class ImageApiService {
    constructor() {
        this.URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal'
        this.KEY = '22384845-2364b219a750a32869ef5ac48';
        this.page = 1;
        this.query = '';
    };

    nextPage() {
        return this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
    
    resetQuery(query) {
        if(this.query !== query) {
            this.query = query;
            this.page = 1;
        }
    }

    fetchRequest(query) {
        this.resetQuery(query);

        return fetch(`${this.URL}&q=${this.query}&page=${this.page}&per_page=12&key=${this.KEY}`)
            .then(response => response.json());
    }
}

export default ImageApiService;