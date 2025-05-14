import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../services/eventService";
import { FaCalendarAlt } from "react-icons/fa";
import EventCard from "./EventCard";
import SearchBar from "../SearchBar"; // Giả sử bạn có component này

const EventDisplay = () => {
  const [allFetchedEvents, setAllFetchedEvents] = useState([]); // Lưu tất cả sự kiện đã fetch
  const [displayableEvents, setDisplayableEvents] = useState([]); // Sự kiện có saleStartDate >= now
  const [filteredEvents, setFilteredEvents] = useState([]); // Sự kiện sau khi áp dụng search/category filter
  const [loading, setLoading] = useState(true);
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
      const response = await getAllEvents(); // response nên là một mảng các sự kiện

      const now = new Date(); // Thời điểm hiện tại

      const formattedEvents = Array.isArray(response) ? response.map(event => ({
        _id: event._id || '',
        title: event.title || 'Untitled Event',
        description: event.description || '',
        image: event.image || '',
        status: event.status || 'ongoing', // 'ongoing', 'completed', 'upcoming'
        eventDate: event.eventDate ? new Date(event.eventDate) : new Date(), // Chuyển thành Date object
        saleStartDate: event.saleStartDate ? new Date(event.saleStartDate) : null, // QUAN TRỌNG: Lấy và chuyển thành Date object
        venue: event.venue || 'No venue specified',
        category: event.category || ''
        // Thêm các trường khác nếu cần
      })) : [];

      setAllFetchedEvents(formattedEvents); // Lưu tất cả sự kiện đã format

      // Lọc ban đầu: chỉ những sự kiện có saleStartDate >= now HOẶC không có saleStartDate (luôn hiển thị)
      // Hoặc bạn có thể quyết định chỉ hiển thị nếu saleStartDate tồn tại VÀ >= now
      const initialDisplayableEvents = formattedEvents.filter(event => {
        if (event.saleStartDate) {
          return event.saleStartDate <= now;
        }
        return true; // Nếu không có saleStartDate, mặc định hiển thị (hoặc thay đổi logic này)
      });

      setDisplayableEvents(initialDisplayableEvents);
      setFilteredEvents(initialDisplayableEvents); // Ban đầu, filteredEvents giống displayableEvents

    } catch (error) {
      console.error("Error fetching events:", error);
      setAllFetchedEvents([]);
      setDisplayableEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Separate handlers for search and filter
  const handleSearch = (term) => {
    const searchTermValue = String(term || '');
    setSearchTerm(searchTermValue);
    applyFilters(searchTermValue, selectedCategory);
    setCurrentPage(1);
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    applyFilters(searchTerm, category);
    setCurrentPage(1);
  };

  // Combined filter function - SẼ HOẠT ĐỘNG TRÊN displayableEvents
  const applyFilters = (term, category) => {
    let filtered = [...displayableEvents]; // Bắt đầu với danh sách sự kiện đã lọc theo saleStartDate

    // Apply category filter if selected
    if (category) {
      filtered = filtered.filter(event => event.category === category);
    }

    // Apply search term if exists
    const searchTermValue = String(term || '').toLowerCase();
    if (searchTermValue) {
      filtered = filtered.filter(event =>
        (event.title?.toLowerCase() || '').includes(searchTermValue) ||
        (event.description?.toLowerCase() || '').includes(searchTermValue)
      );
    }
    setFilteredEvents(filtered);
  };

  // Calculate pagination based on filteredEvents
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-6">
        {/* Thêm spinner hoặc UI loading đẹp hơn */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-lg">Loading Events...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          totalEvents={filteredEvents.length} // Hiển thị số lượng sự kiện sau khi filter
        />

        {/* Filter Summary */}
        {(selectedCategory || searchTerm) && (
          <div className="my-6 p-4 bg-blue-50 rounded-lg shadow flex items-center flex-wrap gap-3">
            <span className="font-medium text-gray-700">Active Filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-200 text-blue-800 text-sm">
                Category: {selectedCategory}
                <button
                  onClick={() => handleFilter('')}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                  title="Clear category filter"
                >
                  &times;
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm">
                Search: "{searchTerm}"
                <button
                  onClick={() => handleSearch('')}
                  className="ml-2 text-green-600 hover:text-green-800 font-bold"
                  title="Clear search term"
                >
                  &times;
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchTerm('');
                // Khi clear all, setFilteredEvents lại bằng displayableEvents (đã lọc theo saleStartDate)
                setFilteredEvents(displayableEvents);
                setCurrentPage(1);
              }}
              className="text-sm text-gray-600 hover:text-red-600 underline transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {currentEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {currentEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                />
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <FaCalendarAlt className="mx-auto text-5xl text-gray-400 mb-6" />
            <h3 className="text-xl font-semibold text-gray-700">No Events Match Your Criteria</h3>
            <p className="text-gray-500 mt-3">
              Try adjusting your search or filters, or check back later for new events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDisplay;
