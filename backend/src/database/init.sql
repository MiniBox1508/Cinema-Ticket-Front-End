USE MovieTheater;

-- Tạo bảng Room nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Room]') AND type in (N'U'))
BEGIN
    CREATE TABLE Room (
        RoomID INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Capacity INT NOT NULL,
        TheaterId INT NULL
    );
END
