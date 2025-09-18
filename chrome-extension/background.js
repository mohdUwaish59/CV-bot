// Background script for CV Tracker extension
class CVTrackerBackground {
  constructor() {
    this.baseUrl = 'https://your-cv-tracker-domain.vercel.app'; // Replace with your actual domain
    this.setupMessageListener();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep the message channel open for async responses
    });
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'checkAuth':
          const authStatus = await this.checkAuthenticationStatus();
          sendResponse(authStatus);
          break;

        case 'authenticate':
          const authResult = await this.authenticateUser();
          sendResponse(authResult);
          break;

        case 'saveApplication':
          const saveResult = await this.saveApplication(request.data);
          sendResponse(saveResult);
          break;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({ error: error.message });
    }
  }

  async checkAuthenticationStatus() {
    try {
      // Check if user has stored authentication token
      const result = await chrome.storage.local.get(['cvTrackerAuth']);
      
      if (!result.cvTrackerAuth || !result.cvTrackerAuth.token) {
        return { isAuthenticated: false };
      }

      // Verify token is still valid by making a test request
      const response = await fetch(`${this.baseUrl}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${result.cvTrackerAuth.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        return { 
          isAuthenticated: true, 
          user: userData 
        };
      } else {
        // Token is invalid, clear it
        await chrome.storage.local.remove(['cvTrackerAuth']);
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return { isAuthenticated: false };
    }
  }

  async authenticateUser() {
    try {
      // Open CV Tracker login page in a new tab
      const authTab = await chrome.tabs.create({
        url: `${this.baseUrl}/auth/extension-login`,
        active: true
      });

      // Listen for the authentication completion
      return new Promise((resolve) => {
        const authListener = (tabId, changeInfo, tab) => {
          // Check if the auth tab completed authentication
          if (tabId === authTab.id && changeInfo.url && changeInfo.url.includes('extension-auth-success')) {
            // Extract token from URL or use postMessage
            chrome.tabs.remove(tabId);
            chrome.tabs.onUpdated.removeListener(authListener);
            
            // In a real implementation, you'd extract the token from the URL or use postMessage
            // For now, we'll simulate successful authentication
            this.handleAuthSuccess().then(resolve);
          }
        };

        chrome.tabs.onUpdated.addListener(authListener);

        // Timeout after 5 minutes
        setTimeout(() => {
          chrome.tabs.onUpdated.removeListener(authListener);
          resolve({ success: false, error: 'Authentication timeout' });
        }, 300000);
      });
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: error.message };
    }
  }

  async handleAuthSuccess() {
    // In a real implementation, you'd receive the auth token from the web app
    // For now, we'll simulate this process
    
    // Store authentication data
    await chrome.storage.local.set({
      cvTrackerAuth: {
        token: 'simulated-token', // This would be the real Firebase ID token
        user: {
          uid: 'user-id',
          email: 'user@example.com',
          displayName: 'User Name'
        },
        timestamp: Date.now()
      }
    });

    return { success: true };
  }

  async saveApplication(applicationData) {
    try {
      // Get authentication token
      const result = await chrome.storage.local.get(['cvTrackerAuth']);
      
      if (!result.cvTrackerAuth || !result.cvTrackerAuth.token) {
        throw new Error('Not authenticated');
      }

      // Prepare form data for file uploads
      const formData = new FormData();
      
      // Add text fields
      Object.keys(applicationData).forEach(key => {
        if (key !== 'cvFile' && key !== 'coverLetterFile' && applicationData[key] !== null && applicationData[key] !== undefined) {
          formData.append(key, applicationData[key]);
        }
      });

      // Add files if present
      if (applicationData.cvFile) {
        formData.append('cvFile', applicationData.cvFile);
      }
      if (applicationData.coverLetterFile) {
        formData.append('coverLetterFile', applicationData.coverLetterFile);
      }

      // Make API request to save application
      const response = await fetch(`${this.baseUrl}/api/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${result.cvTrackerAuth.token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      });

      if (response.ok) {
        const savedApplication = await response.json();
        return { 
          success: true, 
          application: savedApplication 
        };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save application');
      }
    } catch (error) {
      console.error('Save application error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

// Initialize background script
new CVTrackerBackground();