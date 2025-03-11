import React from 'react'
import UserNavbar from '../../components/User/UserNavbar'
import EventdetailDisplay from '../../components/User/EventdetailDisplay'

const ViewEvent = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <UserNavbar />
            <div className='bg-gray-100 overflow-auto'>
                <EventdetailDisplay />
            </div>
        </div>
    )
}

export default ViewEvent