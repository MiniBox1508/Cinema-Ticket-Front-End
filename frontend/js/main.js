const API_URL = 'http://localhost:3000/api';

async function fetchMovies() {
    try {
        const response = await fetch(`${API_URL}/movies`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

async function login(credentials) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize your app
});
