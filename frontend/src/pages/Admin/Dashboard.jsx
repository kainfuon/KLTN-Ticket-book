import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";


const Dashboard = () => {
  return (
    <div className="bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold">Welcome to Admin Dashboard</h2>
        </div>
      </div>
    </div>
  );
};
  
  export default Dashboard; // ✅ Đảm bảo có dòng này!
  