import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaTicketAlt, FaQrcode, FaInfoCircle, FaSync } from 'react-icons/fa';
import { generateTicketQR } from '../../services/userticketService';
import { format } from 'date-fns';

const TicketDetailModal = ({ ticket, onClose }) => {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQRCode = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setRefreshing(true);
      const result = await generateTicketQR(ticket._id);
      if (result.success) {
        setQrCode(result.qrCode);
        setTimeLeft(30); // Reset timer
      } else {
        setError(result.message || 'Failed to generate QR code');
      }
    } catch (err) {
      setError(err.message || 'Error generating QR code');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ticket._id]);

  // Initial QR code generation
  useEffect(() => {
    if (ticket?._id) {
      fetchQRCode();
    }
  }, [ticket?._id, fetchQRCode]);

  // Timer for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          fetchQRCode(); // Fetch new QR code when timer reaches 0
          return 30; // Reset timer
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchQRCode]);

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
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Ticket ID:</span>
          <span className="text-gray-800">{ticket._id}</span>
        </div>
      </div>
    </div>
  );

  const renderQRCode = () => (
    <div className="flex flex-col items-center justify-center mb-6">
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 p-4 text-center flex items-center">
          <FaInfoCircle className="mr-2" />
          {error}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="relative">
            <img 
              src={qrCode} 
              alt="Ticket QR Code"
              className="w-48 h-48 object-contain mx-auto"
            />
            {refreshing && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <FaSync className="animate-spin text-blue-600 text-xl" />
              </div>
            )}
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <FaQrcode className="mr-2" />
              Scan this QR code at the event entrance
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-gray-600">
                Refreshing in {timeLeft}s
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        {/* Modal Header */}
        <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <FaTicketAlt className="mr-2" />
            <h2 className="text-xl font-semibold">Ticket Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {renderTicketDetails()}
          {renderQRCode()}

          {/* Additional Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 flex items-start">
              <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
              This QR code refreshes every 30 seconds for security. Please ensure you're showing the latest code at the entrance.
            </p>
          </div>

          {/* Manual Refresh Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={fetchQRCode}
              disabled={loading || refreshing}
              className={`text-sm px-4 py-2 rounded-lg flex items-center space-x-2 
                ${loading || refreshing 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              <FaSync className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh QR Code</span>
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
