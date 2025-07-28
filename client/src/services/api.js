import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export const askAI = async (question, context = '') => {
  const res = await api.post('/ask', { question, context });
  return res.data.answer;
};
