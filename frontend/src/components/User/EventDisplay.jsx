import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../services/eventService";
import { FaCalendarAlt } from "react-icons/fa";
import EventCard from "./EventCard";
import SearchBar from "../SearchBar";

const EventDisplay = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="p-6">
      {/* Container for both search and events with consistent max-width */}
      <div className="max-w-7xl mx-auto"> {/* Added wrapper div */}
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
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
    </div>
  );
};



export default EventDisplay;
