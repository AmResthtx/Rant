# Grant Application Agent

An AI-powered agent that automatically builds grant applications based on your specifications and boundaries.

## Features

- **Set Your Boundaries**: Define eligible grant types, amount ranges, and keywords via `config.js`
- **Paste & Generate**: Simply paste grant details; the agent builds complete applications
- **Eligibility Checking**: Automatically validates grants against your configured boundaries
- **Manual Approval**: Override eligibility for special cases with explicit approval
- **Ready to Submit**: Generated applications are polished and ready for your review and submission

## Quick Start

### 1. Setup

```bash
# Copy environment file
cp .env.example .env

# Add your Anthropic API key
# Edit .env and set: ANTHROPIC_API_KEY=your_key_here
```

### 2. Configure Your Grant Boundaries

Edit `config.js` to define:
- Eligible grant types (e.g., "Small Business Grant", "Technology Innovation")
- Amount range (min/max funding)
- Ineligible keywords (e.g., "weapons", "tobacco")
- Your applicant profile (name, organization, mission, etc.)

```javascript
// Example from config.js
grantBoundaries: {
  eligibleTypes: ['Small Business Grant', 'Technology Innovation Grant'],
  minGrantAmount: 1000,
  maxGrantAmount: 1000000,
  // ... more settings
}
```

### 3. Start the Application

```bash
npm start
```

Then open `http://localhost:3000` in your browser.

## How It Works

1. **Paste Grant Details**: Copy-paste the entire grant description, requirements, and evaluation criteria
2. **Optional Applicant Info**: Add your organization name, mission, focus areas (system fills with defaults if omitted)
3. **Generate**: Click "Generate Application"
4. **Eligibility Check**: Agent validates against your boundaries
   - ✅ Eligible: Application generates immediately
   - ⚠️ Review Required: You must approve to proceed
   - ❌ Ineligible: Grant doesn't match your criteria
5. **Review & Submit**: Copy, download, or edit the generated application, then submit

## Configuration

### Grant Boundaries (config.js)

```javascript
grantBoundaries: {
  eligibleTypes: [],           // Grant types you accept
  ineligibleKeywords: [],      // Keywords that disqualify grants
  eligibleCountries: [],       // Geographic restrictions (empty = all)
  eligibleStates: [],          // State restrictions (empty = all)
  minGrantAmount: 1000,        // Minimum funding
  maxGrantAmount: 1000000,     // Maximum funding
  organizationTypes: [],       // Types of orgs you run (Individual, Small Business, etc.)
  requiresApprovalIfMatches: [] // Criteria requiring manual approval
}
```

### Applicant Profile (config.js)

```javascript
applicantProfile: {
  name: 'Your Name',
  organization: 'Your Organization',
  yearsInOperation: null,      // Optional
  numberOfEmployees: null,     // Optional
  missionStatement: '...',     // Your mission/purpose
  focusAreas: [],              // What you focus on
  previousGrants: []           // Previous grants received
}
```

## API Endpoints

### `POST /api/generate-application`

Generate a grant application.

**Request:**
```json
{
  "grantText": "Full grant details and requirements...",
  "applicantInfo": {
    "name": "Your Name",
    "organization": "Your Org",
    "missionStatement": "...",
    "focusAreas": ["Education", "Technology"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "application": "Full application text...",
  "metadata": {
    "grantEvaluated": "...",
    "applicant": "Your Name",
    "generatedAt": "2025-05-26T..."
  }
}
```

### `POST /api/force-application`

Generate application with explicit approval (bypassing eligibility warnings).

**Request:**
```json
{
  "grantText": "...",
  "applicantInfo": {...},
  "approvalReason": "User approved despite warnings"
}
```

### `GET /api/config`

Get current grant boundaries and applicant profile.

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)
- `PORT`: Server port (default: 3000)

## Technology Stack

- **Backend**: Node.js + Express
- **AI**: Claude API (Anthropic SDK)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Config**: JavaScript module

## Tips for Best Results

1. **Paste Complete Details**: Include all requirements, evaluation criteria, deadlines, and funding amounts
2. **Update Your Profile**: The more detailed your applicant profile in `config.js`, the better tailored applications will be
3. **Customize Boundaries**: Be specific about grant types and amounts you target
4. **Review First**: Always review generated applications before submitting - they're ready but should be customized to your specific situation
5. **Manual Approval**: Use this for borderline cases or grants that don't fit standard criteria but still interest you

## Example Workflow

1. Find a grant you're interested in
2. Copy the grant posting/requirements
3. Paste into the agent
4. Add or review your organization details
5. Click "Generate Application"
6. Review the output
7. Download or copy for submission
8. Submit to the grant program

## Troubleshooting

**"Grant does not meet eligibility criteria"**
- The grant doesn't match your configured boundaries
- Review your boundaries in `config.js` to adjust
- Or click "I Approve" if you want to proceed anyway

**"Failed to generate application"**
- Check your `ANTHROPIC_API_KEY` is set in `.env`
- Ensure you have API credits available
- Try with simpler grant details first

**Application quality seems generic**
- Update your `applicantProfile` in `config.js` with more details
- Include more specific requirements when pasting grant details
- The agent uses your profile and grant requirements to customize the application

## Next Steps

- Customize `config.js` with your grant targets
- Test with a grant you're interested in
- Refine boundaries based on results
- Integrate with other tools for grant sourcing and tracking

---

Built with [Claude API](https://anthropic.com/api)
