import React from "react";
import { Link } from "react-router-dom";
import {
  PresentationChartBarIcon,
  TicketIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

const AdminSidebar = () => {
  return (
    <div className="h-screen text-black w-64 p-6 shadow-md text-center transition-all">
      <h2 className="text-2xl font-bold mb-4">Ticket Book</h2>
      <ul className="space-y-3">
        <li>
          <Link to="/admin/dashboard" className="flex items-center gap-3 text-xl py-2 px-4 rounded-lg hover:bg-gray-300">
            <PresentationChartBarIcon className="h-6 w-6" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/tickets" className="flex items-center gap-3 text-xl py-2 px-4 rounded-lg hover:bg-gray-300">
            <TicketIcon className="h-6 w-6" />
            Tickets
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="flex items-center gap-3 text-xl py-2 px-4 rounded-lg hover:bg-gray-300">
            <UserCircleIcon className="h-6 w-6" />
            Users
          </Link>
        </li>
        <li>
          <Link to="/admin/settings" className="flex items-center gap-3 text-xl py-2 px-4 rounded-lg hover:bg-gray-300">
            <Cog6ToothIcon className="h-6 w-6" />
            Settings
          </Link>
        </li>
        <li>
          <button className="flex items-center gap-3 text-lg py-2 px-4 rounded-xl text-red-500 hover:bg-red-100">
            <PowerIcon className="h-6 w-6" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
