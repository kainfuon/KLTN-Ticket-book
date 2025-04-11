import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser } from 'react-icons/fa';
import reactLogo from '../../assets/react.svg';
import { useNavigate } from 'react-router-dom';


const UserNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={reactLogo}
                alt="React Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="text-gray-800 text-lg font-semibold">
                Ticket Book
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/home" 
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-600 hover:text-gray-900"
            >
              Contact
            </Link>
            <div className="relative">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1.5">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none w-44 text-sm"
                />
                <FaSearch className="text-gray-400 text-sm" />
              </div>
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <FaUser className="text-gray-500 text-sm" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-md py-1">
                <Link
                  to="/user"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={() => {
                    localStorage.removeItem("Authorization"); 
                    navigate("/login"); // Điều hướng về trang login
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;