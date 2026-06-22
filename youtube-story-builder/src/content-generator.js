const Anthropic = require('@anthropic-ai/sdk').default;

class ContentGenerator {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async generateYouTubeStory(emails, projects) {
    const emailSummary = this.summarizeEmails(emails);
    const projectSummary = this.summarizeProjects(projects);

    const prompt = `You are an expert storyteller for a faceless YouTube channel called "${process.env.CHANNEL_NAME}".

Create an engaging YouTube video story based on these sources:

EMAILS:
${emailSummary}

PROJECTS:
${projectSummary}

Generate a compelling narrative that:
1. Opens with a hook that grabs attention in the first 3 seconds
2. Tells a relatable story from the emails and projects
3. Includes a strong call-to-action (CTA) asking viewers to:
   - Share their own similar story in the comments
   - Engage with the content
   - Subscribe for more stories like this
4. Uses conversational, engaging language
5. Is authentic and feels personal

Format the response as JSON with these fields:
{
  "title": "Video title (50 chars max)",
  "hook": "Opening hook (15-20 words)",
  "story": "Full story narrative (500-800 words)",
  "cta": "Call to action for engagement",
  "hashtags": ["tag1", "tag2", "tag3"]
}`;

    const response = await this.client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    try {
      return JSON.parse(response.content[0].text);
    } catch {
      console.error('Failed to parse response');
      return null;
    }
  }

  async generateShortReel(story) {
    const prompt = `Convert this YouTube story into a short, punchy reel script (30-60 seconds) for TikTok/Instagram Reels.

Story: ${story}

Create a JSON response with:
{
  "title": "Reel title",
  "script": "Reel script (80-120 words, punchy and fast-paced)",
  "visuals": ["visual1", "visual2", "visual3"],
  "sound": "Suggested background music/sound style"
}`;

    const response = await this.client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    try {
      return JSON.parse(response.content[0].text);
    } catch {
      return null;
    }
  }

  async generateCommentResponse(comment, originalStory) {
    const prompt = `Generate a response to this YouTube comment that shows you actually read it while remaining mostly generic for bulk responses.

Original Story: ${originalStory}
Comment: "${comment}"

Create a response that:
1. References a specific detail from the comment (shows it was read)
2. Engages authentically but can be used as a template
3. Is 1-2 sentences
4. Ends with an invitation to continue the conversation

Respond with just the comment text, no JSON.`;

    const response = await this.client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.content[0].text;
  }

  summarizeEmails(emails) {
    if (!emails || emails.length === 0) return 'No emails available';
    return emails.map(e => `From: ${e.from}\nSubject: ${e.subject}\nContent: ${e.body.substring(0, 300)}...`).join('\n\n');
  }

  summarizeProjects(projects) {
    if (!projects || projects.length === 0) return 'No projects available';
    return projects.map(p => `Project: ${p.name}\nDescription: ${p.description}`).join('\n\n');
  }
}

module.exports = ContentGenerator;
