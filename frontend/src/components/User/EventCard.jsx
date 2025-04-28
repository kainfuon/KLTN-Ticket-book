import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  // Ensure all required properties exist with proper type checking
  if (!event || typeof event !== 'object') {
    return null;
  }

  const {
    _id,
    title,
    image,
    status,
    eventDate,
    venue,
    description
  } = event;

  // Format the date properly
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false,
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Event Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={image ? `http://localhost:4001/images/${image}` : 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={title || 'Event'}
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
            {title || 'Untitled Event'}
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            status === 'ongoing'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {status === 'ongoing' ? 'Ongoing' : 'Ended'}
          </span>
        </div>

        {/* Event Description - Always 2 lines */}
        <div className="h-[40px] mb-2"> {/* Fixed height for 2 lines */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {description || 'No description available'}
          </p>
        </div>

        {/* Event Details */}
        <div className="flex justify-between items-end">
          <div className="text-gray-500">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="mr-1" />
              <span>{formatDate(eventDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="mr-1" />
              <span className="line-clamp-1">{venue || 'No venue specified'}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/events/${_id}`)}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
