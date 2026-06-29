# CLAUDE.md — Rant (Texas Rigs & Roots Website) Development Guide

## Project Overview

**Rant** is the marketing and lead-generation website for **Texas Rigs & Roots**, a helical pier installation and foundation repair company serving the Houston, TX area.

- **Purpose**: Lead capture, customer education, sales funnel automation
- **Tech Stack**: Node.js/Express, vanilla HTML/CSS/JavaScript, n8n automation
- **Primary Function**: Contact form submissions → automated email follow-up sequence
- **Target Audience**: Houston-area homeowners with foundation concerns

## Repository Structure

```
Rant/
├── index.html                    # Main landing page
├── main.js                       # Front-end form handling and interactivity
├── style.css                     # Responsive styling
├── package.json                  # Node.js dependencies and scripts
├── .env.example                  # Environment variable template
├── server.js                     # Express.js backend (if present)
├── funnel-bammel/
│   └── follow-up-emails.md      # Email sequence templates (3-email sequence)
└── README.md                     # Quick start guide
```

## Core Functionality

### Lead Capture Flow

1. **Landing Page** (`index.html`) — Displays:
   - Company branding and value proposition
   - Foundation repair problem education
   - Lead capture form (name, email, phone, property location)
   - Trust signals (certifications, testimonials)

2. **Form Submission** (`main.js`) — Client-side:
   - Form validation (required fields, email format, phone format)
   - Data collection from form fields
   - POST request to backend `/api/submit-lead`

3. **Backend Processing** (`server.js`) — Node.js/Express:
   - Receive lead data
   - Trigger n8n webhook for workflow automation
   - Store lead in database/CRM (via n8n)
   - Return confirmation to client

4. **Lead Automation** (n8n) — Workflow triggers:
   - Email 1 (same day): Initial acknowledgment
   - Email 2 (day 3): Educational follow-up about local foundation issues
   - Email 3 (day 7): Final check-in with CTA
   - SMS/phone follow-up (optional, configured in n8n)

### Email Sequence (funnel-bammel/follow-up-emails.md)

Three-email sequence designed to:
- Establish credibility and local knowledge
- Educate about Houston's clay soil issues
- Create urgency (seasonal dry-spell context)
- Provide direct contact information

Email templates use personalization tokens:
- `[Name]` → Lead's first name
- `[your name]` → Sales rep name (configured in n8n)

## Development Workflow

### Setting Up Local Environment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with:
   # N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/leads
   # NODE_ENV=development
   # PORT=3000
   ```

3. **Start Dev Server**
   ```bash
   npm run dev    # With nodemon (auto-reload)
   npm run start  # Production mode
   ```

4. **Test Locally**
   - Open http://localhost:3000
   - Submit test lead form
   - Verify network request in DevTools → Network tab

### Making Changes

#### Frontend (HTML/CSS/JavaScript)
- **HTML**: Edit `index.html` to modify page structure, form fields
- **Styling**: Update `style.css` for responsive design (mobile-first approach)
- **Interactivity**: Modify `main.js` for form validation, event handling

#### Backend
- Edit `server.js` to modify API routes, validation logic
- Test with Postman or curl:
  ```bash
  curl -X POST http://localhost:3000/api/submit-lead \
    -H "Content-Type: application/json" \
    -d '{"name":"John","email":"john@example.com","phone":"5551234567"}'
  ```

#### Email Sequence
- Update templates in `funnel-bammel/follow-up-emails.md`
- Sync changes to n8n workflow configuration

### Commit Conventions

Use clear, action-oriented commit messages:

```
[FORM] Add phone number formatting validation

[EMAIL] Update Day 3 email with seasonal messaging for Q3

[UI] Fix mobile responsiveness for form fields on small screens

[API] Add rate limiting to lead submission endpoint

