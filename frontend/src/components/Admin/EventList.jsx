import React, { useEffect, useState } from "react";
import { getAllEvents, deleteEvent } from "../../services/eventService";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaCalendarAlt, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { toast } from 'sonner';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Same as EventSales
  const navigate = useNavigate();

  
  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = events.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  // Calculate empty rows needed
  const emptyRows = itemsPerPage - currentItems.length;
  const emptyRowsArray = Array(emptyRows).fill(null);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const FallbackImage = () => (
        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-200">
        <FaImage className="h-6 w-6 text-gray-400" />
        </div>
    );

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
            toast.error("Failed to fetch events");
        } finally {
            setLoading(false);
        }
    };

  // Helper function to check if event is completed
  const isEventCompleted = (event) => {
    const eventDate = new Date(event.eventDate);
    return eventDate < new Date();
  };

  const handleEdit = (eventId) => {
    navigate(`/admin/events/edit/${eventId}`);
  };

  const handleDelete = async (event) => {
    if (!isEventCompleted(event)) {
      toast.error("Cannot delete event that hasn't completed yet");
      return;
    }

    // Check if event has any sold tickets
    if (event.tickets?.some(ticket => ticket.totalSeats - ticket.availableSeats > 0)) {
      toast.error("Cannot delete event that has sold tickets");
      return;
    }

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await deleteEvent(event._id);
        if (response.success) {
          toast.success('Event deleted successfully');
          fetchEvents();
        } else {
          toast.error(response.message || 'Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="grow p-8 relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Events Management</h2>
          <p className="text-lg text-gray-600 mt-1">Manage your events and tickets</p>
        </div>
        <button
          onClick={() => navigate('/admin/events/add')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer text-lg"
        >
          <FaPlus className="text-lg" />
          <span>Add Event</span>
        </button>
      </div>

      {events.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-6">Event List</h3>
          <div className="min-h-[400px] flex flex-col">
            <div className="flex-grow overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[35%]">
                      EVENT NAME
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[15%]">
                      DATE
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[20%]">
                      VENUE
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[15%]">
                      STATUS
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[15%]">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((event) => {
                    const completed = isEventCompleted(event);
                    return (
                      <tr key={event._id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {event.image ? (
                                <img
                                  className="h-12 w-12 rounded-full object-cover"
                                  src={`http://localhost:4001/images/${event.image}`}
                                  alt={event.title}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.appendChild(FallbackImage());
                                  }}
                                />
                              ) : (
                                <FallbackImage />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-base font-medium text-gray-900">
                                {event.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-base text-gray-500">
                          {new Date(event.eventDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-4 px-4 text-base text-gray-500">
                          {event.venue}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1.5 inline-flex text-sm font-semibold rounded-full ${
                            event.status === 'ongoing'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {event.status === 'ongoing' ? 'Ongoing' : 'Ended'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => navigate(`/admin/events/${event._id}`)}
                              className="text-blue-600 hover:text-blue-900 text-base"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleEdit(event._id)}
                              className="text-green-600 hover:text-green-800"
                              title="Edit event"
                            >
                              <FaEdit size={18} />
                            </button>
                            {completed ? (
                              <button
                                onClick={() => handleDelete(event)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete event"
                              >
                                <FaTrash size={18} />
                              </button>
                            ) : (
                              <span
                                className="text-gray-400 cursor-not-allowed"
                                title="Can only delete completed events"
                              >
                                <FaTrash size={18} />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Empty rows to maintain height */}
                  {emptyRows > 0 && emptyRowsArray.map((_, index) => (
                    <tr key={`empty-${index}`} className="border-b border-gray-100 h-[72px]">
                      <td colSpan="5" className="px-4">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, events.length)} of {events.length} entries
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaCalendarAlt className="mx-auto text-5xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No Events Found</h3>
          <p className="text-lg text-gray-500 mt-2">Get started by creating a new event.</p>
          <button
            onClick={() => navigate('/admin/events/add')}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-lg"
          >
            Create Event
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;
