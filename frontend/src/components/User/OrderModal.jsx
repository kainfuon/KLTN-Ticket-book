import React, { useState } from 'react';
import { FaTimes, FaSpinner, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { placeOrder } from '../../services/orderService';

const OrderModal = ({ isOpen, onClose, event, selectedTickets, tickets, total }) => {
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!userInfo.fullName.trim() || !userInfo.email.trim() || !userInfo.phone.trim()) {
      setError('Please fill in all required fields');
      return;
    }
  
    try {
      setLoading(true);
  
      // Convert selectedTickets from object to array format
      const formattedTickets = Object.entries(selectedTickets)
        .filter(([ticketId, quantity]) => quantity > 0)
        .map(([ticketId, quantity]) => ({
          ticketId,
          quantity
        }));
  
      const orderData = {
        eventId: event._id,
        tickets: formattedTickets, // Correct format
        ...userInfo
      };
  
      const response = await placeOrder(orderData);
      
      if (response.success && response.sessionUrl) {
        window.location.href = response.sessionUrl;
      }
    } catch (err) {
  setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Complete Your Order</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="p-6">
          {/* Selected Tickets Summary */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Selected Tickets</h3>
            <div className="space-y-2">
              {tickets
                .filter(ticket => selectedTickets[ticket._id] > 0)
                .map(ticket => (
                  <div key={ticket._id} className="flex justify-between text-sm">
                    <span>{ticket.type}</span>
                    <span>{selectedTickets[ticket._id]} x {ticket.price.toLocaleString()}$</span>
                  </div>
                ))
              }
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{total.toLocaleString()}$</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={userInfo.fullName}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg bg-blue-600 text-white flex items-center justify-center ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
