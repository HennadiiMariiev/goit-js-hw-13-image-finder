import './sass/main.scss';

import * as basicLightbox from 'basiclightbox';
import alertify from 'alertifyjs';
import debounce from 'lodash.debounce';

import ImageApiService from './js/apiService';
import imageCardTemplate from './handlebars/imageCard.hbs';
import searchWordTemplate from './handlebars/searchWord.hbs';

const galleryList = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const input = document.querySelector('input[type="text"]');
const searchButton = document.querySelector('button[type="submit"]');
const loadMoreButton = document.querySelector('#load-more');
const clearButton = document.querySelector('#clear');
const searchBox = document.querySelector('.search-box');

const imageApiService = new ImageApiService();

disableSearchButton(true);
hideLoadMoreButton();

input.addEventListener('input', debounce(onInputKeyDown, 300));
clearButton.addEventListener('click', onClearClick);
galleryList.addEventListener('click', onGalleryListClick);
searchBox.addEventListener('click', onSearchBoxClick);

try {
    form.addEventListener('submit', onSearchClick);
    loadMoreButton.addEventListener('click', onSearchClick);
} catch (error) {
    errorMessage(error);
}

//#region ALL FUNCTIONS

async function makeFetch(event) {
    if(event) {
        event.preventDefault();
    }

    const response = await imageApiService.fetchRequest(input.value.trim());
    const imagesArray =  await proceedResponse(response);
    
    if(imagesArray.length === 0) {
        warningMessage();
        return;
    }

    addRequestToSearchBox(imageApiService.query);

    const imagesMarkup = await makePhotoCardMarkup(imagesArray);

    return imagesMarkup;
}

async function onSearchClick(event) {
    if(input.value === imageApiService.query) {
        imageApiService.nextPage();
    } else if(imageApiService.query !== '') {
        refreshGalleryListAndInput();
    }

    const imagesMarkup = await makeFetch(event);

    return insertMarkupToList(imagesMarkup);
}

function hideLoadMoreButton() {
    loadMoreButton.style.display = 'none';
}

function showLoadMoreButton() {
    loadMoreButton.style.display = 'block';
}

function onClearClick() {
    galleryList.innerHTML = '';
    input.value = '';

    hideLoadMoreButton();
    disableSearchButton(true);

    imageApiService.resetQuery();
}

function proceedResponse(response) {
    if(response.status === 404) {
        errorMessage(404);
        return;
    }
    
    return response.hits;
}

function makePhotoCardMarkup(imageObjArray) {
    return imageCardTemplate(imageObjArray);
}

function insertMarkupToList(markup) {
    if(markup) {
        galleryList.insertAdjacentHTML('beforeend', markup);

        showLoadMoreButton();
        successMessage();
        scroolToLastImages();
    }
}

function onInputKeyDown() {
    if(input.value.trim().length !== 0){
        return disableSearchButton(false);
    }

    onClearClick();

    return disableSearchButton(true);
}

function disableSearchButton(bool) {
    searchButton.disabled = bool;
}

function onGalleryListClick(event) {
    if(event.target.nodeName === "A") {
        event.preventDefault();

        downloadImage(event.target.href);
    }

    if(event.target.nodeName === "IMG") {
        const largeImagePath = event.target.dataset.large_img;

        openImage(largeImagePath);
    }
}

function downloadImage(imageRef) {
        return fetch(imageRef)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
        
                a.href = url;
                a.download = imageApiService.query;
        
                const clickHandler = () => {
                    setTimeout(() => URL.revokeObjectURL(url), 150);
                };

                a.addEventListener('click', clickHandler, {once: true});
                a.click();
            });
}

function openImage(image) {
    const ligthBox = basicLightbox.create(`
        <img src="${image}" alt="${imageApiService.query} image">
    `);

    ligthBox.show();
}

function scroolToLastImages() {
    setTimeout(() => {
        loadMoreButton.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            });
    }, 300);
}

function successMessage() {
    alertify.success(`Success! Request: '${imageApiService.query}'. Page: ${imageApiService.page}. Images: ${getGalleryItemsCount()}`);
}

function warningMessage() {
    if(getGalleryItemsCount() > 0) {
        return alertify.warning(`Sorry! No more images found on request - '${imageApiService.query}'. Images: ${getGalleryItemsCount()}`);
    }
    return alertify.warning(`Sorry! No images found on your request - '${imageApiService.query}'. Images: ${getGalleryItemsCount()}`);
}

function errorMessage(error) {
    alertify.error(`Error! ${error}`);
}

function getGalleryItemsCount() {
    return galleryList.children.length;
}

function addRequestToSearchBox() {
    const searchTags = [...searchBox.children].map(el => el.dataset.query);

    if(!searchTags.includes(imageApiService.query)) {
        searchBox.insertAdjacentHTML('beforeend', searchWordTemplate(imageApiService.query));
    }
}

function onSearchBoxClick(event) {
    if(event.target.nodeName !== 'BUTTON') {
        return;
    }

    input.value = event.target.dataset.query;
    onSearchClick(event);
    disableSearchButton(false);
}

function refreshGalleryListAndInput() {
    galleryList.innerHTML = '';
    imageApiService.resetQuery();
    hideLoadMoreButton();
}

//#endregion