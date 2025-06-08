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

async function handleSignup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const notification = document.getElementById('notification');

    // Validate input
    if (!name || !email || !phone || !password) {
        notification.textContent = 'Vui lòng điền đầy đủ thông tin';
        notification.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: name,
                Email: email,
                Phone: phone,
                Password: password
            })
        });

        const data = await response.json();
        console.log('Signup response:', data); // Debug log

        if (response.ok) {
            notification.textContent = 'Đăng ký thành công!';
            notification.style.display = 'block';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } else {
            notification.textContent = data.error || 'Đăng ký thất bại';
            notification.style.display = 'block';
        }
    } catch (err) {
        console.error('Error during signup:', err);
        notification.textContent = 'Lỗi kết nối server';
        notification.style.display = 'block';
    }

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Lắng nghe sự kiện click vào nút đăng ký
document.getElementById('signupBtn').addEventListener('click', handleSignup);