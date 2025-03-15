console.log('Password Manager Extension Background Script loaded');

// Store user credentials
let userCredentials = {
  userId: null,
  token: null
};

// Store passwords
let savedPasswords = [];

// Handle messages from the web app or content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Background script received message:', request.action);
  
  switch (request.action) {
    case 'setCredentials':
      // Store user credentials
      userCredentials.userId = request.userId;
      userCredentials.token = request.token;
      
      // Store app URL if provided
      if (request.appUrl) {
        chrome.storage.local.set({ appBaseUrl: request.appUrl }, function() {
          console.log('App URL stored:', request.appUrl);
        });
      }
      
      console.log('User credentials set:', userCredentials.userId);
      sendResponse({ success: true });
      break;
      
    case 'savePasswords':
      // Store passwords
      if (request.userId === userCredentials.userId) {
        savedPasswords = request.passwords;
        console.log('Passwords saved:', savedPasswords.length);
        sendResponse({ success: true });
      } else {
        console.error('User ID mismatch, passwords not saved');
        sendResponse({ success: false, message: 'User ID mismatch' });
      }
      break;
    
    case 'fillCredentials':
      // Forward autofill request to content script
      console.log('Received fillCredentials request for:', request.url);
      
      // If we have active tabs permission, send to active tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs || !tabs[0]) {
          console.error('No active tab found');
          sendResponse({ success: false, message: 'No active tab found' });
          return;
        }
        
        const activeTab = tabs[0];
        console.log('Sending autofill request to tab:', activeTab.id);
        
        // Send message to content script
        chrome.tabs.sendMessage(
          activeTab.id,
          {
            action: 'fillCredentials',
            username: request.username,
            password: request.password
          },
          function(response) {
            console.log('Content script response:', response);
            sendResponse(response || { success: false, message: 'No response from content script' });
          }
        );
      });
      
      // Must return true to indicate async response
      return true;
      
    default:
      console.log('Unknown action:', request.action);
      sendResponse({ success: false, message: 'Unknown action' });
  }
  
  // Return true if we will send a response asynchronously
  return true;
});

console.log('Password Manager Extension background script ready');
