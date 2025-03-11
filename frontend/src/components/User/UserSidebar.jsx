import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTicketAlt, FaExchangeAlt, FaUser } from 'react-icons/fa';

const UserSidebar = () => {
  const menuItems = [
    {
      path: '/user/tickets',
      name: 'My Tickets',
      icon: <FaTicketAlt />
    },
    {
      path: '/user/trade',
      name: 'Trade Tickets',
      icon: <FaExchangeAlt />
    },
    {
      path: '/user/profile',
      name: 'Profile',
      icon: <FaUser />
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-white shadow-sm pt-16">
      <div className="p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default UserSidebar;
