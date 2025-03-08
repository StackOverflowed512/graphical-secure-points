
// Background script for the Password Manager Extension

// Listen for runtime messages from the web app
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log('External message received:', request);
    
    if (request.action === 'setCredentials') {
      // Store the user info in local storage
      chrome.storage.local.set({
        user: {
          id: request.userId,
          token: request.token
        }
      }, function() {
        console.log('User credentials saved in extension');
        sendResponse({ success: true, message: 'Credentials saved' });
      });
      return true;
    }
    
    if (request.action === 'savePasswords') {
      // Store passwords for this user
      const storageKey = `passwords_${request.userId}`;
      chrome.storage.local.set({
        [storageKey]: request.passwords
      }, function() {
        console.log('Passwords saved in extension');
        sendResponse({ success: true, message: 'Passwords saved' });
      });
      return true;
    }
    
    // Default response for unsupported actions
    sendResponse({ success: false, message: 'Action not supported' });
    return true;
  }
);

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Message from content script:', request);
    
    if (request.action === 'loginFormDetected') {
      // Check if we have passwords for this URL
      const url = request.url;
      
      // Get the current user
      chrome.storage.local.get(['user'], function(result) {
        if (!result.user) {
          return;
        }
        
        // Get passwords for this user
        const userId = result.user.id;
        const storageKey = `passwords_${userId}`;
        
        chrome.storage.local.get([storageKey], function(data) {
          const userPasswords = data[storageKey] || [];
          
          // Check if we have passwords for this domain
          const hasPasswordsForDomain = userPasswords.some(password => {
            if (!password.url) return false;
            
            const passwordDomain = password.url
              .replace(/^https?:\/\//, '')
              .replace(/^www\./, '')
              .split('/')[0];
            
            const currentDomain = new URL(url).hostname
              .replace(/^www\./, '');
            
            return passwordDomain.includes(currentDomain) || currentDomain.includes(passwordDomain);
          });
          
          // If we have passwords, show the notification
          if (hasPasswordsForDomain) {
            chrome.action.setBadgeText({
              text: "✓",
              tabId: sender.tab.id
            });
          }
        });
      });
      
      sendResponse({ received: true });
      return true;
    }
    
    return true;
  }
);

// Listen for installation events
chrome.runtime.onInstalled.addListener(function(details) {
  console.log('Extension installed:', details);
});

console.log('Password Manager Background Script initialized');
