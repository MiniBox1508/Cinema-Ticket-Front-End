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

// API URLs
const API_BASE_URL = 'http://localhost:3000/api';

// Load dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    initializeSelectBoxes();
    loadTheaters();
    // Ẩn seat grid ban đầu
    const seatGrid = document.querySelector('.seat-grid');
    seatGrid.style.display = 'none';
});

// Khởi tạo trạng thái select boxes
function initializeSelectBoxes() {
    document.getElementById('movie-filter').disabled = true;
    document.getElementById('showtime-filter').disabled = true;
    document.getElementById('room-filter').disabled = true;
}

// API handlers
async function loadTheaters() {
    try {
        const response = await fetch(`${API_BASE_URL}/theaters`);
        const theaters = await response.json();
        const theaterSelect = document.getElementById('theater-filter');
        theaterSelect.innerHTML = '<option value="" disabled selected>Chọn Rạp Phim</option>';
        theaters.forEach(theater => {
            theaterSelect.innerHTML += `
                <option value="${theater.TheaterId}">${theater.Name}</option>
            `;
        });
    } catch (err) {
        console.error('Error loading theaters:', err);
        showError('Không thể tải danh sách rạp');
    }
}

async function loadMoviesByTheater(theaterId) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/theaters/${theaterId}/movies`);
        const movies = await response.json();

        const movieSelect = document.getElementById('movie-filter');
        movieSelect.innerHTML = '<option value="" disabled selected>Chọn Phim</option>';

        if (movies && movies.length > 0) {
            movies.forEach(movie => {
                movieSelect.innerHTML += `
                    <option value="${movie.MovieId}">${movie.Title}</option>
                `;
            });
            movieSelect.disabled = false;
        } else {
            movieSelect.innerHTML = '<option value="" disabled>Không có phim nào đang chiếu</option>';
        }
    } catch (err) {
        console.error('Error loading movies:', err);
        showError('Không thể tải danh sách phim');
    } finally {
        hideLoading();
    }
}

async function loadShowtimes() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/showtimes/details`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Showtimes data:', data); // Debug log

        const showtimeSelect = document.getElementById('showtime-filter');
        showtimeSelect.innerHTML = '<option value="" disabled selected>Chọn Suất Chiếu</option>';

        if (data && data.length > 0) {
            data.forEach(showtime => {
                const option = document.createElement('option');
                option.value = showtime.ShowtimeId;
                option.textContent = `${showtime.MovieTitle} - ${formatDateTime(showtime.StartTime)} - ${showtime.TheaterName}`;
                showtimeSelect.appendChild(option);
            });
            showtimeSelect.disabled = false;
        } else {
            showtimeSelect.innerHTML += '<option value="" disabled>Không có suất chiếu nào</option>';
        }
    } catch (err) {
        console.error('Error loading showtimes:', err);
        showError('Không thể tải danh sách suất chiếu');
    } finally {
        hideLoading();
    }
}

// Helper function to format date time
function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

async function loadRoomsByShowtime(showtimeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/showtime/${showtimeId}`);
        const rooms = await response.json();
        const roomSelect = document.getElementById('room-filter');
        roomSelect.innerHTML = '<option value="" disabled selected>Chọn Phòng</option>';
        rooms.forEach(room => {
            roomSelect.innerHTML += `
                <option value="${room.RoomId}">${room.Name}</option>
            `;
        });
        roomSelect.disabled = false;
    } catch (err) {
        console.error('Error loading rooms:', err);
        showError('Không thể tải danh sách phòng');
    }
}

// Event listeners
document.getElementById('theater-filter').addEventListener('change', async (e) => {
    const theaterId = e.target.value;
    if (theaterId) {
        try {
            showLoading();
            await loadMoviesByTheater(theaterId);
            // Reset các select box phụ thuộc
            document.getElementById('movie-filter').disabled = false;
            document.getElementById('showtime-filter').innerHTML = '<option value="" disabled selected>Chọn Suất Chiếu</option>';
            document.getElementById('showtime-filter').disabled = true;
            document.getElementById('room-filter').innerHTML = '<option value="" disabled selected>Chọn Phòng</option>';
            document.getElementById('room-filter').disabled = true;
        } catch (err) {
            console.error('Error:', err);
            showError('Không thể tải danh sách phim');
        } finally {
            hideLoading();
        }
    }
});

document.getElementById('movie-filter').addEventListener('change', async (e) => {
    const movieId = e.target.value;
    const theaterId = document.getElementById('theater-filter').value;
    
    if (movieId && theaterId) {
        try {
            showLoading();
            console.log('Loading showtimes for theater:', theaterId, 'movie:', movieId);
            
            const response = await fetch(`${API_BASE_URL}/showtimes/theater/${theaterId}/movie/${movieId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const showtimes = await response.json();
            console.log('Received showtimes:', showtimes);

            const showtimeSelect = document.getElementById('showtime-filter');
            // Reset showtime select
            showtimeSelect.innerHTML = '<option value="" disabled selected>Chọn Suất Chiếu</option>';
            showtimeSelect.disabled = true;

            if (showtimes && showtimes.length > 0) {
                showtimes.forEach(showtime => {
                    const option = document.createElement('option');
                    option.value = showtime.ShowtimeId;
                    option.textContent = new Date(showtime.StartTime).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    showtimeSelect.appendChild(option);
                });
                showtimeSelect.disabled = false;
            } else {
                showError('Không có suất chiếu nào cho phim này');
            }

            // Reset room select
            const roomSelect = document.getElementById('room-filter');
            roomSelect.innerHTML = '<option value="" disabled selected>Chọn Phòng</option>';
            roomSelect.disabled = true;

        } catch (error) {
            console.error('Error loading showtimes:', error);
            showError('Không thể tải danh sách suất chiếu');
            // Reset selects on error
            document.getElementById('showtime-filter').disabled = true;
            document.getElementById('room-filter').disabled = true;
        } finally {
            hideLoading();
        }
    } else {
        // Nếu chưa chọn đủ rạp và phim thì disable showtime
        document.getElementById('showtime-filter').disabled = true;
        document.getElementById('room-filter').disabled = true;
    }
});

