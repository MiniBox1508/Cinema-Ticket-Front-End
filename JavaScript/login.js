// Hàm xử lý đăng nhập
function handleLogin() {
    // Lấy phần tử thông báo
    const notification = document.getElementById('notification');
    
    // Hiển thị thông báo
    notification.style.display = 'block';
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(function() {
        notification.style.display = 'none';
    }, 3000);
}

// Lắng nghe sự kiện click vào nút đăng nhập
document.getElementById('loginBtn').addEventListener('click', handleLogin);

// Lắng nghe sự kiện nhấn Enter ở ô email
document.getElementById('email').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        // Ngăn chặn hành vi mặc định của phím Enter
        event.preventDefault();
        // Focus vào ô mật khẩu
        document.getElementById('password').focus();
    }
});

// Lắng nghe sự kiện nhấn Enter ở ô mật khẩu
document.getElementById('password').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        // Ngăn chặn hành vi mặc định của phím Enter
        event.preventDefault();
        // Thực hiện đăng nhập
        handleLogin();
    }
});
