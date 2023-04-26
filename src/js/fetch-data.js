import axios from 'axios';

const API_KEY = '35400410-e14c5a11562853396e2d71b0b';
const BASE_URL = 'https://pixabay.com/api/';
export const IMAGES_PER_PAGE = 40;

const defaultParam = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: IMAGES_PER_PAGE,
};

/**
 * Fetches images from the Pixabay API based on a search query and page number.
 * @param query
 * @param page
 * @returns {Promise<*>}
 */
export async function fetchImages(query, page = 1) {
  const params = { ...defaultParam, q: query, page };
  const config = { baseURL: BASE_URL, params };

  try {
    const response = await axios(config);
    if (response.status !== 200) {
      throw new Error('Error fetching data');
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
