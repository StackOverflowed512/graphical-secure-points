
// This script runs in the context of web pages

// Function to find username and password fields
function findLoginFields() {
  const usernameSelectors = [
    'input[type="email"]',
    'input[type="text"][name*="email"]',
    'input[type="text"][name*="user"]',
    'input[type="text"][autocomplete="username"]',
    'input[id*="email"]',
    'input[id*="user"]'
  ];
  
  const passwordSelectors = [
    'input[type="password"]'
  ];
  
  const usernameField = document.querySelector(usernameSelectors.join(','));
  const passwordField = document.querySelector(passwordSelectors.join(','));
  
  return { usernameField, passwordField };
}

// Function to fill credentials
function fillCredentials(username, password) {
  const { usernameField, passwordField } = findLoginFields();
  
  if (usernameField && username) {
    usernameField.value = username;
    usernameField.dispatchEvent(new Event('input', { bubbles: true }));
    usernameField.dispatchEvent(new Event('change', { bubbles: true }));
  }
  
  if (passwordField && password) {
    passwordField.value = password;
    passwordField.dispatchEvent(new Event('input', { bubbles: true }));
    passwordField.dispatchEvent(new Event('change', { bubbles: true }));
  }
  
  return !!usernameField || !!passwordField;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fillCredentials') {
    const success = fillCredentials(message.username, message.password);
    sendResponse({ success });
    return true;
  }
  
  if (message.action === 'checkForLoginForm') {
    const { usernameField, passwordField } = findLoginFields();
    sendResponse({
      hasLoginForm: !!usernameField || !!passwordField
    });
    return true;
  }
});

// Notify extension when login forms are detected
window.addEventListener('load', () => {
  setTimeout(() => {
    const { usernameField, passwordField } = findLoginFields();
    if (usernameField || passwordField) {
      chrome.runtime.sendMessage({
        action: 'loginFormDetected',
        url: window.location.href
      });
    }
  }, 500);
});
