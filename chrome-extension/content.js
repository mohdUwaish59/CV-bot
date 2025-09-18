// Content script for LinkedIn job pages
class CVTrackerExtension {
  constructor() {
    this.isInjected = false;
    this.init();
  }

  init() {
    // Check if we're on a LinkedIn job page
    if (this.isLinkedInJobPage()) {
      this.injectCVTrackerButton();
      this.setupObserver();
    }
  }

  isLinkedInJobPage() {
    return window.location.href.includes('linkedin.com/jobs/');
  }

  setupObserver() {
    // Watch for URL changes (LinkedIn is a SPA)
    let currentUrl = window.location.href;
    
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        if (this.isLinkedInJobPage()) {
          setTimeout(() => this.injectCVTrackerButton(), 1000);
        } else {
          this.removeCVTrackerButton();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  extractJobDetails() {
    // Your tested script with improvements
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

      // Get job URL
      const job_url = window.location.href;

      return {
        company_name,
        job_title,
        job_description,
        location,
        job_url,
        extracted_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error extracting job details:', error);
      return null;
    }
  }

  injectCVTrackerButton() {
    // Remove existing button if present
    this.removeCVTrackerButton();

    // Find the job actions container
    const actionsContainer = document.querySelector('.jobs-apply-button--top-card') ||
                           document.querySelector('.job-details-jobs-unified-top-card__primary-description-container') ||
                           document.querySelector('.jobs-unified-top-card__content--two-pane');

    if (!actionsContainer) {
      console.log('Could not find suitable container for CV Tracker button');
      return;
    }

    // Create the CV Tracker button
    const cvTrackerButton = document.createElement('button');
    cvTrackerButton.id = 'cv-tracker-extension-btn';
    cvTrackerButton.className = 'cv-tracker-btn';
    cvTrackerButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
      Add to CV Tracker
    `;

    cvTrackerButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleCVTrackerClick();
    });

    // Insert the button
    actionsContainer.appendChild(cvTrackerButton);
    this.isInjected = true;
  }

  removeCVTrackerButton() {
    const existingButton = document.getElementById('cv-tracker-extension-btn');
    if (existingButton) {
      existingButton.remove();
      this.isInjected = false;
    }
  }

  async handleCVTrackerClick() {
    const button = document.getElementById('cv-tracker-extension-btn');
    if (!button) return;

    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      Loading...
    `;
    button.disabled = true;

    try {
      // Extract job details
      const jobDetails = this.extractJobDetails();
      
      if (!jobDetails || !jobDetails.job_title || !jobDetails.company_name) {
        throw new Error('Could not extract job details. Please try again or add manually.');
      }

      // Check authentication status
      const authStatus = await this.checkAuthStatus();
      
      if (!authStatus.isAuthenticated) {
        // Open popup for authentication
        this.openAuthPopup();
        return;
      }

      // Open the CV Tracker form with pre-filled data
      this.openCVTrackerForm(jobDetails);

    } catch (error) {
      console.error('Error handling CV Tracker click:', error);
      this.showNotification('Error: ' + error.message, 'error');
    } finally {
      // Restore button state
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }

  async checkAuthStatus() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'checkAuth' },
        (response) => {
          resolve(response || { isAuthenticated: false });
        }
      );
    });
  }

  openAuthPopup() {
    // Create and show authentication popup
    const popup = this.createPopup(`
      <div class="cv-tracker-popup-content">
        <div class="cv-tracker-popup-header">
          <h3>CV Tracker Login Required</h3>
          <button class="cv-tracker-close-btn" onclick="this.closest('.cv-tracker-popup').remove()">×</button>
        </div>
        <div class="cv-tracker-popup-body">
          <p>Please log in to CV Tracker to save this job application.</p>
          <div class="cv-tracker-popup-actions">
            <button class="cv-tracker-btn cv-tracker-btn-primary" id="cv-tracker-login-btn">
              Login with Google
            </button>
            <button class="cv-tracker-btn cv-tracker-btn-secondary" onclick="this.closest('.cv-tracker-popup').remove()">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `);

    // Handle login button click
    popup.querySelector('#cv-tracker-login-btn').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'authenticate' }, (response) => {
        if (response && response.success) {
          popup.remove();
          this.handleCVTrackerClick(); // Retry after authentication
        } else {
          this.showNotification('Authentication failed. Please try again.', 'error');
        }
      });
    });
  }

  openCVTrackerForm(jobDetails) {
    // Create and show the CV Tracker form popup
    const popup = this.createPopup(`
      <div class="cv-tracker-popup-content cv-tracker-form-popup">
        <div class="cv-tracker-popup-header">
          <h3>Add to CV Tracker</h3>
          <button class="cv-tracker-close-btn" onclick="this.closest('.cv-tracker-popup').remove()">×</button>
        </div>
        <div class="cv-tracker-popup-body">
          <form id="cv-tracker-form" class="cv-tracker-form">
            <div class="cv-tracker-form-group">
              <label for="jobTitle">Job Title *</label>
              <input type="text" id="jobTitle" name="jobTitle" value="${this.escapeHtml(jobDetails.job_title)}" required>
            </div>
            
            <div class="cv-tracker-form-group">
              <label for="companyName">Company Name *</label>
              <input type="text" id="companyName" name="companyName" value="${this.escapeHtml(jobDetails.company_name)}" required>
            </div>
            
            <div class="cv-tracker-form-group">
              <label for="jobDescription">Job Description</label>
              <textarea id="jobDescription" name="jobDescription" rows="6">${this.escapeHtml(jobDetails.job_description)}</textarea>
            </div>
            
            <div class="cv-tracker-form-row">
              <div class="cv-tracker-form-group">
                <label for="applicationDate">Application Date *</label>
                <input type="date" id="applicationDate" name="applicationDate" value="${new Date().toISOString().split('T')[0]}" required>
              </div>
              
              <div class="cv-tracker-form-group">
                <label for="status">Status</label>
                <select id="status" name="status">
                  <option value="applied">Applied</option>
                  <option value="under_review">Under Review</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offer_received">Offer Received</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>
            
            <div class="cv-tracker-form-group">
              <label for="cvFile">CV / Resume</label>
              <input type="file" id="cvFile" name="cvFile" accept=".pdf,.doc,.docx">
              <small>PDF, DOC, or DOCX files only (max 10MB)</small>
            </div>
            
            <div class="cv-tracker-form-group">
              <label for="coverLetterFile">Cover Letter</label>
              <input type="file" id="coverLetterFile" name="coverLetterFile" accept=".pdf,.doc,.docx">
              <small>PDF, DOC, or DOCX files only (max 10MB)</small>
            </div>
            
            <div class="cv-tracker-form-group">
              <label for="notes">Additional Notes</label>
              <textarea id="notes" name="notes" rows="3" placeholder="e.g., Applied through LinkedIn, contacted by recruiter, etc."></textarea>
            </div>
            
            <div class="cv-tracker-form-actions">
              <button type="submit" class="cv-tracker-btn cv-tracker-btn-primary">
                Save Application
              </button>
              <button type="button" class="cv-tracker-btn cv-tracker-btn-secondary" onclick="this.closest('.cv-tracker-popup').remove()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `);

    // Handle form submission
    popup.querySelector('#cv-tracker-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission(popup, jobDetails);
    });
  }

  async handleFormSubmission(popup, originalJobDetails) {
    const form = popup.querySelector('#cv-tracker-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Saving...';
    submitBtn.disabled = true;

    try {
      // Prepare application data
      const applicationData = {
        jobTitle: formData.get('jobTitle'),
        companyName: formData.get('companyName'),
        jobDescription: formData.get('jobDescription'),
        applicationDate: formData.get('applicationDate'),
        status: formData.get('status'),
        notes: formData.get('notes'),
        jobUrl: originalJobDetails.job_url,
        extractedAt: originalJobDetails.extracted_at
      };

      // Handle file uploads
      const cvFile = formData.get('cvFile');
      const coverLetterFile = formData.get('coverLetterFile');

      if (cvFile && cvFile.size > 0) {
        applicationData.cvFile = cvFile;
      }
      if (coverLetterFile && coverLetterFile.size > 0) {
        applicationData.coverLetterFile = coverLetterFile;
      }

      // Send to background script to save
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { 
            action: 'saveApplication', 
            data: applicationData 
          },
          resolve
        );
      });

      if (response && response.success) {
        this.showNotification('Job application saved successfully!', 'success');
        popup.remove();
      } else {
        throw new Error(response?.error || 'Failed to save application');
      }

    } catch (error) {
      console.error('Error saving application:', error);
      this.showNotification('Error: ' + error.message, 'error');
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  }

  createPopup(content) {
    // Remove existing popup
    const existingPopup = document.querySelector('.cv-tracker-popup');
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create popup overlay
    const popup = document.createElement('div');
    popup.className = 'cv-tracker-popup';
    popup.innerHTML = content;

    // Add to page
    document.body.appendChild(popup);

    // Close on overlay click
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.remove();
      }
    });

    return popup;
  }

  showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.cv-tracker-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `cv-tracker-notification cv-tracker-notification-${type}`;
    notification.innerHTML = `
      <div class="cv-tracker-notification-content">
        <span>${this.escapeHtml(message)}</span>
        <button class="cv-tracker-notification-close" onclick="this.closest('.cv-tracker-notification').remove()">×</button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the extension when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CVTrackerExtension();
  });
} else {
  new CVTrackerExtension();
}