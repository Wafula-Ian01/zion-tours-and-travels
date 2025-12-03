// // Simple localStorage-based authentication
// // ⚠️ WARNING: This is NOT secure for production use!
// // For real security, use Lovable Cloud with proper backend authentication

// const AUTH_TOKEN_KEY = 'cms_auth_token';
// const AUTH_CREDENTIALS_KEY = 'cms_credentials';

// interface Credentials {
//   username: string;
//   password: string;
// }

// // Initialize default credentials if not set
// const initializeCredentials = () => {
//   const stored = localStorage.getItem(AUTH_CREDENTIALS_KEY);
//   if (!stored) {
//     const defaultCredentials: Credentials = {
//       username: 'admin',
//       password: 'admin123'
//     };
//     localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(defaultCredentials));
//   }
// };

// export const login = (username: string, password: string): boolean => {
//   initializeCredentials();
//   const stored = localStorage.getItem(AUTH_CREDENTIALS_KEY);
//   if (!stored) return false;
  
//   const credentials: Credentials = JSON.parse(stored);
//   if (credentials.username === username && credentials.password === password) {
//     const token = btoa(`${username}:${Date.now()}`);
//     localStorage.setItem(AUTH_TOKEN_KEY, token);
//     return true;
//   }
//   return false;
// };

// export const logout = () => {
//   localStorage.removeItem(AUTH_TOKEN_KEY);
// };

// export const isAuthenticated = (): boolean => {
//   return !!localStorage.getItem(AUTH_TOKEN_KEY);
// };

// export const updateCredentials = (newUsername: string, newPassword: string) => {
//   const credentials: Credentials = {
//     username: newUsername,
//     password: newPassword
//   };
//   localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(credentials));
// };


// src/lib/auth.ts
// Backend API-based authentication

const AUTH_TOKEN_KEY = 'cms_auth_token';
const AUTH_USER_KEY = 'cms_auth_user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Login failed:', error);
      return false;
    }

    const data: LoginResponse = await response.json();
    
    // Store token and user info
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
  role?: 'admin' | 'editor'
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Registration failed:', error);
      return false;
    }

    const data: LoginResponse = await response.json();
    
    // Store token and user info
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getCurrentUser = (): AuthUser | null => {
  const userJson = localStorage.getItem(AUTH_USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const updateCredentials = async (
  newUsername: string,
  newPassword: string
): Promise<boolean> => {
  // This would need to be implemented on the backend
  // For now, return false as this feature needs backend support
  console.warn('updateCredentials not yet implemented in backend');
  return false;
};