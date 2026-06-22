import SwiftUI

struct ContentView: View {
    @EnvironmentObject var assistant: VoiceAssistant

    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.blue.opacity(0.1),
                    Color.purple.opacity(0.1)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 24) {
                VStack(spacing: 12) {
                    Text("Claude Voice")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(.primary)

                    Text("Powerful AI at Your Command")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 32)

                Spacer()

                VStack(spacing: 16) {
                    if assistant.isListening {
                        AudioWaveView()
                            .frame(height: 100)
                    } else {
                        Image(systemName: "waveform.circle.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.blue)
                    }

                    Text(assistant.isListening ? "Listening..." : "Ready to listen")
                        .font(.headline)
                        .foregroundColor(.primary)
                }

                if !assistant.transcript.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("You said:")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(assistant.transcript)
                            .font(.body)
                            .padding(12)
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(8)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }

                if assistant.isProcessing {
                    HStack {
                        ProgressView()
                        Text("Thinking...")
                            .foregroundColor(.secondary)
                    }
                }

                if !assistant.response.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Claude says:")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(assistant.response)
                            .font(.body)
                            .padding(12)
                            .background(Color.blue.opacity(0.1))
                            .cornerRadius(8)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }

                if let error = assistant.error {
                    HStack {
                        Image(systemName: "exclamationmark.circle.fill")
                            .foregroundColor(.red)
                        Text(error)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                    .padding(12)
                    .background(Color.red.opacity(0.1))
                    .cornerRadius(8)
                    .frame(maxWidth: .infinity, alignment: .leading)
                }

                Spacer()

                Button(action: {
                    assistant.startListening()
                }) {
                    HStack(spacing: 12) {
                        Image(systemName: assistant.isListening ? "stop.circle.fill" : "microphone.circle.fill")
                        Text(assistant.isListening ? "Stop Listening" : "Start Listening")
                            .font(.headline)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(16)
                    .background(assistant.isListening ? Color.red : Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                }
                .disabled(assistant.isProcessing)
                .padding(.bottom, 32)
            }
            .padding(24)
        }
    }
}

struct AudioWaveView: View {
    @State private var values: [CGFloat] = [0.5, 0.3, 0.7, 0.4, 0.6]

    var body: some View {
        HStack(alignment: .center, spacing: 8) {
            ForEach(0..<5, id: \.self) { _ in
                RoundedRectangle(cornerRadius: 8)
                    .fill(LinearGradient(
                        gradient: Gradient(colors: [.blue, .purple]),
                        startPoint: .top,
                        endPoint: .bottom
                    ))
                    .frame(height: 40)
                    .onAppear {
                        withAnimation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true)) {
                            values[Int.random(in: 0..<5)] = CGFloat.random(in: 0.3...1.0)
                        }
                    }
            }
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(VoiceAssistant())
}
