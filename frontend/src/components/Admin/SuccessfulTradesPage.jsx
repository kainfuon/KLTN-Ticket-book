import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaExchangeAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'sonner';
import { getAdminSuccessfulTrades} from '../../services/userticketService'; 
const SuccessfulTradesPage = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError('');
      // Call the imported service function
      const tradesData = await getAdminSuccessfulTrades();
      setTrades(tradesData); // Service returns the data array directly
    } catch (err) {
      // Catch errors thrown by the service
      console.error("Error fetching successful trades in component:", err);
      const errorMessage = err.message || 'Failed to load successful trades.';
      setError(errorMessage);
      toast.error(errorMessage); // Show error toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []); // Fetch trades on component mount

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrades = trades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(trades.length / itemsPerPage);
  const paginate = (pageNumber) => {
    // Ensure page number stays within bounds
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-6">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        <p className="ml-3 text-lg text-gray-700">Loading Successful Trades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Trades</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchTrades} // Allow retrying
          className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Successful Ticket Trades</h1>
          <div className="text-lg text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
            Total Trades: <span className="font-semibold text-blue-600">{trades.length}</span>
          </div>
        </div>

        {trades.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaExchangeAlt className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No Successful Trades Found</h3>
            <p className="text-lg text-gray-500 mt-2">There are no completed ticket trades to display.</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original Owner
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      New Owner (Recipient)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trade Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTrades.map((tradeTicket) => (
                    // Assuming tradeHistory contains the relevant trade info
                    // Displaying the last trade event for this ticket
                    tradeTicket.tradeHistory?.slice(-1).map(trade => (
                      <tr key={`${tradeTicket._id}-${trade._id}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono" title={tradeTicket._id}>
                          {tradeTicket._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Ensure your backend populates these fields or adjust accordingly */}
                          <div className="text-sm font-medium text-gray-900">{trade.fromUserId?.name || trade.fromUserId?.fullName || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{trade.fromUserId?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{trade.toUserId?.name || trade.toUserId?.fullName || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{trade.toUserId?.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(trade.tradeDate), 'MMM dd, yyyy - HH:mm')}
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} (Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, trades.length)} of {trades.length} trades)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {/* Optional: Page number buttons */}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessfulTradesPage;
