import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../services/eventService";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";

const EventList = () => {
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
      <div className="grow p-8">
          {/* Header Section - Increased size */}
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
              <div className="bg-white rounded-lg shadow-md">
                  <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                      Event Name
                                  </th>
                                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                      Date
                                  </th>
                                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                      Venue
                                  </th>
                                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                      Status
                                  </th>
                                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                      Actions
                                  </th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {events.map((event) => (
                                  <tr key={event._id} className="hover:bg-gray-50">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                              <div className="flex-shrink-0 h-12 w-12"> {/* Increased image size */}
                                                  <img 
                                                      className="h-12 w-12 rounded-full object-cover"
                                                      src={`http://localhost:4001/images/${event.image}`}
                                                      alt=""
                                                      onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = 'https://via.placeholder.com/48';
                                                      }}
                                                  />
                                              </div>
                                              <div className="ml-4">
                                                  <div className="text-lg font-medium text-gray-900"> {/* Increased text size */}
                                                      {event.title}
                                                  </div>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500"> {/* Increased text size */}
                                          {new Date(event.eventDate).toLocaleDateString('vi-VN')}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500"> {/* Increased text size */}
                                          {event.venue}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                          <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${  /* Increased badge size */
                                              event.status === 'ongoing' 
                                                  ? 'bg-green-100 text-green-800' 
                                                  : 'bg-red-100 text-red-800'
                                          }`}>
                                              {event.status === 'ongoing' ? 'Ongoing' : 'Ended'}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium"> {/* Increased text size */}
                                      <button
                                          onClick={() => navigate(`/admin/events/${event._id}`)}
                                          className="text-blue-600 hover:text-blue-900 mr-6 text-base"  // Fixed the syntax
                                      >
                                          View Details
                                      </button>

                                          
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <FaCalendarAlt className="mx-auto text-5xl text-gray-400 mb-4" /> {/* Increased icon size */}
                  <h3 className="text-xl font-medium text-gray-900">No Events Found</h3> {/* Increased text size */}
                  <p className="text-lg text-gray-500 mt-2">Get started by creating a new event.</p> {/* Increased text size */}
                  <button
                      onClick={() => navigate('/admin/events/add')}
                      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-lg" /* Increased button size */
                  >
                      Create Event
                  </button>
              </div>
          )}
      </div>
  );
};

export default EventList;
