
// Local storage key for passwords
const PASSWORDS_STORAGE_KEY = "user_passwords_";

// Helper to get all passwords for a user
export const getUserPasswords = async (userId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Get passwords from local storage
  const storageKey = `${PASSWORDS_STORAGE_KEY}${userId}`;
  const storedData = localStorage.getItem(storageKey);
  
  if (!storedData) {
    return [];
  }
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing passwords:", error);
    return [];
  }
};

// Helper to save passwords to local storage
const saveUserPasswords = async (userId, passwords) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Save passwords to local storage
  const storageKey = `${PASSWORDS_STORAGE_KEY}${userId}`;
  localStorage.setItem(storageKey, JSON.stringify(passwords));
};

// Add a new password
export const addPassword = async (userId, data) => {
  // Get existing passwords
  const passwords = await getUserPasswords(userId);
  
  // Create new password
  const newPassword = {
    id: Date.now().toString(),
    userId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Add to collection
  passwords.push(newPassword);
  
  // Save to storage
  await saveUserPasswords(userId, passwords);
  
  return newPassword;
};

// Update an existing password
export const updatePassword = async (userId, data) => {
  // Get existing passwords
  const passwords = await getUserPasswords(userId);
  
  // Find the password to update
  const index = passwords.findIndex((p) => p.id === data.id);
  
  if (index === -1) {
    throw new Error("Password not found");
  }
  
  // Update password
  const updatedPassword = {
    ...passwords[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  // Replace in collection
  passwords[index] = updatedPassword;
  
  // Save to storage
  await saveUserPasswords(userId, passwords);
  
  return updatedPassword;
};

// Delete a password
export const deletePassword = async (userId, id) => {
  // Get existing passwords
  const passwords = await getUserPasswords(userId);
  
  // Filter out the password to delete
  const updatedPasswords = passwords.filter((p) => p.id !== id);
  
  // Save to storage
  await saveUserPasswords(userId, updatedPasswords);
};

// Create a service for browser extension integration
export const autofillService = {
  /**
   * Get a password for a specific URL
   * @param {string} userId - The user ID
   * @param {string} url - The URL to match against
   * @returns {Promise<Password|null>} - The matching password or null
   */
  getPasswordForUrl: async (userId, url) => {
    if (!url) return null;
    
    const passwords = await getUserPasswords(userId);
    
    // Clean URL for matching (remove protocol and www)
    const cleanUrl = url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]; // Only use domain
    
    // Find a password with a matching URL
    return passwords.find(password => {
      if (!password.url) return false;
      
      const passwordUrl = password.url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];
      
      return passwordUrl.includes(cleanUrl) || cleanUrl.includes(passwordUrl);
    }) || null;
  }
};
