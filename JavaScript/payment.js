document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.ticket_checkbox');
    const selectedCount = document.getElementById('selected_count');
    const totalAmount = document.getElementById('total_amount');

    function updateSelection() {
        let count = 0;
        let total = 0;

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                count++;
                total += parseInt(checkbox.getAttribute('data-price'));
            }
        });

        selectedCount.textContent = count;
        totalAmount.textContent = total.toLocaleString('vi-VN') + ' VNĐ';
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelection);
    });

    // Khởi tạo trạng thái ban đầu
    updateSelection();
});