import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { confirmTrade } from '../../services/userticketService'; // Use confirmTrade service
import { toast } from 'sonner';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaTicketAlt } from 'react-icons/fa';

const TradeConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for UI feedback
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Confirming your ticket trade...');

  // Get parameters from URL - matching your screenshot for /verify-trade
  const paymentSuccess = searchParams.get("success");
  const ticketId = searchParams.get("ticketId"); // Changed from orderId to ticketid

  useEffect(() => {
    const handleTradeConfirmation = async () => {
      if (!ticketId) {
        setStatus('error');
        setMessage('Trade information missing (Ticket ID not found in URL). Cannot confirm trade.');
        toast.error('Trade information missing: Ticket ID.');
        return;
      }

      if (paymentSuccess !== 'true') {
        setStatus('error');
        setMessage('Payment for the trade was not successful or not indicated. Please try again or contact support.');
        toast.error('Trade payment failed or was not marked as successful.');
        return;
      }

      try {
        // Call the confirmTrade service
        // The confirmTrade service in userticketService.js expects only ticketId
        const response = await confirmTrade(ticketId);

        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Ticket trade confirmed successfully! The ticket is now yours.');
          toast.success(response.message || 'Trade confirmed!');
        } else {
          setStatus('error');
          setMessage(response.message || 'Failed to confirm trade. The ticket might have already been processed or is no longer available.');
          toast.error(response.message || 'Trade confirmation failed.');
        }
      } catch (error) {
        console.error('Error confirming trade:', error);
        setStatus('error');
        let errorMessage = 'An unexpected error occurred during trade confirmation.';
        if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        if (error.response?.status === 401) {
            errorMessage = 'Authentication error. Please ensure you are logged in.';
            // Optionally navigate to login: navigate('/login');
        }
        
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    handleTradeConfirmation();
  }, [paymentSuccess, ticketId, navigate]); // Dependencies for useEffect

  const renderIcon = () => {
    if (status === 'processing') {
      return <FaSpinner className="animate-spin text-blue-500 text-5xl mb-4" />;
    }
    if (status === 'success') {
      return <FaCheckCircle className="text-green-500 text-5xl mb-4" />;
    }
    if (status === 'error') {
      return <FaTimesCircle className="text-red-500 text-5xl mb-4" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
        {renderIcon()}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {status === 'processing' && 'Processing Trade Confirmation'}
          {status === 'success' && 'Trade Confirmed!'}
          {status === 'error' && 'Trade Confirmation Issue'}
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {status !== 'processing' && (
          <Link
            to="/user/tickets" // Redirect to user's tickets page
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaTicketAlt className="mr-2" />
            View My Tickets
          </Link>
        )}
         {status === 'error' && (
            <button
                onClick={() => navigate('/')} // Or to a relevant page like event listing
                className="mt-4 ml-0 sm:ml-4 sm:mt-0 inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
                Go to Homepage
            </button>
        )}
      </div>
    </div>
  );
};

export default TradeConfirmationPage;
