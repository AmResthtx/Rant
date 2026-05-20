const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, '../tokens/gmail-token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials/gmail-credentials.json');

class GmailClient {
  constructor() {
    this.auth = null;
    this.gmail = null;
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

    this.gmail = google.gmail({ version: 'v1', auth: this.auth });
  }

  async getRecentEmails(maxResults = 10) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults,
        q: 'is:unread' // Get unread emails as fresh content
      });

      const messages = response.data.messages || [];
      const emailData = [];

      for (const message of messages) {
        const msg = await this.gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });

        const headers = msg.data.payload.headers;
        const from = headers.find(h => h.name === 'From').value;
        const subject = headers.find(h => h.name === 'Subject').value;
        const body = this.extractBody(msg.data.payload);

        emailData.push({
          id: message.id,
          from,
          subject,
          body,
          timestamp: new Date(parseInt(msg.data.internalDate))
        });
      }

      return emailData;
    } catch (error) {
      console.error('Error fetching emails:', error);
      return [];
    }
  }

  extractBody(payload) {
    if (payload.parts) {
      let text = '';
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain') {
          text += Buffer.from(part.data.data, 'base64').toString();
        }
      }
      return text;
    }
    return payload.body.data ? Buffer.from(payload.body.data, 'base64').toString() : '';
  }

  async markAsRead(messageId) {
    try {
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds: ['UNREAD']
        }
      });
    } catch (error) {
      console.error('Error marking email as read:', error);
    }
  }
}

module.exports = GmailClient;
