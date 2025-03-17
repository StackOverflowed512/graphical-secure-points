
console.log('Password Manager Content Script loaded');

// Function to find username and password fields
function findFormFields() {
  const fields = {
    username: null,
    password: null
  };
  
  // Find password field first
  const passwordFields = Array.from(document.querySelectorAll('input[type="password"]'));
  
  if (passwordFields.length === 0) {
    console.log('No password fields found on page');
    return fields;
  }
  
  fields.password = passwordFields[0];
  
  // Find username field (usually comes before password field)
  const allInputs = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], input:not([type])'));
  
  // Try to find a field that might be a username/email field
  // Usually it's an input that comes before the password field and has a type of text or email
  for (const input of allInputs) {
    // Skip hidden fields
    if (input.type === 'hidden') continue;
    
    // Skip fields that come after the password field in the DOM
    if (input.compareDocumentPosition(fields.password) & Node.DOCUMENT_POSITION_PRECEDING) continue;
    
    // Found a potential username field
    fields.username = input;
    break;
  }
  
  // If we didn't find a username field before the password, check for any other visible text/email input
  if (!fields.username) {
    fields.username = allInputs.find(input => {
      return input.type !== 'hidden' && 
             (input.type === 'text' || input.type === 'email' || input.type === '');
    });
  }
  
  return fields;
}

// Function to autofill credentials
function autofillCredentials(username, password) {
  console.log('Attempting to autofill credentials');
  
  const fields = findFormFields();
  
  if (!fields.username && !fields.password) {
    console.log('No form fields found to autofill');
    return { success: false, message: 'No form fields found' };
  }
  
  // Fill in the fields if found
  let filled = false;
  
  if (fields.username && username) {
    fields.username.value = username;
    fields.username.dispatchEvent(new Event('input', { bubbles: true }));
    fields.username.dispatchEvent(new Event('change', { bubbles: true }));
    filled = true;
    console.log('Username field filled');
  }
  
  if (fields.password && password) {
    fields.password.value = password;
    fields.password.dispatchEvent(new Event('input', { bubbles: true }));
    fields.password.dispatchEvent(new Event('change', { bubbles: true }));
    filled = true;
    console.log('Password field filled');
  }
  
  return {
    success: filled,
    message: filled ? 'Credentials filled successfully' : 'No fields could be filled'
  };
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Content script received message:', request.action);
  
  if (request.action === 'fillCredentials') {
    const result = autofillCredentials(request.username, request.password);
    sendResponse(result);
    return true;
  }
  
  // Default response for unknown actions
  sendResponse({ success: false, message: 'Unknown action' });
  return true;
});

// Create a messaging channel to the page
window.addEventListener('message', function(event) {
  // We only accept messages from ourselves
  if (event.source !== window) return;
  
  if (event.data.type && event.data.type === 'FROM_PAGE') {
    console.log('Content script received message from page:', event.data);
    // Handle messages from the page if needed
  }
});

// Inform that content script is ready
console.log('Password Manager content script ready');
