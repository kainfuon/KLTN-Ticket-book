import { login } from "../../services/authService";

export const handleLogin = async (email, password, setError, navigate) => {
    const response = await login(email, password);

    if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("user", JSON.stringify(response.user)); // 🛠 Lưu thông tin user

        // Điều hướng dựa trên role
        if (response.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/home");
        }
    } else {
        setError(response.message);
    }
};

