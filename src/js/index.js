import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './refs';
import { fetchImages } from './pixabay-api';
import { imgCardMarkup } from './img-markup';

let page = 1;
let searchQuery = '';
let totalImages = 0;

const notiflixOoptions = {
  borderRadius: '20px',
  cssAnimationStyle: 'from-top',
  fontSize: '20px',
};

const observer = new IntersectionObserver(handlerObserver, {
  rootMargin: '0px 0px 50px 0px',
});

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function showSearchResults(totalHits) {
  Notiflix.Notify.success(
    `Hooray! We found ${totalHits} images.`,
    notiflixOoptions
  );
}

function toggleUpButton() {
  const scrollY = window.scrollY;

  if (scrollY > 0) {
    refs.upBtn.classList.remove('is-hidden');
  } else {
    refs.upBtn.classList.add('is-hidden');
  }
}

window.addEventListener('scroll', toggleUpButton);

refs.upBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

async function handlerObserver(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      page += 1;
      try {
        const { hits, totalHits } = await fetchImages(searchQuery, page);
        console.log(totalHits);
        const markup = imgCardMarkup(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
        smoothScroll();

        if (refs.gallery.children.length >= totalImages) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results.",
            notiflixOoptions
          );
          observer.unobserve(refs.jsGuard);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        Notiflix.Notify.failure(
          'Error fetching images. Please try again later.',
          notiflixOoptions
        );
      }
    }
  }
}

function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

refs.searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  searchQuery = refs.searchInput.value.trim().toLowerCase();

  if (searchQuery === '') {
    Notiflix.Notify.info('Please enter a search query.', notiflixOoptions);
    return;
  }

  refs.gallery.innerHTML = '';
  page = 1;

  try {
    const { hits, totalHits } = await fetchImages(searchQuery, page);

    totalImages = totalHits;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        notiflixOoptions
      );
    } else {
      const markup = imgCardMarkup(hits);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
      showSearchResults(totalHits);
      observer.observe(refs.jsGuard);
      lightbox.refresh();
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure(
      'Error fetching images. Please try again later.',
      notiflixOoptions
    );
  }
});
