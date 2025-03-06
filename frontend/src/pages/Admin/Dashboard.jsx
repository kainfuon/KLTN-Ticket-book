import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminDashboard from "../../components/Admin/AdminDashboard";

const Dashboard = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className='grow ml-16 md:ml-64 h-full lg:h-screen bg-gray-100 text-gray-900'>
        <AdminNavbar />
        <div>
          <AdminDashboard/>
        </div>
      </div>
    </div>
  );
};
  
export default Dashboard; // ✅ Đảm bảo có dòng này!
  