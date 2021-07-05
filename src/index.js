import './sass/main.scss';
import fetchCountries from './js/fetchCountries';
import countryTemplate from './handlebars/country.hbs';
import countriesNamesTemplate from './handlebars/countriesNames.hbs';
import pnotify from './js/pnotify.js';

let debounce = require('lodash.debounce');
const inputEl = document.querySelector('.input');
const countryEl = document.querySelector('.country');

const message = {
    noCountry: 'No country was found. Please, change your request.',
    moreThanTenCountries: 'More than 10 countries match your request.',
    404: 'Error 404: bad request. Please, change your request.',
}

inputEl.addEventListener('input', debounce(makeFetch, 500));

function checkRequest(request) {
    if(request.status !== 404) {
        return request;
    }
    if(request.status === 404) {
        pnotify(message[404]);
    }
    return;
}

function proceedObject(obj) {
    if(!obj) {
        return;
    }

    if(obj.length === 1) {
        makeCountryMarkup(obj);
    } else if(obj.length >= 2 && obj.length <= 10){
        makeCountriesNamesMarkup(obj);
    } else if (obj.length > 10){
        moreThanTenCountriesResponse();
    }
}

function moreThanTenCountriesResponse() {
    pnotify(message.moreThanTenCountries); 
}

function makeFetch(event) {
    clearCountryField();

    const value = event.target.value.trim();

    if(value) {
        fetchCountries(value)
                .then(checkRequest)
                .then(proceedObject)
                .catch(showError);
        }
}

function clearCountryField() {
    countryEl.innerHTML = '';
    // countryEl.style.display = 'none';
}

function showError(error) {
    pnotify(error);
}

function makeCountryMarkup(countryObj) {
    countryEl.insertAdjacentHTML('beforeend', countryTemplate(countryObj));
}

function makeCountriesNamesMarkup(countries) {
    countryEl.insertAdjacentHTML('beforeend', countriesNamesTemplate(countries));
}

// function isValidSearchQuery(query) {
//     const REGEXP = /\b[^\d\W]+\b/;

//     if(query.match(REGEXP)) {
//         return true;
//     }

//     return false;
// }

