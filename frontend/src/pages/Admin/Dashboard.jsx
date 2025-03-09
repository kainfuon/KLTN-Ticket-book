import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-16 md:ml-64 bg-gray-100 overflow-auto">
        <AdminNavbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
