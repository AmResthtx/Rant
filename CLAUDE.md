# Rant Codebase Guide

**Project**: Texas Rigs & Roots - Marketing Website & Lead Generation Funnel
**Purpose**: Market helical pier manufacturing and installation services; generate qualified leads for foundation repair services
**Stack**: HTML5, CSS3, JavaScript, Node.js/Express, Web3Forms API
**Status**: Production website with partial backend implementation

---

## Project Overview

**Texas Rigs & Roots** provides helical pier foundation solutions for Houston-area homeowners and businesses experiencing foundation issues due to soil instability. The Rant repository contains:

1. **Main Marketing Website** (`index.html`) - Corporate branding and service overview
2. **Bammel Sinkhole Funnel** (`funnel-bammel/`) - Targeted lead generation page for a specific geographic area with high sinkhole risk
3. **Backend Infrastructure** (Node.js/Express) - Configured but not fully implemented

**Target Users**: Homeowners in North Houston (especially Bammel area) experiencing foundation concerns; contractors and engineers

---

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features (ARIA labels)
- **CSS3**: Modern layout with CSS custom properties (variables) for theming
  - Color scheme: rust, earth tones, steel colors
  - Responsive design: uses `clamp()`, `min()`, mobile-first approach
  - No CSS framework - vanilla CSS only
- **JavaScript**: Vanilla (no frameworks)
  - Scroll-triggered animations and header styling
  - Mobile hamburger navigation toggle
  - Form validation with regex patterns
  - Web3Forms integration for contact form submission

### Backend (Partial Implementation)
- **Node.js** (requirement: >=14.0.0)
- **Express.js** (4.18.2) - Server framework configured but `server.js` file not yet implemented
- **CORS** (2.8.5) - Cross-origin request handling
- **Axios** (1.6.2) - HTTP client
- **dotenv** (16.3.1) - Environment variable management
- **nodemon** (3.0.1) - Development auto-reload

### External Services
- **Web3Forms API** - Client-side form submission (no backend processing needed)
- **SendGrid** (optional) - Email service integration configured
- **Google Fonts** - Oswald, Open Sans typefaces

---

## Directory Structure

```
Rant/
├── .env.example           # Environment configuration template
├── .gitignore             # Git ignore rules
├── package.json           # Node.js dependencies and scripts
├── README.md              # Project overview
├── main.js                # Main website JavaScript (153 lines)
├── index.html             # Primary marketing website (377 lines)
├── style.css              # Main stylesheet (848 lines)
│
└── funnel-bammel/         # Lead generation funnel subdirectory
    ├── landing.html       # Sinkhole awareness landing page (158 lines)
    ├── thank-you.html     # Post-form confirmation (41 lines)
    ├── funnel-style.css   # Funnel-specific styling (306 lines)
    └── follow-up-emails.md # Email nurture sequence templates
```

---

## Key Files & Their Roles

### `package.json`
Defines project metadata and npm scripts:
```json
{
  "name": "texas-rigs-roots-website",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": { /* Express, Axios, CORS, dotenv */ },
  "devDependencies": { "nodemon": "3.0.1" }
}
```
**Note**: `server.js` referenced but not yet created.

### `.env.example`
Template for environment configuration:
```
PORT=3000
NODE_ENV=development
N8N_WEBHOOK_URL=<webhook_for_automation>
SENDGRID_API_KEY=<optional_email_service>
```

### `main.js` - Core Interactivity
Handles:
- **Scroll-triggered header styling** - Changes header appearance on scroll
- **Mobile navigation** - Hamburger menu toggle for responsive nav
- **Section highlighting** - Updates active nav section based on scroll position
- **Fade-in animations** - Reveals sections as user scrolls
- **Contact form validation** - Email regex validation before submission
- **Web3Forms submission** - POSTs form data to Web3Forms endpoint

Key functions:
- `toggleNav()` - Mobile menu toggle
- `updateActiveNavLink()` - Highlight nav item based on scroll position
- `handleFormSubmit(e)` - Validate and submit contact form

### `index.html` - Main Marketing Site
Structure:
- **Header/Navigation** - Logo, nav links, mobile toggle
- **Hero Section** - Call-to-action buttons, value proposition
- **Services Section** - Two core offerings (manufacturing & installation)
- **Contact Form Section** - Web3Forms integration for lead capture
- **Footer** - Business contact info and links

Business contact embedded:
- Phone: (979) 803-1644
- Email: Rigsnroots@gmail.com

### `style.css` - Main Styling
- CSS variables for theming (--color-rust, --color-earth, --color-steel)
- Responsive breakpoints for mobile/tablet/desktop
- Smooth transitions and animations
- Accessibility-focused styling

### `funnel-bammel/` - Sinkhole Lead Funnel
**Purpose**: Targeted persuasion page for Bammel, North Houston (high sinkhole risk area)

**landing.html**:
- Problem-focused copy addressing Houston clay soil foundation issues
- Risk comparison: helical piers vs. concrete solutions
- Social proof and testimonial sections
- Web3Forms lead capture form
- High-urgency CTAs

