// Grant Application Agent UI
const grantTextEl = document.getElementById('grantText');
const applicantNameEl = document.getElementById('applicantName');
const applicantOrgEl = document.getElementById('applicantOrg');
const missionEl = document.getElementById('missionStatement');
const focusAreasEl = document.getElementById('focusAreas');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const messagesEl = document.getElementById('messages');
const outputSection = document.getElementById('outputSection');
const applicationOutputEl = document.getElementById('applicationOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const newApplicationBtn = document.getElementById('newApplicationBtn');
const boundariesDisplayEl = document.getElementById('boundariesDisplay');

let currentApplication = '';

// Load grant boundaries on page load
document.addEventListener('DOMContentLoaded', () => {
  loadGrantBoundaries();
});

async function loadGrantBoundaries() {
  try {
    const response = await fetch('/api/config');
    const data = await response.json();
    displayBoundaries(data.boundaries);
  } catch (error) {
    console.error('Failed to load boundaries:', error);
  }
}

function displayBoundaries(boundaries) {
  const items = [
    {
      title: 'Eligible Grant Types',
      value: boundaries.eligibleTypes.join(', ')
    },
    {
      title: 'Amount Range',
      value: `$${boundaries.minGrantAmount.toLocaleString()} - $${boundaries.maxGrantAmount.toLocaleString()}`
    },
    {
      title: 'Ineligible Keywords',
      value: boundaries.ineligibleKeywords.join(', ')
    },
    {
      title: 'Eligible Organization Types',
      value: boundaries.organizationTypes.join(', ')
    }
  ];

  boundariesDisplayEl.innerHTML = items
    .map(item => `
      <div class="boundary-item">
        <strong>${item.title}</strong>
        <p>${item.value}</p>
      </div>
    `)
    .join('');
}

generateBtn.addEventListener('click', generateApplication);
clearBtn.addEventListener('click', clearForm);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadApplication);
newApplicationBtn.addEventListener('click', startNewApplication);

async function generateApplication() {
  const grantText = grantTextEl.value.trim();

  if (!grantText) {
    showMessage('Please paste grant details', 'error');
    return;
  }

  // Collect applicant info
  const applicantInfo = {
    name: applicantNameEl.value || 'Applicant',
    organization: applicantOrgEl.value || '',
    missionStatement: missionEl.value || '',
    focusAreas: focusAreasEl.value
      ? focusAreasEl.value.split(',').map(s => s.trim())
      : [],
    previousGrants: []
  };

  // Disable button and show loading
  generateBtn.disabled = true;
  showMessage('🔄 Analyzing grant requirements...', 'info');

  try {
    const response = await fetch('/api/generate-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grantText, applicantInfo })
    });

    const data = await response.json();

    if (!response.ok) {
      // Check if approval is required
      if (data.error?.includes('requires manual approval') && data.applicantCanProceed) {
        showApprovalRequired(data, grantText, applicantInfo);
        generateBtn.disabled = false;
        messagesEl.innerHTML = '';
        return;
      }

      showMessage(`Error: ${data.error}`, 'error');
      if (data.issues) {
        data.issues.forEach(issue => {
          showMessage(`• ${issue}`, 'error');
        });
      }
      generateBtn.disabled = false;
      return;
    }

    currentApplication = data.application;
    displayApplication(data);
    showMessage('✓ Application generated successfully!', 'success');

  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
  } finally {
    generateBtn.disabled = false;
  }
}

function showApprovalRequired(data, grantText, applicantInfo) {
  messagesEl.innerHTML = `
    <div class="message approval-required">
      <strong>⚠️ Approval Required</strong>
      <p>${data.warning || 'This grant requires manual review before proceeding.'}</p>
      <p>This grant matches criteria that require your explicit approval.</p>
      <button class="btn btn-primary" onclick="forceGenerateApplication('${btoa(JSON.stringify({grantText, applicantInfo}))}')">
        I Approve - Generate Application
      </button>
    </div>
  `;
}

async function forceGenerateApplication(encodedData) {
  try {
    const { grantText, applicantInfo } = JSON.parse(atob(encodedData));

    generateBtn.disabled = true;
    showMessage('🔄 Generating application with approval...', 'info');

    const response = await fetch('/api/force-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grantText,
        applicantInfo,
        approvalReason: 'User approved despite eligibility warnings'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(`Error: ${data.error}`, 'error');
      generateBtn.disabled = false;
      return;
    }

    currentApplication = data.application;
    displayApplication(data);
    showMessage('✓ Application generated with approval!', 'success');

  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
  } finally {
    generateBtn.disabled = false;
  }
}

function displayApplication(data) {
  applicationOutputEl.textContent = currentApplication;
  outputSection.style.display = 'block';
  outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyToClipboard() {
  navigator.clipboard.writeText(currentApplication).then(() => {
    showMessage('✓ Copied to clipboard!', 'success');
  }).catch(err => {
    showMessage('Failed to copy', 'error');
  });
}

function downloadApplication() {
  const element = document.createElement('a');
  const file = new Blob([currentApplication], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `grant-application-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showMessage('✓ Downloaded!', 'success');
}

function startNewApplication() {
  clearForm();
  outputSection.style.display = 'none';
  grantTextEl.focus();
}

function clearForm() {
  grantTextEl.value = '';
  applicantNameEl.value = '';
  applicantOrgEl.value = '';
  missionEl.value = '';
  focusAreasEl.value = '';
  messagesEl.innerHTML = '';
}

function showMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = text;
  messagesEl.appendChild(msg);

  // Auto-remove info messages after 5 seconds
  if (type === 'info') {
    setTimeout(() => msg.remove(), 5000);
  }
}
