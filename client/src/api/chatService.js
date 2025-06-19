import axios from 'axios';

const API_URL = 'https://nutri-gen-3.onrender.com/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const chatService = {
  sendMessage: async (messages) => {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_URL}/chat`,
      { messages },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default chatService;
