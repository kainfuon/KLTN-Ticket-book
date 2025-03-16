import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { tradeTicket } from '../../services/userticketService';

const TradeTicketModal = ({ ticket, onClose, onTradeComplete }) => {
  const [formData, setFormData] = useState({
    recipientId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await tradeTicket(ticket._id, formData);
      if (result.success) {
        onTradeComplete();
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to trade ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold">Trade Ticket</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <FaTimes />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Event Info */}
            <div className="mb-4">
              <h3 className="font-semibold">{ticket.eventId.title}</h3>
              <p className="text-sm text-gray-600">Type: {ticket.ticketType.type}</p>
            </div>

            {/* Recipient ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient ID *
              </label>
              <input
                type="text"
                name="recipientId"
                value={formData.recipientId}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter recipient's user ID"
              />
            </div>

            {/* Password Confirmation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter your password to confirm"
              />
            </div>

            {/* Warning Message */}
            <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
              <p>⚠️ Warning: This action cannot be undone. Please make sure you have entered the correct recipient ID.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Trading...' : 'Confirm Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeTicketModal;
