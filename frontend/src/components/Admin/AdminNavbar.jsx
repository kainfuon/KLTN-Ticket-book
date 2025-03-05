import React from "react";

const AdminNavbar = () => {
  return (
    <nav className=" shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">Welcome, Admin</span>
      </div>
    </nav>
  );
};

export default AdminNavbar;
