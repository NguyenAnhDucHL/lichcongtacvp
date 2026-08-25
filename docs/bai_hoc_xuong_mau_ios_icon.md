# Bài Học Xương Máu: Cấu hình Logo/Icon cho Web App trên iOS (PWA)

## 1. Vấn Đề (Symptom)
- Khi người dùng sử dụng trình duyệt Safari trên iOS (iPhone/iPad) và nhấn **"Thêm vào Màn hình chính" (Add to Home Screen)**, thiết bị không nhận diện được logo của hệ thống (Quốc Huy). 
- Thay vào đó, iOS tự động hiển thị một ô vuông màu mặc định kèm theo ký tự đầu tiên của tiêu đề trang web (ví dụ: "L" cho "Lịch CT VP").

## 2. Nguyên Nhân Gốc Rễ (Root Cause)
- **Sai lầm về kích thước và dung lượng ảnh**: Hệ thống trước đó đã sử dụng chung 1 file ảnh `quoc_huy.png` cho cả favicon và PWA icon. File này có độ phân giải gốc cực lớn (`3200x3253 px`) và dung lượng nặng tới **7.1 MB**.
- **Đặc thù của HĐH iOS**: Trái với Android hay Windows (thường linh động auto-scale ảnh to), iOS Safari có một bộ tiêu chuẩn rất khắt khe cho `apple-touch-icon`:
  1. Ảnh **phải vuông tuyệt đối** (tỉ lệ 1:1). Ảnh cũ `3200x3253` là ảnh chữ nhật (dù chỉ lệch vài pixel).
  2. Kích thước (dimensions) phải chuẩn với các thiết bị Apple, thường là `180x180 px` hoặc các mốc tiêu chuẩn của PWA (`192x192 px`, `512x512 px`).
  3. Dung lượng ảnh quá lớn sẽ dẫn đến việc Safari từ chối (reject) render hình ảnh hoặc bị timeout khi fetch ảnh đưa ra Màn hình chính.

## 3. Cách Khắc Phục (Solution)
Để giải quyết triệt để và tương thích với mọi nền tảng:
- **Tạo các ảnh chuyên biệt (Optimized Icons):** Dùng công cụ crop và resize (như `sips` trên MacOS) để cắt và nén file gốc thành 3 phiên bản chuẩn:
  - `apple-touch-icon.png` (180x180 px) - Tiêu chuẩn tối thượng của iOS
  - `icon-192.png` (192x192 px) - Tiêu chuẩn Web App Manifest (Android/Chrome)
  - `icon-512.png` (512x512 px) - Icon chất lượng cao (Android/Chrome)
- **Khai báo tường minh trong `index.html`**:
  ```html
  <link rel="icon" type="image/png" href="/assets/icon-192.png" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
  ```
- **Khai báo trong `manifest.json`**: Trỏ chính xác mảng `icons` về 2 file `192` và `512`.

## 4. Bài Học Rút Ra (The "Bloody" Lesson)
> Không bao giờ dùng một bức ảnh gốc "raw" khổng lồ, nguyên bản để làm Web Icon hay Favicon.
> Việc "lười" resize không những gây lãng phí băng thông khủng khiếp cho người dùng mỗi khi tải trang web (load 7.1MB cho 1 cái icon nhỏ bằng ngón tay), mà còn vi phạm nghiêm trọng UX/UI chuẩn mực của nền tảng (Platform Specific Guidelines), dẫn đến các lỗi vỡ giao diện hoặc lỗi tính năng (như mất logo trên iOS Home Screen). Mọi resource media đều **phải** được tối ưu hóa trước khi phục vụ trên frontend.
