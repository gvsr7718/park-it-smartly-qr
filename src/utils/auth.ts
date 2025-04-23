
import { users, User } from './mockData';

// Store the current user in session storage
let currentUser: User | null = null;

// Check if user is already logged in from session storage
export const initAuth = () => {
  const savedUser = sessionStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
  return currentUser;
};

// Login function
export const login = (email: string, password: string): User | null => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }
  return user || null;
};

// Register function (simulated)
export const register = (name: string, email: string, password: string): User | null => {
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return null;
  }

  // Create new user (in a real app this would save to the database)
  const newUser: User = {
    id: `user-${users.length + 1}`,
    name,
    email,
    password,
    isAdmin: false,
  };
  
  users.push(newUser);
  
  // Log in the new user
  currentUser = newUser;
  sessionStorage.setItem('currentUser', JSON.stringify(newUser));
  
  return newUser;
};

// Logout function
export const logout = (): void => {
  currentUser = null;
  sessionStorage.removeItem('currentUser');
};

// Get current user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return currentUser?.isAdmin || false;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};
