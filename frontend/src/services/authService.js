import axios from "axios";

const API_URL = "http://localhost:4000/api/user"; 

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Login failed" };
    }
};
