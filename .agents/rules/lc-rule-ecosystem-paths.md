# LC-RULE-ECOSYSTEM-PATHS

Quy tắc này giúp AI tự động nhận diện toàn bộ hệ sinh thái mã nguồn của Phường Cẩm Phả trên máy tính của Developer. Khi có bất kỳ yêu cầu nào liên quan đến các dự án này, AI KHÔNG CẦN hỏi lại đường dẫn mà tự động tìm đến đúng vị trí.

## Hệ sinh thái 3 Source Code chính

### 1. Lịch Công Tác cho Văn Phòng
- **Local Path**: `/Users/macbookpro/Documents/lichcongtacvp`
- **Domain Server**: `lichcongtacvp.vpdtcampha.vn`
- **Đặc điểm**: Hệ thống mới, backend C# ASP.NET Core, frontend React.
- **Deploy**: Script `./deploy_to_vnpt.sh`

### 2. Lịch Công Tác cho Uỷ Ban
- **Local Path**: `/Users/macbookpro/lichcongtac`
- **Domain Server**: `lichcongtac.vpdtcampha.vn`
- **Đặc điểm**: Chạy docker-compose trên port nội bộ `59608:5000`.

### 3. Tool-Calendar (Quản lý Công Văn & API Gateway)
- **Local Path**: `/Users/macbookpro/Tool-Calendar`
- **Domain Server**: `congvan.vpdtcampha.vn` (Dành cho `official-doc-backend`) và `vpdtcampha.vn` (Uptime Kuma).
- **ĐẶC BIỆT (API Gateway)**: Thư mục `gateway` bên trong dự án này chính là trái tim mạng của toàn bộ hệ sinh thái. Nginx API Gateway được deploy độc lập bằng script `./deploy_gateway.sh`.

## Quy tắc áp dụng
- Không được nhầm lẫn giữa `lichcongtac` và `lichcongtacvp`.
- Khi cần cấu hình SSL, tên miền mới -> Bắt buộc thực hiện trên `Tool-Calendar/gateway`.
