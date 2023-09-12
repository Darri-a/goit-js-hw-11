import { fetchImages } from './js/search';
import Notiflix from 'notiflix';

const form = document.getElementById('search-form');
const searchInput = document.querySelector('.input');
const gallery = document.querySelector('.gallery');
const more = document.querySelector('.load-more');
let page;
let onSubmit = true;

form.addEventListener('submit', e => {
  e.preventDefault();
  const q = searchInput.value.trim();
  gallery.innerHTML = '';
  page = 1;
  if (q === '') {
    Notiflix.Notify.failure(`PLease enter search query`);
    return;
  }

  renderSearchImages(q, page);
  onSubmit = true;
});

more.addEventListener('click', e => {
  const q = searchInput.value.trim();
  page = page + 1;
  renderSearchImages(q, page);
  more.hidden = true;

  onSubmit = false;
});

async function renderSearchImages(q, page) {
  const response = await fetchImages(q, page);
  const images = response.data.hits;
  const totalHits = response.data.totalHits;

  if (images.length > 0 && onSubmit) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images`);
  }

  if (images.length === 0) {
    more.hidden = true;
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

  gallery.insertAdjacentHTML('beforeend', galleryItems);

  const lastPage = Math.ceil(totalHits / 40);

  if (totalHits < 40) {
    return (more.hidden = true);
  }

  more.hidden = false;

  if (lastPage === page) {
    more.hidden = true;
    Notiflix.Notify.failure(
      'We are sorry, but you have reached the end of the search results'
    );
    return;
  }
}
