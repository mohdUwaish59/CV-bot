// Simplified Content Script for LinkedIn job pages
console.log('CV Tracker extension loaded on:', window.location.href);

// Simple approach: Just extract and redirect to web app
class CVTrackerExtension {
  constructor() {
    this.init();
  }

  init() {
    if (this.isLinkedInJobPage()) {
      console.log('LinkedIn job page detected');
      // Wait for page content to load
      setTimeout(() => {
        this.injectButton();
      }, 3000); // Give LinkedIn time to load
    }
  }

  isLinkedInJobPage() {
    return window.location.href.includes('linkedin.com/jobs/view/');
  }

  injectButton() {
    // Remove existing button
    const existing = document.getElementById('cv-tracker-btn');
    if (existing) existing.remove();

    // Find a good place to inject the button
    const targetContainer = document.querySelector('.jobs-apply-button--top-card') ||
      document.querySelector('.job-details-jobs-unified-top-card__primary-description-container') ||
      document.querySelector('.jobs-unified-top-card__content--two-pane');

    if (!targetContainer) {
      console.log('Could not find container for button');
      return;
    }

    // Create simple button
    const button = document.createElement('button');
    button.id = 'cv-tracker-btn';
    button.innerHTML = '📋 Add to CV Tracker';
    button.style.cssText = `
      background: #059669;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      margin: 8px 0;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    `;

    button.onclick = () => this.handleButtonClick();
    targetContainer.appendChild(button);
    console.log('Button injected successfully');
  }

  extractJobDetails() {
    console.log('Extracting job details...');

    // Your exact working script
    const companyEl = document.querySelector('.job-details-jobs-unified-top-card__company-name a');
    const company_name = companyEl ? companyEl.textContent.trim() : '';

    const titleEl = document.querySelector('.job-details-jobs-unified-top-card__job-title h1');
    const job_title = titleEl ? titleEl.textContent.trim() : '';

    const aboutContainer = document.querySelector('#job-details');
    let about_the_job = '';
    if (aboutContainer) {
      about_the_job = aboutContainer.innerText
        .replace(/\r/g, ' ')
        .replace(/\n{2,}/g, '\n')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .join(' ');
    }

    console.log('Extracted:', { company_name, job_title, description_length: about_the_job.length });

    return { company_name, job_title, about_the_job };
  }

  handleButtonClick() {
    console.log('CV Tracker button clicked');

    // Extract job details
    const jobDetails = this.extractJobDetails();

    if (!jobDetails.company_name || !jobDetails.job_title) {
      alert('Could not extract job details. Please try refreshing the page.');
      return;
    }

    // Simple approach: Open web app with job details as URL parameters
    const params = new URLSearchParams({
      source: 'extension',
      company: jobDetails.company_name,
      title: jobDetails.job_title,
      description: jobDetails.about_the_job.substring(0, 1000), // Limit URL length
      url: window.location.href
    });

    const webAppUrl = `https://cv-bot-4-you.vercel.app/applications/new?${params.toString()}`;
    window.open(webAppUrl, '_blank');
  }

}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CVTrackerExtension();
  });
} else {
  new CVTrackerExtension();
}

// Initialize the extension when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CVTrackerExtension();
  });
} else {
  new CVTrackerExtension();
}