import SwiftUI

@main
struct VoiceAssistantApp: App {
    @StateObject var assistant = VoiceAssistant()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(assistant)
        }
    }
}
