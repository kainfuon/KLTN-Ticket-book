import axios from 'axios';

const API_URL = 'http://localhost:4001/api/ticket';

// Get all tickets for an event
export const getTicketsByEvent = async (eventId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/event/${eventId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.data || []; // Handle the response data structure
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return []; // Return empty array on error
    }
};

// Create a new ticket
export const createTicket = async (ticketData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/add`, {
            eventId: ticketData.eventId,
            type: ticketData.type,
            price: Number(ticketData.price),
            totalSeats: Number(ticketData.totalSeats)
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};

// Update a ticket
export const updateTicket = async (ticketId, ticketData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/update/${ticketId}`, ticketData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating ticket:', error);
        throw error;
    }
};

// Delete a ticket
export const deleteTicket = async (ticketId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/delete/${ticketId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting ticket:', error);
        throw error;
    }
};
