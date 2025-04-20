import React, { useState, useEffect } from 'react';
import { getSuspectedScalpers } from '../../services/aiService';
import axios from 'axios';
import { getAllUsers } from '../../services/authService';
import { toast } from 'sonner';

const ScalpersList = () => {
  const [scalpers, setScalpers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both scalpers and users data in parallel
      const [scalpersResponse, usersData] = await Promise.all([
        getSuspectedScalpers(),
        getAllUsers()
      ]);

      if (scalpersResponse.success) {
        // Combine scalper data with user data
        const scalperData = scalpersResponse.data.map(scalper => {
          const user = usersData.find(user => user._id === scalper.userId) || {};
          return {
            ...scalper,
            userDetails: user
          };
        });
        
        setScalpers(scalperData);
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load scalpers data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (isScalper, totalTickets, trades) => {
    if (!isScalper) return { level: 'Low', color: 'green' };
    const ratio = trades / totalTickets;
    if (ratio > 0.5) return { level: 'High', color: 'red' };
    return { level: 'Medium', color: 'yellow' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Suspected Scalpers</h2>
        <p className="text-gray-600 mt-2">
          Monitor users with suspicious ticket purchasing and trading patterns
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
              const risk = getRiskLevel(scalper.isScalper, scalper.totalTickets, scalper.trades);
              
              return (
                <tr key={scalper.userId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {scalper.userDetails?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {scalper.userDetails?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{scalper.totalTickets}</div>
                    <div className="text-xs text-gray-500">Total Purchased</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{scalper.trades}</div>
                    <div className="text-xs text-gray-500">Times Traded</div>
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
                      onClick={() => {/* Add action handler */}}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      View Details
                    </button>
                    {risk.level === 'High' && (
                      <button
                        onClick={() => {/* Add warning handler */}}
                        className="text-red-600 hover:text-red-900"
                      >
                        Send Warning
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {scalpers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No suspected scalpers found
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Monitored Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{scalpers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">High Risk Users</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {scalpers.filter(s => getRiskLevel(s.isScalper, s.totalTickets, s.trades).level === 'High').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Total Trades</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {scalpers.reduce((acc, curr) => acc + curr.trades, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScalpersList;

