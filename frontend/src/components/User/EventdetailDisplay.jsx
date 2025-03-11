import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMinus, FaPlus, FaRegCalendar, FaMapMarkerAlt  } from 'react-icons/fa';
import { getEventById } from '../../services/eventService';
import { getTicketsByEvent } from '../../services/ticketService';
import { createOrder } from '../../services/orderService';

const EventdetailDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTickets, setSelectedTickets] = useState({});

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      // Get event details
      const eventResponse = await getEventById(id);
      if (eventResponse.data) {
        setEvent(eventResponse.data);
      } else {
        setError('Failed to load event');
        return;
      }
      // Get tickets
      const ticketsResponse = await getTicketsByEvent(id);
      setTickets(ticketsResponse || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (ticketId, change) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + change)
    }));
  };

  const calculateTotal = () => {
    return tickets.reduce((total, ticket) => {
      return total + (selectedTickets[ticket._id] || 0) * ticket.price;
    }, 0);
  };

  const handleBooking = async () => {
    try {
      const orderData = {
        eventId: id,
        tickets: Object.entries(selectedTickets).map(([ticketId, quantity]) => ({
          ticketId,
          quantity
        }))
      };
      
      await createOrder(orderData);
      navigate('/user/tickets', { 
        state: { success: true, message: 'Booking successful!' }
      });
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to create booking');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!event) return <div className="p-6">Event not found</div>;

  return (
    <div className="grow p-8 relative">
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-blue-600 hover:text-blue-800 text-lg"
        >
          <FaArrowLeft className="mr-2" />
          Back to Events
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Event Image */}
        <div className="w-full">
          {event.image ? (
            <img
              src={`http://localhost:4001/images/${event.image}`}
              alt={event.title}
              className="w-full h-[300px] object-cover rounded-lg shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>

        {/* Event Information Box */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h2 className="text-xl font-bold mb-3">{event.title}</h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <FaRegCalendar className="mr-2" />
              <span>
                {event.eventDate ? 
                  `${event.time || '18:30-21:00'}, ${new Date(event.eventDate).toLocaleDateString('vi-VN')}` : 
                  'Not set'
                }
              </span>
            </div>
            <div className="flex items-start text-gray-700">
              <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
              <span>{event.venue || 'No venue specified'}</span>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Chi tiết:
          </h3>
          <p className="text-gray-600 whitespace-pre-line">
            {event.description || 'No description available'}
          </p>
        </div>

        {/* Ticket Booking Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Hạng vé</h3>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} 
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
              >
                <div>
                  <h4 className="font-medium">{ticket.type}</h4>
                  <p className="text-gray-600">{ticket.price.toLocaleString()}$</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(ticket._id, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                    disabled={!selectedTickets[ticket._id]}
                  >
                    <FaMinus className="text-gray-600" />
                  </button>
                  <span className="w-8 text-center">
                    {selectedTickets[ticket._id] || 0}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(ticket._id, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FaPlus className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))}

            {/* Total and Book Button */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Tổng:</span>
                <span>{calculateTotal().toLocaleString()}đ</span>
              </div>
              <button
                onClick={handleBooking}
                disabled={calculateTotal() === 0}
                className={`w-full py-3 rounded-lg transition-colors ${
                  calculateTotal() === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventdetailDisplay;
