
// Handle user login and password selection in the popup

// Global variable to store the current URL
let currentUrl = '';

// Check if user is logged in and get current tab URL
document.addEventListener('DOMContentLoaded', async function() {
  // Get current tab URL
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0) {
    currentUrl = tabs[0].url;
    
    // Extract domain from URL
    const urlObj = new URL(currentUrl);
    const domain = urlObj.hostname;
    
    // Display the current domain
    const messageElement = document.getElementById('message');
    messageElement.textContent = `Looking for passwords for ${domain}`;
    messageElement.style.display = 'block';
    
    // Check if we're logged in to the password manager
    checkLoggedIn();
  }
});

// Check if user is logged in
function checkLoggedIn() {
  chrome.storage.local.get(['userToken', 'userId'], function(result) {
    const isLoggedIn = !!result.userToken;
    document.getElementById('login-container').style.display = isLoggedIn ? 'none' : 'block';
    document.getElementById('passwords-container').style.display = isLoggedIn ? 'block' : 'none';
    
    if (isLoggedIn && result.userId) {
      fetchPasswordsForCurrentUrl(result.userId);
    }
  });
}

// Open the password manager web app
document.getElementById('login-button').addEventListener('click', function() {
  // Open the password manager in a new tab
  chrome.tabs.create({ url: chrome.runtime.getURL('../../index.html') });
});

// Fetch passwords for the current URL
async function fetchPasswordsForCurrentUrl(userId) {
  if (!currentUrl) return;
  
  try {
    // In a real-world scenario, this would communicate with your web app's backend
    // For now, we'll retrieve data from localStorage directly
    const storageKey = `user_passwords_${userId}`;
    const storedData = localStorage.getItem(storageKey);
    
    if (!storedData) {
      displayNoPasswordsMessage();
      return;
    }
    
    const passwords = JSON.parse(storedData);
    const domain = new URL(currentUrl).hostname;
    
    // Filter passwords that match the current domain
    const matchingPasswords = passwords.filter(password => {
      if (!password.url) return false;
      
      try {
        const passwordUrl = new URL(
          password.url.startsWith('http') 
            ? password.url 
            : `https://${password.url}`
        );
        return passwordUrl.hostname === domain;
      } catch (e) {
        return false;
      }
    });
    
    displayPasswords(matchingPasswords, domain);
  } catch (error) {
    console.error('Error fetching passwords:', error);
    displayErrorMessage('Failed to fetch passwords');
  }
}

// Display matching passwords in the popup
function displayPasswords(passwords, domain) {
  const passwordsList = document.getElementById('passwords-list');
  passwordsList.innerHTML = '';
  
  if (passwords.length === 0) {
    displayNoPasswordsMessage(domain);
    return;
  }
  
  const message = document.getElementById('message');
  message.textContent = `Found ${passwords.length} saved password(s) for ${domain}`;
  message.style.display = 'block';
  message.className = 'message';
  
  passwords.forEach(password => {
    const passwordItem = document.createElement('div');
    passwordItem.className = 'password-item';
    
    const titleElement = document.createElement('div');
    titleElement.className = 'password-title';
    titleElement.textContent = password.title;
    
    const usernameElement = document.createElement('div');
    usernameElement.className = 'password-username';
    usernameElement.textContent = password.username;
    
    passwordItem.appendChild(titleElement);
    passwordItem.appendChild(usernameElement);
    
    passwordItem.addEventListener('click', function() {
      autofillPassword(password);
    });
    
    passwordsList.appendChild(passwordItem);
  });
}

// Display message when no passwords are found
function displayNoPasswordsMessage(domain = '') {
  const message = document.getElementById('message');
  message.textContent = domain 
    ? `No saved passwords found for ${domain}` 
    : 'No passwords found';
  message.style.display = 'block';
  message.className = 'message';
  
  const passwordsList = document.getElementById('passwords-list');
  passwordsList.innerHTML = '';
}

// Display error message
function displayErrorMessage(errorText) {
  const message = document.getElementById('message');
  message.textContent = errorText;
  message.style.display = 'block';
  message.className = 'message error';
}

// Send credentials to the content script for autofill
function autofillPassword(password) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length === 0) return;
    
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action: 'fillCredentials',
        username: password.username,
        password: password.password
      },
      function(response) {
        const message = document.getElementById('message');
        
        if (response && response.success) {
          message.textContent = 'Credentials autofilled successfully!';
          message.className = 'message';
        } else {
          message.textContent = 'Could not find login form on this page.';
          message.className = 'message error';
        }
        
        message.style.display = 'block';
        
        // Close popup after a short delay
        setTimeout(() => window.close(), 1500);
      }
    );
  });
}
