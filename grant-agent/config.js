/**
 * Grant Eligibility Configuration
 * Define which grants this agent can apply for
 */

module.exports = {
  // Define your grant boundaries here
  grantBoundaries: {
    // Examples - customize these to your situation
    eligibleTypes: [
      'Small Business Grant',
      'Technology Innovation Grant',
      'Startup Funding',
      'Research Grant',
      'Nonprofit Grant'
    ],

    ineligibleKeywords: [
      'weapons',
      'tobacco',
      'gambling',
      'political campaign'
    ],

    // Geographic restrictions (empty = no restriction)
    eligibleCountries: ['US'], // Leave empty for all
    eligibleStates: [], // Leave empty for all

    // Amount constraints (in USD)
    minGrantAmount: 1000,
    maxGrantAmount: 1000000,

    // Eligibility rules
    organizationTypes: [
      'Individual',
      'Small Business',
      'Nonprofit',
      'Social Enterprise'
    ],

    // Approval required for grants matching certain criteria
    requiresApprovalIfMatches: [
      'over 500k', // Requires manual approval if grant is over 500k
      'international', // Requires approval if international
      'highly competitive' // Requires approval if described as highly competitive
    ]
  },

  // Grant applicant profile (customize with your info)
  applicantProfile: {
    name: 'Your Name',
    organization: 'Your Organization',
    yearsInOperation: null, // Set to number or null
    numberOfEmployees: null,
    annualRevenue: null,
    missionStatement: 'Define your mission here',
    previousGrants: [], // List previous grants you've received
    focusAreas: [] // What you focus on
  }
};
