import React, { useState, useEffect } from 'react';
import { createTicket, updateTicket } from '../../services/ticketService';

const TicketAdd = ({ eventId, onClose, onSuccess, ticket }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ticketForm, setTicketForm] = useState({
        type: '',
        price: '',
        totalSeats: '',
        status: 'available'
    });

    // Helper function to check if tickets have been sold
    const hasTicketsSold = (ticket) => {
        return ticket && (ticket.totalSeats - ticket.availableSeats > 0);
    };

    useEffect(() => {
        if (ticket) {
            setTicketForm({
                type: ticket.type,
                price: ticket.price,
                totalSeats: ticket.totalSeats,
                status: ticket.status
            });
        }
    }, [ticket]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicketForm(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        const ticketsSold = hasTicketsSold(ticket);
    
        // Prevent reducing total seats below sold amount
        if (ticketsSold && Number(ticketForm.totalSeats) < (ticket.totalSeats - ticket.availableSeats)) {
          setError('Cannot reduce total seats below the number of tickets sold');
          setLoading(false);
          return;
        }
    
        try {
          const ticketData = {
            eventId,
            type: ticketForm.type,
            price: Number(ticketForm.price),
            totalSeats: Number(ticketForm.totalSeats),
            status: ticketForm.status,
            // Preserve the sold status if tickets have been sold
            availableSeats: ticketsSold ? ticket.availableSeats : Number(ticketForm.totalSeats)
          };
    
          const response = ticket
            ? await updateTicket(ticket._id, ticketData)
            : await createTicket(ticketData);
    
          if (response.success) {
            onSuccess();
          } else {
            setError(response.message || `Failed to ${ticket ? 'update' : 'create'} ticket`);
          }
        } catch (err) {
          console.error(`Error ${ticket ? 'updating' : 'creating'} ticket:`, err);
          setError(`Failed to ${ticket ? 'update' : 'create'} ticket. Please try again.`);
        } finally {
          setLoading(false);
        }
      };
    
    const ticketsSold = hasTicketsSold(ticket);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
            {ticket ? 'Edit Ticket' : 'Add New Ticket'}
            </h2>
            {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
            </div>
            )}
            {ticketsSold && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
                    Some tickets have been sold. Total seats cannot be reduced below sold amount.
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                    Ticket Type
                    </label>
                    <input
                    type="text"
                    name="type"
                    value={ticketForm.type}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                    Price
                    </label>
                    <input
                    type="number"
                    name="price"
                    value={ticketForm.price}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                    min="0"
                    step="0.01"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                    Total Seats
                    </label>
                    <input
                    type="number"
                    name="totalSeats"
                    value={ticketForm.totalSeats}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading || (ticketsSold && ticket.status === 'sold_out')}
                    min={ticketsSold ? (ticket.totalSeats - ticket.availableSeats) : 1}
                    />
                    {ticketsSold && (
                    <p className="mt-1 text-sm text-gray-500">
                        Minimum seats: {ticket.totalSeats - ticket.availableSeats} (sold tickets)
                    </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                    Status
                    </label>
                    <select
                    name="status"
                    value={ticketForm.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                    >
                    <option value="available">Available</option>
                    <option value="sold_out">Sold Out</option>
                    </select>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    disabled={loading}
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    disabled={loading}
                    >
                    {loading ? (
                        <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            />
                            <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        {ticket ? 'Updating...' : 'Creating...'}
                        </span>
                    ) : (
                        ticket ? 'Update Ticket' : 'Create Ticket'
                    )}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default TicketAdd;
