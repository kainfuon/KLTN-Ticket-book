import React from 'react';
import EventDisplay from '../../components/User/EventDisplay';
import UserNavbar from '../../components/User/UserNavbar';
import SearchBar from '../../components/SearchBar';

const Home = () => {
  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      
      
      <div className="bg-white pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <EventDisplay />
          </div>
        </div>
    </div>
  );
};

export default Home;
