let normalizedMovies = movies.map((movie) => {
  return {
    title: movie.Title.toString(),
    year: movie.movie_year,
    summary: movie.summary,
    categories: movie.Categories.split('|'),
    imdbId: movie.imdb_id,
    imdbRating: movie.imdb_rating,
    language: movie.language,
    trailer: movie.ytid,
    img: `https://i3.ytimg.com/vi/${movie.ytid}/maxresdefault.jpg`,
  };
});

let normalized = normalizedMovies.splice(0, 100)


let elForm = document.querySelector(".search-form");
let elSearchInput = document.querySelector(".js-form-input-search");
let elCategoriesSelect = document.querySelector(".js-form-select-category");
let elRaytingInput = document.querySelector(".js-rayting-form");
let elSortSelect = document.querySelector(".js-form-sort");

let elList = document.querySelector(".movie-list");

let elResultTemplate = document.querySelector("#movies-template").content;

//Modal
let elModalTitle = document.querySelector(".js-modal-title");
let elModalSummery = document.querySelector(".js-modal-summery");
let elModalLink = document.querySelector('.js-modal-link');


//Category

let arrCategory = [];
let elSelectCategory = () => {
  normalizedMovies.forEach(movie => {
    movie.categories.forEach(category => {
      if (!arrCategory.includes(category)) {
        arrCategory.push(category)
      }
    })
  })

  arrCategory.sort();
  let elOptionFragmet = document.createDocumentFragment();

  arrCategory.forEach((category) => {
    let elOptionCategory = document.createElement("option");
    elOptionCategory.textContent = category;
    elOptionCategory.value = category;

    elOptionFragmet.appendChild(elOptionCategory);
  })
  elCategoriesSelect.appendChild(elOptionFragmet);
}

elSelectCategory();

//Render

let renderResult = (searchResults) => {
  elList.innerHTML = '';

  let elResultFragmet = document.createDocumentFragment();


  searchResults.forEach(movie => {
    let elMovie = elResultTemplate.cloneNode(true);

    elMovie.querySelector(".js-results-item").dataset.movie = movie.imdbId;
    // elMovie.querySelector(".js-img-card").src = movie.img;
    elMovie.querySelector(".js-img-card").alt = movie.title;
    elMovie.querySelector(".card-title").textContent = movie.title;
    elMovie.querySelector(".js-rayting").textContent = `Rayting: ${movie.imdbRating}`;
    elMovie.querySelector(".js-year").textContent = `Year: ${movie.year}`;
    elMovie.querySelector(".ja-link").href = movie.ytid;


    elResultFragmet.appendChild(elMovie);
  });

  elList.appendChild(elResultFragmet);
}

renderResult(normalized);



let findMovies = (title, rayting, gener) => {
  return normalizedMovies.filter(movie => {
    let doesCotegory = gener === "All" || movie.categories.includes(gener);
    return movie.title.match(title) && movie.imdbRating >= rayting && doesCotegory;
  });
};

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let searchTitle = elSearchInput.value.trim();
  let movieTitleRegex = new RegExp(searchTitle, 'gi');

  let minRayting = Number(elRaytingInput.value);

  let gener = elCategoriesSelect.value;

  let searchResults = findMovies(movieTitleRegex, minRayting, gener);


  renderResult(searchResults);
});


elList.addEventListener("click", (evt) => {
  if (evt.target.matches(".js-modal-button")) {
    let movieImdbId = evt.target.closest(".js-results-item").dataset.movie;
    console.log(movieImdbId);

    let foundMovie = normalized.find((movie) => {
      return movie.imdbId === movieImdbId;

    });

    elModalTitle.textContent = foundMovie.title;
    elModalSummery.textContent = foundMovie.summary;
    elModalLink.href = foundMovie.ytid;
    elModalLink.textContent = 'Link'


    console.log(foundMovie);
  }
})