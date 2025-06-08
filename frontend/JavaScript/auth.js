function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // If no token or user info, redirect to login
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Update UI with user info
    const userInfo = JSON.parse(user);
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userInfo.Name;
    }
}

// Add to all protected pages
document.addEventListener('DOMContentLoaded', checkAuth);
