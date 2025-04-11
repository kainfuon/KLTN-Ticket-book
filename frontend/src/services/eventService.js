import axios from "axios";

const API_URL = "http://localhost:4001/api/event"; // Updated base URL

// Helper function to get token
const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    return token;
};

// Fetch all events
export const getAllEvents = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };
  
  // Fetch event details by ID
  export const getEventById = async (eventId) => {
    try {
      const token = getToken();
      const response = await axios.get(`${API_URL}/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  };
  
  // Create an event
  export const createEvent = async (eventData) => {
    try {
      const token = getToken();
      const formData = new FormData();
      for (const key in eventData) {
        formData.append(key, eventData[key]);
      }
      
      const response = await axios.post(`${API_URL}/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      return { success: false, message: error.response?.data?.message || "Failed to create event" };
    }
  };
  

// Update an event
export const updateEvent = async (eventId, updatedData) => {
    try {
        const token = getToken();
        const formData = new FormData();
  
      // Only append fields that are actually present in updatedData
        Object.keys(updatedData).forEach(key => {
            // Skip null or undefined values, but include empty strings and 0
            if (updatedData[key] !== null && updatedData[key] !== undefined) {
            // Handle the image field specially
            if (key === 'image' && !updatedData[key]) {
                return; // Skip empty image
            }
            formData.append(key, updatedData[key]);
            }
        });
  
      const response = await axios.put(`${API_URL}/update/${eventId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        },
          withCredentials: true
      });
  
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to update event"
        };
      }
    } catch (error) {
      console.error(`Error updating event ${eventId}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update event"
      };
    }
};
  

  
  // Delete an event
export const deleteEvent = async (eventId) => {
    try {
      const token = getToken();
      const response = await axios.delete(`${API_URL}/remove/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting event ${eventId}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to delete event" 
      };
    }
  };
  
  // Add error interceptor for token expiration
axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle token expiration
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login page
      }
      return Promise.reject(error);
    }
  );