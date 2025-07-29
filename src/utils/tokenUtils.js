// utils/tokenUtils.js

/**
 * Set a JWT token into a cookie
 * @param {string} token - JWT token
 * @param {number} days - Optional: number of days until cookie expires
 */
export function setTokenCookie(token, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString(); // default: 1 day
  document.cookie = `jwt=${token}; path=/; expires=${expires}; Secure; SameSite=Strict`;
}

/**
 * Get the JWT token from cookie
 * @returns {string|null} - JWT token if exists, else null
 */
export function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)jwt=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}
