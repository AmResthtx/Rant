// Email Manager - localStorage-based contact and email tracking system

const STORAGE_KEYS = {
  contacts: 'rant_contacts',
  emails: 'rant_emails'
};

const ORGANIZATIONS = {
  'arclabs': 'Arclabs',
  'stablechase': 'Stablechase',
  'jp4-cops': 'JP4 and COPS',
  'harris-county': 'Harris County Officials',
  'other': 'Other'
};

// ============================================
// UTILITIES
// ============================================

function generateId() {
  return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function generateWebhookUrl() {
  const webhookId = generateId();
  return `https://webhook.site/${webhookId}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ============================================
// LOCALSTORAGE OPERATIONS
// ============================================

function getContacts() {
  const data = localStorage.getItem(STORAGE_KEYS.contacts);
  return data ? JSON.parse(data) : [];
}

function saveContacts(contacts) {
  localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(contacts));
}

function addContact(name, email, organization) {
  const contacts = getContacts();
  const newContact = {
    id: generateId(),
    name,
    email,
    organization,
    dateAdded: new Date().toISOString().split('T')[0]
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
}

function deleteContact(contactId) {
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.id !== contactId);
  saveContacts(filtered);
}

function getEmails() {
  const data = localStorage.getItem(STORAGE_KEYS.emails);
  return data ? JSON.parse(data) : [];
}

function saveEmails(emails) {
  localStorage.setItem(STORAGE_KEYS.emails, JSON.stringify(emails));
}

function addEmail(contactId, subject, body, status) {
  const emails = getEmails();
  const trackingUrl = generateWebhookUrl();
  const newEmail = {
    id: generateId(),
    contactId,
    subject,
    body,
    dateSent: new Date().toISOString().split('T')[0],
    status,
    trackingPixelId: generateId(),
    trackingPixelUrl: trackingUrl,
    opened: false,
    openedAt: null,
    openCount: 0
  };
  emails.push(newEmail);
  saveEmails(emails);
  return newEmail;
}

function deleteEmail(emailId) {
  const emails = getEmails();
  const filtered = emails.filter(e => e.id !== emailId);
  saveEmails(filtered);
}

function getContactById(id) {
  return getContacts().find(c => c.id === id);
}

// ============================================
// DOM MANIPULATION
// ============================================

function renderContacts() {
  const container = document.getElementById('contactsContainer');
  const contacts = getContacts();

  if (contacts.length === 0) {
    container.innerHTML = '<p class="empty-state">No contacts yet. Add one above!</p>';
    return;
  }

  const groupedByOrg = {};
  contacts.forEach(contact => {
    if (!groupedByOrg[contact.organization]) {
      groupedByOrg[contact.organization] = [];
    }
    groupedByOrg[contact.organization].push(contact);
  });

  let html = '';
  Object.keys(ORGANIZATIONS).forEach(orgKey => {
    if (groupedByOrg[orgKey]) {
      html += `<div class="org-group">
        <h3 class="org-name">${ORGANIZATIONS[orgKey]}</h3>
        <div class="contacts-grid">`;

      groupedByOrg[orgKey].forEach(contact => {
        html += `
          <div class="contact-card">
            <div class="contact-card-header">
              <h4>${contact.name}</h4>
              <button class="btn-delete" onclick="deleteContactHandler('${contact.id}')">Delete</button>
            </div>
            <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
            <p><strong>Organization:</strong> ${ORGANIZATIONS[contact.organization]}</p>
            <p><strong>Added:</strong> ${formatDate(contact.dateAdded)}</p>
          </div>
        `;
      });

      html += '</div></div>';
    }
  });

  container.innerHTML = html;
}

function renderEmailHistory() {
  const container = document.getElementById('emailHistoryContainer');
  const emails = getEmails();

  if (emails.length === 0) {
    container.innerHTML = '<p class="empty-state">No emails logged yet. Log one above!</p>';
    return;
  }

  let html = '<div class="emails-list">';
  emails.forEach(email => {
    const contact = getContactById(email.contactId);
    if (!contact) return;

    const statusClass = `status-${email.status}`;
    const openStatus = email.opened ? `✓ Opened ${formatDate(email.openedAt)}` : 'Not Opened';

    html += `
      <div class="email-item">
        <div class="email-item-header">
          <div>
            <h4>${email.subject}</h4>
            <p class="email-contact">To: <strong>${contact.name}</strong> (${ORGANIZATIONS[contact.organization]})</p>
          </div>
          <button class="btn-delete" onclick="deleteEmailHandler('${email.id}')">Delete</button>
        </div>
        <div class="email-item-body">
          <p>${email.body}</p>
        </div>
        <div class="email-item-footer">
          <div class="email-meta">
            <span class="meta-item">Sent: ${formatDate(email.dateSent)}</span>
            <span class="meta-item status ${statusClass}">Status: ${email.status}</span>
            <span class="meta-item">Opens: ${email.openCount}</span>
            <span class="meta-item">Open Status: ${openStatus}</span>
          </div>
          <div class="email-actions">
            <button class="btn btn-small" onclick="showTrackingPixel('${email.id}')">View Tracking Pixel</button>
            <button class="btn btn-small" onclick="refreshTrackingStatus('${email.id}')">Refresh Status</button>
          </div>
        </div>
      </div>
    `;
  });
  html += '</div>';

  container.innerHTML = html;
}

function showTrackingPixel(emailId) {
  const emails = getEmails();
  const email = emails.find(e => e.id === emailId);
  if (!email) return;

  const pixelHtml = `<img src="${email.trackingPixelUrl}" width="1" height="1" style="display:none;" />`;
  const message = `Tracking Pixel HTML:\n\n${pixelHtml}\n\nWebhook URL: ${email.trackingPixelUrl}\n\n(Copy the HTML above and add it to the end of your email body)`;

  alert(message);
}

function refreshTrackingStatus(emailId) {
  const emails = getEmails();
  const emailIndex = emails.findIndex(e => e.id === emailId);
  if (emailIndex === -1) return;

  const email = emails[emailIndex];

  fetch(email.trackingPixelUrl)
    .then(response => {
      if (response.ok) {
        email.opened = true;
        email.openedAt = new Date().toISOString().split('T')[0];
        email.openCount += 1;
        saveEmails(emails);
        renderEmailHistory();
        alert('Tracking status updated!');
      }
    })
    .catch(() => {
      alert('Could not refresh tracking status at this time.');
    });
}

function updateContactDropdown() {
  const select = document.getElementById('emailContact');
  const contacts = getContacts();

  let html = '<option value="">Choose a contact...</option>';
  contacts.forEach(contact => {
    html += `<option value="${contact.id}">${contact.name} (${ORGANIZATIONS[contact.organization]})</option>`;
  });

  select.innerHTML = html;
}

// ============================================
// EVENT HANDLERS
// ============================================

function deleteContactHandler(contactId) {
  if (confirm('Are you sure you want to delete this contact?')) {
    deleteContact(contactId);
    renderContacts();
    updateContactDropdown();
  }
}

function deleteEmailHandler(emailId) {
  if (confirm('Are you sure you want to delete this email record?')) {
    deleteEmail(emailId);
    renderEmailHistory();
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  event.target.classList.add('active');
  document.getElementById(tabName + '-tab').classList.add('active');
}

// ============================================
// FORM SUBMISSIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Add Contact Form
  const addContactForm = document.getElementById('addContactForm');
  if (addContactForm) {
    addContactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const organization = document.getElementById('contactOrg').value;

      if (name && email && organization) {
        addContact(name, email, organization);
        addContactForm.reset();
        renderContacts();
        updateContactDropdown();
      }
    });
  }

  // Log Email Form
  const logEmailForm = document.getElementById('logEmailForm');
  if (logEmailForm) {
    logEmailForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const contactId = document.getElementById('emailContact').value;
      const subject = document.getElementById('emailSubject').value;
      const body = document.getElementById('emailBody').value;
      const status = document.getElementById('emailStatus').value;

      if (contactId && subject && body && status) {
        addEmail(contactId, subject, body, status);
        logEmailForm.reset();
        renderEmailHistory();
      }
    });
  }

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      switchTab(this.dataset.tab);
    });
  });

  // Initial render
  renderContacts();
  renderEmailHistory();
  updateContactDropdown();

  // Add header scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 50) {
      if (!header.classList.contains('scrolled')) {
        header.classList.add('scrolled');
      }
    } else {
      header.classList.remove('scrolled');
    }
  });
});
