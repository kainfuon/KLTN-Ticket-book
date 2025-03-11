import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../services/eventService";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt , FaCalendarAlt } from "react-icons/fa";

const EventDisplay = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await getAllEvents();
            setEvents(response || []);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            

            {events.length > 0 ? (
                /* Events Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div 
                            key={event._id} 
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Event Image */}
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={`http://localhost:4001/images/${event.image}`}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                                    }}
                                />
                            </div>

                            {/* Event Content */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        event.status === 'ongoing' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {event.status === 'ongoing' ? 'Ongoing' : 'Ended'}
                                    </span>
                                </div>

                                {/* Event Details */}
                                <div className="flex justify-between items-end mt-2">
                                    {/* Event Date & Venue (căn trái) */}
                                    <div className="text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="mr-1" />
                                            <span>
                                                {new Date(event.eventDate).toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour12: false, // Đảm bảo hiển thị 24h thay vì AM/PM
                                                })}
                                            </span>

                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt  className="mr-1" /> {event.venue}
                                        </div>
                                    </div>

                                    {/* Action Button (căn phải, nằm dưới) */}
                                    <button
                                        onClick={() => navigate(`/events/${event._id}`)}
                                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 cursor-pointer"
                                    >
                                        View Details
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Events Found</h3>
                    <p className="text-gray-500 mt-2">Get started by creating a new event.</p>
                    
                </div>
            )}
        </div>
    );
};

export default EventDisplay;
