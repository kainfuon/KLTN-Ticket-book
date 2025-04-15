import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaChartBar , FaUsers, FaBox, FaCog, FaSignOutAlt } from "react-icons/fa";

const AdminSidebar = () => {

  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 text-gray-900 h-screen px-4 fixed w-16 md:w-64 border-r border-gray-300">
      <h1 className="text-2xl font-bold hidden md:block mt-4 text-center italic">Ticket Book</h1>
      <ul className="flex flex-col mt-5 text-xl">
        <Link to="/admin/dashboard" className="flex items-center md:justify-start justify-center py-3 px-2 md:space-x-4 hover:bg-gray-300 hover:rounded hover:cursor-pointer">
          <span className="w-8 h-8 flex items-center justify-center">
            <FaTachometerAlt className="text-gray-900 text-2xl" />
          </span>
          <span className="hidden md:inline">Dashboard</span>
        </Link>

        <Link to="/admin/events" className="flex items-center md:justify-start justify-center py-3 px-2 md:space-x-4 hover:bg-gray-300 hover:rounded hover:cursor-pointer">
          <span className="w-8 h-8 flex items-center justify-center">
            <FaCalendarAlt className="text-gray-900 text-2xl" />
          </span>
          <span className="hidden md:inline">Events</span>
        </Link>

        <Link to="/admin/statistics" className="flex items-center md:justify-start justify-center py-3 px-2 md:space-x-4 hover:bg-gray-300 hover:rounded hover:cursor-pointer">
          <span className="w-8 h-8 flex items-center justify-center">
            <FaChartBar  className="text-gray-900 text-2xl" />
          </span>
          <span className="hidden md:inline">Statistics</span>
        </Link>

        <Link to="/admin/customers" className="flex items-center md:justify-start justify-center py-3 px-2 md:space-x-4 hover:bg-gray-300 hover:rounded hover:cursor-pointer">
          <span className="w-8 h-8 flex items-center justify-center">
            <FaUsers className="text-gray-900 text-2xl" />
          </span>
          <span className="hidden md:inline">Customers</span>
        </Link>

        <Link to="/admin/orders" className="flex items-center md:justify-start justify-center py-3 px-2 md:space-x-4 hover:bg-gray-300 hover:rounded hover:cursor-pointer">
          <span className="w-8 h-8 flex items-center justify-center">
            <FaBox className="text-gray-900 text-2xl" />
          </span>
          <span className="hidden md:inline">Orders</span>
        </Link>

        <Link to="/admin/settings" className="flex items-center md:justify-start justify-center py-3 px-2 md:space-x-4 hover:bg-gray-300 hover:rounded hover:cursor-pointer">
          <span className="w-8 h-8 flex items-center justify-center">
            <FaCog className="text-gray-900 text-2xl" />
          </span>
          <span className="hidden md:inline">Settings</span>
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("Authorization"); 
            navigate("/login"); // Điều hướng về trang login
          }}
          className="flex items-center md:justify-start justify-center py-3 px-2 md:space-x-4 w-full text-left hover:bg-gray-300 hover:rounded hover:cursor-pointer"
        >
          <span className="w-8 h-8 flex items-center justify-center">
            <FaSignOutAlt className="text-gray-900 text-2xl" />
          </span>
          <span className="hidden md:inline">Logout</span>
        </button>
      </ul>
    </div>
  );
};

export default AdminSidebar;
