
// This file would contain logic for browser extension integration

/**
 * This service provides functions that interact with a browser extension
 * for autofilling passwords on websites
 */

// Check if the extension is installed
export const isExtensionInstalled = () => {
  return !!window.passwordManagerExtension;
};

// Request autofill for a specific site
export const requestAutofill = async (data) => {
  if (!isExtensionInstalled()) {
    console.log('Password manager extension not installed');
    return false;
  }
  
  try {
    await window.passwordManagerExtension.autofill(data);
    return true;
  } catch (error) {
    console.error('Error autofilling password:', error);
    return false;
  }
};

// Register the extension (would be called by the extension)
export const registerExtension = (extensionApi) => {
  window.passwordManagerExtension = extensionApi;
  // Fire an event that the extension is ready
  window.dispatchEvent(new CustomEvent('passwordManagerExtensionReady'));
};

// Listen for extension installation
export const onExtensionReady = (callback) => {
  if (isExtensionInstalled()) {
    callback();
    return;
  }
  
  window.addEventListener('passwordManagerExtensionReady', callback);
};

// Mock methods for demo purposes
export const mockExtensionForDemo = () => {
  // This would only be used for demonstration in the web app
  window.passwordManagerExtension = {
    autofill: async (data) => {
      console.log('MOCK: Autofilling data for', data.url);
      console.log('MOCK: Username:', data.username);
      console.log('MOCK: Password: [REDACTED]');
      
      return true;
    },
    checkCurrentSite: async () => {
      return {
        url: 'https://example.com',
        hasLoginForm: true
      };
    }
  };
  
  // Let components know extension is "ready"
  window.dispatchEvent(new CustomEvent('passwordManagerExtensionReady'));
};
