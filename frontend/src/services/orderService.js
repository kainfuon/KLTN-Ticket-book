import axios from 'axios';

const API_URL = 'http://localhost:4001/api/order';

export const placeOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/place`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Failed to place order" };
  }
};
