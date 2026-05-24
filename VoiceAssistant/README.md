# Claude Voice Assistant

A powerful iOS voice assistant powered by Claude AI. Speak naturally, and get intelligent responses with text-to-speech output.

## Features

- 🎤 **Real-time Speech Recognition** - Capture your voice commands
- 🧠 **Claude AI Integration** - Powered by Claude 3.5 Sonnet for intelligent responses
- 🔊 **Natural Speech Output** - Hear responses in a natural voice
- 🎨 **Beautiful UI** - Modern SwiftUI interface with audio waveform visualization
- 🔒 **Secure** - Credentials stored in environment variables, not in code

## Setup Instructions

### 1. Create Xcode Project

```bash
# In Xcode, create a new iOS App project:
# File → New → Project → iOS → App
# Product Name: Claude Voice Assistant
# Organization: Your Name
# Interface: SwiftUI
# Lifecycle: SwiftUI App
```

### 2. Get Your API Key

1. Sign up at [Anthropic Console](https://console.anthropic.com)
2. Generate an API key from the settings
3. Keep this secure!

### 3. Configure Environment

In Xcode:
1. Select the project in the navigator
2. Select the target
3. Go to Build Settings
4. Search for "User-Defined"
5. Add a new setting: `ANTHROPIC_API_KEY` with your API key

**Alternative: Edit scheme**
1. Product → Scheme → Edit Scheme
2. Run → Pre-actions
3. Add shell script: `export ANTHROPIC_API_KEY="your-key-here"`

### 4. Replace Project Files

Replace these files in your Xcode project:
- `VoiceAssistantApp.swift` - App entry point
- `VoiceAssistant.swift` - Voice recognition & API logic
- `ContentView.swift` - UI
- `Info.plist` - App permissions

### 5. Add Permissions to Info.plist

Xcode will auto-add these when you include the Info.plist file:
- Microphone access
- Speech recognition access
- Network access for API calls

### 6. Minimum Deployment Target

Set to **iOS 16.0 or later** (for SpeechRecognition framework)

### 7. Test on Device

⚠️ **Important**: Speech recognition requires a physical device (not simulator)

1. Connect your iPhone
2. Select it as the build target
3. Press Run (⌘R)
4. Grant microphone permission when prompted
5. Tap "Start Listening" and speak!

## How It Works

1. **Listen** - Tap the microphone button to start recording
2. **Transcribe** - Your speech is converted to text in real-time
3. **Send to Claude** - Once you stop speaking, text is sent to Claude API
4. **Respond** - Claude generates a response and speaks it back to you

## API Calls

Each conversation costs approximately:
- **Input tokens**: Your speech transcript
- **Output tokens**: Claude's response

The app uses `claude-3-5-sonnet-20241022` for fast, intelligent responses.

## Troubleshooting

### Microphone not working
- Check Settings → Privacy → Microphone
- Ensure the app has permission
- Restart the app

### No API response
- Verify your API key is correct
- Check your Anthropic account has credits
- Check network connection
- Look at Xcode console for error messages

### Speech recognition not working
- Only works on physical devices, not simulator
- Requires iOS 16.0+
- Check microphone permissions

## Next Steps

- Add context/memory (remember conversation history)
- Create custom system prompts for specific tasks
- Add support for typing instead of voice
- Implement conversation history saving
- Add multiple voice options
- Create voice presets for different assistant personalities

## Security Notes

- Never hardcode API keys in your app
- Use environment variables or secure storage
- Consider using a backend proxy for production apps
- Store user preferences securely using Keychain

## Requirements

- iOS 16.0+
- iPhone with microphone
- Internet connection
- Anthropic API key

## License

MIT License
