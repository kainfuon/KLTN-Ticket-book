import React, { useState, useEffect } from 'react';
import { getSuspectedScalpers } from '../../services/aiService'; // For scalper data
import { getAllUsers, updateUserBlockStatus } from '../../services/authService'; // Corrected import for getAllUsers
import { toast } from 'sonner';
import { FaUserLock, FaUserCheck, FaUserSlash, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'; // Added icons

const ScalpersList = () => {
  const [scalpers, setScalpers] = useState([]);
  // users state will now store a map for efficient lookup and updates
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // For block/unblock button loading state
  const [error, setError] = useState('');


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [scalpersResponse, allUsersData] = await Promise.all([
        getSuspectedScalpers(),
        getAllUsers() // Fetches all users
      ]);

      // Create a map of users for easy lookup by _id
      const usersLookup = {};
      allUsersData.forEach(user => {
        usersLookup[user._id] = user;
      });
      setUsersMap(usersLookup);

      if (scalpersResponse.success) {
        // Combine scalper data with full user details from the usersMap
        const enrichedScalperData = scalpersResponse.data.map(scalper => ({
          ...scalper,
          // userDetails will now come from the comprehensive usersMap
          userDetails: usersLookup[scalper.userId] || { name: 'User data missing', email: '', isBlocked: false }
        }));
        setScalpers(enrichedScalperData);
      } else {
        throw new Error(scalpersResponse.message || "Failed to fetch scalper data.");
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = err.message || 'Failed to load page data.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId, currentStatus) => {
    const action = currentStatus ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} user ${usersMap[userId]?.name || userId}?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      const newBlockStatus = !currentStatus;
      const response = await updateUserBlockStatus(userId, newBlockStatus);

      if (response.success) {
        toast.success(response.message);
        // Update local state for immediate UI feedback
        setUsersMap(prevMap => ({
          ...prevMap,
          [userId]: { ...prevMap[userId], isBlocked: newBlockStatus }
        }));
        // Also update the scalpers array if userDetails is directly used from there
        setScalpers(prevScalpers => prevScalpers.map(s =>
            s.userId === userId ? { ...s, userDetails: { ...s.userDetails, isBlocked: newBlockStatus } } : s
        ));
      } else {
        toast.error(response.message || `Failed to ${action} user.`);
      }
    } catch (err) {
      toast.error(err.message || `An error occurred while trying to ${action} the user.`);
      console.error(`Error ${action}ing user:`, err);
    } finally {
      setActionLoading(null);
    }
  };


  const getRiskLevel = (isScalper, totalTickets, trades) => {
    if (!isScalper && totalTickets > 0) { // Check totalTickets to avoid division by zero
        const ratio = trades / totalTickets;
        
        if (ratio > 0.5) return { level: 'Medium', color: 'yellow' }; // Example threshold
    } else if (isScalper) { // If AI flags as scalper, could be high or medium
        return { level: 'High', color: 'red' }; // Default to high if AI flagged
    }
    return { level: 'Low', color: 'green' };
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-6">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        <p className="ml-3 text-lg text-gray-700">Loading Scalpers Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchData}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Suspected Scalpers</h1>
          <p className="text-gray-600 mt-2">
            Monitor users with suspicious ticket purchasing and trading patterns.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Tickets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scalpers.map((scalper) => {
                  const user = scalper.userDetails; // User details are now part of the scalper object
                  const risk = getRiskLevel(scalper.isScalper, scalper.totalTickets, scalper.trades);
                  const isBlocked = user?.isBlocked || false; // Get block status from userDetails
                  const isLoadingAction = actionLoading === scalper.userId;

                  return (
                    <tr key={scalper.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className={`text-sm font-medium ${isBlocked ? 'text-red-600 line-through' : 'text-gray-900'}`}>
                              {user?.name || user?.fullName || 'Unknown User'}
                              {isBlocked && <FaUserSlash className="inline ml-1 text-red-500" title="Blocked"/>}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{scalper.totalTickets}</div>
                        <div className="text-xs text-gray-500">Purchased</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{scalper.trades}</div>
                        <div className="text-xs text-gray-500">Traded</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${risk.color === 'red' ? 'bg-red-100 text-red-800' : 
                            risk.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {risk.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleBlockToggle(scalper.userId, isBlocked)}
                          disabled={isLoadingAction}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                            isLoadingAction
                              ? 'bg-gray-200 text-gray-400 cursor-wait'
                              : isBlocked
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                          title={isBlocked ? 'Unblock User' : 'Block User'}
                        >
                          {isLoadingAction ? <FaSpinner className="animate-spin" /> : (isBlocked ? <FaUserCheck /> : <FaUserLock />)}
                          {isLoadingAction ? 'Processing...' : (isBlocked ? 'Unblock' : 'Block')}
                        </button>
                        {/* You can add other actions like "View Details" or "Send Warning" here */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {scalpers.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No suspected scalpers found.
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary - This part uses the `users` state which is now a map.
            If you need the count of all users, you can use Object.keys(usersMap).length */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{Object.keys(usersMap).length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Monitored Scalpers</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{scalpers.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">High Risk Users</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {scalpers.filter(s => getRiskLevel(s.isScalper, s.totalTickets, s.trades).level === 'High').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Total Trades by Scalpers</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {scalpers.reduce((acc, curr) => acc + curr.trades, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScalpersList;
