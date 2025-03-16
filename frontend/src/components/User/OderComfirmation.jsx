import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { placeOrder } from '../../services/orderService';
import { FaTicketAlt, FaSpinner, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, tickets, total } = location.state || {};

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

  const handlePlaceOrder = async () => {
    if (!userInfo.fullName.trim() || !userInfo.email.trim() || !userInfo.phone.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        eventId: event._id,
        tickets,
        ...userInfo
      };

      const response = await placeOrder(orderData);
      if (response.success) {
        navigate('/payment', { 
          state: { 
            orderId: response.orderId,
            amount: total
          }
        });
      }
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>

      {/* Event Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{event?.title}</h2>
        <p className="text-gray-600">{event?.venue}</p>
      </div>

      {/* Selected Tickets */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Selected Tickets</h2>
        <div className="space-y-3">
          {tickets?.map((ticket) => (
            <div key={ticket._id} className="flex justify-between items-center">
              <div className="flex items-center">
                <FaTicketAlt className="text-gray-500 mr-2" />
                <span>{ticket.type}</span>
              </div>
              <div className="text-right">
                <span className="mr-4">{ticket.quantity}x</span>
                <span>{ticket.price.toLocaleString()}$</span>
              </div>
            </div>
          ))}
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>{total?.toLocaleString()}$</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
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
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`px-6 py-2 rounded-lg bg-blue-600 text-white flex items-center ${
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
    </div>
  );
};

export default OrderConfirmation;
