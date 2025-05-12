import axios from "axios";

const API_URL = "http://localhost:4001/api/user"; 

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Login failed" };
    }
};

export const getAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found.");
    }
    const response = await axios.get(`${API_URL}/info`, { // Your actual API endpoint
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch user profile.");
    }
  } catch (error) {
    console.error("Error in getUserProfile service:", error);
    throw error; // Re-throw to be caught by the component
  }
};

export const updateUserBlockStatus = async (userId, block) => {
  try {
    const token = getToken();
    if (!token) throw new Error("Admin token not found.");

    const response = await axios.patch(`${API_URL}/block`, // Matches backend/routers/userRoutes.js
      { userId, block }, // Request body
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (response.data && response.data.success) {
      return response.data; // Return { success: true, message: '...' }
    } else {
      throw new Error(response.data?.message || 'Failed to update user block status.');
    }
  } catch (error) {
    console.error("Error updating user block status:", error);
    throw error.response?.data || error;
  }
};