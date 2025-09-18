// Popup script for CV Tracker extension
class CVTrackerPopup {
    constructor() {
        this.baseUrl = 'https://cv-bot-4-you.vercel.app/'; // Replace with your actual domain
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    async setup() {
        // Setup event listeners
        this.setupEventListeners();

        // Check status
        await this.checkStatus();

        // Hide loading and show content
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
    }

    setupEventListeners() {
        // Login button
        document.getElementById('login-btn').addEventListener('click', () => {
            this.handleLogin();
        });

        // Extract job button
        document.getElementById('extract-btn').addEventListener('click', () => {
            this.handleExtractJob();
        });

        // Open app button
        document.getElementById('open-app-btn').addEventListener('click', () => {
            chrome.tabs.create({ url: this.baseUrl });
            window.close();
        });

        // Help link
        document.getElementById('help-link').addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: `${this.baseUrl}/help` });
            window.close();
        });

        // Set app URL
        document.getElementById('open-app-btn').href = this.baseUrl;
    }

    async checkStatus() {
        try {
            // Check authentication status
            const authStatus = await this.sendMessage({ action: 'checkAuth' });
            this.updateAuthStatus(authStatus);

            // Check current page
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const currentTab = tabs[0];
            this.updatePageStatus(currentTab);

        } catch (error) {
            console.error('Error checking status:', error);
            this.updateAuthStatus({ isAuthenticated: false });
            this.updatePageStatus(null);
        }
    }

    updateAuthStatus(authStatus) {
        const icon = document.getElementById('auth-status-icon');
        const text = document.getElementById('auth-status-text');
        const loginBtn = document.getElementById('login-btn');

        if (authStatus && authStatus.isAuthenticated) {
            icon.className = 'status-icon success';
            icon.textContent = '✓';
            text.textContent = `Logged in as ${authStatus.user?.email || 'User'}`;
            loginBtn.classList.add('hidden');
        } else {
            icon.className = 'status-icon error';
            icon.textContent = '✗';
            text.textContent = 'Not logged in';
            loginBtn.classList.remove('hidden');
        }
    }

    updatePageStatus(tab) {
        const icon = document.getElementById('page-status-icon');
        const text = document.getElementById('page-status-text');
        const extractBtn = document.getElementById('extract-btn');

        if (tab && tab.url && tab.url.includes('linkedin.com/jobs/')) {
            icon.className = 'status-icon success';
            icon.textContent = '✓';
            text.textContent = 'LinkedIn job page detected';
            extractBtn.classList.remove('hidden');
        } else {
            icon.className = 'status-icon info';
            icon.textContent = 'i';
            text.textContent = 'Navigate to a LinkedIn job page';
            extractBtn.classList.add('hidden');
        }
    }

    async handleLogin() {
        const loginBtn = document.getElementById('login-btn');
        const originalText = loginBtn.innerHTML;

        try {
            // Show loading state
            loginBtn.innerHTML = `
        <div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>
        Logging in...
      `;
            loginBtn.disabled = true;

            // Attempt authentication
            const result = await this.sendMessage({ action: 'authenticate' });

            if (result && result.success) {
                // Refresh status
                await this.checkStatus();
            } else {
                throw new Error(result?.error || 'Authentication failed');
            }

        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        } finally {
            // Restore button state
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    }

    async handleExtractJob() {
        const extractBtn = document.getElementById('extract-btn');
        const originalText = extractBtn.innerHTML;

        try {
            // Show loading state
            extractBtn.innerHTML = `
        <div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>
        Extracting...
      `;
            extractBtn.disabled = true;

            // Get current tab
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const currentTab = tabs[0];

            if (!currentTab || !currentTab.url.includes('linkedin.com/jobs/')) {
                throw new Error('Please navigate to a LinkedIn job page first');
            }

            // Inject content script to extract job details
            const results = await chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: this.extractJobDetailsScript
            });

            const jobDetails = results[0]?.result;

            if (!jobDetails || !jobDetails.job_title || !jobDetails.company_name) {
                throw new Error('Could not extract job details. Please try again or add manually.');
            }

            // Check if user is authenticated
            const authStatus = await this.sendMessage({ action: 'checkAuth' });
            if (!authStatus || !authStatus.isAuthenticated) {
                throw new Error('Please log in first');
            }

            // Send message to content script to open form
            await chrome.tabs.sendMessage(currentTab.id, {
                action: 'openForm',
                jobDetails: jobDetails
            });

            // Close popup
            window.close();

        } catch (error) {
            console.error('Extract job error:', error);
            alert('Error: ' + error.message);
        } finally {
            // Restore button state
            extractBtn.innerHTML = originalText;
            extractBtn.disabled = false;
        }
    }

    // This function will be injected into the LinkedIn page
    extractJobDetailsScript() {
        try {
            // Get company name
            const companyEl = document.querySelector('.job-details-jobs-unified-top-card__company-name a') ||
                document.querySelector('.jobs-unified-top-card__company-name a') ||
                document.querySelector('[data-test-id="job-details-company-name"]');
            const company_name = companyEl ? companyEl.textContent.trim() : '';

            // Get job title
            const titleEl = document.querySelector('.job-details-jobs-unified-top-card__job-title h1') ||
                document.querySelector('.jobs-unified-top-card__job-title h1') ||
                document.querySelector('[data-test-id="job-details-job-title"]');
            const job_title = titleEl ? titleEl.textContent.trim() : '';

            // Get job description
            const aboutContainer = document.querySelector('#job-details') ||
                document.querySelector('.jobs-description-content__text') ||
                document.querySelector('.jobs-box__html-content');

            let job_description = '';
            if (aboutContainer) {
                job_description = aboutContainer.innerText
                    .replace(/\r/g, ' ')
                    .replace(/\n{2,}/g, '\n')
                    .split('\n')
                    .map(s => s.trim())
                    .filter(Boolean)
                    .join(' ')
                    .substring(0, 2000); // Limit length
            }

            // Get job location
            const locationEl = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container .tvm__text') ||
                document.querySelector('[data-test-id="job-details-location"]');
            const location = locationEl ? locationEl.textContent.trim() : '';

            return {
                company_name,
                job_title,
                job_description,
                location,
                job_url: window.location.href,
                extracted_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error extracting job details:', error);
            return null;
        }
    }

    async sendMessage(message) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, (response) => {
                resolve(response);
            });
        });
    }
}

// Initialize popup
new CVTrackerPopup();