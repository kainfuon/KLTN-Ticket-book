import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEventById } from '../../services/eventService';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'sonner';

const EventAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get event ID from URL for editing
  const [imageErrors, setImageErrors] = useState({}); // Track image load errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    saleStartDate: '',
    venue: '',
    status: 'ongoing',
    image: null
  });

  // Fetch event data if in edit mode
  useEffect(() => {
    const fetchEventData = async () => {
      if (id) {
        try {
          const response = await getEventById(id);
          if (response.success) {
            const event = response.data;
            setFormData({
              title: event.title,
              description: event.description,
              eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
              saleStartDate: new Date(event.saleStartDate).toISOString().slice(0, 16),
              venue: event.venue,
              status: event.status,
              image: event.image
            });
            if (event.image) {
              setPreview(`http://localhost:4001/images/${event.image}`);
            }
          } else {
            toast.error('Failed to fetch event data');
            navigate('/admin/events');
          }
        } catch (err) {
          toast.error('Error fetching event data');
          navigate('/admin/events');
        }
      }
    };

    fetchEventData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = id
        ? await updateEvent(id, formData)
        : await createEvent(formData);

      if (response.success) {
        toast.success(`Event ${id ? 'updated' : 'created'} successfully`);
        navigate('/admin/events');
      } else {
        setError(response.message || `Failed to ${id ? 'update' : 'create'} event`);
        toast.error(response.message || `Failed to ${id ? 'update' : 'create'} event`);
      }
    } catch (err) {
      const errorMessage = `Failed to ${id ? 'update' : 'add'} event. Please try again.`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
            <button
            onClick={() => navigate('/admin/events')}
            className="flex items-center text-blue-600 hover:text-blue-800 text-lg cursor-pointer"
            >
            <FaArrowLeft className="mr-2" />
            Back to Events
            </button>
        </div>

        <div className="bg-white rounded-lg shadow-md max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-semibold mb-6">
                {id ? 'Edit Event' : 'Add New Event'}
                </h2>

                {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-lg">
                    {error}
                </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... (rest of your form fields remain the same) ... */}
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Event Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Event Date
                            </label>
                            <input
                                type="datetime-local"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Sale Start Date
                            </label>
                            <input
                                type="datetime-local"
                                name="saleStartDate"
                                value={formData.saleStartDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Venue
                        </label>
                        <input
                            type="text"
                            name="venue"
                            value={formData.venue}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

            {/* Update the image input to make it optional during edit */}
            <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                Event Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
                <div className="space-y-1 text-center">
                    {preview ? (
                    <div className="mb-4">
                        <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto h-32 w-auto"
                        />
                    </div>
                    ) : (
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                    >
                        <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                    </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span className="text-lg">Upload a file</span>
                        <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="sr-only"
                        accept="image/*"
                        required={!id} // Only required for new events
                        />
                    </label>
                    <p className="pl-1 text-lg">or drag and drop</p>
                    </div>
                    <p className="text-base text-gray-500">
                    PNG, JPG, GIF up to 10MB
                    </p>
                </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                >
                {loading
                    ? id ? 'Updating Event...' : 'Adding Event...'
                    : id ? 'Update Event' : 'Add Event'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EventAdd;
