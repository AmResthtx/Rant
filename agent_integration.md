# Rant - Agent Stack Integration

## Overview

Rant integrates with the agent stack orchestration system to route form submissions and customer inquiries to specialized agents (foundation analysis, design, financial analysis, etc.).

This document explains how to configure and use the agent integration.

## Setup

### 1. Configure Environment Variables

Add to your `.env` file:

```env
# Agent Orchestrator Integration
ORCHESTRATOR_URL=http://localhost:8000
ORCHESTRATOR_TOKEN=your-secure-token-here
```

If running via n8n workflow:

```env
N8N_ORCHESTRATOR_WEBHOOK=https://your-n8n-instance/webhook/agent-events
N8N_TRIGGER_ON_FORM_SUBMIT=true
```

### 2. Initialize Agent Event Handler

In your main application (or before form submission):

```javascript
// Create handler instance
const agentHandler = new AgentEventHandler({
  orchestratorUrl: process.env.ORCHESTRATOR_URL,
  securityToken: process.env.ORCHESTRATOR_TOKEN
});

// Store in global context or module exports
window.agentHandler = agentHandler; // For browser
module.exports = agentHandler; // For Node.js
```

### 3. Route Form Submissions to Agents

Modify your form submission handler:

```javascript
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Collect form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    service: document.getElementById('service').value,
    message: document.getElementById('message').value,
    propertyLocation: document.getElementById('location').value
  };

  try {
    // Route to agent stack (replaces or complements n8n webhook)
    const result = await agentHandler.routeFormSubmission(formData);

    // Show task ID to user
    alert(`Your inquiry has been submitted. Task ID: ${result.task_id}`);

    // Optional: Subscribe to updates
    const ws = agentHandler.subscribeToUpdates(
      result.task_id,
      (update) => {
        console.log('Task update:', update);
        // Update UI with progress
      },
      (error) => {
        console.error('Update error:', error);
      }
    );

    // Reset form
    e.target.reset();
  } catch (error) {
    console.error('Failed to submit:', error);
    alert('Error submitting inquiry. Please try again.');
  }
});
```

## Service Type Mapping

The agent handler automatically selects the appropriate agent based on the service type:

| Service Type | Agent | Purpose |
|--------------|-------|---------|
| `foundation_analysis` | helical-pier-agent | Structural foundation analysis |
| `structural_design` | design-agent | Custom structural design |
| `cost_estimation` | financial-agent | Project cost analysis |
| `timeline` | scheduling-agent | Timeline and scheduling |
| `general` | general-assistant | General inquiries |

## Priority Calculation

Form submissions are prioritized based on keywords:

| Keywords | Priority | Level |
|----------|----------|-------|
| urgent, asap, emergency | 1 | Critical |
| broken, leaking | 2 | High |
| inspect | 3 | Normal |
| standard, estimate | 4 | Low |

## Integration with n8n

If you're already using n8n, you can use the agent handler alongside your existing workflows:

### Option 1: Route to Agents First, Then n8n

```javascript
async function handleFormSubmission(formData) {
  try {
    // Route to agent stack
    const agentResult = await agentHandler.routeFormSubmission(formData);
    formData.agent_task_id = agentResult.task_id;

    // Then trigger n8n workflow with agent task ID
    await fetch(process.env.N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    return agentResult;
  } catch (error) {
    console.error('Integration error:', error);
    throw error;
  }
}
```

### Option 2: Use n8n as Proxy to Agents

Configure n8n webhook to forward to orchestrator:

```json
{
  "n8n_webhook_in": {...},
  "node_type": "HTTP_REQUEST",
  "url": "{{ $env.ORCHESTRATOR_URL }}/events",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {{ $env.ORCHESTRATOR_TOKEN }}"
  },
  "body": {
    "type": "task_created",
    "payload": "{{ $json }}"
  }
}
```

## Monitoring and Tracking

### Get Task Status

```javascript
const taskId = result.task_id;
const status = await agentHandler.getTaskStatus(taskId);

console.log(status);
// {
//   "id": "task-...",
//   "status": "in_progress",
//   "agent": "helical-pier-agent",
//   "progress": 45,
//   "estimated_completion": "2026-06-24T16:30:00Z"
// }
```

### Subscribe to Real-time Updates

