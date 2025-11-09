// Centralized auth token management
/*const TOKEN_KEY = 'colive_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const isLoggedIn = () => !!getToken();

// Helper to create Authorization header
export const getAuthHeader = () => ({
    'Authorization': `Bearer ${getToken()}`
});
*/
import { jwtDecode } from 'jwt-decode';

const tokenKey = 'colive_token';

export function getUserFromToken() {
  const token = localStorage.getItem(tokenKey);
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded; // contains userId, role, etc.
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function setToken(token) {
  localStorage.setItem(tokenKey, token);
}

export function removeToken() {
  localStorage.removeItem(tokenKey);
}

// ✅ Add this helper
export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
