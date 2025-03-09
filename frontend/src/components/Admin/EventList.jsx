import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../services/eventService";
import { useNavigate } from "react-router-dom";
import Card from "../Card";
import { FaCalendarAlt, FaMapMarkerAlt, FaPlus } from "react-icons/fa"; // Added FaPlus icon

const EventList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getAllEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Quản lý Sự kiện</h2>
        <button
          onClick={() => navigate('/admin/events/add')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm cursor-pointer"
        >
          <FaPlus className="text-sm" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card icon={<FaCalendarAlt />} title="Tổng sự kiện" value={events.length} />
        <Card icon={<FaMapMarkerAlt />} title="Địa điểm" value="Nhiều địa điểm" />
      </div>

      {/* Bảng danh sách sự kiện */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] md:min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Tên Sự kiện</th>
                <th className="border border-gray-300 px-4 py-2">Địa điểm</th>
                <th className="border border-gray-300 px-4 py-2">Ngày diễn ra</th>
                <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{event.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{event.venue}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        event.status === "ongoing"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {event.status === "ongoing" ? "Đang diễn ra" : "Đã kết thúc"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => navigate(`/admin/events/${event._id}/tickets`)}
                      className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition cursor-pointer"
                    >
                      Xem sự kiện
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventList;

