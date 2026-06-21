const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();
const config = require('./config');

const app = express();
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

app.use(express.json());
app.use(express.static('public'));

/**
 * Evaluate grant eligibility based on configured boundaries
 */
function evaluateGrantEligibility(grantText) {
  const textLower = grantText.toLowerCase();
  const issues = [];

  // Check for ineligible keywords
  config.grantBoundaries.ineligibleKeywords.forEach(keyword => {
    if (textLower.includes(keyword.toLowerCase())) {
      issues.push(`Contains ineligible keyword: "${keyword}"`);
    }
  });

  // Check if grant type is mentioned
  let typeFound = false;
  config.grantBoundaries.eligibleTypes.forEach(type => {
    if (textLower.includes(type.toLowerCase())) {
      typeFound = true;
    }
  });
  if (!typeFound) {
    issues.push(`Grant type not recognized among eligible types`);
  }

  // Check amount constraints if amounts are mentioned
  const amountMatch = grantText.match(/\$?([\d,]+)(?:,\d{3})*/g);
  if (amountMatch) {
    const amounts = amountMatch.map(a => parseInt(a.replace(/[$,]/g, '')));
    const maxAmount = Math.max(...amounts);
    if (maxAmount > config.grantBoundaries.maxGrantAmount) {
      issues.push(`Grant amount exceeds maximum (${config.grantBoundaries.maxGrantAmount})`);
    }
    if (maxAmount < config.grantBoundaries.minGrantAmount) {
      issues.push(`Grant amount below minimum (${config.grantBoundaries.minGrantAmount})`);
    }
  }

  // Check for approval-required keywords
  let requiresApproval = false;
  config.grantBoundaries.requiresApprovalIfMatches.forEach(criterion => {
    if (textLower.includes(criterion.toLowerCase())) {
      requiresApproval = true;
    }
  });

  return {
    eligible: issues.length === 0,
    requiresApproval,
    issues
  };
}

/**
 * POST /api/generate-application
 * Generate a grant application based on pasted grant details
 */
app.post('/api/generate-application', async (req, res) => {
  try {
    const { grantText, applicantInfo } = req.body;

    if (!grantText || grantText.trim().length === 0) {
      return res.status(400).json({ error: 'Grant details required' });
    }

    // Evaluate eligibility
    const eligibility = evaluateGrantEligibility(grantText);
    if (!eligibility.eligible) {
      return res.status(400).json({
        error: 'Grant does not meet eligibility criteria',
        issues: eligibility.issues
      });
    }

    if (eligibility.requiresApproval) {
      return res.status(400).json({
        error: 'Grant requires manual approval before proceeding',
        warning: 'This grant matches criteria requiring review',
        applicantCanProceed: true
      });
    }

    // Merge applicant info with profile
    const finalApplicantInfo = {
      ...config.applicantProfile,
      ...applicantInfo
    };

    // Generate application using Claude
    const systemPrompt = `You are an expert grant writer specializing in creating compelling grant applications.
Your task is to generate a professional, complete grant application based on the grant requirements and applicant information provided.

The application should:
1. Address all stated requirements and evaluation criteria
2. Use compelling, clear language
3. Highlight the applicant's strengths and qualifications
4. Demonstrate impact and feasibility
5. Be ready for submission with minimal editing
6. Follow standard grant writing best practices

Provide only the application text itself - no meta-commentary or explanations.`;

    const userPrompt = `Please write a complete grant application based on the following:

GRANT REQUIREMENTS:
${grantText}

APPLICANT INFORMATION:
Name/Organization: ${finalApplicantInfo.name} ${finalApplicantInfo.organization ? `(${finalApplicantInfo.organization})` : ''}
${finalApplicantInfo.missionStatement ? `Mission: ${finalApplicantInfo.missionStatement}` : ''}
${finalApplicantInfo.yearsInOperation ? `Years in Operation: ${finalApplicantInfo.yearsInOperation}` : ''}
${finalApplicantInfo.focusAreas.length > 0 ? `Focus Areas: ${finalApplicantInfo.focusAreas.join(', ')}` : ''}
${finalApplicantInfo.previousGrants.length > 0 ? `Previous Grants: ${finalApplicantInfo.previousGrants.join(', ')}` : ''}

Generate a complete, professional grant application tailored to these requirements and the applicant's profile.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      system: systemPrompt
    });

    const application = response.content[0].type === 'text' ? response.content[0].text : '';

    res.json({
      success: true,
      application,
      metadata: {
        grantEvaluated: grantText.substring(0, 100) + '...',
        applicant: finalApplicantInfo.name,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating application:', error);
    res.status(500).json({
      error: 'Failed to generate application',
      details: error.message
    });
  }
});

/**
 * POST /api/force-application
 * Generate application even if eligibility check fails (requires explicit approval)
 */
app.post('/api/force-application', async (req, res) => {
  try {
    const { grantText, applicantInfo, approvalReason } = req.body;

    if (!grantText || !approvalReason) {
      return res.status(400).json({
        error: 'Grant text and approval reason required'
      });
    }

    const finalApplicantInfo = {
      ...config.applicantProfile,
      ...applicantInfo
    };

    const systemPrompt = `You are an expert grant writer. Generate a complete, professional grant application.`;

    const userPrompt = `Please write a complete grant application based on the following:

GRANT REQUIREMENTS:
${grantText}

APPLICANT INFORMATION:
Name/Organization: ${finalApplicantInfo.name} ${finalApplicantInfo.organization ? `(${finalApplicantInfo.organization})` : ''}
${finalApplicantInfo.missionStatement ? `Mission: ${finalApplicantInfo.missionStatement}` : ''}

Generate a complete, professional grant application tailored to these requirements.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      system: systemPrompt
    });

    const application = response.content[0].type === 'text' ? response.content[0].text : '';

    res.json({
      success: true,
      application,
      metadata: {
        forceApplied: true,
        approvalReason,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating forced application:', error);
    res.status(500).json({
      error: 'Failed to generate application',
      details: error.message
    });
  }
});

/**
 * GET /api/config
 * Get current grant boundaries (for UI reference)
 */
app.get('/api/config', (req, res) => {
  res.json({
    boundaries: config.grantBoundaries,
    applicantProfile: config.applicantProfile
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Grant Application Agent running on http://localhost:${PORT}`);
  console.log(`Configured eligible grant types: ${config.grantBoundaries.eligibleTypes.join(', ')}`);
});
