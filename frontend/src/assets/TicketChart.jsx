import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const TicketChart = ({ tickets }) => {
    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: 'Ticket Sales Distribution',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                stacked: true,
                ticks: {
                    font: {
                        size: 14
                    }
                }
            }
        }
    };

    // Prepare data for the chart
    const data = {
        labels: tickets.map(ticket => ticket.type),
        datasets: [
            {
                label: 'Tickets Sold',
                data: tickets.map(ticket => ticket.ticketsSold),
                backgroundColor: 'rgba(53, 162, 235, 0.8)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 1
            },
            {
                label: 'Available Tickets',
                data: tickets.map(ticket => ticket.availableSeats),
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-[400px]"> {/* Fixed height container for the chart */}
                <Bar options={options} data={data} />
            </div>
            
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-600">Total Types</h4>
                    <p className="text-2xl font-bold text-blue-800">{tickets.length}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-600">Total Tickets</h4>
                    <p className="text-2xl font-bold text-green-800">
                        {tickets.reduce((sum, ticket) => sum + ticket.totalSeats, 0)}
                    </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-purple-600">Total Sold</h4>
                    <p className="text-2xl font-bold text-purple-800">
                        {tickets.reduce((sum, ticket) => sum + ticket.ticketsSold, 0)}
                    </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-yellow-600">Available</h4>
                    <p className="text-2xl font-bold text-yellow-800">
                        {tickets.reduce((sum, ticket) => sum + ticket.availableSeats, 0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TicketChart;
