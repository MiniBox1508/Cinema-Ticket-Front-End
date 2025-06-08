const API_BASE_URL = 'http://localhost:3000/api';

// Lấy ID phim từ URL
function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Lấy thông tin chi tiết phim
async function loadMovieDetails() {
    const movieId = getMovieIdFromUrl();
    if (!movieId) {
        window.location.href = 'movie.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (err) {
        console.error('Error loading movie details:', err);
    }
}

// Hiển thị thông tin chi tiết phim
function displayMovieDetails(movie) {
    document.title = `${movie.Title} - Chi tiết phim`;
    document.getElementById('movie-poster').src = movie.PosterUrl;
    document.getElementById('movie-title').textContent = movie.Title;
    document.getElementById('movie-genre').textContent = movie.Genre;
    document.getElementById('movie-director').textContent = movie.Director;
    document.getElementById('movie-release').textContent = new Date(movie.ReleaseDate).toLocaleDateString('vi-VN');
    document.getElementById('movie-duration').textContent = movie.Duration;
    document.getElementById('movie-rating').textContent = movie.Rating;
    document.getElementById('movie-description').textContent = movie.Description;

    // Cập nhật URL đặt vé
    const bookTicketBtn = document.querySelector('.book-ticket-btn');
    bookTicketBtn.href = `ticket.html?movieId=${movie.MovieId}`;
}

// Load thông tin phim khi trang được tải
document.addEventListener('DOMContentLoaded', loadMovieDetails);
