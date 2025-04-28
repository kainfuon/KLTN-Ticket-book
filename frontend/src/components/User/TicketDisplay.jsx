import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTickets } from '../../services/userticketService';
import { format } from 'date-fns';
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt, FaEye, FaExchangeAlt, FaClock } from 'react-icons/fa';
import TicketDetailModal from './TicketDetailModal';
import TradeTicketModal from './TradeTicketModal';

const TicketDisplay = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const response = await getUserTickets();
      // Assuming the response data is populated with eventId and ticketType references
      setTickets(response.data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      if (err.message === 'Please login again') {
        navigate('/login', { 
          state: { 
            from: '/user/tickets',
            message: 'Please login to view your tickets' 
          }
        });
      } else {
        setError(err.message || 'Failed to load tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={fetchUserTickets}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8">
          <FaTicketAlt className="mx-auto text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Tickets Found</h3>
          <p className="text-gray-600 mb-4">You haven't purchased any tickets yet.</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid gap-6">
        {tickets.map((ticket) => {
          const eventDate = new Date(ticket.eventId.eventDate);
          const isPastEvent = eventDate < new Date();

          return (
            <div
              key={ticket._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="grid md:grid-cols-12 divide-x divide-gray-100">
                {/* Date Column */}
                <div className="md:col-span-2 p-6 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800">
                      {format(eventDate, 'dd')}
                    </div>
                    <div className="text-sm font-medium text-gray-500 uppercase">
                      {format(eventDate, 'MMM yyyy')}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
                      <FaClock className="mr-1" />
                      {format(eventDate, 'HH:mm')}
                    </div>
                  </div>
                </div>

                {/* Event Details Column */}
                <div className="md:col-span-7 p-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-800 flex-grow">
                      {ticket.eventId.title}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                      isPastEvent 
                        ? 'bg-gray-100 text-gray-600' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {isPastEvent ? 'Past Event' : 'Upcoming'}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500 flex-shrink-0" />
                      <span className="line-clamp-1">{ticket.eventId.venue}</span>
                    </div>
                    <div className="flex items-center">
                      <FaTicketAlt className="mr-2 text-blue-500 flex-shrink-0" />
                      <span className="font-medium">{ticket.ticketType.type}</span>
                      {ticket.isTraded && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Traded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price and Actions Column */}
                <div className="md:col-span-3 p-6 bg-gray-50">
                  <div className="text-right mb-4">
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-xl font-bold text-gray-900">
                      ${ticket.ticketType.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowDetailModal(true);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </button>
                    {!ticket.isTraded && !isPastEvent && (
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowTradeModal(true);
                        }}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <FaExchangeAlt className="mr-2" />
                        Trade
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showDetailModal && selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTicket(null);
          }}
        />
      )}
      {showTradeModal && selectedTicket && (
        <TradeTicketModal
          ticket={selectedTicket}
          onClose={() => {
            setShowTradeModal(false);
            setSelectedTicket(null);
          }}
          onTradeComplete={fetchUserTickets}
        />
      )}
    </div>
  );
};

export default TicketDisplay;
