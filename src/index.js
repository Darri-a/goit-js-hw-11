import { fetchImages } from './js/search';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const searchInput = document.querySelector('.input');
const gallery = document.querySelector('.gallery');
const more = document.querySelector('.load-more');
let page;
let allowedTotalHits;

more.hidden = true;

form.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;
  renderSearchImages();
});

more.addEventListener('click', e => {
  page = page + 1;
  renderSearchImages(page);
  more.hidden = true;
});

function renderSearchImages() {
  allowedTotalHits = Number(localStorage.getItem('allowedTotalHits')) ?? 0;
  localStorage.setItem('allowedTotalHits', allowedTotalHits + 1);

  fetchImages(searchInput.value, page)
    .then(response => {
      const images = response.data.hits;
      const totalHits = response.data.totalHits;

      // console.log(response.data);

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
            <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
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
      more.hidden = false;

      form.reset();
    })
    .catch(e => {
      return Notiflix.Notify.failure('Error');
    });
}
