
# Password Manager Browser Extension

This browser extension allows you to autofill login credentials from your Password Manager application.

## How to Install the Extension in Developer Mode

### Google Chrome / Microsoft Edge

1. Open Chrome/Edge and navigate to `chrome://extensions` or `edge://extensions`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click "Load unpacked" button
4. Select the `browser-extension` folder inside the `public` directory of this project
5. The extension should now be installed and visible in your browser toolbar

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Navigate to the `browser-extension` folder and select the `manifest.json` file
4. The extension should now be installed and visible in your browser toolbar

## How to Use

1. Log in to the Password Manager web application
2. When you visit a website that matches one of your saved passwords, click the extension icon
3. Select the credential you want to autofill
4. The extension will automatically fill in your username and password

## Features

- Automatically detects login forms on websites
- Securely retrieves credentials from your Password Manager
- One-click autofill functionality
- Visual indicators when login forms are detected

## Troubleshooting

- If the extension doesn't detect a login form, try refreshing the page
- Make sure you're logged in to the Password Manager web application
- The extension only works with standard login forms; some websites with custom forms may not be compatible
