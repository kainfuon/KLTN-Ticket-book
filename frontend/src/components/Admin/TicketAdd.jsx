import React, { useState, useEffect } from 'react';
import { createTicket, updateTicket } from '../../services/ticketService';
import { toast } from 'sonner';

const TicketAdd = ({ eventId, onClose, onSuccess, ticket }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketForm, setTicketForm] = useState({
    type: '',
    price: '',
    totalSeats: '',
    status: 'available'
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = ticket
        ? await updateTicket(ticket._id, {
            ...ticketForm,
            eventId,
            price: Number(ticketForm.price),
            totalSeats: Number(ticketForm.totalSeats)
          })
        : await createTicket({
            ...ticketForm,
            eventId,
            price: Number(ticketForm.price),
            totalSeats: Number(ticketForm.totalSeats)
          });

      if (response.success) {
        toast.success(`Ticket ${ticket ? 'updated' : 'created'} successfully`);
        onSuccess();
        onClose();
      } else {
        setError(response.message || `Failed to ${ticket ? 'update' : 'create'} ticket`);
      }
    } catch (err) {
      setError(`Failed to ${ticket ? 'update' : 'create'} ticket. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-300/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-full max-w-2xl shadow-xl z-50">
        {/* Modal Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              {ticket ? 'Edit Ticket' : 'Add New Ticket'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Ticket Type */}
          <div>
            <label className="block text-gray-700 text-base font-semibold mb-2">
              Ticket Type
            </label>
            <input
              type="text"
              value={ticketForm.type}
              onChange={(e) => setTicketForm({...ticketForm, type: e.target.value})}
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ticket type"
              required
              disabled={loading}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 text-base font-semibold mb-2">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-600">$</span>
              <input
                type="number"
                value={ticketForm.price}
                onChange={(e) => setTicketForm({...ticketForm, price: e.target.value})}
                className="w-full pl-8 pr-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Total Seats */}
          <div>
            <label className="block text-gray-700 text-base font-semibold mb-2">
              Total Seats
            </label>
            <input
              type="number"
              value={ticketForm.totalSeats}
              onChange={(e) => setTicketForm({...ticketForm, totalSeats: e.target.value})}
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of seats"
              min="1"
              required
              disabled={loading || (ticket && ticket.totalSeats - ticket.availableSeats > 0)}
            />
            {ticket && ticket.totalSeats - ticket.availableSeats > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                Cannot modify total seats as tickets have been sold
              </p>
            )}
          </div>

          {/* Status (for editing) */}
          {ticket && (
            <div>
              <label className="block text-gray-700 text-base font-semibold mb-2">
                Status
              </label>
              <select
                value={ticketForm.status}
                onChange={(e) => setTicketForm({...ticketForm, status: e.target.value})}
                className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="available">Available</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md text-base">
              {error}
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium text-base cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-base cursor-pointer flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {ticket ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                ticket ? 'Update Ticket' : 'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TicketAdd;
