require('dotenv').config();
const cron = require('node-cron');
const GmailClient = require('./gmail-client');
const DriveClient = require('./drive-client');
const ContentGenerator = require('./content-generator');
const ProjectLoader = require('./project-loader');

let isRunning = false;

async function generateDailyStory() {
  if (isRunning) {
    console.log('⏳ Story generation already in progress...');
    return;
  }

  isRunning = true;
  console.log('\n🚀 Starting daily story generation...');
  const timestamp = new Date().toLocaleString();
  console.log(`⏰ Timestamp: ${timestamp}`);

  try {
    // Initialize clients
    const gmail = new GmailClient();
    const drive = new DriveClient();
    const generator = new ContentGenerator();
    const projectLoader = new ProjectLoader('./projects');

    console.log('🔐 Initializing clients...');
    await gmail.initialize();
    await drive.initialize();

    // Fetch data sources
    console.log('📧 Fetching emails...');
    const emails = await gmail.getRecentEmails(5);
    console.log(`   Found ${emails.length} emails`);

    console.log('📁 Loading projects...');
    const projects = projectLoader.loadProjects();
    console.log(`   Found ${projects.length} projects`);

    if (emails.length === 0 && projects.length === 0) {
      console.log('⚠️  No content sources available. Skipping story generation.');
      isRunning = false;
      return;
    }

    // Generate story
    console.log('✍️  Generating YouTube story...');
    const story = await generator.generateYouTubeStory(emails, projects);

    if (!story) {
      console.error('❌ Failed to generate story');
      isRunning = false;
      return;
    }

    console.log(`📝 Story generated: "${story.title}"`);

    // Generate short reel
    console.log('📱 Generating short reel...');
    const reel = await generator.generateShortReel(story.story);
    console.log('   Reel generated');

    // Prepare outputs
    const today = new Date().toISOString().split('T')[0];
    const mainStoryFileName = `${today}-${story.title.toLowerCase().replace(/\s+/g, '-')}-YouTube.md`;
    const reelFileName = `${today}-${story.title.toLowerCase().replace(/\s+/g, '-')}-Reel.md`;

    const storyMarkdown = formatStoryMarkdown(story);
    const reelMarkdown = formatReelMarkdown(reel, story);

    // Save to Google Drive
    console.log('💾 Saving to Google Drive...');
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (folderId) {
      await drive.saveStory(storyMarkdown, mainStoryFileName, folderId, 'text/markdown');
      await drive.saveStory(reelMarkdown, reelFileName, folderId, 'text/markdown');
      console.log('✅ Content saved to Google Drive');
    } else {
      console.log('⚠️  GOOGLE_DRIVE_FOLDER_ID not set. Skipping Drive save.');
    }

    // Mark emails as read
    for (const email of emails) {
      await gmail.markAsRead(email.id);
    }

    console.log('\n✅ Daily story generation completed successfully!');
    console.log(`📊 Generated: ${mainStoryFileName}`);
    console.log(`📊 Generated: ${reelFileName}`);

  } catch (error) {
    console.error('❌ Error during story generation:', error);
  } finally {
    isRunning = false;
  }
}

function formatStoryMarkdown(story) {
  return `# ${story.title}

## Hook
${story.hook}

## Story
${story.story}

## Call to Action
${story.cta}

## Hashtags
${story.hashtags.map(tag => `#${tag}`).join(' ')}

---
Generated: ${new Date().toISOString()}
`;
}

function formatReelMarkdown(reel, story) {
  return `# ${reel.title}

## Script
${reel.script}

## Visuals
${reel.visuals.map(v => `- ${v}`).join('\n')}

## Sound/Music
${reel.sound}

## Original Story
${story.title}

---
Generated: ${new Date().toISOString()}
`;
}

async function start() {
  console.log('🎬 YouTube Story Builder - Daily Automation');
  console.log('========================================');
  console.log(`Channel: ${process.env.CHANNEL_NAME || 'Not set'}`);
  console.log(`Schedule: ${process.env.STORY_GENERATION_TIME || '06:00'} daily`);
  console.log('');

  // Run immediately on startup
  await generateDailyStory();

  // Schedule daily run
  const scheduledTime = process.env.STORY_GENERATION_TIME || '06:00';
  const [hour, minute] = scheduledTime.split(':');

  cron.schedule(`${minute} ${hour} * * *`, () => {
    generateDailyStory();
  });

  console.log(`⏰ Scheduler active - will run daily at ${scheduledTime}`);
  console.log('Press Ctrl+C to stop');
}

start().catch(console.error);
