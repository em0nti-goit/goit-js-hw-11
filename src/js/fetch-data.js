import axios from 'axios';

const API_KEY = '35400410-e14c5a11562853396e2d71b0b';
const BASE_URL = 'https://pixabay.com/api/';
export const IMAGES_PER_PAGE = 40;

const urlParam = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  q: '',
  safesearch: true,
  page: 1,
  per_page: IMAGES_PER_PAGE,
};
function setQuery(query) {
  this.q = query; //encodeURIComponent(query);
}

function setPages(page) {
  this.page = page;
}

const setUrlParamQ = setQuery.bind(urlParam);
const setUrlParamPage = setPages.bind(urlParam);

export async function fetchImages(query, page = 1) {
  const config = {};

  setUrlParamQ(query);
  setUrlParamPage(page);

  config.params = urlParam;
  config.baseURL = BASE_URL;
  config.timeout = 5000;

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
