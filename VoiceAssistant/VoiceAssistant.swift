import Foundation
import Speech
import AVFoundation

@MainActor
class VoiceAssistant: NSObject, ObservableObject, SFSpeechRecognizerDelegate {
    @Published var isListening = false
    @Published var transcript = ""
    @Published var isProcessing = false
    @Published var response = ""
    @Published var error: String?

    private var speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    private let synthesizer = AVSpeechSynthesizer()

    private let apiKey: String

    override init() {
        self.apiKey = ProcessInfo.processInfo.environment["ANTHROPIC_API_KEY"] ?? ""
        super.init()

        speechRecognizer?.delegate = self
        requestMicrophoneAccess()
    }

    func startListening() {
        if audioEngine.isRunning {
            stopListening()
            return
        }

        transcript = ""
        response = ""
        error = nil

        let audioSession = AVAudioSession.sharedInstance()
        try? audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
        try? audioSession.setActive(true, options: .notifyOthersOnDeactivation)

        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        guard let recognitionRequest = recognitionRequest else {
            error = "Unable to create recognition request"
            return
        }

        recognitionRequest.shouldReportPartialResults = true

        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { result, error in
            Task { @MainActor in
                if let result = result {
                    self.transcript = result.bestTranscription.formattedString

                    if result.isFinal {
                        self.stopListening()
                        await self.sendToAI(self.transcript)
                    }
                }

                if let error = error {
                    self.error = error.localizedDescription
                    self.stopListening()
                }
            }
        }

        let inputNode = audioEngine.inputNode
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: inputNode.outputFormat(forBus: 0)) { buffer, _ in
            recognitionRequest.append(buffer)
        }

        audioEngine.prepare()
        try? audioEngine.start()
        isListening = true
    }

    func stopListening() {
        audioEngine.stop()
        recognitionRequest?.endAudio()
        audioEngine.inputNode.removeTap(onBus: 0)
        isListening = false
    }

    private func sendToAI(_ prompt: String) async {
        isProcessing = true
        error = nil

        let url = URL(string: "https://api.anthropic.com/v1/messages")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "x-api-key")
        request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")

        let body: [String: Any] = [
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 1024,
            "messages": [["role": "user", "content": prompt]]
        ]

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
            let (data, _) = try await URLSession.shared.data(for: request)

            let decoder = JSONDecoder()
            let apiResponse = try decoder.decode(ClaudeAPIResponse.self, from: data)

            if let content = apiResponse.content.first {
                self.response = content.text
                await speak(content.text)
            }
        } catch {
            self.error = "Failed to get response: \(error.localizedDescription)"
        }

        isProcessing = false
    }

    private func speak(_ text: String) async {
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        utterance.rate = 0.5
        synthesizer.speak(utterance)
    }

    private func requestMicrophoneAccess() {
        SFSpeechRecognizer.requestAuthorization { status in
            DispatchQueue.main.async {
                switch status {
                case .authorized:
                    break
                case .denied, .notDetermined, .restricted:
                    self.error = "Microphone access denied"
                @unknown default:
                    break
                }
            }
        }
    }
}

struct ClaudeAPIResponse: Decodable {
    struct ContentBlock: Decodable {
        let type: String
        let text: String
    }

    let content: [ContentBlock]
}
