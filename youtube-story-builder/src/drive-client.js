const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, '../tokens/drive-token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials/gmail-credentials.json');

class DriveClient {
  constructor() {
    this.auth = null;
    this.drive = null;
  }

  async initialize() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_id, client_secret, redirect_uris } = credentials.installed;

    this.auth = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
      this.auth.setCredentials(token);
    }

    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  async saveStory(content, fileName, folderId, mimeType = 'text/plain') {
    try {
      const fileMetadata = {
        name: fileName,
        mimeType: mimeType,
        parents: [folderId]
      };

      const media = {
        mimeType: mimeType,
        body: content
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink'
      });

      console.log(`✅ Saved to Drive: ${response.data.webViewLink}`);
      return response.data;
    } catch (error) {
      console.error('Error saving to Drive:', error);
      return null;
    }
  }

  async createFolder(folderName, parentFolderId) {
    try {
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentFolderId]
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        fields: 'id'
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      return null;
    }
  }
}

module.exports = DriveClient;
