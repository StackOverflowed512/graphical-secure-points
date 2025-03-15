
/**
 * Utility for connecting with the browser extension
 */

// Check if browser extension is installed
export const isExtensionInstalled = () => {
  try {
    return typeof chrome !== 'undefined' && chrome.runtime && !!chrome.runtime.id;
  } catch (error) {
    console.error('Error checking extension:', error);
    return false;
  }
};

// Get extension URL for installation
export const getExtensionUrl = () => {
  try {
    // Chrome Web Store URL would go here in production
    return '/browser-extension/index.html'; // Local development path
  } catch (error) {
    console.error('Error getting extension URL:', error);
    return '/browser-extension/index.html';
  }
};

// Get the main application URL for redirecting from the extension
export const getAppUrl = () => {
  // Get the base URL of the current application
  const baseUrl = window.location.origin;
  return baseUrl;
};

// Send authentication information to the extension
export const authenticateExtension = (userId, token) => {
  if (!isExtensionInstalled()) {
    console.log('Browser extension not installed');
    return false;
  }
  
  try {
    chrome.runtime.sendMessage(
      {
        action: 'setCredentials',
        userId,
        token,
        appUrl: getAppUrl() // Send the app URL to the extension
      },
      function(response) {
        console.log('Extension authenticated:', response);
        return response && response.success;
      }
    );
    return true;
  } catch (error) {
    console.error('Error authenticating extension:', error);
    return false;
  }
};

// Sync passwords with the extension
export const syncPasswordsWithExtension = (userId, passwords) => {
  if (!isExtensionInstalled()) {
    console.log('Browser extension not installed');
    return false;
  }
  
  try {
    chrome.runtime.sendMessage(
      {
        action: 'savePasswords',
        userId,
        passwords,
        appUrl: getAppUrl() // Send the app URL to the extension
      },
      function(response) {
        console.log('Passwords synced with extension:', response);
        return response && response.success;
      }
    );
    return true;
  } catch (error) {
    console.error('Error syncing passwords with extension:', error);
    return false;
  }
};

// Request autofill for a specific password
export const requestAutofill = (username, password, url) => {
  console.log('Requesting autofill for:', { username, password, url });
  
  if (!isExtensionInstalled()) {
    console.log('Browser extension not installed');
    return { success: false, message: 'Browser extension not installed' };
  }
  
  try {
    // Send message directly to the extension
    chrome.runtime.sendMessage(
      {
        action: 'fillCredentials',
        username,
        password,
        url
      },
      function(response) {
        console.log('Autofill response:', response);
        return response;
      }
    );
    
    return { success: true, message: 'Autofill request sent to extension' };
  } catch (error) {
    console.error('Error performing autofill:', error);
    return { success: false, message: 'Error communicating with extension' };
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
      autofill: requestAutofill,
      syncPasswords: syncPasswordsWithExtension,
      getAppUrl: getAppUrl
    };
    
    console.log('Extension handler setup complete');
  }
};
