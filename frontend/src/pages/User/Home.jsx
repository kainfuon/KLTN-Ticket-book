import React from 'react'
import EventDisplay from '../../components/User/EventDisplay'
import UserNavbar from '../../components/User/UserNavbar'

const Home = () => {
  return (
    <div>
      <UserNavbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Ticket Book</h2>
        <p className="text-gray-600 mt-1">Booking events and tickets</p>
      </div>
      <div>
        <EventDisplay />
      </div>
    </div>
  )
}

export default Home
