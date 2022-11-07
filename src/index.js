import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

let getEl = selector => document.querySelector(selector);

const refs = {
    elementInput: getEl('#search-box'),
    ulList: getEl('.country-list'),
    divContainer: getEl('.country-info')
}

function onSearchInput(event) {
    const value = event.target.value.trim();
    
    if (!value) {
        Notify.info('Please enter country');
        return;
    }

    clearInput();

    fetchCountries(value)
        .then(country => {

            const countryLength = country.length;

            if (!countryLength) {

                Notify.failure("Oops, there is no country with that name");

            } else if (countryLength >= 2 && countryLength < 10) {
                refs.ulList.insertAdjacentHTML('beforeend', markupMoreCountry(country));

            } else if (countryLength === 1) {

                refs.divContainer.insertAdjacentHTML('beforeend', markupOneCountry(country));

            } else if (countryLength > 10) {

               Notify.info("Too many matches found. Please enter a more specific name.");

            }
            
        })
}  

function clearInput() {
    refs.divContainer.innerHTML = '';
    refs.ulList.innerHTML = '';
 
}

function markupMoreCountry(country) {
  const markup = country
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
    })
    .join('')
  return markup
}

function markupOneCountry(country)  {
  const markup = country
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>
        `
    })
    .join('')
  return markup
}

refs.elementInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));
