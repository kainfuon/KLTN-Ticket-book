import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const HotEventsBanner = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === events.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  if (!events || events.length === 0) return null;

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl">
      {/* Single visible slide */}
      <div className="relative h-full">
        <img
          src={`http://localhost:4001/images/${events[currentIndex].image}`}
          alt={events[currentIndex].title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/1200x500?text=No+Image';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg">
              {/* Event Status */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  events[currentIndex].status === 'ongoing'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {events[currentIndex].status === 'ongoing' ? 'Ongoing' : 'Ended'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl font-bold text-white mb-4">
                {events[currentIndex].title}
              </h2>

              {/* Description */}
              <p className="text-gray-200 mb-6 line-clamp-3">
                {events[currentIndex].description}
              </p>

              {/* Event Details */}
              <div className="flex flex-col gap-3 mb-8 text-gray-200">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>
                    {new Date(events[currentIndex].eventDate).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{events[currentIndex].venue}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleViewDetails(events[currentIndex]._id)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-blue-500 w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Side Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex(prev => prev === 0 ? events.length - 1 : prev - 1);
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all"
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex(prev => prev === events.length - 1 ? 0 : prev + 1);
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all"
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
};

export default HotEventsBanner;
