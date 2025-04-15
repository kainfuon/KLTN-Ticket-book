import axios from 'axios';

const API_URL = 'http://localhost:4001/api/stats';

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

export const getEventSalesStats = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching event stats:', error);
    throw error;
  }
};

export const getTicketTypeSalesStats = async (eventId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/tickets/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    throw error;
  }
};
