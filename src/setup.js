const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, '../credentials');
const TOKENS_PATH = path.join(__dirname, '../tokens');

function ensureDirectories() {
  [CREDENTIALS_PATH, TOKENS_PATH].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
}

async function setupGoogleAuth() {
  console.log('\n📝 Google OAuth Setup');
  console.log('====================');
  console.log('1. Go to https://console.cloud.google.com');
  console.log('2. Create a new project or select existing');
  console.log('3. Enable Gmail API and Google Drive API');
  console.log('4. Create OAuth 2.0 Client ID (Desktop app)');
  console.log('5. Download credentials JSON and save as credentials/gmail-credentials.json');
  console.log('\nPress Enter once credentials file is saved...');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question('', () => {
      rl.close();
      resolve();
    });
  });
}

async function authenticateGmail() {
  const credentialsPath = path.join(CREDENTIALS_PATH, 'gmail-credentials.json');

  if (!fs.existsSync(credentialsPath)) {
    console.log('❌ Credentials file not found at:', credentialsPath);
    return;
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath));
  const { client_id, client_secret, redirect_uris } = credentials.installed;

  const auth = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const authUrl = auth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/drive']
  });

  console.log('\n🔑 Authorization Required');
  console.log('========================');
  console.log('Visit this URL to authorize:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question('\nEnter authorization code: ', async (code) => {
      rl.close();

      try {
        const { tokens } = await auth.getToken(code);
        const tokenPath = path.join(TOKENS_PATH, 'gmail-token.json');
        fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
        console.log('✅ Token saved:', tokenPath);
        resolve(tokens);
      } catch (error) {
        console.error('❌ Error getting token:', error.message);
        resolve(null);
      }
    });
  });
}

function setupEnv() {
  const envPath = path.join(__dirname, '../.env');
  const examplePath = path.join(__dirname, '../.env.example');

  if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
    return;
  }

  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ Created .env from .env.example');
    console.log('⚠️  Please edit .env and add your values:');
    console.log('   - ANTHROPIC_API_KEY');
    console.log('   - GOOGLE_DRIVE_FOLDER_ID');
    console.log('   - CHANNEL_NAME');
  }
}

async function main() {
  console.log('🎬 YouTube Story Builder - Setup');
  console.log('================================\n');

  ensureDirectories();
  setupEnv();
  await setupGoogleAuth();
  await authenticateGmail();

  console.log('\n✅ Setup complete!');
  console.log('Next steps:');
  console.log('1. Edit .env and add your API keys and settings');
  console.log('2. Create a projects/ folder and add your project files');
  console.log('3. Run: npm start');
}

main().catch(console.error);