[DOCS] Update email sequence templates with new CTA language
```

Prefixes:
- `[FORM]` — Form fields, validation, UX
- `[EMAIL]` — Email templates, sequence logic
- `[UI]` — HTML/CSS/styling changes
- `[API]` — Backend routes, business logic
- `[DOCS]` — Documentation updates
- `[CONFIG]` — Environment, deployment, build config

## Integration Points

### n8n Automation

The backend connects to n8n workflows via webhook. Ensure the webhook URL in `.env` matches your n8n instance:

**Expected n8n Workflow Triggers:**
- **Lead Submission Webhook** (incoming POST)
  - Receives: `{ name, email, phone, location }`
  - Actions: Store in database, send Email 1, schedule Email 2 & 3

**Configuration in n8n:**
1. Create HTTP trigger (webhook)
2. Map incoming fields to variables
3. Create 3 email nodes (scheduled sends)
4. Add database/CRM connector for lead storage

### Environment Variables

Required in `.env`:

| Variable | Purpose | Example |
|----------|---------|---------|
| `N8N_WEBHOOK_URL` | Webhook endpoint for lead submission | `https://n8n.company.com/webhook/leads` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3000` |
| `SENDGRID_API_KEY` | (Optional) SendGrid for email delivery | `SG.abc123...` |
| `DATABASE_URL` | (Optional) Database connection | `mongodb://...` |

## Form Fields

Current form fields in `index.html`:
- **Name** (text, required)
- **Email** (email, required)
- **Phone** (tel, required)
- **Property Location** (text, optional — city/area in Houston)
- **Issue Description** (textarea, optional)

### Adding New Fields

1. Add `<input>` or `<textarea>` in `index.html`
2. Update validation in `main.js` (if required)
3. Update POST payload to include new field
4. Sync new field name with n8n webhook handler

## Styling Guidelines

- **Mobile-First**: Start with mobile styles in CSS, then use media queries for larger screens
- **Responsive Breakpoints**:
  - `768px` — Tablet
  - `1024px` — Desktop
- **Color Scheme**: Check `style.css` for current brand colors
- **Font**: System font stack for fast loading

## Testing Checklist

Before deploying to production:

- [ ] Form submission sends data to console (check DevTools)
- [ ] Network request to backend succeeds (200 status)
- [ ] Test lead appears in n8n workflow logs
- [ ] Email 1 is sent to test email address
- [ ] Form validation blocks invalid emails/phones
- [ ] Mobile layout is responsive (test on phone/tablet)
- [ ] No console errors or warnings
- [ ] Links to company contact info work (`tel:`, `mailto:`)

## Deployment

### Production Checklist

1. **Environment**
   - Set `NODE_ENV=production` in `.env`
   - Use production n8n webhook URL
   - Verify all API keys are secure (never in git)

2. **Testing**
   - Run full test checklist above
   - Test on actual mobile device
   - Submit test lead and verify email delivery

3. **Git & Deployment**
   - Commit changes to feature branch
   - Create PR for review
   - Merge to `main` when approved
   - Deploy (via CI/CD or manual deployment)

### Hosting Considerations

- **Node.js Server**: Deploy to Heroku, DigitalOcean, AWS, or similar
- **Static Assets**: index.html, main.js, style.css can be served as-is
- **SSL/TLS**: Always use HTTPS in production
- **CDN**: Consider CloudFlare for static assets and DDoS protection

## Common Tasks

### Test Lead Submission
```bash
curl -X POST http://localhost:3000/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9795551234",
    "location": "Bammel, TX"
  }'
```

### Check Form Validation
Open browser console (F12 → Console) and submit empty form:
```
Form validation should log errors and prevent submission
```

### Update Email Templates
Edit `funnel-bammel/follow-up-emails.md`, then:
1. Copy new template text
2. Paste into corresponding n8n email node
3. Test with a sample lead

### Debug n8n Webhook Connection
1. Add a log node in n8n to inspect incoming data
2. Submit lead form
3. Check n8n execution logs to see what was received

## Key Metrics to Track

Monitor these via n8n or your CRM:
- **Form Submissions**: New leads per day/week
- **Email Delivery**: Email 1, 2, 3 delivery rates
- **Email Opens**: Which emails get read most
- **Response Rate**: Leads who reply or call
- **Conversion Rate**: Leads who become customers

## Support & Questions

For questions about:
- **Form fields or flow**: Check HTML structure first
- **Email sequence**: See `funnel-bammel/follow-up-emails.md`
- **Backend/API**: Review `server.js` and .env configuration
- **n8n integration**: Verify webhook URL and payload format

## Contact Information

**Company**: Texas Rigs & Roots  
**Phone**: (979) 803-1644  
**Email**: Rigsnroots@gmail.com  
**Service Area**: Houston, TX and surrounding areas

---

**Last Updated:** June 2026  
**Tech Stack**: Node.js, Express, HTML5, CSS3, JavaScript (vanilla)  
**License**: Proprietary (Business/Commercial)
