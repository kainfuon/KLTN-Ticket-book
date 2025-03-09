// ... existing imports

export const addEvent = async (formData) => {
  try {
    const response = await fetch('/api/events/add', {
      method: 'POST',
      body: formData, // Using FormData for file upload
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};
