const API_BASE_URL = 'http://localhost:3000/api';

// Load movies khi trang được load
document.addEventListener('DOMContentLoaded', loadMovies);

async function loadMovies() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/movies`);
        const movies = await response.json();
        displayMovies(movies);
    } catch (err) {
        console.error('Error loading movies:', err);
        showError('Không thể tải danh sách phim');
    } finally {
        hideLoading();
    }
}

function displayMovies(movies) {
    const cardsContainer = document.querySelector('.cards');
    cardsContainer.innerHTML = '';

    movies.forEach(movie => {
        const card = createMovieCard(movie);
        cardsContainer.appendChild(card);
    });
}

function createMovieCard(movie) {
    const card = document.createElement('a');
    card.href = `movie-detail.html?id=${movie.MovieId}`; // Thay đổi href để trỏ đến trang chi tiết
    card.classList.add('card');
    
    card.innerHTML = `
        <img class="poster" src="${movie.PosterUrl || '../img/default-movie.jpg'}" alt="${movie.Title}">
        <div class="cont">
            <h3>${movie.Title}</h3>
            <p>${movie.Genre}, ${new Date(movie.ReleaseDate).getFullYear()},
               <span>IMDB</span> <i class="bi bi-star-fill"></i>${movie.Rating}</p>
        </div>
    `;
    return card;
}

// Search functionality
const searchInput = document.getElementById('search_input');
const searchResults = document.querySelector('.search');

searchInput.addEventListener('keyup', debounce(handleSearch, 300));

async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        searchResults.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/movies/search?q=${searchTerm}`);
        const movies = await response.json();
        displaySearchResults(movies);
    } catch (err) {
        console.error('Error searching movies:', err);
    }
}

function displaySearchResults(movies) {
    searchResults.innerHTML = '';
    movies.forEach(movie => {
        const searchCard = document.createElement('a');
        searchCard.href = `movie-detail.html?id=${movie.MovieId}`;
        searchCard.classList.add('search-card');
        
        searchCard.innerHTML = `
            <img class="poster" src="${movie.PosterUrl || '../img/default-movie.jpg'}" alt="${movie.Title}">
            <div class="cont">
                <h3>${movie.Title}</h3>
                <p>${movie.Genre}, ${new Date(movie.ReleaseDate).getFullYear()},
                   <span>IMDB</span> <i class="bi bi-star-fill"></i>${movie.Rating}</p>
            </div>
        `;
        searchResults.appendChild(searchCard);
    });
}

// Utils
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
