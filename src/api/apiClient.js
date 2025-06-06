// Authenticated fetch with automatic JWT refresh

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function refreshToken() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token to refresh');
  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'omit'
  });
  if (!res.ok) throw new Error('Token refresh failed');
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data.token;
}

export async function authFetch(url, options = {}, retry = true) {
  let token = localStorage.getItem('token');
  options.headers = options.headers || {};
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  options.credentials = 'omit';

  let res = await fetch(url, options);

  if ((res.status === 401 || res.status === 403) && retry && token) {
    try {
      token = await refreshToken();
      options.headers['Authorization'] = `Bearer ${token}`;
      res = await fetch(url, options);
    } catch (err) {
      console.error('Token refresh failed:', res);
      // Refresh failed, logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw err;
    }
  }
  return res;
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("/")
    ? `${API_BASE_URL}${path}`
    : `${API_BASE_URL}/${path}`;
  // Default: no credentials
  options.credentials = options.credentials || "omit";
  return fetch(url, options);
}

export function getAvatarUrl(avatar_url) {
  if (!avatar_url) return null;
  if (avatar_url.startsWith("http")) return avatar_url;
  return `${API_BASE_URL}/api/${avatar_url}`;
}