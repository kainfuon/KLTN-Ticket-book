import React, { useState, useEffect } from 'react';
import EventDisplay from '../../components/User/EventDisplay';
import UserNavbar from '../../components/User/UserNavbar';
import HotEventsBanner from '../../components/User/HotEventsBanner';
import { getAllEvents } from '../../services/eventService';

const Home = () => {
  const [hotEvents, setHotEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotEvents();
  }, []);

  const fetchHotEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      // Get the first 5 events or filter by some criteria
      const topEvents = response.slice(0, 5);
      setHotEvents(topEvents);
    } catch (error) {
      console.error('Error fetching hot events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <main className="bg-white pt-20">
        {/* Hot Events Banner Section */}
        {!loading && hotEvents.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <HotEventsBanner events={hotEvents} />
          </div>
        )}

        {/* Events Display Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EventDisplay />
        </div>
      </main>
    </div>
  );
};

export default Home;
