import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import { createTicket, getTicketsByEvent } from '../../services/ticketService';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import TicketAdd from './TicketAdd';

const EventDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [ticketForm, setTicketForm] = useState({
        type: '',
        price: '',
        totalSeats: '',
    });

    useEffect(() => {
        fetchEventData();
    }, [id]);

    const fetchEventData = async () => {
        try {
            setLoading(true);
            // Get event details
            const eventResponse = await getEventById(id);
            console.log('Event Response:', eventResponse); // For debugging
            if (eventResponse.data) {
                setEvent(eventResponse.data);
            } else {
                setError('Failed to load event');
                return;
            }
    
            // Get tickets
            const ticketsResponse = await getTicketsByEvent(id);
            setTickets(ticketsResponse || []); // Simplified as tickets data is working
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTicket({
                ...ticketForm,
                eventId: id,
            });
            setShowTicketForm(false);
            fetchEventData(); // Refresh ticket list
            setTicketForm({ type: '', price: '', totalSeats: '' });
        } catch (err) {
            setError('Failed to create ticket');
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!event) return <div className="p-6">Event not found</div>;


  return (
    <div className="grow p-8 relative">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
            <button
                onClick={() => navigate('/admin/events')}
                className="flex items-center text-blue-600 hover:text-blue-800 text-lg cursor-pointer"
            >
                <FaArrowLeft className="mr-2" />
                Back to Events
            </button>
        </div>

        {/* Event Information Card */}
        {event && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {/* Event Title and Status */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{event.title || 'No Title'}</h2>
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold
                        ${event.status === 'ongoing'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'}`}
                    >
                        {event.status === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'}
                    </span>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Image */}
                    <div className="w-full">
                        {event.image ? (
                            <img 
                                src={`http://localhost:4001/images/${event.image}`} // Changed from /uploads to /images
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


                    {/* Right Column - Event Details */}
                    <div className="space-y-4">
                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Description
                            </h3>
                            <p className="text-gray-600">
                                {event.description || 'No description available'}
                            </p>
                        </div>

                        {/* Venue */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Venue
                            </h3>
                            <p className="text-gray-600">
                                {event.venue || 'No venue specified'}
                            </p>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Event Date
                                </h3>
                                <p className="text-gray-600">
                                    {event.eventDate ?
                                        new Date(event.eventDate).toLocaleDateString('vi-VN') :
                                        'Not set'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Sale Starts
                                </h3>
                                <p className="text-gray-600">
                                    {event.saleStartDate ?
                                        new Date(event.saleStartDate).toLocaleDateString('vi-VN') :
                                        'Not set'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Tickets Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Tickets Management</h3>
                    <button
                        onClick={() => setShowTicketForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                    >
                        <FaPlus size={16} />
                        Add New Ticket
                    </button>
            </div>

            {/* Tickets Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Seats
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Available
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <tr key={ticket._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {ticket.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    ${ticket.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {ticket.totalSeats}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {ticket.availableSeats}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                                        ${ticket.status === 'available'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'}`}
                                    >
                                        {ticket.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Ticket Add Modal */}
        {showTicketForm && (
            <TicketAdd 
                eventId={id}
                onClose={() => setShowTicketForm(false)}
                onSuccess={fetchEventData}
            />
        )}
    
    </div>
  )
};

export default EventDetail

