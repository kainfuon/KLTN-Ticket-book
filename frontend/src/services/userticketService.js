import axios from 'axios';

const API_URL = 'http://localhost:4001/api/userTicket';

export const getUserTickets = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await axios.get(`${API_URL}/my-tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Please login again');
      }
      throw error.response?.data || error.message;
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
export const tradeTicket = async (ticketId, tradeData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/${ticketId}/trade`,
      {
        recipientEmail: tradeData.recipientEmail,
        password: tradeData.password
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw error.response?.data || { success: false, message: "Failed to trade ticket" };
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