import React, { useState, useEffect } from 'react';
import { FaChartBar, FaTicketAlt, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns'; 
import Card from '../../components/Card';
import EventSalesChart from '../../assets/EventSalesChart';
import TicketTypeSalesChart from '../../assets/TicketTypeSalesChart';
import { getEventSalesStats, getTicketTypeSalesStats } from '../../services/statsService';
import { toast } from 'sonner';

const Statistics = () => {
  const [eventStats, setEventStats] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketStats, setTicketStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventStats();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchTicketStats(selectedEvent);
    }
  }, [selectedEvent]);

  const fetchEventStats = async () => {
    try {
      setLoading(true);
      const response = await getEventSalesStats();
      setEventStats(response);
      // Set first event as default selected event
      if (response && response.length > 0) {
        setSelectedEvent(response[0].eventId);
      }
    } catch (error) {
      console.error('Error fetching event stats:', error);
      toast.error('Failed to fetch event statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketStats = async (eventId) => {
    try {
      const response = await getTicketTypeSalesStats(eventId);
      setTicketStats(response);
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      toast.error('Failed to fetch ticket statistics');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalRevenue = eventStats?.reduce((sum, event) => sum + event.totalRevenue, 0) || 0;
  const totalTickets = eventStats?.reduce((sum, event) => sum + event.ticketsSold, 0) || 0;
  const averageRevenue = eventStats?.length ? totalRevenue / eventStats.length : 0;

  return (
    <div className="grow p-8 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sales Statistics</h1>

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
        
        {/* Event Sales Data Table */}
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Event
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Sale Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Tickets Sold
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Revenue
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventStats?.map((event) => (
                <tr key={event.eventId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                    {event.eventTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base">
                    {format(new Date(event.saleStartDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base">
                    {event.ticketsSold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(event.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Type Analysis with Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Ticket Type Analysis</h2>
          <select
            className="px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedEvent || ''}
            onChange={(e) => setSelectedEvent(e.target.value)}
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

            {/* Ticket Types Data Table */}
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
    </div>
  );
};

export default Statistics;
