import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const role = localStorage.getItem("role"); // Lấy role từ localStorage

  if (!role) {
    return <Navigate to="/login" replace />; // Nếu chưa đăng nhập, chuyển về trang login
  }

  if (role !== "admin") {
    return <Navigate to="/login" replace />; // Nếu không phải admin, chuyển về trang user
  }

  return <Outlet />; // Nếu là admin, render trang con bên trong
};

export default AdminRoute;
