import axios from 'axios';

const API_URL = 'http://localhost:4001/api/tickets'; // Adjust if your base URL is different

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

// Note: confirmTrade is likely called from a different part of your app (e.g., after Stripe redirect)
// If you need it here for some reason, it would look like this:
// export const confirmTradeAfterPayment = async (ticketId) => {
//   try {
//     const token = getToken();
//     const response = await axios.post(`${API_URL}/confirm-trade`, { ticketId }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error confirming trade:', error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || 'Failed to confirm trade');
//   }
// };

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