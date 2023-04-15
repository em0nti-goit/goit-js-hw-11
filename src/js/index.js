// Import all of Bootstrap's JS
// import * as bootstrap from 'bootstrap';
import { fetchImages } from './fetch-data';

fetchImages('flowers').then(console.log).catch(console.error);
