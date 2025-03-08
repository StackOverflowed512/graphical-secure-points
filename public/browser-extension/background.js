
// Background script for the extension

// When extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Password Manager extension installed');
  
  // Initialize storage
  chrome.storage.local.get(['userToken', 'userId'], function(result) {
    if (!result.userToken) {
      console.log('User not logged in');
      // We'll set these values when the user logs in through the web app
    }
  });
});

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
    
    sendResponse({ success: true });
    return true;
  }
  
  // Handle authentication from the web app
  if (message.action === 'setCredentials') {
    chrome.storage.local.set({
      userToken: message.token,
      userId: message.userId
    }, function() {
      console.log('User credentials saved in extension');
      sendResponse({ success: true });
    });
    return true;
  }
  
  // Handle autofill request from popup
  if (message.action === 'performAutofill') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length === 0) return;
      
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: 'fillCredentials',
          username: message.username,
          password: message.password
        },
        (response) => {
          sendResponse({ success: response?.success || false });
        }
      );
    });
    return true;
  }
});

// Reset badge when tab changes
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.action.setBadgeText({ text: '', tabId: activeInfo.tabId });
});

// Reset badge when navigating to a new page
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading') {
    chrome.action.setBadgeText({ text: '', tabId: tabId });
  }
});
