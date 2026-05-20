# 🎬 YouTube Story Builder - Automated Daily Stories

An automated system that generates engaging YouTube stories from your emails and projects, with daily scheduling, Google Drive storage, and AI-powered content creation.

## ✨ Features

- **Automated Daily Stories** - Runs on schedule (e.g., 6 AM daily)
- **Multi-Source Content** - Pulls from Gmail and local projects
- **AI-Generated Stories** - Uses Claude to create engaging narratives
- **Multiple Formats** - YouTube long-form + short reels (TikTok/Instagram)
- **Google Drive Integration** - Auto-saves all content
- **Smart CTAs** - Asks viewers to share their stories
- **Comment Response Templates** - Generic but personalized responses
- **Set & Forget** - Once configured, runs automatically

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Setup
```bash
npm run setup
```

This will:
- Guide you through Google OAuth setup
- Create necessary credentials
- Generate `.env` file

### 3. Configure .env
Edit `.env` with:
```env
ANTHROPIC_API_KEY=your_key_here
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
CHANNEL_NAME=Your YouTube Channel Name
STORY_GENERATION_TIME=06:00
```

### 4. Add Projects (Optional)
Create a `projects/` folder and add files:
- Markdown files (`.md`)
- JSON files with `{ name, description }` structure

### 5. Start the Service
```bash
npm start
```

## 📧 How It Works

### Daily Flow
1. **Fetch Fresh Emails** - Pulls recent unread emails from Gmail
2. **Load Projects** - Reads from `projects/` directory
3. **Generate Story** - Claude AI creates an engaging narrative
4. **Create Reel** - Generates short-form video script
5. **Save to Drive** - Stores both versions in Google Drive
6. **Mark Read** - Archives processed emails

### Content Generated
Each day creates:
- **YouTube Script** - Full narrative with CTAs (500-800 words)
- **Reel Script** - Short punchy version (30-60 seconds)
- **Metadata** - Title, hashtags, visual suggestions

### Call-to-Action Examples
The AI will generate CTAs like:
- "What's your story? Comment below 👇"
- "Drop your experience in the comments"
- "Tell me your journey in the replies"
- "Subscribe for more real stories from people like you"

### Comment Responses
Template for personalized bulk responses:
- Generic structure works across comments
- Includes specific detail from each comment
- Shows actual engagement/reading

## 🔐 Google Setup

### Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable APIs:
   - Gmail API
   - Google Drive API
4. Create OAuth 2.0 credentials (Desktop app)
5. Download as `credentials/gmail-credentials.json`

### Get Your Drive Folder ID
1. Create a folder in Google Drive
2. Open it and copy the ID from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```
3. Add to `.env` as `GOOGLE_DRIVE_FOLDER_ID`

## 📁 Project Structure
```
/home/user/Rant/
├── src/
│   ├── index.js              # Main scheduler
│   ├── gmail-client.js        # Gmail integration
│   ├── drive-client.js        # Google Drive integration
│   ├── content-generator.js   # Claude AI generation
│   ├── project-loader.js      # Project file loading
│   └── setup.js               # Initial setup
├── projects/                  # Your project files
│   ├── project1.md
│   ├── project2.json
│   └── ...
├── credentials/               # Google OAuth credentials (created by setup)
├── tokens/                    # OAuth tokens (created by setup)
├── .env                       # Configuration
└── package.json
```

## 🛠️ Configuration

### Daily Schedule
Edit `STORY_GENERATION_TIME` in `.env`:
```env
STORY_GENERATION_TIME=06:00  # 6 AM daily
STORY_GENERATION_TIME=14:30  # 2:30 PM daily
```

### Channel Info
```env
CHANNEL_NAME=My Awesome Stories
```

## 📝 Adding Content Sources

### Email Integration
The system automatically fetches unread emails from Gmail. Just send yourself notes/ideas.

### Project Files
Create `projects/` folder with:

**Markdown (projects/my-project.md):**
```markdown
# My Awesome Project
This is a description of what I've been working on...
```

**JSON (projects/my-project.json):**
```json
{
  "name": "My Project Name",
  "description": "What this project is about..."
}
```

## 🎥 Output Examples

### YouTube Script Output
```
# Story Title

## Hook
"I thought I was stuck forever, but this one decision changed everything..."

## Story
[Full 500-800 word narrative]

## Call to Action
"What's a decision that changed your life? Drop it in the comments below 👇"

## Hashtags
#storytelling #motivation #realbusiness
```

### Reel Script Output
```
# Short Reel Title

## Script
"Took a massive risk. Here's what happened..." [punchy 60-second version]

## Visuals
- Scene 1: Opening moment
- Scene 2: Conflict
- Scene 3: Resolution

## Sound
Trending background music with good momentum
```

## 🤖 Claude AI Integration

The system uses `claude-opus-4-7` for:
- Story narrative generation
- Short-form reel scripts
- Comment response personalization

### Example Prompts
- Creates hooks in < 3 seconds
- Narratives feel authentic and conversational
- CTAs are non-salesy and community-focused
- Comment responses show genuine reading

## ⚙️ Running Options

### Production (Background)
```bash
npm start
# Runs in foreground, logs to console
# Use screen/tmux/PM2 for background persistence
```

### Development
```bash
npm run dev
# Auto-restarts on file changes
# Requires nodemon
```

### Manual Testing
```bash
node src/index.js
# Runs once immediately, then schedules
```

## 🐛 Troubleshooting

### "Credentials file not found"
Run `npm run setup` to create Google credentials

### "No emails found"
- Check Gmail has unread emails
- Verify Gmail API is enabled
- Tokens may have expired - re-run setup

### "Failed to save to Drive"
- Verify GOOGLE_DRIVE_FOLDER_ID is correct
- Check folder exists in Google Drive
- Verify Google Drive API is enabled

### API Key Errors
- Ensure ANTHROPIC_API_KEY is in `.env`
- Check key has proper permissions

## 💡 Tips

1. **Add Notes as Emails** - Email yourself story ideas daily
2. **Use Project Files** - Keep project descriptions updated
3. **Batch Edit on Drive** - Download all scripts, edit as needed
4. **Test First** - Check generated content before scheduling
5. **Monitor Engagement** - Track which CTAs get best responses

## 📊 Monitoring

The system logs:
- Story generation start/end times
- Number of emails/projects processed
- File names and Drive links
- Any errors or warnings

Monitor the logs to ensure it's running smoothly:
```bash
tail -f story-generation.log
```

## 🔄 Updates & Maintenance

### Regular Tasks
- Update projects/ as you work
- Monitor email quality (keep relevant)
- Check Drive for storage limits
- Review AI-generated content quality

### Refreshing Tokens
If you get auth errors, re-run:
```bash
npm run setup
```

## 📄 License
MIT

## 🚀 Support
For issues, check `.env` configuration and try rerunning setup.
