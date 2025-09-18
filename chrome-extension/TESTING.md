# CV Tracker Extension - Testing Guide

## ✅ What's Been Fixed

### 1. **Real Firebase Authentication**
- ✅ Extension now uses actual Firebase login from your web app
- ✅ Real Firebase ID tokens are passed from web app to extension
- ✅ Tokens are stored securely in Chrome storage
- ✅ API endpoints verify authentication properly

### 2. **Automatic Job Extraction**
- ✅ Extension automatically extracts job details when LinkedIn job page loads
- ✅ Uses your exact tested script for job extraction
- ✅ Shows notification when job details are detected
- ✅ Pre-fills form with extracted data

### 3. **Improved Error Handling**
- ✅ Better error messages for debugging
- ✅ Console logging for troubleshooting
- ✅ Fallback selectors for different LinkedIn layouts

## 🧪 Testing Steps

### Step 1: Load Extension
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. ✅ Extension should load without errors

### Step 2: Test Authentication
1. Click the extension icon in Chrome toolbar
2. Should show "Not logged in" status
3. Click "Login to CV Tracker"
4. Should open your web app login page
5. Login with Google
6. Should redirect to success page and close automatically
7. Extension popup should now show "Logged in as [your-email]"

### Step 3: Test Job Extraction
1. Navigate to any LinkedIn job page:
   - Example: `https://www.linkedin.com/jobs/view/1234567890`
2. Wait 2-3 seconds for page to load
3. ✅ Should see notification: "Job details detected: [Job Title] at [Company]"
4. ✅ Should see "Add to CV Tracker" button on the page
5. Click the button
6. ✅ Form should open with pre-filled job details

### Step 4: Test Saving
1. In the form popup:
   - Review auto-filled job title and company
   - Review auto-filled job description
   - Upload CV file (optional)
   - Upload cover letter (optional)
   - Add notes (optional)
2. Click "Save Application"
3. ✅ Should show success notification
4. ✅ Application should appear in your CV Tracker dashboard

## 🐛 Troubleshooting

### If job extraction fails:
1. Open browser console (F12)
2. Look for console logs starting with "Extracting job details..."
3. Check if selectors are finding elements
4. Try refreshing the LinkedIn page

### If authentication fails:
1. Check if popup shows correct login status
2. Try clearing extension storage: `chrome://extensions/` → CV Tracker → "Clear storage"
3. Try logging out and back in to your web app

### If saving fails:
1. Check browser console for API errors
2. Verify your web app is running at the correct domain
3. Check if API endpoints are accessible

## 🔧 Console Commands for Debugging

Open browser console on LinkedIn job page and run:

```javascript
// Test job extraction manually
(() => {
  const companyEl = document.querySelector('.job-details-jobs-unified-top-card__company-name a');
  const company_name = companyEl ? companyEl.textContent.trim() : '';
  
  const titleEl = document.querySelector('.job-details-jobs-unified-top-card__job-title h1');
  const job_title = titleEl ? titleEl.textContent.trim() : '';
  
  const aboutContainer = document.querySelector('#job-details');
  let about_the_job = '';
  if (aboutContainer) {
    about_the_job = aboutContainer.innerText.replace(/\r/g, ' ').replace(/\n{2,}/g, '\n').split('\n').map(s => s.trim()).filter(Boolean).join(' ');
  }
  
  console.log({ company_name, job_title, about_the_job: about_the_job.substring(0, 200) + '...' });
})();
```

## 📋 Expected Behavior

1. **Page Load**: Extension detects LinkedIn job page → Auto-extracts details → Shows notification
2. **Button Click**: User clicks "Add to CV Tracker" → Form opens with pre-filled data
3. **Authentication**: If not logged in → Opens login popup → Authenticates with Firebase → Returns to form
4. **Save**: User fills additional details → Clicks save → Data sent to API → Success notification

## 🎯 Success Criteria

- ✅ Extension loads without errors
- ✅ Authentication works with real Firebase login
- ✅ Job details are automatically extracted from LinkedIn
- ✅ Form pre-fills with correct data
- ✅ Applications save to your CV Tracker account
- ✅ No console errors during normal operation

The extension should now work exactly as intended with real Firebase authentication and automatic job extraction!