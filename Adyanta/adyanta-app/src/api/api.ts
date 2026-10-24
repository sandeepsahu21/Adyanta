
const API_BASE_URL = 'https://adyanta-backend.onrender.com';

export async function checkBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Backend health check failed');
    }

    return data;
  } catch (error) {
    console.error('Backend connection error:', error);
    throw error;
  }
}

export async function registerUser(
  fullname: string,
  email: string,
  password: string
) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Registration failed');
  }

  return data;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Login failed');
  }

  return data;
}

export async function getProfile(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Could not load profile');
  }

  return data;
}

export async function logoutUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Logout failed');
  }

  return data;
}