```javascript
const ws = agentHandler.subscribeToUpdates(
  taskId,
  (update) => {
    // Update progress bar
    document.getElementById('progress').value = update.progress;
    document.getElementById('status').textContent = update.status;

    if (update.status === 'completed') {
      // Show results
      displayResults(update.result);
    }
  },
  (error) => {
    console.error('Subscription error:', error);
  }
);

// Later, close subscription
ws.close();
```

### Queue Management

```javascript
// Check queue status
const queueStatus = agentHandler.getQueueStatus();
console.log(`${queueStatus.pending} pending, ${queueStatus.routed} routed`);

// View event log
const eventLog = agentHandler.getEventLog();
eventLog.forEach(event => {
  console.log(`${event.timestamp}: ${event.type} - ${event.status}`);
});

// Clear processed queue
agentHandler.clearQueue();
```

## Error Handling

```javascript
try {
  const result = await agentHandler.routeFormSubmission(formData);
} catch (error) {
  if (error.message.includes('Orchestrator URL not configured')) {
    // Fallback to n8n webhook
    console.log('Using fallback n8n webhook');
    // ... send to n8n instead
  } else if (error.message.includes('401')) {
    // Authentication error - check token
    console.error('Authentication failed - check ORCHESTRATOR_TOKEN');
  } else if (error.message.includes('timeout')) {
    // Network timeout - queue locally
    console.log('Orchestrator unreachable - queuing locally');
  } else {
    // Other error
    console.error('Unknown error:', error);
  }
}
```

## Development & Testing

### Standalone Testing (Node.js)

```javascript
const AgentEventHandler = require('./agent_event_handler.js');

async function test() {
  const handler = new AgentEventHandler({
    orchestratorUrl: 'http://localhost:8000',
    securityToken: 'test-token'
  });

  const result = await handler.routeFormSubmission({
    name: 'Test User',
    email: 'test@example.com',
    phone: '555-0123',
    service: 'foundation_analysis',
    message: 'Test inquiry',
    propertyLocation: 'Test Location'
  });

  console.log('Task created:', result.task_id);
}

test().catch(console.error);
```

### Browser Testing

Load the script in your HTML:

```html
<script src="agent_event_handler.js"></script>
<script>
  const handler = new AgentEventHandler({
    orchestratorUrl: 'http://localhost:8000',
    securityToken: 'test-token'
  });

  // Test form routing
  document.getElementById('test-btn').onclick = async () => {
    const result = await handler.routeFormSubmission({
      name: 'Test',
      email: 'test@example.com',
      service: 'foundation_analysis',
      message: 'Test message'
    });
    console.log('Task:', result);
  };
</script>
```

## Troubleshooting

### Orchestrator URL not found

```
Error: ORCHESTRATOR_URL not configured - agent integration disabled
```

**Solution**: Set `ORCHESTRATOR_URL` environment variable before initializing handler.

### Authentication failures

```
Error: Orchestrator error: 401 Unauthorized
```

**Solution**: Verify `ORCHESTRATOR_TOKEN` matches the orchestrator's configured token.

### Connection timeouts

If the orchestrator is unavailable, implement local queuing:

```javascript
async function robustSubmit(formData) {
  try {
    return await agentHandler.routeFormSubmission(formData);
  } catch (error) {
    if (error.message.includes('Failed to connect')) {
      // Queue locally for later
      localStorage.setItem('pending_submission', JSON.stringify(formData));
      return { queued_locally: true };
    }
    throw error;
  }
}
```

## Security Considerations

- **Never commit `.env` files** - Use environment variables for tokens
- **Validate form data server-side** - Don't trust client-side validation
- **Use HTTPS** - Always use secure connections to orchestrator
- **Rotate tokens regularly** - Change `ORCHESTRATOR_TOKEN` periodically
- **Log integration events** - Monitor for suspicious activity

## Performance Tips

- **Cache agent availability** - Don't query on every form submission
- **Batch submissions** - Group multiple forms if volume is high
- **Implement backoff** - Retry failed submissions with exponential backoff
- **Monitor queue depth** - Alert if local queue grows too large

## Next Steps

1. Configure environment variables
2. Initialize `AgentEventHandler` in your application
3. Update form submission handler
4. Test with sample form data
5. Monitor orchestrator logs for errors
6. Set up WebSocket subscription for live updates
7. Deploy to production
