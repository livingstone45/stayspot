// Mock Authentication Service
// This provides simulated auth endpoints for demo/testing purposes

const STORAGE_KEY = 'mockAuthToken';
const USER_STORAGE_KEY = 'mockUser';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database
const mockUsers = {
  'tenant@example.com': {
    id: '1',
    email: 'tenant@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Tenant',
    type: 'tenant',
    phoneNumber: '+1234567890',
    profileComplete: true
  },
  'manager@example.com': {
    id: '2',
    email: 'manager@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Manager',
    type: 'property_manager',
    phoneNumber: '+0987654321',
    profileComplete: true
  },
  'investor@example.com': {
    id: '3',
    email: 'investor@example.com',
    password: 'password123',
    firstName: 'Bob',
    lastName: 'Investor',
    type: 'investor',
    phoneNumber: '+1122334455',
    profileComplete: true
  }
};

export const mockAuthService = {
  // Register user
  register: async (userData) => {
    await delay(500);
    
    const { email, password, firstName, lastName, userType, phoneNumber } = userData;
    
    // Check if user already exists
    if (mockUsers[email]) {
      throw new Error('User with this email already exists');
    }
    
    // Validate password
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Create new user
    const newUser = {
      id: String(Object.keys(mockUsers).length + 1),
      email,
      password,
      firstName,
      lastName,
      type: userType || 'tenant',
      phoneNumber,
      profileComplete: true
    };
    
    mockUsers[email] = newUser;
    
    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        type: newUser.type
      }
    };
  },

  // Login user
  login: async (email, password) => {
    await delay(500);
    
    const user = mockUsers[email];
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    // Generate mock token
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    // Store token
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: user.type
    }));
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type
      }
    };
  },

  // Logout user
  logout: async () => {
    await delay(200);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    return { success: true };
  },

  // Get current user
  getCurrentUser: async () => {
    await delay(200);
    const token = localStorage.getItem(STORAGE_KEY);
    const user = localStorage.getItem(USER_STORAGE_KEY);
    
    if (!token || !user) {
      throw new Error('Not authenticated');
    }
    
    return {
      success: true,
      user: JSON.parse(user)
    };
  },

  // Verify token
  verifyToken: async (token) => {
    await delay(200);
    if (!token || !token.startsWith('mock_token_')) {
      throw new Error('Invalid token');
    }
    
    return {
      success: true,
      valid: true
    };
  }
};

// Demo credentials for reference
export const DEMO_CREDENTIALS = {
  tenant: {
    email: 'tenant@example.com',
    password: 'password123',
    role: 'Tenant'
  },
  manager: {
    email: 'manager@example.com',
    password: 'password123',
    role: 'Property Manager'
  },
  investor: {
    email: 'investor@example.com',
    password: 'password123',
    role: 'Investor'
  }
};
