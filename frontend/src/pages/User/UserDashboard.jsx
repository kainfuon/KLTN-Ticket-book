import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../../components/User/UserNavbar';
import UserSidebar from '../../components/User/UserSidebar';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="flex bg-gray-100">
        <UserSidebar />
        <main className="flex-1 p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
