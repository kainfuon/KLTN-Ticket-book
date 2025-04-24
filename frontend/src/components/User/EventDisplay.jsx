import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../services/eventService";
import { FaCalendarAlt } from "react-icons/fa";
import EventCard from "./EventCard";
import SearchBar from "../SearchBar";

const EventDisplay = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const eventsPerPage = 9;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      
      const formattedEvents = Array.isArray(response) ? response.map(event => ({
        _id: event._id || '',
        title: event.title || 'Untitled Event',
        description: event.description || '',
        image: event.image || '',
        status: event.status || 'ongoing',
        eventDate: event.eventDate || new Date(),
        venue: event.venue || 'No venue specified',
        category: event.category || ''
      })) : [];

      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Separate handlers for search and filter
  const handleSearch = (term) => {
    // Ensure term is a string
    const searchTerm = String(term || '');
    setSearchTerm(searchTerm);
    applyFilters(searchTerm, selectedCategory);
    setCurrentPage(1);
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    applyFilters(searchTerm, category);
    setCurrentPage(1);
  };

  // Combined filter function
  
  const applyFilters = (term, category) => {
    let filtered = [...events];

    // Apply category filter if selected
    if (category) {
      filtered = filtered.filter(event => event.category === category);
    }

    // Apply search term if exists (ensure term is a string)
    const searchTerm = String(term || '').toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredEvents(filtered);
  };

  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <SearchBar 
          onSearch={handleSearch}
          onFilter={handleFilter}
          totalEvents={filteredEvents.length}
        />

        {/* Filter Summary */}
        {(selectedCategory || searchTerm) && (
          <div className="mb-4 flex items-center gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                Category: {selectedCategory}
                <button
                  onClick={() => handleFilter('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                Search: {searchTerm}
                <button
                  onClick={() => handleSearch('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {(selectedCategory || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchTerm('');
                  setFilteredEvents(events);
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {currentEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentEvents.map((event) => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Events Found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters to find events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDisplay;
