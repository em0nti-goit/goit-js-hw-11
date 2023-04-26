//Import the SimpleLightbox CSS and JS files
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import { IMAGES_PER_PAGE, fetchImages } from './fetch-data';
import { renderGallery } from './render.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Define element refs
const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.pagination__load-more-btn'),
  spinner: document.querySelector('.spinner-border'),
};

// Define search state object
const searchState = {
  page: 1,
  query: '',
  count: 0,
};

// Initialize lightbox as null
let lightbox = null;

// ---------------Form submit listener--------------
refs.form.addEventListener('submit', onSearchSubmitHandler);

// ---------------Functions for fetching first request------
/**
 *
 * @param event
 */
function onSearchSubmitHandler(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    Notify.warning('Please, input some search query');
    return;
  }

  // Remove event listener and hide load more button if new search is performed
  if (searchState.count > 0) {
    refs.loadMoreBtn.removeEventListener('click', onLoadMoreBtnClickHandler);
    refs.loadMoreBtn.classList.add('visually-hidden');
    searchState.page = 1;
    // Destroy lightbox if it exists
    if (lightbox) {
      lightbox.destroy();
      lightbox = null;
    }
  }

  // Update search state and fetch images
  searchState.query = query;
  searchState.count += 1;

  fetchImages(query)
    .then(data => {
      refs.gallery.innerHTML = '';

      if (!data.hits.length) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      renderGallery(data.hits, refs.gallery);

      lightbox = new SimpleLightbox('.gallery a');
      if (data.totalHits >= IMAGES_PER_PAGE) {
        refs.loadMoreBtn.classList.remove('visually-hidden');
        refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClickHandler);
      }
    })
    .catch(error => console.error(`Images fetching error: ${error.message}`));
}

function onLoadMoreBtnClickHandler() {
  searchState.page += 1;

  // Show spinner and disable load more button
  refs.spinner.classList.remove('d-none');
  refs.loadMoreBtn.textContent = 'Loading...';
  refs.loadMoreBtn.disabled = true;

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  fetchImages(searchState.query, searchState.page)
    .then(data => {
      renderGallery(data.hits, refs.gallery);
      lightbox.refresh();

      if (IMAGES_PER_PAGE * searchState.page >= data.totalHits) {
        refs.loadMoreBtn.classList.add('visually-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      // scroll smoothly to the top of the next group of images
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => console.error(`Images fetchin error: ${error.message}`))
    .finally(() => {
      refs.spinner.classList.add('d-none');
      refs.loadMoreBtn.textContent = 'Load more';
      refs.loadMoreBtn.disabled = false;
    });
}
