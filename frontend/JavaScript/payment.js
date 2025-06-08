document.addEventListener('DOMContentLoaded', async () => {
    // Lấy thông tin từ sessionStorage 
    const ticketInfo = JSON.parse(sessionStorage.getItem('ticketInfo'));
    console.log('Ticket info:', ticketInfo); // Debug log

    if (!ticketInfo) {
        console.error('No ticket info found in session storage');
        return;
    }

    try {
        // Lấy giá vé từ API
        const response = await fetch(`http://localhost:3000/api/showtimes/theater/${ticketInfo.theaterId}/movie/${ticketInfo.movieId}`);
        const showtimes = await response.json();
        console.log('Showtimes:', showtimes); // Debug log

        // Tìm showtime tương ứng
        const showtime = showtimes.find(s => s.ShowtimeId === parseInt(ticketInfo.showtimeId));
        const ticketPrice = showtime ? showtime.Price : 90000; // Giá mặc định nếu không tìm thấy

        const ticketList = document.querySelector('.ticket_list');
        ticketList.innerHTML = ''; // Clear any existing tickets

        // Tạo vé cho mỗi ghế đã chọn
        ticketInfo.seats.forEach((seat, index) => {
            const ticketCard = document.createElement('div');
            ticketCard.className = 'ticket_card';
            ticketCard.innerHTML = `
                <input type="checkbox" class="ticket_checkbox" data-price="${ticketPrice}" checked>
                <div class="ticket_info">
                    <h3>Mã vé: TICKET${String(index + 1).padStart(3, '0')}</h3>
                    <p>Ghế: ${seat.number}</p>
                    <p>Phim: ${ticketInfo.movieName}</p>
                    <p>Rạp: ${ticketInfo.theaterName}</p>
                    <p>Phòng: ${ticketInfo.roomName}</p>
                    <p>Suất chiếu: ${ticketInfo.showtimeText}</p>
                    <p>Giá vé: ${ticketPrice.toLocaleString('vi-VN')} VNĐ</p>
                </div>
            `;
            ticketList.appendChild(ticketCard);
        });

        // Tính và hiển thị tổng tiền
        updateTotalAmount();
        
        // Debug logs
        console.log('Created tickets:', ticketList.children.length);
        console.log('Ticket price:', ticketPrice);

    } catch (err) {
        console.error('Error loading ticket information:', err);
    }

    // Hàm tính tổng tiền
    function updateTotalAmount() {
        const checkboxes = document.querySelectorAll('.ticket_checkbox:checked');
        const total = Array.from(checkboxes).reduce((sum, checkbox) => {
            return sum + parseInt(checkbox.dataset.price);
        }, 0);

        // Cập nhật tổng tiền ở cả hai nơi
        const totalAmountElements = [
            document.getElementById('total_amount'),           // Bảng bên trái
            document.querySelector('.payment_table #total_amount')  // Bảng thông tin thanh toán bên phải
        ];

        totalAmountElements.forEach(element => {
            if (element) {
                element.textContent = total.toLocaleString('vi-VN') + ' VNĐ';
            }
        });

        // Cập nhật số lượng vé đã chọn
        const selectedCount = document.getElementById('selected_count');
        if (selectedCount) {
            selectedCount.textContent = checkboxes.length;
        }

        // Tạo mã thanh toán
        const paymentId = document.getElementById('payment_id');
        if (paymentId) {
            paymentId.textContent = 'PAY' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        }
    }

    // Thêm sự kiện click cho các checkbox
    const checkboxes = document.querySelectorAll('.ticket_checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalAmount);
    });

    // Gọi hàm lần đầu để hiển thị giá trị ban đầu
    updateTotalAmount();

    // Thêm sự kiện click cho nút hoàn thành
    document.querySelector('.complete_button').addEventListener('click', async (e) => {
        e.preventDefault();
        
        const ticketInfo = JSON.parse(sessionStorage.getItem('ticketInfo'));
        const paymentMethod = document.getElementById('payment_method').value;
        const totalAmount = parseInt(document.getElementById('total_amount').textContent.replace(/[^\d]/g, ''));

        try {
            const response = await fetch('http://localhost:3000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tickets: ticketInfo.seats.map(seat => ({
                        seatNumber: seat.number,
                        price: totalAmount / ticketInfo.seats.length, // Chia đều giá cho các vé
                        showtimeId: ticketInfo.showtimeId
                    })),
                    payment: {
                        amount: totalAmount,
                        paymentMethod: paymentMethod || 'cash',
                        userId: 1 // Should come from auth system
                    }
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Đặt ${data.ticketCount} vé thành công!`);
                sessionStorage.removeItem('ticketInfo');
                window.location.href = 'home.html';
            } else {
                alert(data.error || 'Có lỗi xảy ra khi đặt vé');
            }
        } catch (err) {
            console.error('Booking error:', err);
            alert('Lỗi kết nối server');
        }
    });
});