
console.log('Password Manager Extension Background Script loaded');

// Store user credentials
let userCredentials = {
  userId: null,
  token: null
};

// Store passwords
let savedPasswords = [];

// Default app URL - set to correct port
const DEFAULT_APP_URL = 'http://localhost:8080';

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
        console.log('Storing app URL:', request.appUrl);
        chrome.storage.local.set({ appBaseUrl: request.appUrl }, function() {
          console.log('App URL stored:', request.appUrl);
          // Also store in localStorage as fallback
          try {
            localStorage.setItem('appBaseUrl', request.appUrl);
          } catch (e) {
            console.error('Could not store in localStorage:', e);
          }
        });
      } else {
        // Store default app URL if none provided
        chrome.storage.local.set({ appBaseUrl: DEFAULT_APP_URL }, function() {
          console.log('Default App URL stored:', DEFAULT_APP_URL);
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
        
        // Store passwords in Chrome storage for persistence
        chrome.storage.local.set(
          { [`passwords_${request.userId}`]: request.passwords }, 
          function() {
            console.log('Passwords stored in Chrome storage');
          }
        );
        
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

// Handle extension installation or update
chrome.runtime.onInstalled.addListener(function(details) {
  console.log('Extension installed or updated:', details.reason);
  
  // Set default app URL on installation
  chrome.storage.local.set({ appBaseUrl: DEFAULT_APP_URL }, function() {
    console.log('Default App URL set on installation:', DEFAULT_APP_URL);
  });
});

console.log('Password Manager Extension background script ready');
