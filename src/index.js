import { fetchImages } from './js/search';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const searchInput = document.querySelector('.input');
const gallery = document.querySelector('.gallery');
const more = document.querySelector('.load-more');
let page;

form.addEventListener('submit', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;

  if (searchInput.value === '') {
    return Notiflix.Notify.failure(`Wrong search input`);
  }

  renderSearchImages();
});

more.addEventListener('click', e => {
  page = page + 1;
  renderSearchImages(page);
  more.hidden = true;
});

async function renderSearchImages() {
  const allowedTotalHits =
    Number(localStorage.getItem('allowedTotalHits')) ?? 0;
  localStorage.setItem('allowedTotalHits', allowedTotalHits + 1);

  const response = await fetchImages(searchInput.value, page);
  const images = response.data.hits;
  const totalHits = response.data.totalHits;

  if (images.length > 0) {
    Notiflix.Notify.success(`Hooray! We found ${images.length} images`);
  }

  if (allowedTotalHits > totalHits) {
    return Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  if (images.length === 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  let galleryItems = '';
  images.forEach(element => {
    galleryItems += `
          <div class="photo-card">
            <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" width="200px" />
            <div class="info">
              <p class="info-item">
                <b>Likes ${element.likes}</b>
              </p>
              <p class="info-item">
                <b>Views ${element.views}</b>
              </p>
              <p class="info-item">
                <b>Comments ${element.comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads ${element.downloads}</b>
              </p>
            </div>
        </div>`;
  });

  gallery.innerHTML = galleryItems;

  if (images.length < 40) {
    Notiflix.Notify.failure(
      'We are sorry, but you have reached the end of the search results'
    );
  } else {
    more.hidden = false;
  }

  form.reset();
}
