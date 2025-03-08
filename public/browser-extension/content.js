
// This script runs in the context of web pages

// Function to find username and password fields
function findLoginFields() {
  const usernameSelectors = [
    'input[type="email"]',
    'input[name*="email"]',
    'input[id*="email"]',
    'input[type="text"][name*="user"]',
    'input[type="text"][id*="user"]',
    'input[type="text"][autocomplete="username"]',
    'input[name="username"]',
    'input[id="username"]',
    'input[autocomplete="email"]'
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
  let successCount = 0;
  
  if (usernameField && username) {
    usernameField.focus();
    usernameField.value = username;
    usernameField.dispatchEvent(new Event('input', { bubbles: true }));
    usernameField.dispatchEvent(new Event('change', { bubbles: true }));
    successCount++;
  }
  
  if (passwordField && password) {
    passwordField.focus();
    passwordField.value = password;
    passwordField.dispatchEvent(new Event('input', { bubbles: true }));
    passwordField.dispatchEvent(new Event('change', { bubbles: true }));
    successCount++;
  }
  
  return { 
    success: successCount > 0,
    message: `Filled ${successCount} field(s)` 
  };
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.action === 'fillCredentials') {
    const result = fillCredentials(message.username, message.password);
    sendResponse(result);
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

// Check for login forms when the page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    const { usernameField, passwordField } = findLoginFields();
    if (usernameField || passwordField) {
      chrome.runtime.sendMessage({
        action: 'loginFormDetected',
        url: window.location.href
      });
    }
  }, 1000);
});

// Also check for login forms that might be added dynamically
const observer = new MutationObserver(() => {
  const { usernameField, passwordField } = findLoginFields();
  if (usernameField || passwordField) {
    chrome.runtime.sendMessage({
      action: 'loginFormDetected',
      url: window.location.href
    });
  }
});

// Start observing the document body for DOM changes
observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});

console.log('Password Manager Content Script initialized');
