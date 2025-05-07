import React, { useState } from 'react';
import { FaExchangeAlt, FaEnvelope, FaLock, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import { initiateTrade } from '../../services/userticketService'; // Import the service

const TradeTicketModal = ({ ticket, onClose, onTradeComplete }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrade = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate inputs
      if (!recipientEmail || !password) {
        setError('Please fill in all fields');
        return;
      }

      // Call API to initiate trade using the service
      const response = await initiateTrade(ticket._id, recipientEmail, password);

      if (response.success) {
        toast.success(response.message || 'Trade initiated successfully!');
        onTradeComplete(response.data); // Pass updated ticket data if available
        onClose();
      } else {
        // Handle specific error messages from backend
        setError(response.message || 'Failed to initiate trade');
        toast.error(response.message || 'Failed to initiate trade');
      }
    } catch (err) {
      // Handle network errors or other unexpected errors
      const errorMessage = err.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Trade initiation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FaExchangeAlt className="text-blue-600 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">Trade Ticket</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Ticket Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              {ticket.eventId?.title || 'Event Title Missing'}
            </h3>
            <div className="text-sm text-gray-600">
              <p>Ticket Type: {ticket.ticketType?.type || 'Type Missing'}</p>
              <p>Price: ${ticket.ticketType?.price?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>

          {/* Trade Form */}
          <div className="space-y-4">
            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => { setRecipientEmail(e.target.value); setError(''); }}
                  placeholder="Enter recipient's email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password Confirmation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Your Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Trade Information */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-2">Important Information:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>The recipient will have 24 hours to accept the trade.</li>
                <li>They will need to pay the ticket price to complete the trade.</li>
                <li>You can cancel the trade before it's accepted.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors rounded-md border"
          >
            Cancel
          </button>
          <button
            onClick={handleTrade}
            disabled={loading || !recipientEmail || !password}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2
              ${(loading || !recipientEmail || !password)
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700 transition-colors'
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaExchangeAlt />
                Initiate Trade
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeTicketModal;
