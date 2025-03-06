
// Background script for the extension

// Listen for the content script to detect login forms
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'loginFormDetected') {
    // Update the extension icon to show that a login form is available
    chrome.action.setBadgeText({
      text: '!',
      tabId: sender.tab.id
    });
    
    chrome.action.setBadgeBackgroundColor({
      color: '#4CAF50',
      tabId: sender.tab.id
    });
    
    // Store the URL with the login form
    chrome.storage.local.set({
      currentLoginUrl: message.url
    });
  }
});

// Function to autofill credentials on the current page
function autofillCredentials(tabId, username, password) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      {
        action: 'fillCredentials',
        username,
        password
      },
      (response) => {
        resolve(response?.success || false);
      }
    );
  });
}

// Create context menu for password fields
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'autofillPassword',
    title: 'Autofill from Password Manager',
    contexts: ['page']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'autofillPassword') {
    // Open the popup to select credentials
    chrome.action.openPopup();
  }
});

// Make the autofill function available to the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'performAutofill') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length === 0) return;
      
      const success = await autofillCredentials(
        tabs[0].id,
        message.username,
        message.password
      );
      
      sendResponse({ success });
    });
    return true;
  }
});
