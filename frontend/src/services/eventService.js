import axios from "axios";

const API_URL = "http://localhost:4000/api/event"; // Updated base URL

// Fetch all events
export const getAllEvents = async () => {
    try {
        const response = await axios.get(`${API_URL}/list`); // Corrected API endpoint
        return response.data.data; // Extract "data" from response
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

// Fetch event details by ID
export const getEventById = async (eventId) => {
    try {
        const response = await axios.get(`${API_URL}/${eventId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching event ${eventId}:`, error);
        return null;
    }
};

// Update the createEvent function to include the auth token
export const createEvent = async (eventData) => {
    try {
      const token = localStorage.getItem('token');
  
      const formData = new FormData();
      for (const key in eventData) {
        formData.append(key, eventData[key]);
      }
  
      const response = await axios.post(`${API_URL}/add`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
        withCredentials: true // Add this line
      });
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      return { success: false, message: "Failed to create event" };
    }
  };
  
  

// Update an event
export const updateEvent = async (eventId, updatedData) => {
    try {
        const formData = new FormData();
        for (const key in updatedData) {
            formData.append(key, updatedData[key]);
        }

        const response = await axios.put(`${API_URL}/update/${eventId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating event ${eventId}:`, error);
        return { success: false, message: "Failed to update event" };
    }
};

// Delete an event
export const deleteEvent = async (eventId) => {
    try {
        const response = await axios.delete(`${API_URL}/remove`, { data: { id: eventId } });
        return response.data;
    } catch (error) {
        console.error(`Error deleting event ${eventId}:`, error);
        return { success: false, message: "Failed to delete event" };
    }
};
