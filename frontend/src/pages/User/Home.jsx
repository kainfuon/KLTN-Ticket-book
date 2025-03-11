import React from 'react'
import EventDisplay from '../../components/User/EventDisplay'
import UserNavbar from '../../components/User/UserNavbar'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="bg-gray-100 ">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Ticket Book</h2>
          <p className="text-gray-600 mt-1">Booking events and tickets</p>
        </div>
        <div >
          <EventDisplay />
        </div>
      </div>
    </div>
  )
}

export default Home
