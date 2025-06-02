// Authenticated fetch with automatic JWT refresh

async function refreshToken() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token to refresh');
  const res = await fetch('/api/auth/refresh', {
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