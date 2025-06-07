// Lấy tất cả các input field
const inputs = document.querySelectorAll('.input-group input');

// Thêm xử lý sự kiện Enter cho mỗi input
inputs.forEach((input, index) => {
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            // Nếu không phải input cuối cùng thì focus vào input tiếp theo
            if (index < inputs.length - 1) {
                inputs[index + 1].focus();
            } else {
                // Nếu là input cuối cùng thì kích hoạt nút đăng ký
                document.getElementById('signupBtn').click();
            }
        }
    });
});

// Xử lý đăng ký
function handleSignup() {
    // Lấy phần tử thông báo
    const notification = document.getElementById('notification');
    
    // Hiển thị thông báo
    notification.style.display = 'block';
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(function() {
        notification.style.display = 'none';
    }, 3000);
}

// Lắng nghe sự kiện click vào nút đăng ký
document.getElementById('signupBtn').addEventListener('click', handleSignup);
