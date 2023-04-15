const API_KEY = '35400410-e14c5a11562853396e2d71b0b';
const BASE_URL = 'https://pixabay.com/api/';

const urlParam = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  q: '',
  safesearch: true,
};
function setQuery(query) {
  this.q = encodeURIComponent(query);
}
const setQ = setQuery.bind(urlParam);
function createQueryUrl(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return url.toString();
}

export async function fetchImages(query) {
  const options = {
    mode: 'cors',
  };
  setQ(query);
  const url = createQueryUrl(BASE_URL, urlParam);
  console.log(url);
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
