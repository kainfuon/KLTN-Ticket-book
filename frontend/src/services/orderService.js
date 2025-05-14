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
    const errorMessage = error.response?.data?.message;

    // Nếu thông báo có liên quan đến Stripe
    if (typeof errorMessage === 'string' && errorMessage.includes('Stripe')) {
      throw new Error('Payment service is temporarily unavailable');
    }

    // Ném lỗi chi tiết nếu có message, hoặc mặc định
    throw new Error(errorMessage || 'Failed to place order');
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
