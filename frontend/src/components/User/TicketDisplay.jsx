import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserTickets } from '../../services/userticketService';
import { format } from 'date-fns';
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

const TicketDisplay = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const response = await getUserTickets();
      setTickets(response.data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      if (err.message === 'Please login again') {
        // Redirect to login page if token is invalid
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
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={fetchUserTickets}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <FaTicketAlt className="mx-auto text-gray-400 text-4xl mb-4" />
        <p className="text-gray-600">You don't have any tickets yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* Ticket Header - Date and Status */}
          <div className="bg-gray-800 text-white p-4 flex items-start">
            <div className="text-center mr-6">
              <div className="text-3xl font-bold">
                {format(new Date(ticket.eventId.eventDate), 'dd')}
              </div>
              <div className="text-sm uppercase">
                {format(new Date(ticket.eventId.eventDate), 'MMM yyyy')}
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{ticket.eventId.title}</h3>
              <div className="flex items-center text-gray-300 text-sm mt-1">
                <FaTicketAlt className="mr-2" />
                <span>{ticket.ticketType.type}</span>
                {ticket.isTraded && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 rounded-full text-xs">
                    Traded
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="p-4 space-y-3">
            {/* Time and Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <FaCalendar className="mr-2" />
                <span>
                  {format(new Date(ticket.eventId.eventDate), 'HH:mm - dd/MM/yyyy')}
                </span>
              </div>
              <div className="flex items-start text-gray-600">
                <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                <span>{ticket.eventId.venue}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold">
                {ticket.ticketType.price.toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketDisplay;
