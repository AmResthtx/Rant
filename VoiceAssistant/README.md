# Local Voice Assistant

A powerful iOS voice assistant powered by **Ollama** (free, local AI). Speak naturally, and get intelligent responses with text-to-speech output. No API costs, no subscriptions, completely private.

## Features

- 🎤 **Real-time Speech Recognition** - Capture your voice commands
- 🧠 **Local AI** - Powered by Mistral, Llama, or other free models running on your Mac
- 🔊 **Natural Speech Output** - Hear responses in a natural voice
- 🎨 **Beautiful UI** - Modern SwiftUI interface with audio waveform visualization
- 🔒 **Private** - Everything stays on your Mac, nothing uploaded to cloud
- 💰 **Free** - No API keys, no monthly bills

## Quick Start

1. **Install Ollama**: Download from [ollama.ai](https://ollama.ai)
2. **Download a model**: `ollama pull mistral` (takes ~2 min)
3. **Start the server**: `ollama serve` (keep this running)
4. **Set up iPhone**: Follow the iOS setup below
5. **Talk to your AI!**

See [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) for detailed instructions.

## Setup Instructions

### 1. Create Xcode Project

```bash
# In Xcode, create a new iOS App project:
# File → New → Project → iOS → App
# Product Name: Voice Assistant
# Organization: Your Name
# Interface: SwiftUI
# Lifecycle: SwiftUI App
```

### 2. Set Up Ollama (Mac)

Follow the complete guide in [OLLAMA_SETUP.md](./OLLAMA_SETUP.md)

Quick version:
```bash
# Install from ollama.ai, then:
ollama pull mistral
ollama serve
```

### 3. Get Your Mac's IP Address

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.100
```

### 4. Configure the App

In Xcode:
1. Product → Scheme → Edit Scheme
2. Run → Pre-actions
3. Add shell script:
   ```bash
   export OLLAMA_URL="http://192.168.1.100:11434"
   ```
   (Replace IP with your actual Mac IP)

### 5. Replace Project Files

Copy these files into your Xcode project:
- `VoiceAssistantApp.swift` - App entry point
- `VoiceAssistant.swift` - Voice & Ollama integration
- `ContentView.swift` - UI
- `Info.plist` - App permissions

### 6. Minimum Deployment Target

Set to **iOS 16.0 or later** (for SpeechRecognition framework)

### 7. Test on Device

⚠️ **Important**: 
- Speech recognition requires a physical device (not simulator)
- iPhone and Mac must be on the **same WiFi network**

Steps:
1. Make sure `ollama serve` is running on your Mac
2. Connect your iPhone
3. Select it as the build target
4. Press Run (⌘R)
5. Grant microphone permission when prompted
6. Tap "Start Listening" and speak!

## How It Works

1. **Listen** - Tap the microphone to start recording
2. **Transcribe** - Your speech is converted to text in real-time
3. **Send to Ollama** - Text sent to the AI server on your Mac
4. **Respond** - Ollama generates a response and the app speaks it back

## Performance

- **First response**: 5-10 seconds (model loads)
- **Subsequent responses**: 1-3 seconds
- **Best model for speed**: `mistral`
- **Best model for quality**: `openhermes`

## Cost

✅ **Free Forever**
- No API keys needed
- No monthly bills
- No usage limits
- No tracking or data collection

Just electricity to run Ollama on your Mac!

## Troubleshooting

### Can't connect to Ollama
- Is `ollama serve` running? (keep Terminal window open)
- Is iPhone on the same WiFi as Mac?
- Is the IP address correct?
- Try: `curl http://YOUR_IP:11434/api/tags`

### Very slow responses
- First response takes 5-10 seconds (normal)
- Check Mac isn't busy with other tasks
- Try the faster `mistral` model

### Speech recognition not working
- Only works on physical devices, not simulator
- Grant microphone permissions in Settings
- Requires iOS 16.0+

### Model errors
- Make sure you've downloaded a model: `ollama pull mistral`
- Check available models: `ollama list`

See [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) for more troubleshooting.

## Next Steps

- Change models (neural-chat, llama2, openhermes)
- Add conversation history
- Create system prompts for specific tasks
- Add support for typing instead of voice
- Build task execution (send messages, calendar events, etc.)

## Requirements

- **iPhone**: iOS 16.0+ with microphone
- **Mac**: Running Ollama server
- **Network**: iPhone and Mac on same WiFi
- **Storage**: ~4GB for a model (varies by model)

## Security & Privacy

✅ **Completely Private**
- All processing happens on your Mac
- Nothing sent to cloud
- No tracking
- Fully offline capable (no internet needed after setup)

## License

MIT License
