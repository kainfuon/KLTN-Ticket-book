import React, { useState } from 'react';
import { FaTimes, FaExchangeAlt, FaInfoCircle, FaLock } from 'react-icons/fa';
import { tradeTicket } from '../../services/userticketService';
import { format } from 'date-fns';

const TradeTicketModal = ({ ticket, onClose, onTradeComplete }) => {
  const [formData, setFormData] = useState({
    recipientId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.recipientId.trim()) {
      setError('Recipient ID is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.recipientId.trim() === ticket.ownerId) {
      setError('Cannot trade ticket to yourself');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await tradeTicket(ticket._id, formData);
      if (result.success) {
        onTradeComplete();
        onClose();
      } else {
        setError(result.message);
        setConfirmStep(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to trade ticket');
      setConfirmStep(false);
    } finally {
      setLoading(false);
    }
  };

  const renderTicketDetails = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">
            {ticket.eventId.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {format(new Date(ticket.eventId.eventDate), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-gray-600">
            Ticket Type
          </span>
          <p className="text-sm font-semibold text-gray-800">
            {ticket.ticketType.type}
          </p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Venue:</span>
          <span className="text-gray-800">{ticket.eventId.venue}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Time:</span>
          <span className="text-gray-800">
            {format(new Date(ticket.eventId.eventDate), 'HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6">
      <h4 className="font-semibold text-yellow-800 flex items-center">
        <FaInfoCircle className="mr-2" />
        Confirm Trade Details
      </h4>
      <div className="mt-3 space-y-2 text-sm text-yellow-700">
        <p>• Recipient ID: {formData.recipientId}</p>
        <p>• Event: {ticket.eventId.title}</p>
        <p>• Ticket Type: {ticket.ticketType.type}</p>
        <p className="font-medium mt-3">
          This action cannot be undone. Please confirm your password to proceed.
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        {/* Modal Header */}
        <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <FaExchangeAlt className="mr-2" />
            <h2 className="text-xl font-semibold">Trade Ticket</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-start">
              <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {confirmStep ? renderConfirmationStep() : renderTicketDetails()}

          {/* Trade Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient ID *
              </label>
              <input
                type="text"
                name="recipientId"
                value={formData.recipientId}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter the recipient's user ID"
                disabled={confirmStep}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  required
                  placeholder="Enter your password to confirm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FaLock />
                </button>
              </div>
            </div>

            {!confirmStep && (
              <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="flex items-start">
                  <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
                  This action will permanently transfer the ticket to the recipient.
                  Make sure you have entered the correct recipient ID.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                if (confirmStep) {
                  setConfirmStep(false);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {confirmStep ? 'Back' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg flex items-center ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : confirmStep 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Processing...
                </>
              ) : confirmStep ? (
                'Confirm Trade'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeTicketModal;
