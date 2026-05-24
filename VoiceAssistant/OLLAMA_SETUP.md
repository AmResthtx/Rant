# Ollama Setup Guide

This voice assistant uses **Ollama** to run a local AI model on your Mac. It's completely free, private, and requires no API keys.

## What is Ollama?

Ollama is a simple way to run large language models locally on your Mac. The AI runs on your computer, not in the cloud—no monthly bills, no data sent to servers.

## Installation & Setup

### Step 1: Install Ollama

1. Download from [ollama.ai](https://ollama.ai)
2. Run the installer for Mac
3. Open Terminal and verify installation:
   ```bash
   ollama --version
   ```

### Step 2: Download a Model

Run this in Terminal to download Mistral (7B, ~4GB):
```bash
ollama pull mistral
```

**Alternative models:**
- `mistral` (fastest, 7B, ~4GB)
- `neural-chat` (faster, 7B, ~5GB)
- `llama2` (good quality, 7B, ~4GB)
- `openhermes` (very capable, 7B, ~4GB)

### Step 3: Start Ollama Server

```bash
ollama serve
```

You'll see:
```
listening on 127.0.0.1:11434
```

**Keep this Terminal window open!** The app needs this running.

### Step 4: Find Your Mac's IP Address

In a new Terminal window:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

You'll see something like: `inet 192.168.1.100`

**Save this IP address** — you'll need it in the next step.

### Step 5: Configure the iOS App

In Xcode, before running on your iPhone:

1. Edit the scheme (Product → Scheme → Edit Scheme)
2. Run → Pre-actions
3. Add shell script:
   ```bash
   export OLLAMA_URL="http://192.168.1.100:11434"
   ```
   (Replace `192.168.1.100` with your Mac's IP)

**Or** set it in build settings:
1. Project → Target → Build Settings
2. Add User-Defined Setting: `OLLAMA_URL` = `http://192.168.1.100:11434`

### Step 6: Connect iPhone to Same WiFi

Make sure your iPhone and Mac are on the **same WiFi network**.

### Step 7: Test Connection

In Terminal, test the connection:
```bash
curl http://192.168.1.100:11434/api/tags
```

You should see your downloaded models listed.

### Step 8: Run the App

1. Build & run the app on your iPhone
2. If you see connection errors, check:
   - Ollama server is running
   - iPhone and Mac are on same WiFi
   - IP address is correct
   - Firewall isn't blocking port 11434

## Using the App

1. Make sure Ollama server is running on your Mac
2. Open the app on your iPhone
3. Tap "Start Listening"
4. Speak your question or command
5. Wait for the response (first response takes ~5-10 seconds)

## Performance Tips

- **Faster responses**: Use `mistral` or `neural-chat` models
- **Better quality**: Use `openhermes` or `llama2`
- **First response slower**: Model loads into memory on first use
- **Subsequent responses**: Much faster (1-3 seconds)

## Troubleshooting

### "Failed to get response"
- Make sure Ollama server is running (`ollama serve`)
- Check your IP address is correct
- Verify iPhone and Mac are on same WiFi
- Try `curl http://192.168.1.100:11434/api/tags` in Terminal

### Very slow responses
- First response is normal (5-10 seconds)
- Check your Mac's CPU/RAM usage
- Close other apps
- Try a faster model like `mistral`

### Model not found
- Download it first: `ollama pull mistral`
- Check available models: `ollama list`

### "Connection refused"
- Ollama server not running
- Run `ollama serve` in Terminal
- Keep that Terminal window open

### Firewall blocking
- System Settings → Security & Privacy → Firewall
- Add Ollama to allowed apps

## Advanced: Change Models

To use a different model, edit VoiceAssistant.swift:
```swift
let body: [String: Any] = [
    "model": "neural-chat",  // Change this
    "prompt": prompt,
    "stream": false
]
```

Then rebuild the app.

## Next Steps

- Try different models to find the best balance
- Add conversation history (save previous messages)
- Create system prompts for specific tasks
- Experiment with response quality vs speed

## Free Forever

No charges, no limits, no tracking. Just you, your Mac, and the AI running locally!
