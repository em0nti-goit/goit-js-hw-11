const API_KEY = '35400410-e14c5a11562853396e2d71b0b';
const BASE_URL = 'https://pixabay.com/api/';

const urlParam = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  q: '',
  safesearch: true,
  page: 1,
  per_page: 40,
};
function setQuery(query) {
  this.q = encodeURIComponent(query);
}

function setPages(page) {
  this.page = page;
}

const setUrlParamQ = setQuery.bind(urlParam);
const setUrlParamPage = setPages.bind(urlParam);

function createQueryUrl(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return url.toString();
}

export async function fetchImages(query, page = 1) {
  const options = {
    mode: 'cors',
  };
  setUrlParamQ(query);
  setUrlParamPage(page);
  const url = createQueryUrl(BASE_URL, urlParam);
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
