const selectBoxes = [
    { id: 'theater-filter', name: 'Rạp Phim' },
    { id: 'movie-filter', name: 'Phim' },
    { id: 'showtime-filter', name: 'Thời Gian Chiếu' },
    { id: 'room-filter', name: 'Phòng' }
];

selectBoxes.forEach(select => {
    const selectElement = document.getElementById(select.id);
    if (selectElement) {
        selectElement.addEventListener('change', (e) => {
            const selectedValue = e.target.value;
            const selectedText = e.target.options[e.target.selectedIndex].text;
            if (selectedValue) {
                console.log(`Đã chọn ${select.name}: ${selectedText} (${selectedValue})`);
            }
        });
    }
});

// Tạo lưới ghế
document.addEventListener('DOMContentLoaded', createSeatGrid);
const seatGrid = document.querySelector('.seat-grid');
const seatErrorMessage = document.querySelector('.seat-error-message');
const seatSelectionInfo = document.querySelector('.seat-selection-info');
let selectedSeats = 0;

function createSeatGrid() {
    // Tạo nhãn cột (1-10)
    seatGrid.innerHTML = '<div class="col-label"></div>'; // Ô trống ở góc
    for (let i = 1; i <= 10; i++) {
        seatGrid.innerHTML += `<div class="col-label">${i}</div>`;
    }

    // Tạo các hàng (A-I)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
rows.forEach(row => {
    seatGrid.innerHTML += `<div class="row-label">${row}</div>`;
    for (let col = 1; col <= 10; col++) {
        const seatId = `${row}${col}`;
        seatGrid.innerHTML += `<div class="seat" data-seat="${seatId}"><span>${seatId}</span></div>`;
    }
});

// Thêm thông báo lỗi và số lượng ghế
    seatGrid.innerHTML += `<div class="seat-error-message"></div>`;
    //seatGrid.innerHTML += `<div class="seat-selection-info">Đã chọn 0 ghế</div>`;

    seatGrid.innerHTML += `<div class="seat-selection-info"><span class="seat-count">Đã chọn 0 ghế</span><a href="payment.html" class="payment-button">Thanh Toán <i class="bi bi-arrow-right"></i></a></div>`;

    // Lấy tham chiếu mới
    const seatErrorMessage = document.querySelector('.seat-error-message');
    const seatSelectionInfo = document.querySelector('.seat-selection-info');

    // Thêm sự kiện click cho các ô ghế
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            if (seat.classList.contains('selected')) {
                // Bỏ chọn ghế
                seat.classList.remove('selected');
                selectedSeats--;
            } 

        else {
            // Kiểm tra nếu ghế đã được chọn
                if (seat.classList.contains('selected')) {
                    seatErrorMessage.textContent = 'Ghế đã được chọn, vui lòng chọn ghế khác';
                    seatErrorMessage.style.display = 'block';
                    setTimeout(() => {
                        seatErrorMessage.style.display = 'none';
                    }, 2000); // Ẩn thông báo sau 2 giây
                    return;
                }
                // Chọn ghế
                seat.classList.add('selected');
                selectedSeats++;
            }
            // Cập nhật thông báo số lượng ghế
            seatSelectionInfo.querySelector('span.seat-count').textContent = `Đã chọn ${selectedSeats} ghế`;
    });
    });
}