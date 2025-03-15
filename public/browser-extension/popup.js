// DOM Elements
let loginButton;
let loginContainer;
let passwordsContainer;
let passwordsList;
let messageElement;

// State
let currentUser = null;
let currentTab = null;
let availablePasswords = [];

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  loginButton = document.getElementById('login-button');
  loginContainer = document.getElementById('login-container');
  passwordsContainer = document.getElementById('passwords-container');
  passwordsList = document.getElementById('passwords-list');
  messageElement = document.getElementById('message');
  
  // Set up event listeners
  loginButton.addEventListener('click', openPasswordManager);
  
  // Initialize the popup
  initializePopup();
});

// Initialize the popup state
async function initializePopup() {
  try {
    // Get the current tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tabs[0];
    
    // Check if we're logged in
    chrome.storage.local.get(['user'], function(result) {
      if (result.user) {
        currentUser = result.user;
        fetchPasswordsForCurrentSite();
      } else {
        showLoginView();
      }
    });
  } catch (error) {
    showError('Error initializing popup: ' + error.message);
  }
}

// Show the login view
function showLoginView() {
  loginContainer.style.display = 'block';
  passwordsContainer.style.display = 'none';
}

// Show the passwords view
function showPasswordsView() {
  loginContainer.style.display = 'none';
  passwordsContainer.style.display = 'block';
}

// Open the password manager in a new tab
function openPasswordManager() {
  // Get the base URL from storage or use a default
  chrome.storage.local.get(['appBaseUrl'], function(result) {
    let appUrl = result.appBaseUrl || '';
    
    // If we don't have a stored URL, try to construct one from the extension URL
    if (!appUrl) {
      // Use the extension's origin as fallback
      const extensionUrl = chrome.runtime.getURL('');
      // Extract just the origin part (e.g., http://localhost:8080)
      const urlParts = new URL(extensionUrl);
      appUrl = `${urlParts.protocol}//${urlParts.hostname}${urlParts.port ? ':' + urlParts.port : ''}`;
    }
    
    console.log('Opening password manager at:', appUrl);
    chrome.tabs.create({ url: appUrl });
  });
}

// Fetch passwords for the current site
function fetchPasswordsForCurrentSite() {
  if (!currentUser || !currentTab) {
    showLoginView();
    return;
  }
  
  // Get the domain from the current tab URL
  const url = new URL(currentTab.url);
  const domain = url.hostname;
  
  // Check if the domain is empty or not valid
  if (!domain) {
    showMessage('Cannot suggest passwords for this page', true);
    return;
  }
  
  // Retrieve passwords for this user
  chrome.storage.local.get([`passwords_${currentUser.id}`], function(result) {
    const userPasswords = result[`passwords_${currentUser.id}`] || [];
    
    // Filter passwords for the current domain
    availablePasswords = userPasswords.filter(password => {
      if (!password.url) return false;
      
      // Clean URLs for comparison
      const passwordUrl = password.url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];
      
      const currentDomain = domain
        .replace(/^www\./, '');
      
      return passwordUrl.includes(currentDomain) || currentDomain.includes(passwordUrl);
    });
    
    if (availablePasswords.length > 0) {
      showPasswordsList();
    } else {
      showMessage('No saved passwords found for this site');
    }
    
    showPasswordsView();
  });
}

// Show the list of available passwords
function showPasswordsList() {
  // Clear the list
  passwordsList.innerHTML = '';
  
  // Add each password to the list
  availablePasswords.forEach(password => {
    const passwordItem = document.createElement('div');
    passwordItem.className = 'password-item';
    passwordItem.innerHTML = `
      <div class="password-title">${password.title}</div>
      <div class="password-username">${password.username}</div>
    `;
    
    // Add click event to autofill
    passwordItem.addEventListener('click', () => {
      autofillCredentials(password);
    });
    
    passwordsList.appendChild(passwordItem);
  });
}

// Autofill credentials on the current page
function autofillCredentials(password) {
  chrome.tabs.sendMessage(
    currentTab.id,
    {
      action: 'fillCredentials',
      username: password.username,
      password: password.password
    },
    (response) => {
      if (response && response.success) {
        showMessage('Credentials filled successfully!');
        setTimeout(() => window.close(), 1500);
      } else {
        showMessage('Could not find login fields on this page', true);
      }
    }
  );
}

// Show a message in the popup
function showMessage(message, isError = false) {
  messageElement.textContent = message;
  messageElement.style.display = 'block';
  
  if (isError) {
    messageElement.classList.add('error');
  } else {
    messageElement.classList.remove('error');
  }
}

// Show an error message
function showError(message) {
  showMessage(message, true);
}
