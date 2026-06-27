/**
 * Agent Event Handler for Rant
 *
 * Integrates Rant's form submissions and events with the agent stack.
 * Routes events to JangaRoo orchestrator through secure webhooks.
 *
 * Connects the web frontend to the multi-agent orchestration system.
 */

class AgentEventHandler {
  constructor(config = {}) {
    this.orchestratorUrl = config.orchestratorUrl || process.env.ORCHESTRATOR_URL;
    this.securityToken = config.securityToken || process.env.ORCHESTRATOR_TOKEN;
    this.eventQueue = [];
    this.eventLog = [];

    if (!this.orchestratorUrl) {
      console.warn('ORCHESTRATOR_URL not configured - agent integration disabled');
    }
  }

  /**
   * Route a form submission to the agent stack
   */
  async routeFormSubmission(formData) {
    const event = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'form_submission',
      timestamp: new Date().toISOString(),
      source: 'rant-web',
      data: formData,
      status: 'pending'
    };

    this.eventQueue.push(event);
    this.eventLog.push(event);

    try {
      const result = await this.sendToOrchestrator('task_created', {
        name: `Web Form: ${formData.service || 'General Inquiry'}`,
        description: formData.message,
        agent_type: this._selectAgentType(formData),
        parameters: this._convertFormToTaskParams(formData),
        priority: this._calculatePriority(formData),
        source: 'web_form'
      });

      event.status = 'routed';
      event.orchestrator_task_id = result.task_id;
      return result;
    } catch (error) {
      event.status = 'error';
      event.error = error.message;
      console.error('Failed to route event to orchestrator:', error);
      throw error;
    }
  }

  /**
   * Select appropriate agent type based on form service
   */
  _selectAgentType(formData) {
    const service = (formData.service || '').toLowerCase();

    const agentMap = {
      'foundation_analysis': 'helical-pier-agent',
      'structural_design': 'design-agent',
      'cost_estimation': 'financial-agent',
      'timeline': 'scheduling-agent',
      'general': 'general-assistant',
    };

    return agentMap[service] || 'general-assistant';
  }

  /**
   * Convert web form to orchestrator task parameters
   */
  _convertFormToTaskParams(formData) {
    return {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      message: formData.message,
      property_location: formData.propertyLocation || null,
      urgency: this._calculatePriority(formData),
      source_url: window.location.href || null
    };
  }

  /**
   * Calculate task priority from form data
   */
  _calculatePriority(formData) {
    // Priority: 1=critical, 5=low
    const urgencyKeywords = {
      'urgent': 1,
      'asap': 1,
      'emergency': 1,
      'broken': 2,
      'leaking': 2,
      'inspect': 3,
      'standard': 4,
      'estimate': 4,
    };

    const text = `${formData.message} ${formData.service}`.toLowerCase();

    for (const [keyword, priority] of Object.entries(urgencyKeywords)) {
      if (text.includes(keyword)) {
        return priority;
      }
    }

    return 3; // Default to normal priority
  }

  /**
   * Send event to orchestrator
   */
  async sendToOrchestrator(eventType, payload) {
    if (!this.orchestratorUrl) {
      throw new Error('Orchestrator URL not configured');
    }

    const response = await fetch(`${this.orchestratorUrl}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.securityToken}`,
        'X-Event-Type': eventType,
        'X-Source': 'rant-web'
      },
      body: JSON.stringify({
        type: eventType,
        timestamp: new Date().toISOString(),
        payload: payload
      })
    });

    if (!response.ok) {
      throw new Error(`Orchestrator error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get status of a submitted task
   */
  async getTaskStatus(taskId) {
    if (!this.orchestratorUrl) {
      throw new Error('Orchestrator URL not configured');
    }

    const response = await fetch(
      `${this.orchestratorUrl}/tasks/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.securityToken}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get task status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Subscribe to task updates (WebSocket)
   */
  subscribeToUpdates(taskId, onUpdate, onError) {
    if (!this.orchestratorUrl) {
      onError(new Error('Orchestrator URL not configured'));
      return null;
    }

    const wsUrl = this.orchestratorUrl
      .replace(/^http/, 'ws')
      .replace(/\/$/, '') + `/subscribe?task_id=${taskId}`;

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        onUpdate(update);
      } catch (error) {
        onError(error);
      }
    };

    ws.onerror = (event) => {
      onError(new Error('WebSocket connection error'));
    };

    return ws;
  }

  /**
   * Get event log
   */
  getEventLog() {
    return this.eventLog.slice(); // Return copy
  }

  /**
   * Clear event queue
   */
  clearQueue() {
    this.eventQueue = [];
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      queued: this.eventQueue.length,
      total_processed: this.eventLog.length,
      pending: this.eventQueue.filter(e => e.status === 'pending').length,
      routed: this.eventQueue.filter(e => e.status === 'routed').length,
      errors: this.eventQueue.filter(e => e.status === 'error').length
    };
  }
}

// Export for use in Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgentEventHandler;
}
