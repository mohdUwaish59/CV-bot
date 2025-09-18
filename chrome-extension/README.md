# CV Tracker Chrome Extension

A Chrome extension that automatically captures job details from LinkedIn and saves them to your CV Tracker application.

## 🚀 Features

- **Auto-Detection**: Automatically detects LinkedIn job pages
- **One-Click Extraction**: Extract job details with a single click
- **Pre-filled Forms**: Auto-populate job application forms
- **Secure Authentication**: Integrated login with your CV Tracker account
- **File Upload**: Upload CV and cover letter directly from the extension
- **Responsive Design**: Works seamlessly on all screen sizes

## 📦 Installation

### Development Installation

1. **Download the Extension**:
   ```bash
   # If you have the source code
   cd chrome-extension
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

3. **Configure Domain**:
   - Edit `manifest.json` and replace `your-cv-tracker-domain.vercel.app` with your actual domain
   - Edit `background.js` and `popup.js` to update the `baseUrl`

### Production Installation

1. **Package the Extension**:
   - Update all domain references to your production URL
   - Test thoroughly in development mode
   - Create a ZIP file of the extension folder

2. **Publish to Chrome Web Store**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Upload your ZIP file
   - Fill in store listing details
   - Submit for review

## 🔧 Configuration

### Update Domain References

Before using the extension, update these files with your actual CV Tracker domain:

1. **manifest.json**:
   ```json
   "host_permissions": [
     "https://your-actual-domain.vercel.app/*"
   ]
   ```

2. **background.js**:
   ```javascript
   this.baseUrl = 'https://your-actual-domain.vercel.app';
   ```

3. **popup.js**:
   ```javascript
   this.baseUrl = 'https://your-actual-domain.vercel.app';
   ```

### Web App Integration

Your CV Tracker web app needs to support the extension. Add these API endpoints:

1. **Authentication Verification** (`/api/auth/verify`):
   ```javascript
   // GET endpoint to verify if user token is valid
   // Returns user data if authenticated
   ```

2. **Extension Login** (`/auth/extension-login`):
   ```javascript
   // Special login page for extension authentication
   // Should redirect to /extension-auth-success after login
   ```

3. **Save Application** (`/api/applications`):
   ```javascript
   // POST endpoint to save job applications
   // Should accept FormData with files
   ```

## 🎯 Usage

### For Users

1. **Install the Extension**: Load it in Chrome as described above

2. **Navigate to LinkedIn**: Go to any LinkedIn job posting
   - Example: `https://www.linkedin.com/jobs/view/1234567890`

3. **Login**: Click the extension icon and login to CV Tracker

4. **Extract Job Details**: 
   - The extension automatically detects job pages
   - Click "Add to CV Tracker" button that appears on the page
   - Or use the extension popup

5. **Fill Additional Details**:
   - Review auto-extracted job information
   - Upload your CV and cover letter
   - Add any additional notes
   - Save the application

### Supported LinkedIn URLs

The extension works on these LinkedIn job page patterns:
- `https://www.linkedin.com/jobs/view/*`
- `https://www.linkedin.com/jobs/collections/*`
- `https://www.linkedin.com/jobs/search/*` (when viewing individual jobs)

## 🔒 Security & Privacy

### Data Handling
- **No Data Storage**: Extension doesn't store personal data locally
- **Secure Transmission**: All data sent over HTTPS
- **Authentication**: Uses your existing CV Tracker login
- **Permissions**: Only requests necessary permissions

### Required Permissions
- `activeTab`: To read job details from LinkedIn pages
- `storage`: To temporarily store authentication tokens
- `identity`: For secure authentication flow

### Privacy Policy
- Extension only accesses LinkedIn job pages when explicitly activated
- No tracking or analytics
- Data is sent directly to your CV Tracker account
- No third-party data sharing

## 🛠️ Development

### File Structure
```
chrome-extension/
├── manifest.json          # Extension configuration
├── content.js            # LinkedIn page interaction
├── background.js         # Background service worker
├── popup.html           # Extension popup interface
├── popup.js             # Popup functionality
├── styles.css           # Extension styling
├── icons/               # Extension icons
└── README.md           # This file
```

### Key Components

1. **Content Script** (`content.js`):
   - Detects LinkedIn job pages
   - Extracts job details using DOM selectors
   - Injects CV Tracker button
   - Handles form popup

2. **Background Script** (`background.js`):
   - Manages authentication
   - Handles API communication
   - Coordinates between popup and content script

3. **Popup** (`popup.html` + `popup.js`):
   - Extension icon popup interface
   - Shows authentication status
   - Provides manual job extraction

### Testing

1. **Load Extension**: Install in developer mode
2. **Test on LinkedIn**: Navigate to job pages
3. **Check Console**: Monitor for errors in extension console
4. **Test Authentication**: Verify login flow works
5. **Test Extraction**: Ensure job details are captured correctly

### Debugging

- **Extension Console**: Right-click extension icon → "Inspect popup"
- **Content Script**: Use browser dev tools on LinkedIn pages
- **Background Script**: Go to `chrome://extensions/` → "Inspect views: background page"

## 🚀 Deployment

### Pre-deployment Checklist

- [ ] Update all domain references to production URLs
- [ ] Test authentication flow
- [ ] Test job extraction on various LinkedIn job pages
- [ ] Test file upload functionality
- [ ] Verify error handling
- [ ] Test on different screen sizes
- [ ] Check permissions are minimal and necessary

### Chrome Web Store Submission

1. **Prepare Assets**:
   - Extension icons (16x16, 32x32, 48x48, 128x128)
   - Screenshots for store listing
   - Promotional images

2. **Store Listing**:
   - Clear description of functionality
   - Privacy policy link
   - Support contact information

3. **Review Process**:
   - Initial review takes 1-3 days
   - Address any feedback from Google
   - Publish when approved

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This extension is part of the CV Tracker project and follows the same MIT license.

## 🆘 Support

- **Issues**: Report bugs in the main CV Tracker repository
- **Documentation**: See main project README
- **Contact**: support@cvtracker.com

---

**Built with ❤️ for job seekers everywhere**