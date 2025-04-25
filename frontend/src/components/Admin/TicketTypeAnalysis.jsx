import React from 'react';
import TicketTypeSalesChart from '../../assets/TicketTypeSalesChart';

const TicketTypeAnalysis = ({ ticketStats, selectedEvent, eventStats, onEventSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Ticket Type Analysis</h2>
        <select
          className="px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedEvent || ''}
          onChange={(e) => onEventSelect(e.target.value)}
        >
          <option value="">Select an event</option>
          {eventStats?.map(event => (
            <option key={event.eventId} value={event.eventId}>
              {event.eventTitle}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && ticketStats && (
        <>
          <div className="h-[300px] mb-8">
            <TicketTypeSalesChart
              data={ticketStats}
              eventTitle={eventStats.find(e => e.eventId === selectedEvent)?.eventTitle}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Ticket Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Tickets Sold
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    % of Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ticketStats.map((ticket) => {
                  const totalRevenue = ticketStats.reduce((sum, t) => sum + t.totalRevenue, 0);
                  const percentage = ((ticket.totalRevenue / totalRevenue) * 100).toFixed(1);
                  return (
                    <tr key={ticket.ticketType} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                        {ticket.ticketType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base">
                        {ticket.ticketsSold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(ticket.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
                      
export default TicketTypeAnalysis;
