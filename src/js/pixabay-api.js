import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '39759517-f2fc46fd889c78780f89bde04';

const fetchImages = async (searchQuery, page) => {
  const BASE_AXIOS_URL = `?key=${API_KEY}`;
  const params = {
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  };
  try {
    const response = await axios.get(BASE_AXIOS_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching images');
  }
};

export { fetchImages };
