import React, { useState } from 'react';
import { format } from 'date-fns';
import { FaDollarSign, FaTicketAlt, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import Card from '../Card';
import EventSalesChart from '../../assets/EventSalesChart';

const EventSales = ({ eventStats }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate summary statistics
  const totalRevenue = eventStats?.reduce((sum, event) => sum + event.totalRevenue, 0) || 0;
  const totalTickets = eventStats?.reduce((sum, event) => sum + event.ticketsSold, 0) || 0;
  const averageRevenue = eventStats?.length ? totalRevenue / eventStats.length : 0;

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = eventStats?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((eventStats?.length || 0) / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Create empty rows to maintain table height
  const emptyRows = itemsPerPage - (currentItems?.length || 0);
  const emptyRowsArray = Array(emptyRows).fill(null);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          icon={<FaDollarSign className="text-green-500" />}
          title="Total Revenue"
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(totalRevenue)}
        />
        <Card
          icon={<FaTicketAlt className="text-blue-500" />}
          title="Total Tickets Sold"
          value={totalTickets.toString()}
        />
        <Card
          icon={<FaCalendarAlt className="text-purple-500" />}
          title="Total Events"
          value={eventStats?.length.toString() || '0'}
        />
        <Card
          icon={<FaChartBar className="text-orange-500" />}
          title="Average Revenue/Event"
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(averageRevenue)}
        />
      </div>

       {/* Event Sales Chart with Table */}
       <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Overall Event Sales</h2>
        <div className="h-[300px] mb-8">
          {eventStats && <EventSalesChart data={eventStats} />}
        </div>

        {/* Table Container */}
        <div className="min-h-[400px] flex flex-col">
          <div className="flex-grow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[30%]">
                    EVENT
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[20%]">
                    SALE START DATE
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[35%]">
                    TICKETS SALES PROGRESS
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-[15%]">
                    REVENUE
                  </th>
                </tr>
              </thead>
              


<tbody>
  {currentItems?.map((event) => {
    // SỬA Ở ĐÂY: Kiểm tra ticketsTotal trước khi chia
    const soldPercentage = event.ticketsTotal > 0 
      ? (event.ticketsSold / event.ticketsTotal) * 100 
      : 0; // Nếu ticketsTotal là 0, phần trăm bán được là 0

    return (
      <tr key={event.eventId} className="border-b border-gray-100">
        <td className="py-4 px-4 text-sm text-gray-900">
          {event.eventTitle}
        </td>
        <td className="py-4 px-4 text-sm text-gray-500">
          {event.saleStartDate ? format(new Date(event.saleStartDate), 'MMM dd, yyyy') : 'N/A'}
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-4">
            {/* Progress bar container */}
            <div className="flex-1"> {/* Giữ nguyên flex-1 */}
              <div className="h-2 bg-gray-100 rounded-full"> {/* Nền xám cho phần chưa đạt */}
                <div
                  className="h-2 bg-green-500 rounded-full" // Màu xanh lá cây gốc
                  style={{ width: `${soldPercentage}%` }}
                />
              </div>
            </div>
            {/* Tickets count */}
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {event.ticketsSold} / {event.ticketsTotal}
            </div>
          </div>
        </td>
        <td className="py-4 px-4 text-sm text-gray-900">
          {/* Giữ nguyên định dạng toFixed(2) nếu bạn muốn, hoặc dùng toLocaleString cho chuẩn hơn */}
          ${event.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>
    );
  })}
  {/* Empty rows to maintain height */}
  {emptyRows > 0 && emptyRowsArray.map((_, index) => (
    <tr key={`empty-${index}`} className="border-b border-gray-100 h-[52px]"> {/* Giữ nguyên chiều cao hàng trống */}
      <td colSpan="4" className="px-4">&nbsp;</td>
    </tr>
  ))}
</tbody>






            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, eventStats?.length || 0)} of {eventStats?.length} entries
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
    </div>
  );
};

export default EventSales;
