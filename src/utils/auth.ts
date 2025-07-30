import Cookies from 'js-cookie';

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Types
export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  // Add more user properties as needed
}

// Mock verification function (in a real app, this would call an API)
export const sendVerificationCode = async (phoneNumber: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would call your backend API to send an SMS
  console.log(`Sending verification code to ${phoneNumber}`);
  
  // Always return true for demo purposes
  return true;
};

// Mock verification check (in a real app, this would validate with an API)
export const verifyCode = async (phoneNumber: string, code: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, accept any 4-digit code
  if (code.length === 4 && /^\d{4}$/.test(code)) {
    // Create a mock user
    const user: User = {
      id: `user_${Date.now()}`,
      phoneNumber,
    };
    
    // Save user data and token
    setUserData(user);
    setAuthToken(`token_${Date.now()}`);
    
    return user;
  }
  
  return null;
};

// Set auth token in cookies
export const setAuthToken = (token: string): void => {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7 }); // Expires in 7 days
};

// Get auth token from cookies
export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

// Remove auth token from cookies
export const removeAuthToken = (): void => {
  Cookies.remove(AUTH_TOKEN_KEY);
};

// Set user data in local storage
export const setUserData = (user: User): void => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

// Get user data from local storage
export const getUserData = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Remove user data from local storage
export const removeUserData = (): void => {
  localStorage.removeItem(USER_DATA_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getUserData();
};

// Logout user
export const logout = (): void => {
  removeAuthToken();
  removeUserData();
};