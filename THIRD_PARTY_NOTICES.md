# Nguồn tài nguyên

- React: MIT; Vite: MIT; Lucide: ISC; các giấy phép gốc nằm trong các gói cài đặt.
- Font Be Vietnam Pro, Bungee và Playfair Display được yêu cầu từ Google Fonts, có font dự phòng hệ thống.
- Âm thanh Web Audio và các khung huy hiệu, ánh sáng, bóng đổ được viết riêng cho dự án. Không dùng tài nguyên hình/âm thanh của các game slot tham khảo.

## Ảnh thật

`src/photo-credits.json` lưu tác giả, trang nguồn, ảnh gốc và giấy phép/tình trạng bản quyền từng ảnh. `public/food` chứa ảnh phục vụ popup; `public/illustrations` là bộ minh họa tiêu chí riêng, không dùng lại ảnh món. Có thay đổi kích thước, chuyển JPEG và crop hiển thị bằng CSS; ảnh món trong popup không được tạo bằng AI. Ghi công cũng hiển thị trong popup và trang nguồn ảnh.

Ảnh Wikimedia Commons có các điều kiện CC BY, CC BY-SA hoặc Public Domain cụ thể theo từng bản ghi; phải giữ ghi công, liên kết giấy phép và thông tin thay đổi. Không coi toàn bộ ảnh là cùng một giấy phép.

`src/venue-photos.json` ghi nguồn và credit của 51 ảnh trong `public/venues`, dùng trên thẻ 77 địa điểm/chi nhánh. Nguồn gồm website quán, MICHELIN Guide, Dân trí, VnExpress, Cổng du lịch/ATTP Hà Nội, VNA, menu beFood, hồ sơ Foody và các bài viết được liên kết cụ thể. Các ảnh còn bản quyền nguồn; chưa có xác nhận quyền phát hành lại. Ảnh chuỗi được gắn nhãn thương hiệu, không xác nhận không gian từng cơ sở. Trang `public/photo-credits.html#venue-photos` liệt kê ảnh và các địa điểm sử dụng. Ảnh đã chuyển JPEG/đổi kích thước, giữ watermark sẵn có; khung hiển thị có thể cắt bằng CSS.

Ảnh menu Don Chicken, Sinh Từ, Lotteria/beFood và một số ảnh bài viết được ghi **Bản quyền nguồn ảnh**. Việc truy cập được ảnh công khai hoặc ghi nguồn không đồng nghĩa được cấp phép tái sử dụng. Chưa xác nhận quyền phát hành lại các ảnh này. Trước khi deploy công khai, xin quyền chủ sở hữu hoặc thay bằng ảnh có quyền sử dụng phù hợp; cập nhật cả ảnh popup, thumbnail và bản ghi nguồn. Không có cam kết các ảnh này đều được chụp tại quán được gợi ý.

## Minh họa trong cuộn

43 hình mô tả tiêu chí được tạo riêng bằng công cụ imagegen tích hợp của OpenAI ngày 01/11/2026, lưu theo 5 atlas. Đây là minh họa được tạo bằng AI; không phải ảnh món thật, không phải ảnh tại quán và không lấy tài nguyên game casino. Bản PNG gốc ở `design/reel-illustrations/`, WebP giữ alpha ở `public/illustrations/`. Prompt gốc và lần chỉnh nền được lưu trong `research/slot-illustration-prompts.json`. Viền đồng và hiệu ứng lấp lánh được dựng bằng CSS.
