/**
 * Error Message Transformer
 * Maps backend error responses to user-friendly messages
 */

const ERROR_MESSAGE_MAP = {
  // Authentication errors
  'Invalid credentials': 'Invalid email or password',
  'invalid credentials': 'Invalid email or password',
  'User not found': 'Invalid email or password',
  'user not found': 'Invalid email or password',
  'User is inactive': 'Your account is inactive. Please contact an administrator',
  'user is inactive': 'Your account is inactive. Please contact an administrator',
  'Unauthorized': 'Your session has expired. Please login again',
  'unauthorized': 'Your session has expired. Please login again',

  // Validation errors
  'Email already exists': 'This email is already in use',
  'email already exists': 'This email is already in use',
  'Email already in use': 'This email is already in use',
  'email already in use': 'This email is already in use',
  'Duplicate entry': 'This entry already exists',
  'duplicate entry': 'This entry already exists',
  'Slug already exists': 'This slug is already in use',
  'slug already exists': 'This slug is already in use',
  'SKU already exists': 'This SKU is already in use',
  'sku already exists': 'This SKU is already in use',
  'Sale price cannot exceed regular price': 'Sale price cannot exceed regular price',
  'sale price cannot exceed regular price': 'Sale price cannot exceed regular price',
  'Price must be greater than or equal to 0': 'Price cannot be negative',
  'price must be greater than or equal to 0': 'Price cannot be negative',
  'Stock must be greater than or equal to 0': 'Stock cannot be negative',
  'stock must be greater than or equal to 0': 'Stock cannot be negative',
  'Duplicate variant combination': 'These variant attributes already exist for this product',
  'duplicate variant combination': 'These variant attributes already exist for this product',
  'Variant not found': 'Variant not found. It may have been deleted',
  'variant not found': 'Variant not found. It may have been deleted',

  // Permission errors
  'Forbidden': 'You do not have permission to perform this action',
  'forbidden': 'You do not have permission to perform this action',
  'Cannot delete last admin': 'Cannot delete the last admin user. At least one admin must exist',
  'cannot delete last admin': 'Cannot delete the last admin user. At least one admin must exist',
  'Cannot modify last admin role': 'Cannot remove the admin role from the last admin user',
  'cannot modify last admin role': 'Cannot remove the admin role from the last admin user',

  // Not found errors
  'Not found': 'The requested resource was not found',
  'not found': 'The requested resource was not found',

  // Server errors
  'Internal server error': 'Server error. Please try again later',
  'internal server error': 'Server error. Please try again later',
};

/**
 * Get user-friendly error message from error response
 * @param {Error} error - Axios error object
 * @param {string} defaultMessage - Default message if no match found
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error, defaultMessage = 'An error occurred. Please try again') => {
  // Check for custom error message from backend
  const backendMessage = error.response?.data?.message;
  
  if (backendMessage && typeof backendMessage === 'string') {
    // Check if we have a translation for this message
    for (const [key, value] of Object.entries(ERROR_MESSAGE_MAP)) {
      if (backendMessage.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    // If no translation, use backend message if it's informative
    if (backendMessage.length < 200) {
      return backendMessage;
    }
  }

  // Handle specific HTTP status codes
  const status = error.response?.status;
  
  if (status === 400) {
    return 'Invalid input. Please check your data and try again';
  }
  if (status === 401) {
    return 'Your session has expired. Please login again';
  }
  if (status === 403) {
    return 'You do not have permission to perform this action';
  }
  if (status === 404) {
    return 'The requested resource was not found';
  }
  if (status === 409) {
    return 'This entry already exists or conflicts with existing data';
  }
  if (status === 500) {
    return 'Server error. Please try again later';
  }

  // Handle network errors
  if (error.message === 'Network Error' || !error.response) {
    return 'Unable to connect to the server. Please check your connection and try again';
  }

  return defaultMessage;
};

/**
 * Extract validation errors from backend response
 * @param {Error} error - Axios error object
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const getValidationErrors = (error) => {
  const errors = {};

  // Check for validation errors in response
  if (error.response?.data?.errors) {
    const backendErrors = error.response.data.errors;
    
    // If it's an array of error objects
    if (Array.isArray(backendErrors)) {
      backendErrors.forEach((err) => {
        if (err.field && err.message) {
          errors[err.field] = err.message;
        }
      });
    }
    // If it's an object with field keys
    else if (typeof backendErrors === 'object') {
      Object.entries(backendErrors).forEach(([field, message]) => {
        errors[field] = Array.isArray(message) ? message[0] : message;
      });
    }
  }

  return errors;
};

/**
 * Check if error is a network error
 * @param {Error} error - Axios error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return error.message === 'Network Error' || !error.response;
};

/**
 * Check if error is a validation error
 * @param {Error} error - Axios error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return error.response?.status === 400;
};

/**
 * Check if error is a permission error
 * @param {Error} error - Axios error object
 * @returns {boolean}
 */
export const isPermissionError = (error) => {
  return error.response?.status === 403;
};

/**
 * Check if error is an authentication error
 * @param {Error} error - Axios error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

/**
 * Check if error is a conflict (duplicate entry, etc)
 * @param {Error} error - Axios error object
 * @returns {boolean}
 */
export const isConflictError = (error) => {
  return error.response?.status === 409;
};
