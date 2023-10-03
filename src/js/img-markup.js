export function imgCardMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a href="${largeImageURL}" class="photo-card-link">
          <div class="photo-card">
            <img class ="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="photo-info">
              <p class="photo-info-item">
                <b>Likes:</b>
                ${likes}
              </p>
              <p class="photo-info-item">
                <b>Views:</b>
                ${views}
              </p>
              <p class="photo-info-item">
                <b>Comments:</b>
                ${comments}
              </p>
              <p class="photo-info-item">
                <b>Downloads:</b>
                ${downloads}
              </p>
            </div>
          </div>  
        </a>
      `;
      }
    )
    .join('');
}
