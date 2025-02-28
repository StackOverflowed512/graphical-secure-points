
import { LoginData, RegisterData, User } from "../types/auth";

// This would be replaced with your actual API URL
const API_BASE_URL = "http://localhost:5000/api";

// Helper to make API requests
async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Allows cookies to be sent and received
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

// Auth API functions
export const authApi = {
  register: (data: RegisterData): Promise<User> => {
    return apiRequest<User>("/auth/register", "POST", data);
  },

  login: (data: LoginData): Promise<User> => {
    return apiRequest<User>("/auth/login", "POST", data);
  },

  logout: (): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>("/auth/logout", "POST");
  },

  getCurrentUser: (): Promise<User> => {
    return apiRequest<User>("/auth/me");
  },
};

// Function to simulate login/register without backend
// This would be replaced with actual API calls in production
export const simulateAuth = {
  login: async (data: LoginData): Promise<User> => {
    console.log("Login attempt with data:", data);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // This is just for demonstration - in a real app, validation would happen on the server
    const storedUser = localStorage.getItem(`user_${data.email}`);
    if (!storedUser) {
      throw new Error("User not found");
    }
    
    const user = JSON.parse(storedUser);
    const storedPoints = user.clickPoints;
    
    // Validate click points with tolerance
    const validPoints = data.clickPoints.every((point, index) => {
      const storedPoint = storedPoints[index];
      if (!storedPoint || point.imageId !== storedPoint.imageId) {
        return false;
      }
      
      // Allow 30px tolerance in each direction
      const xDiff = Math.abs(point.x - storedPoint.x);
      const yDiff = Math.abs(point.y - storedPoint.y);
      return xDiff <= 30 && yDiff <= 30;
    });
    
    if (!validPoints) {
      throw new Error("Invalid graphical password");
    }
    
    // Store auth state
    const authUser = { id: user.id, username: user.username, email: user.email };
    localStorage.setItem("currentUser", JSON.stringify(authUser));
    
    return authUser;
  },
  
  register: async (data: RegisterData): Promise<User> => {
    console.log("Register attempt with data:", data);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Check if user already exists
    if (localStorage.getItem(`user_${data.email}`)) {
      throw new Error("User already exists");
    }
    
    // Create a new user
    const newUser = {
      id: Date.now().toString(),
      username: data.username,
      email: data.email,
      clickPoints: data.clickPoints,
    };
    
    // Store user data
    localStorage.setItem(`user_${data.email}`, JSON.stringify(newUser));
    
    // Store auth state
    const authUser = { id: newUser.id, username: newUser.username, email: newUser.email };
    localStorage.setItem("currentUser", JSON.stringify(authUser));
    
    return authUser;
  },
  
  logout: async (): Promise<{ success: boolean }> => {
    // Remove auth state
    localStorage.removeItem("currentUser");
    return { success: true };
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  }
};