**funnel-style.css**:
- Adapted color scheme for sense of urgency
- Large, readable typography
- Mobile-optimized form layout

**follow-up-emails.md**:
- Email sequence templates (numbered 1-5+)
- Nurture copy progression: awareness → consideration → decision
- Merge tag placeholders for personalization

---

## Development Workflows

### Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with actual values
```

### Development
```bash
# Run with auto-reload (requires server.js to exist)
npm run dev
```

### Production
```bash
npm start
```

### Git Workflow
- **Branches**: Feature/fix branches created from `main`
- **Commits**: Clear, descriptive messages
- **Current branch**: `claude/claude-md-docs-8ep5ke` (documentation updates)

---

## Important Implementation Notes

### ⚠️ Incomplete Backend
The `package.json` references `server.js` as the main entry point, but this file **does not yet exist**. 

**What needs to be implemented**:
- Express server setup (listen on PORT from .env)
- Route handlers (if any backend processing needed beyond Web3Forms)
- CORS configuration for cross-origin requests
- SendGrid integration (if email service desired)
- Webhook endpoint for n8n automation (optional)

**Current workaround**: Frontend is fully functional as static HTML/CSS/JS. Web3Forms handles form submission without backend.

### Form Handling
- **Current approach**: Client-side Web3Forms API
- **Web3Forms endpoint**: Called directly from `main.js`
- **No database required** - Forms submit to Web3Forms service
- **Email routing**: Web3Forms sends confirmation emails

### Responsive Design
- **Mobile-first approach** - Base styles for mobile, enhanced for desktop
- **Breakpoints**: Defined in CSS with media queries
- **Testing**: Check at 375px (mobile), 768px (tablet), 1024px (desktop)

### Email Integration
- **SendGrid** configured in `.env.example` but currently optional
- **Follow-up sequences** documented in `follow-up-emails.md`
- **Manual setup required** - Email automation (n8n webhook) not yet configured

---

## Common Tasks

### Add a New Page
1. Create HTML file in repo root or subfolder
2. Update navigation links in `index.html`
3. Create corresponding CSS file or add styles to `style.css`
4. Link JavaScript interactivity in `main.js` if needed

### Update Business Contact Info
Edit in three places:
- `index.html` - Footer and contact form section
- `funnel-bammel/landing.html` - Footer
- `follow-up-emails.md` - Signature blocks

### Modify Color Scheme
Edit CSS variables in `style.css`:
```css
:root {
  --color-rust: #8B4513;    /* Primary brand color */
  --color-earth: #A0826D;   /* Secondary */
  --color-steel: #708090;   /* Accent */
  /* ... others ... */
}
```

### Test Form Submission
1. Open site in browser
2. Fill contact form with valid email
3. Click submit
4. Check Web3Forms dashboard for submission
5. Verify email received (if email integration active)

### Implement Backend Server
1. Create `server.js` file in repo root
2. Initialize Express app:
   ```javascript
   const express = require('express');
   const cors = require('cors');
   require('dotenv').config();

   const app = express();
   app.use(cors());
   app.use(express.json());
   app.use(express.static('.')); // Serve static files

   app.listen(process.env.PORT || 3000, () => {
     console.log('Server running on port ' + (process.env.PORT || 3000));
   });
   ```
3. Add route handlers as needed
4. Test with `npm run dev`

---

## Git Conventions

**Commit messages**:
- `feat: add feature description`
- `fix: resolve issue description`
- `docs: update documentation`
- `style: CSS/styling changes`
- `refactor: improve code structure`

**Branch naming**:
- `feature/description` - New feature
- `fix/description` - Bug fix
- `docs/description` - Documentation
- `claude/claude-md-docs-8ep5ke` - Documentation updates (current)

---

## Testing Checklist

Before committing changes:

- [ ] **Desktop view**: Check at 1024px+ width
- [ ] **Tablet view**: Check at 768px width
- [ ] **Mobile view**: Check at 375px width
- [ ] **Forms**: Fill and submit contact form, verify no JavaScript errors
- [ ] **Navigation**: Test hamburger menu on mobile, click all nav links
- [ ] **Scroll animations**: Verify fade-ins and header styling trigger correctly
- [ ] **Links**: Verify all external links open correctly
- [ ] **Performance**: Check for console errors (F12 developer tools)

---

## Next Steps & Tech Debt

1. **Implement `server.js`** - Currently referenced but missing
2. **Set up email automation** - Configure n8n webhook for follow-up sequences
3. **Add analytics** - Track funnel performance (Google Analytics or similar)
4. **A/B testing** - Test different CTA copy and layout variants
5. **Lead scoring** - Integrate with CRM if backend is built out

---

## Support & Contacts

**Business**:
- Phone: (979) 803-1644
- Email: Rigsnroots@gmail.com
- Service area: North Houston, Texas

**For questions about this codebase**:
- Review comments in `main.js` for JavaScript logic
- Check `.env.example` for configuration options
- Reference `follow-up-emails.md` for email sequence templates
