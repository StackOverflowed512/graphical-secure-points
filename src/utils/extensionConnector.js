
/**
 * Utility for connecting with the browser extension
 */

// Check if browser extension is installed
export const isExtensionInstalled = () => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
};

// Send authentication information to the extension
export const authenticateExtension = (userId, token) => {
  if (!isExtensionInstalled()) {
    console.log('Browser extension not installed');
    return false;
  }
  
  try {
    chrome.runtime.sendMessage({
      action: 'setCredentials',
      userId,
      token
    }, function(response) {
      console.log('Extension authenticated:', response);
      return response && response.success;
    });
  } catch (error) {
    console.error('Error authenticating extension:', error);
    return false;
  }
};

// Request autofill for a specific password
export const requestAutofill = (username, password) => {
  if (!isExtensionInstalled()) {
    console.log('Browser extension not installed');
    return false;
  }
  
  try {
    chrome.runtime.sendMessage({
      action: 'performAutofill',
      username,
      password
    }, function(response) {
      console.log('Autofill performed:', response);
      return response && response.success;
    });
  } catch (error) {
    console.error('Error performing autofill:', error);
    return false;
  }
};

// Initialize the extension connection
export const initializeExtension = (userId, token) => {
  if (isExtensionInstalled()) {
    console.log('Extension detected, initializing connection...');
    return authenticateExtension(userId, token);
  }
  
  return false;
};

// Create a handler for the window object to expose extension functions
export const setupExtensionHandler = () => {
  if (typeof window !== 'undefined') {
    window.passwordManagerExtension = {
      isInstalled: isExtensionInstalled,
      authenticate: authenticateExtension,
      autofill: requestAutofill
    };
  }
};
