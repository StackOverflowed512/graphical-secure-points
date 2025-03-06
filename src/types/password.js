
// Password types converted to JS comments for documentation
/**
 * @typedef {Object} Password
 * @property {string} id - Unique identifier
 * @property {string} userId - ID of the user who owns this password
 * @property {string} title - Title/name of the password entry
 * @property {string} username - Username for this password entry
 * @property {string} password - The actual password
 * @property {string} [url] - Optional URL associated with this password
 * @property {string} [notes] - Optional notes for this password
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreatePasswordData
 * @property {string} title - Title/name of the password entry
 * @property {string} username - Username for this password entry
 * @property {string} password - The actual password
 * @property {string} [url] - Optional URL associated with this password
 * @property {string} [notes] - Optional notes for this password
 */

/**
 * @typedef {Object} UpdatePasswordData
 * @property {string} id - ID of the password to update
 * @property {string} [title] - Title/name of the password entry
 * @property {string} [username] - Username for this password entry
 * @property {string} [password] - The actual password
 * @property {string} [url] - Optional URL associated with this password
 * @property {string} [notes] - Optional notes for this password
 */

/**
 * @typedef {Object} PasswordContextType
 * @property {Password[]} passwords - Array of password objects
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message, if any
 * @property {Function} getPasswords - Function to fetch all passwords
 * @property {Function} addPassword - Function to add a new password
 * @property {Function} updatePassword - Function to update a password
 * @property {Function} deletePassword - Function to delete a password
 */
