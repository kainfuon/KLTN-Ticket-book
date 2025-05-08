import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaCalendarAlt, FaShieldAlt, FaSpinner, FaExclamationTriangle, FaKey } from 'react-icons/fa'; // Added FaKey
import { toast } from 'sonner';
import ChangePasswordModal from './ChangePasswordModal';

// Mock service function - replace with your actual API call
const getUserProfileData = async () => {
  // Simulate API call
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("Authentication token not found. Please login.");
  }

  // Replace with your actual API endpoint
  const response = await fetch('http://localhost:4001/api/user/profile', { 
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch user data.");
  }
  return data.data; 
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
    <span className="text-blue-500 mr-3 mt-1">{React.cloneElement(icon, { size: 20 })}</span>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-md font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);



const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // State for modal

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const userData = await getUserProfileData();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message || 'Failed to load profile information.');
        toast.error(err.message || 'Failed to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        <p className="ml-3 text-lg text-gray-700">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} // Simple reload, or re-fetch
          className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        <p className="ml-3 text-lg text-gray-700">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} // Simple reload, or re-fetch
          className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center text-gray-500">No user data found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="bg-white shadow-xl rounded-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
            {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
            Account Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem icon={<FaUser />} label="Full Name" value={user.name} />
            <InfoItem icon={<FaEnvelope />} label="Email Address" value={user.email} />
            <InfoItem icon={<FaShieldAlt />} label="Role" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
            <InfoItem 
              icon={<FaCalendarAlt />} 
              label="Joined On" 
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} 
            />
             <InfoItem 
              icon={<FaCalendarAlt />} 
              label="Last Updated" 
              value={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} 
            />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-center gap-4">
          <button 
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            // onClick={() => toast.info("Edit Profile feature coming soon!")} // Placeholder for edit profile
          >
            <FaUser className="text-gray-600"/> Edit Profile (Soon)
          </button>
          <button 
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <FaKey /> Change Password
          </button>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default UserProfile;