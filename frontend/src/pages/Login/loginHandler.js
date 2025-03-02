import { login } from "../../services/authService";

export const handleLogin = async (email, password, setError, navigate) => {
    const response = await login(email, password);

    if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role); // Lưu role để bảo vệ route

        // Điều hướng dựa trên role
        if (response.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/user"); // Điều hướng đúng trang user
        }
    } else {
        setError(response.message);
    }
};
