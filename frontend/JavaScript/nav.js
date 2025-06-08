document.addEventListener('DOMContentLoaded', () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (userInfo) {
        // Đã đăng nhập
        loginBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = userInfo.Name;
    } else {
        // Chưa đăng nhập
        loginBtn.style.display = 'flex';
        userMenu.style.display = 'none';
    }

    // Xử lý đăng xuất
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});
