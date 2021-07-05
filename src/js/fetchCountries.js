export default function(searchQuery) {
    const URL = 'https://restcountries.eu/rest/v2/name/';

    //return fetch(`${URL}${searchQuery}?fields=name;flag;capital;languages`)

    return fetch(`${URL}${searchQuery}`)
            .then(response => response.json())
            .then(arrObj =>  arrObj);
}