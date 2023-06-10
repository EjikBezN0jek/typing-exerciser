import axios from 'axios';

const api = axios.create({
  baseURL: 'https://baconipsum.com/api/',
});

export const fetchText = async () => {
  try {
    const { data } = await api.get('', { params: { type: 'all-meat', sentences: 5 } });
    return data[0];
  } catch (e) {
    throw new Error(e);
  }
};
