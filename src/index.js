import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  list: document.querySelector('ul.country-list'),
  div: document.querySelector('div.country-info'),
};

refs.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(e) {
  const searchQuery = e.target.value.trim();

  if (!searchQuery) {
    cleanMarkup(refs.list);
    cleanMarkup(refs.div);
    return;
  }

  // ========== Обробка виклику API Rest Countries v2 ==========
  fetchCountries(searchQuery)
    .then(countriesArr => {
    //   console.log(countriesArr);

      if (countriesArr.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        cleanMarkup(refs.list);
        cleanMarkup(refs.div);
        return;
      }
      renderMarkup(countriesArr);
    })
    .catch(handleFetchError);
  // .catch (error => handleFetchError(error));
}

function cleanMarkup(ref) {
  ref.innerHTML = '';
}

function renderMarkup(countriesArr) {
  if (countriesArr.length === 1) {
    cleanMarkup(refs.list);
    markupCountry = renderCountryCard(countriesArr);
    // console.log(markupCountry);
    refs.div.innerHTML = markupCountry;
  } else {
    cleanMarkup(refs.div);
    markupCountryList = renderCountriesList(countriesArr);
    // console.log(markupCountryList);
    refs.list.innerHTML = markupCountryList;
  }
}

const handleFetchError = error => {
  cleanMarkup(refs.list);
  cleanMarkup(refs.div);
  Notify.failure('Oops, there is no country with that name');
};

// ========== renderMarkup (renderCountriesList or renderCountryCard) ==========
function renderCountriesList(name) {
  return name
    .map(
      ({ name, flags }) =>
        `<li>
          <div class="wrap-flag"><img src="${flags.svg}" alt="${flags.alt}" width="80" height="auto"></div>
          <p class="country-name">${name.official}</p>
        </li>`
    )
    .join('');
}

function renderCountryCard(name) {
  return name.map(
    ({ name, capital, population, flags, languages }) =>
      `<div class="wrap-flag"><img src="${flags.svg}" alt="${flags.alt}" width="300" height="auto"></div>
      <h2 class="country-name">${name.official}</h2>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages)}</p>`
  );
}
// ========================================
