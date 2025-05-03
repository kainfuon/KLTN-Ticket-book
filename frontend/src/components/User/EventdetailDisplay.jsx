import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMinus, FaPlus, FaRegCalendar, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { getEventById } from '../../services/eventService';
import { getTicketsByEvent } from '../../services/ticketService';
import { toast } from 'sonner';
import OrderModal from './OrderModal';

const EventdetailDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTickets, setSelectedTickets] = useState({});
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [ticketAvailability, setTicketAvailability] = useState({});

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
      if (ticketsResponse) {
        setTickets(ticketsResponse);
        // Check ticket availability
        const availability = {};
        ticketsResponse.forEach(ticket => {
          availability[ticket._id] = ticket.availableSeats > 0;
        });
        setTicketAvailability(availability);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (ticketId, change) => {
    if (!showOrderModal) {
      const ticket = tickets.find(t => t._id === ticketId);
      const currentQuantity = selectedTickets[ticketId] || 0;
      
      // Check if increasing quantity is possible
      if (change > 0) {
        if (currentQuantity >= ticket.availableSeats) {
          toast.error('No more tickets available');
          return;
        }
      }
      
      setSelectedTickets(prev => ({
        ...prev,
        [ticketId]: Math.max(0, Math.min((prev[ticketId] || 0) + change, ticket.availableSeats))
      }));
    }
  };

  const calculateTotal = () => {
    return tickets.reduce((total, ticket) => {
      return total + (selectedTickets[ticket._id] || 0) * ticket.price;
    }, 0);
  };

  const handleContinue = () => {
    if (event?.status === 'completed') {
      toast.error('This event has ended');
      return;
    }
    
    const hasSelectedTickets = Object.values(selectedTickets).some(quantity => quantity > 0);
    if (!hasSelectedTickets) {
      toast.error('Please select at least one ticket');
      return;
    }

    setShowOrderModal(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <div className="text-red-500 text-lg">{error}</div>
      <button
        onClick={() => navigate('/home')}
        className="mt-4 text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
      >
        <FaArrowLeft /> Return to Home
      </button>
    </div>
  );

  if (!event) return <div className="p-8 text-center text-gray-500">Event not found</div>;

  return (
    <div className="max-w-7xl pt-20 mx-auto px-4 py-8">
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 text-base bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>
        {/* Event Status */}
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
          event?.status === 'ongoing'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {event?.status === 'ongoing' ? 'Ongoing' : 'Completed'}
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Image and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Image */}
          <div className="relative rounded-xl overflow-hidden bg-gray-100">
            {event?.image ? (
              <img
                src={`http://localhost:4001/images/${event.image}`}
                alt={event.title}
                className="w-full h-[400px] object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
          </div>

          {/* Event Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">{event?.title}</h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                  <FaRegCalendar className="mr-2 text-blue-500" />
                  <span>
                    {event?.eventDate
                      ? `${event.time || '18:30-21:00'}, ${new Date(event.eventDate).toLocaleDateString('vi-VN')}`
                      : 'Date not set'}
                  </span>
                </div>
                <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  <span>{event?.venue || 'No venue specified'}</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {event?.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Ticket Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <FaTicketAlt className="text-blue-500" />
              <h2 className="text-xl font-semibold">Select Tickets</h2>
            </div>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                (!showOrderModal || selectedTickets[ticket._id]) && (
                  <div
                    key={ticket._id}
                    className="p-4 border rounded-lg hover:border-blue-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{ticket.type}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-blue-600">
                            ${ticket.price.toLocaleString()}
                          </p>
                          {ticket.availableSeats === 0 && (
                            <span className="text-sm text-red-500 font-medium">
                              • Sold out
                            </span>
                          )}
                        </div>
                      </div>
                      {!showOrderModal && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(ticket._id, -1)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              selectedTickets[ticket._id]
                                ? 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!selectedTickets[ticket._id]}
                            title="Decrease quantity"
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {selectedTickets[ticket._id] || 0}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(ticket._id, 1)}
                            disabled={
                              event?.status === 'completed' || 
                              ticket.availableSeats === 0 || 
                              (selectedTickets[ticket._id] || 0) >= ticket.availableSeats
                            }
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              event?.status === 'completed' || ticket.availableSeats === 0 || 
                              (selectedTickets[ticket._id] || 0) >= ticket.availableSeats
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                            }`}
                            title={
                              event?.status === 'completed'
                                ? 'Event has completed'
                                : ticket.availableSeats === 0
                                ? 'Sold out'
                                : (selectedTickets[ticket._id] || 0) >= ticket.availableSeats
                                ? 'Maximum tickets selected'
                                : 'Add ticket'
                            }
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>
                      )}
                    </div>
                    {event?.status === 'completed' && (
                      <p className="text-sm text-red-500 mt-2">
                        This event has completed. Tickets are no longer available.
                      </p>
                    )}
                  </div>
                )
              ))}

              {/* Total and Continue Button */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center py-4 border-t">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${calculateTotal().toLocaleString()}
                  </span>
                </div>
                {!showOrderModal && (
                  <button
                    onClick={handleContinue}
                    disabled={calculateTotal() === 0 || event?.status === 'completed'}
                    className={`w-full py-3 rounded-lg text-lg font-medium transition-all ${
                      calculateTotal() === 0 || event?.status === 'completed'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-0.5'
                    }`}
                  >
                    {event?.status === 'completed' ? 'Event Has Completed' : 'Continue to Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        event={event}
        selectedTickets={selectedTickets}
        tickets={tickets}
        total={calculateTotal()}
      />
    </div>
  );
};

export default EventdetailDisplay;
