import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingTrades, acceptTrade, cancelTrade } from '../../services/userticketService';
import { format } from 'date-fns';
import { FaTicketAlt, FaRegCalendarAlt, FaMapMarkerAlt, FaUserClock, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';

const PendingTradesPage = () => {
  const [pendingTrades, setPendingTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // To track loading state for specific ticket actions
  const navigate = useNavigate();

  const fetchPendingTradesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPendingTrades();
      if (response.success) {
        setPendingTrades(response.data || []);
      } else {
        setError(response.message || 'Failed to load pending trades.');
        setPendingTrades([]);
      }
    } catch (err) {
      console.error('Error fetching pending trades:', err);
      if (err.message.includes('login')) { // Or check for specific status code
        toast.error('Your session has expired. Please login again.');
        navigate('/login', { state: { from: '/user/pending-trades' } });
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
      setPendingTrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTradesData();
  }, []);

  const handleAccept = async (ticketId) => {
    setActionLoading(ticketId);
    try {
      const response = await acceptTrade(ticketId);
      if (response.success && response.sessionUrl) {
        toast.info('Redirecting to payment...');
        window.location.href = response.sessionUrl; // Redirect to Stripe
      } else {
        toast.error(response.message || 'Failed to initiate payment.');
      }
    } catch (err) {
      toast.error(err.message || 'Error accepting trade.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (ticketId) => {
    if (window.confirm('Are you sure you want to decline this trade offer?')) {
      setActionLoading(ticketId);
      try {
        const response = await cancelTrade(ticketId);
        if (response.success) {
          toast.success(response.message || 'Trade declined successfully.');
          fetchPendingTradesData(); // Refresh the list
        } else {
          toast.error(response.message || 'Failed to decline trade.');
        }
      } catch (err) {
        toast.error(err.message || 'Error declining trade.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Loading Pending Trades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md shadow-md">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Trades</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPendingTradesData}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (pendingTrades.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6">
        <div className="text-center p-8">
          <FaUserClock className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Trades</h3>
          <p className="text-gray-600">You currently have no incoming ticket trade offers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Vé đang chờ</h1>
      {pendingTrades.map((trade) => {
        const event = trade.eventId;
        const ticketType = trade.ticketType;
        const tradeDeadline = new Date(new Date(trade.pendingTradeCreatedAt).getTime() + 24 * 60 * 60 * 1000); // 24 hours from creation
        const isExpired = tradeDeadline < new Date();

        return (
          <div
            key={trade._id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden border ${isExpired ? 'border-red-300 opacity-70' : 'border-gray-200'}`}
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-blue-700 mb-1">{event.title}</h2>
                  
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isExpired ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {isExpired ? 'Expired' : 'Pending Confirmation'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-700">
                <div className="flex items-center">
                  <FaRegCalendarAlt className="mr-2 text-blue-500" />
                  <span>{format(new Date(event.eventDate), 'EEE, MMM dd, yyyy \'at\' HH:mm')}</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center">
                  <FaTicketAlt className="mr-2 text-blue-500" />
                  <span className="font-semibold">{ticketType.type}: ${ticketType.price.toLocaleString()}</span>
                </div>
                {!isExpired && (
                  <div className="flex items-center text-sm text-red-600">
                    <FaUserClock className="mr-2" />
                    <span>Thời hạn: {format(tradeDeadline, 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
              Vé này đã được gửi cho bạn. Bạn cần chấp nhận và hoàn tất thanh toán để nhận vé.
              </p>

              {!isExpired && (
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleCancel(trade._id)}
                    disabled={actionLoading === trade._id}
                    className="px-6 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {actionLoading === trade._id && trade._id === actionLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaTimesCircle className="mr-2" />}
                    Decline Offer
                  </button>
                  <button
                    onClick={() => handleAccept(trade._id)}
                    disabled={actionLoading === trade._id}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {actionLoading === trade._id && trade._id === actionLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
                    Accept & Pay
                  </button>
                </div>
              )}
              {isExpired && (
                <p className="text-center text-red-600 font-medium pt-4 border-t border-gray-200">This trade offer has expired.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PendingTradesPage;
