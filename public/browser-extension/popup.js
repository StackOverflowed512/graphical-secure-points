
// Handle user login and password selection in the popup

// Check if user is logged in
function checkLoggedIn() {
  chrome.storage.local.get(['userToken'], function(result) {
    const isLoggedIn = !!result.userToken;
    document.getElementById('login-container').style.display = isLoggedIn ? 'none' : 'block';
    document.getElementById('passwords-container').style.display = isLoggedIn ? 'block' : 'none';
    
    if (isLoggedIn) {
      loadPasswords();
    }
  });
}

// Open the password manager web app
document.getElementById('login-button').addEventListener('click', function() {
  chrome.tabs.create({ url: 'https://your-password-manager-url.com' });
});

// Load matching passwords for the current site
function loadPasswords() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length === 0) return;
    
    const currentUrl = new URL(tabs[0].url);
    const domain = currentUrl.hostname;
    
    // In a real implementation, you would fetch this from your web app
    // For this demo, we'll use mock data
    chrome.storage.local.get(['savedPasswords'], function(result) {
      const passwords = result.savedPasswords || [];
      
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
    });
  });
}

// Display matching passwords in the popup
function displayPasswords(passwords, domain) {
  const passwordsList = document.getElementById('passwords-list');
  passwordsList.innerHTML = '';
  
  if (passwords.length === 0) {
    const message = document.getElementById('message');
    message.textContent = `No saved passwords found for ${domain}`;
    message.style.display = 'block';
    return;
  }
  
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

// Send credentials to the content script for autofill
function autofillPassword(password) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length === 0) return;
    
    chrome.runtime.sendMessage(
      {
        action: 'performAutofill',
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

// Initialize the popup
document.addEventListener('DOMContentLoaded', function() {
  checkLoggedIn();
  
  // For demo purposes, create some mock data
  const mockPasswords = [
    {
      id: '1',
      title: 'Example.com',
      username: 'user@example.com',
      password: 'password123',
      url: 'https://example.com'
    },
    {
      id: '2',
      title: 'Gmail',
      username: 'user@gmail.com',
      password: 'gmailpass123',
      url: 'https://mail.google.com'
    }
  ];
  
  // Store mock data for demo
  chrome.storage.local.set({
    savedPasswords: mockPasswords,
    userToken: 'demo-token' // Simulate logged in state
  });
});
