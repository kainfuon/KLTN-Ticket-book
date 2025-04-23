import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser } from 'react-icons/fa';
import reactLogo from '../../assets/react.svg';

const UserNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    navigate("/login");
    setIsDropdownOpen(false);
  };


  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
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

          {/* Navigation Links and Search */}
          <div className="flex items-center space-x-6">
            <Link
              to="/home"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Contact
            </Link>

            {/* Search Form */}
            {/* <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-200">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none w-44 text-sm placeholder-gray-400"
                />
                <button type="submit">
                  <FaSearch className="text-gray-400 text-sm hover:text-gray-600 transition-colors duration-200" />
                </button>
              </div>
            </form> */}
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              <FaUser className="text-gray-500 text-sm" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Link
                  to="/user"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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
