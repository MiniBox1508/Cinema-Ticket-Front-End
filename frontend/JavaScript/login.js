// Hàm xử lý đăng nhập
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const notification = document.getElementById('notification');

    // Validate input
    if (!email || !password) {
        notification.textContent = 'Vui lòng điền đầy đủ email và mật khẩu';
        notification.style.display = 'block';
        return;
    }

    try {
        // Kiểm tra user có tồn tại
        const userResponse = await fetch('http://localhost:3000/api/users');
        const users = await userResponse.json();
        const user = users.find(u => u.Email === email);

        if (!user) {
            notification.textContent = 'Email không tồn tại';
            notification.style.display = 'block';
            return;
        }

        // Thực hiện đăng nhập
        const loginResponse = await fetch('http://localhost:3000/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await loginResponse.json();
        console.log('Login response:', data);

        if (loginResponse.ok) {
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            notification.textContent = 'Đăng nhập thành công!';
            notification.style.display = 'block';
            
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            notification.textContent = data.error || 'Sai mật khẩu';
            notification.style.display = 'block';
        }
    } catch (err) {
        console.error('Login error:', err);
        notification.textContent = 'Lỗi kết nối server';
        notification.style.display = 'block';
    }

    setTimeout(() => {
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