document.getElementById('showtime-filter').addEventListener('change', async (e) => {
    const showtimeId = e.target.value;
    if (showtimeId) {
        try {
            showLoading();
            console.log('Loading rooms for showtime:', showtimeId);
            
            const response = await fetch(`${API_BASE_URL}/rooms/showtime/${showtimeId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const rooms = await response.json();
            console.log('Received rooms:', rooms);

            const roomSelect = document.getElementById('room-filter');
            roomSelect.innerHTML = '<option value="" disabled selected>Chọn Phòng</option>';

            if (rooms && rooms.length > 0) {
                rooms.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room.RoomId;
                    option.textContent = `${room.Name} - ${room.TheaterName}`;
                    roomSelect.appendChild(option);
                });
                roomSelect.disabled = false;
            } else {
                showError('Không có phòng nào cho suất chiếu này');
                roomSelect.disabled = true;
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
            showError('Không thể tải danh sách phòng');
            document.getElementById('room-filter').disabled = true;
        } finally {
            hideLoading();
        }
    } else {
        document.getElementById('room-filter').disabled = true;
    }
});

document.getElementById('room-filter').addEventListener('change', async (e) => {
    const RoomId = e.target.value;
    if (RoomId) {
        await loadAndDisplaySeats(RoomId);
    } else {
        document.querySelector('.seat-grid').style.display = 'none';
    }
});

async function loadAndDisplaySeats(RoomId) {
    try {
        showLoading();
        
        // Lấy thông tin tất cả ghế trong phòng
        const seatsResponse = await fetch(`${API_BASE_URL}/seats/room/${RoomId}`);
        const seats = await seatsResponse.json();

        // Lấy thông tin suất chiếu đã chọn 
        const showtimeId = document.getElementById('showtime-filter').value;
        
        // Lấy danh sách ghế đã được đặt
        const bookedSeatsResponse = await fetch(`${API_BASE_URL}/tickets/showtime/${showtimeId}/booked-seats`);
        const bookedSeats = await bookedSeatsResponse.json();
        
        // Tạo map các ghế đã được đặt
        const bookedSeatIds = new Set(bookedSeats.map(seat => seat.SeatId));

        // Đánh dấu ghế đã được đặt
        seats.forEach(seat => {
            seat.isBooked = bookedSeatIds.has(seat.SeatId);
        });

        displaySeats(seats);
        
    } catch (err) {
        console.error('Error loading seats:', err);
        showError('Không thể tải thông tin ghế');
    } finally {
        hideLoading();
    }
}

function displaySeats(seats) {
    const seatGrid = document.querySelector('.seat-grid');
    seatGrid.style.display = 'grid';
    seatGrid.innerHTML = '';
    
    // Add column headers
    seatGrid.innerHTML = '<div class="col-label"></div>';
    for (let i = 1; i <= 10; i++) {
        seatGrid.innerHTML += `<div class="col-label">${i}</div>`;
    }

    // Group seats by line
    const seatsByLine = {};
    seats.forEach(seat => {
        if (!seatsByLine[seat.Line]) {
            seatsByLine[seat.Line] = [];
        }
        seatsByLine[seat.Line].push(seat);
    });

    // Create rows 
    Object.keys(seatsByLine).sort().forEach(line => {
        seatGrid.innerHTML += `<div class="row-label">${line}</div>`;
        seatsByLine[line]
            .sort((a, b) => parseInt(a.SeatNumber) - parseInt(b.SeatNumber))
            .forEach(seat => {
                const seatClass = seat.isBooked ? 'seat occupied' : 'seat available';
                // Chỉ hiển thị số ghế (bỏ phần Line vì đã có ở row-label)
                seatGrid.innerHTML += `
                    <div class="${seatClass}" data-seat-id="${seat.SeatId}">
                        <span>${seat.SeatNumber}</span>
                    </div>`;
            });
    });

    // Add booking summary section
    seatGrid.innerHTML += `
        <div class="booking-summary">
            <div class="seat-count">Đã chọn 0 ghế</div>
            <button class="payment-button" disabled>
                Thanh Toán <i class="bi bi-arrow-right"></i>
            </button>
        </div>
    `;

    // Add click events
    const availableSeats = seatGrid.querySelectorAll('.seat.available');
    availableSeats.forEach(seat => {
        seat.addEventListener('click', () => {
            seat.classList.toggle('selected');
            updateBookingSummary();
        });
    });
}

function updateBookingSummary() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const seatCount = selectedSeats.length;
    
    const countDisplay = document.querySelector('.seat-count');
    const paymentButton = document.querySelector('.payment-button');
    
    countDisplay.textContent = `Đã chọn ${seatCount} ghế`;
    paymentButton.disabled = seatCount === 0;

    // Thêm xử lý click cho nút thanh toán
    paymentButton.onclick = () => {
        if (seatCount > 0) {
            // Lưu thông tin vé vào sessionStorage
            const ticketInfo = {
                theaterId: document.getElementById('theater-filter').value,
                theaterName: document.getElementById('theater-filter').selectedOptions[0].text,
                movieId: document.getElementById('movie-filter').value, 
                movieName: document.getElementById('movie-filter').selectedOptions[0].text,
                showtimeId: document.getElementById('showtime-filter').value,
                showtimeText: document.getElementById('showtime-filter').selectedOptions[0].text,
                roomId: document.getElementById('room-filter').value,
                roomName: document.getElementById('room-filter').selectedOptions[0].text,
                seats: Array.from(selectedSeats).map(seat => ({
                    id: seat.dataset.seatId,
                    number: seat.querySelector('span').textContent.trim()
                }))
            };
            
            sessionStorage.setItem('ticketInfo', JSON.stringify(ticketInfo));
            
            // Chuyển hướng sang trang payment
            window.location.href = 'payment.html';
        }
    };
}

// API handlers
async function bookTickets(seatIds, showtimeId, customerInfo) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                seatIds,
                showtimeId,
                customerInfo
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Booking response:', result);
        alert('Đặt vé thành công! Mã đặt chỗ: ' + result.bookingId);
        // Reset all selections
        resetAllSelections();
    } catch (err) {
        console.error('Error booking tickets:', err);
        showError('Không thể đặt vé, vui lòng thử lại sau');
    } finally {
        hideLoading();
    }
}

// Event listener for booking button
document.getElementById('book-button').addEventListener('click', () => {
    const selectedSeats = Array.from(document.querySelectorAll('.seat.selected'));
    const seatIds = selectedSeats.map(seat => seat.dataset.seatId);
    const showtimeId = document.getElementById('showtime-filter').value;

    if (seatIds.length === 0) {
        return showError('Vui lòng chọn ghế để đặt');
    }

    // Collect customer info from form
    const customerInfo = {
        name: document.getElementById('customer-name').value,
        phone: document.getElementById('customer-phone').value,
        email: document.getElementById('customer-email').value
    };

    // Validate customer info
    if (!validateCustomerInfo(customerInfo)) {
        return showError('Vui lòng điền đầy đủ thông tin khách hàng');
    }

    // Proceed to book tickets
    bookTickets(seatIds, showtimeId, customerInfo);
});

function validateCustomerInfo(info) {
    return info.name && info.phone && info.email;
}

// Thêm vào phần CSS để hiển thị ghế đẹp hơn
const style = document.createElement('style');
style.textContent = `
    .seat-grid {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 20px;
    }
    
    .seat-row {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .row-label {
        width: 30px;
        text-align: center;
        font-weight: bold;
    }
    
    .seat {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        cursor: pointer;
        background-color: #444;
        transition: all 0.3s;
    }
    
    .seat.available:hover {
        background-color: #666;
    }
    
    .seat.selected {
        background-color: #2ecc71;
    }
    
    .seat.occupied {
        background-color: #e74c3c;
        cursor: not-allowed;
    }

    .booking-info {
        margin-top: 20px;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 10px;
        color: white;
    }
`;
document.head.appendChild(style);

// Utility functions
function resetDependentSelects(fromSelectId) {
    const selects = ['movie-filter', 'showtime-filter', 'room-filter'];
    const startIndex = selects.indexOf(fromSelectId);
    
    for (let i = startIndex + 1; i < selects.length; i++) {
        const select = document.getElementById(selects[i]);
        select.innerHTML = `<option value="" disabled selected>Chọn ${select.name}</option>`;
        select.disabled = true;
    }
    
    clearSeatGrid();
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

function clearSeatGrid() {
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
        seat.classList.remove('selected', 'occupied');
    });
    updateSelectedInfo();
}

function updateSelectedInfo() {
    document.getElementById('selected-movie').textContent = 
        document.getElementById('movie-filter').selectedOptions[0]?.text || 'Chưa chọn';
    document.getElementById('selected-theater').textContent = 
        document.getElementById('theater-filter').selectedOptions[0]?.text || 'Chưa chọn';
    document.getElementById('selected-room').textContent = 
        document.getElementById('room-filter').selectedOptions[0]?.text || 'Chưa chọn';
    document.getElementById('selected-showtime').textContent = 
        document.getElementById('showtime-filter').selectedOptions[0]?.text || 'Chưa chọn';
}

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}