import React, { useState, useEffect } from 'react';
import { getEventSalesStats, getTicketTypeSalesStats } from '../../services/statsService';
import { toast } from 'sonner';
import EventSales from './EventSales';
import TicketTypeAnalysis from './TicketTypeAnalysis';

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

  return (
    <div className="grow p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sales Statistics</h1>
      
      {/* Event Sales Section */}
      <EventSales eventStats={eventStats} />

      {/* Ticket Type Analysis Section */}
      <TicketTypeAnalysis
        ticketStats={ticketStats}
        selectedEvent={selectedEvent}
        eventStats={eventStats}
        onEventSelect={setSelectedEvent}
      />
    </div>
  );
};

export default Statistics;
