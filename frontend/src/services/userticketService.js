import axios from 'axios';

const API_URL = 'http://localhost:4001/api/userTicket'; // Adjust if your base URL is different

// Helper to get the token
const getToken = () => localStorage.getItem('token');
      
// Existing function
export const getUserTickets = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/my-tickets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Assuming backend returns { success: true, data: [...] }
  } catch (error) {
    console.error('Error fetching user tickets:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch user tickets');
  }
};

// New function to get pending trades for the current user (recipient)
export const getPendingTrades = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/pending-trades`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Assuming { success: true, data: [...] }
  } catch (error) {
    console.error('Error fetching pending trades:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch pending trades');
  }
};

// New function for the recipient to accept a trade (initiates payment)
export const acceptTrade = async (ticketId) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/${ticketId}/accept-trade`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Assuming { success: true, sessionUrl: '...' }
  } catch (error) {
    console.error('Error accepting trade:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to accept trade');
  }
};

// New function for the recipient to cancel/decline a pending trade
export const cancelTrade = async (ticketId) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/${ticketId}/cancel-trade`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Assuming { success: true, message: '...' }
  } catch (error) {
    console.error('Error cancelling trade:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to cancel trade');
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Trade ticket
export const initiateTrade = async (ticketId, recipientEmail, password) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/${ticketId}/trade`, // Make sure this matches your backend route
      { recipientEmail, password }, // Send recipientEmail and password
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { success: false, message: error.message || 'Network error' };
    }
  }
};

export const confirmTrade = async (ticketId) => {
  try {
    const token = localStorage.getItem('token');
    // The backend expects ticketId in the request body
    const response = await axios.post(
      `${API_URL}/confirm-trade`, // Adjust if your backend route is different
      { ticketId }, // Send ticketId in the body
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { success: false, message: error.message || 'Network error' };
    }
  }
};

export const generateTicketQR = async (ticketId) => {
  try {
    const response = await axios.get(`${API_URL}/${ticketId}/qr`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to generate QR code' };
  }
};

export const getAdminSuccessfulTrades = async () => {
  const token = localStorage.getItem('token'); // Consider using an Auth Context/Hook for token management
  try {
    // Make the GET request using axios
    const response = await axios.get(`${API_URL}/all-trades`, { // Ensure this endpoint is correct
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // Check if the response is successful
    if (response.data && response.data.success) {
      return response.data.data || []; // Return the array of trades or an empty array
    } else {
      // Handle cases where the backend API returns success: false
      throw new Error(response.data.message || "Failed to fetch successful trades (API returned success: false).");
    }
  } catch (error) {
    console.error("Error fetching successful trades in service:", error);
    throw error;
    
  }
};