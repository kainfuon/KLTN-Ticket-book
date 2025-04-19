import axios from 'axios';

// Địa chỉ API của backend
const API_URL = "http://localhost:4001/api/ai"; // Sửa theo đúng URL của backend

// Hàm gọi API để lấy danh sách các user nghi ngờ là phe vé
export const getSuspectedScalpers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/suspects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
