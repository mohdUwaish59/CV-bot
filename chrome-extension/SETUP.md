# Chrome Extension Setup Instructions

## Quick Fix for Icon Error

The extension is looking for PNG icon files. Here are 3 ways to fix this:

### Option 1: Remove Icons Temporarily (Fastest)
The manifest.json has been updated to work without icons. The extension should load now.

### Option 2: Create Simple Icons
1. Open `create-icons.html` in your browser
2. Click "Generate Icons" 
3. Download all 4 PNG files (icon16.png, icon32.png, icon48.png, icon128.png)
4. Create an `icons` folder in the chrome-extension directory
5. Move the downloaded PNG files to the `icons` folder
6. Update manifest.json to include the icons section:

```json
"icons": {
  "16": "icons/icon16.png",
  "32": "icons/icon32.png", 
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```

### Option 3: Use Any PNG Image
1. Find any PNG image (128x128 pixels works best)
2. Rename it to `icon.png`
3. Place it in the chrome-extension folder
4. Add this to manifest.json:

```json
"icons": {
  "16": "icon.png",
  "32": "icon.png",
  "48": "icon.png", 
  "128": "icon.png"
}
```

## Loading the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The extension should now load successfully!

## Testing

1. Navigate to any LinkedIn job page (e.g., https://www.linkedin.com/jobs/view/1234567890)
2. Look for the "Add to CV Tracker" button on the page
3. Or click the extension icon in the Chrome toolbar

## Next Steps

1. Update the domain URLs in the extension files:
   - Replace `your-cv-tracker-domain.vercel.app` with your actual Vercel domain
   - Update in: `manifest.json`, `background.js`, and `popup.js`

2. Test the authentication flow
3. Test job extraction and saving

The extension should work without icons for development and testing!