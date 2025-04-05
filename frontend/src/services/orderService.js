import axios from 'axios';

const API_URL = 'http://localhost:4001/api/order';

export const placeOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/place`, orderData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.includes('Stripe')) {
      throw new Error('Payment service is temporarily unavailable');
    }
    throw error.response?.data || { success: false, message: "Failed to place order" };
  }
};

export const confirmPayment = async (success, orderId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/confirm`, 
      { success, orderId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
