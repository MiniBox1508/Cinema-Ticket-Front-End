-- Thêm dữ liệu mẫu cho bảng Payment
INSERT INTO Payment (PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId) VALUES
(N'completed', 100000.00, '2024-10-31 18:00:00', N'cash', 1),
(N'completed', 100000.00, '2024-11-01 12:00:30', N'visa credit', 2),
(N'completed', 100000.00, '2024-11-01 13:00:00', N'cash', 3),
(N'completed', 100000.00, '2024-11-01 15:00:30', N'cash', 4),
(N'completed', 100000.00, '2024-11-01 18:00:00', N'cash', 5),
(N'completed', 100000.00, '2024-11-01 19:00:30', N'visa credit', 6);

-- Thêm các ràng buộc khóa ngoại nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'FK_Payment_Users'))
BEGIN
    ALTER TABLE Payment
    ADD CONSTRAINT FK_Payment_Users FOREIGN KEY (UserId)
    REFERENCES Users(UserId);
END
