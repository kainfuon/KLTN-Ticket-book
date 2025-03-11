import axios from 'axios';

const API_URL = 'http://localhost:4001/api/orders';

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
