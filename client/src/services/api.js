import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ai-chatbot-lz10.onrender.com', // ✅ correct deployed backend
});


export const askAI = async (question, context = '') => {
  const res = await api.post('/ask', { question, context });
  return res.data.answer;
};
