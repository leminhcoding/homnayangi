# Responsive và căn giữa máy

Cập nhật 01/11/2026 từ ảnh Safari trên điện thoại của chủ dự án.

## Vấn đề và cách sửa

Bản cũ xếp hai hàng slot có chiều cao cố định; toolbar Safari che phần dưới. Padding chỉ ở bên cần gạt làm thân máy lệch trái. Hiệu ứng quanh cần cũng thiếu khoảng trống ở mép.

Bản mới chia chiều cao giữa header, bộ lọc và máy bằng flex/grid. Dùng `100svh` để lấy khung nhỏ khi thanh trình duyệt còn mở, tránh máy nhảy kích thước theo việc ẩn/hiện thanh địa chỉ. Phần lề dưới tôn trọng `safe-area-inset-bottom`. Kích thước hình theo chiều cao/rộng thực của cửa sổ slot; giữ chữ đủ dòng và không để flex bóp mất dòng chữ. Với viewport quá thấp, chiều cao tối thiểu cho phép cuộn thay vì cắt điều khiển.

- Điện thoại dọc: 3 + 2 ô, hai ô dưới chuyển thành cửa sổ ngang khi phần máy còn ít chỗ. Khu vực/giá gộp thành một dòng mở bộ lọc; khung rất thấp gộp thêm hoàn cảnh ăn uống. Tất cả tùy chọn vẫn có trong modal. Điều khiển chính và nút Giữ giữ vùng chạm 44px.
- Màn hình ngang: năm ô trên một hàng, giảm trang trí và đưa hướng dẫn lên header.
- Tablet/laptop: một hàng năm ô; máy co theo chiều cao còn lại, giới hạn chiều cao để không kéo dài vô hạn trên màn hình lớn.
- Thân máy căn giữa độc lập với cần gạt. Các lề trái/phải cân đối; cần có khoảng riêng. Beam dùng lớp viewport phía sau, glow cần gạt giảm bán kính/blur trên điện thoại để không bị cắt ở mép.
- Giảm chuyển động của hệ điều hành và công tắc đèn sân khấu vẫn giữ nguyên.

Tham khảo kỹ thuật: [MDN — viewport length units](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length#relative_length_units_based_on_viewport), [WebKit — safe area](https://webkit.org/blog/7929/designing-websites-for-iphone-x/). Không chặn phóng to trang bằng viewport meta.

## Xác minh

`research/responsive-layout-checks.json` ghi phép đo trực tiếp từ ứng dụng chạy trên Vite trong iframe cùng origin của Chromium. Dùng các tên dài như “Bún & miến khô”, “Giòn sần sật”, “Đồ nhanh”. Đây là kiểm tra khung trình duyệt, không phải thử trên 19 máy vật lý hay kiểm thử Safari thật.

19 khung: 320×500, 360×560, 320×568, 360×640, 375×667, 390×720, 412×760, 430×780, 768×900, 1024×560, 1024×680, 1280×560, 1280×620, 1366×680, 1440×800, 1920×1080, 844×390, 667×375 và 568×320. Thêm một trường hợp chừa 34px dưới ở khung 375×667.

Ở các khung đã đo: không có độ tràn trang theo hai trục; tâm thân máy lệch 0px; các điều khiển chính và vùng vòng sáng nằm trong viewport; ảnh và chữ nằm trong cửa sổ chọn, không chồng nhau, không cắt dòng caption. Kiểm thử React kiểm tra mở bộ lọc qua dòng tóm tắt, đổi mục đích/khu vực/giá, áp dụng, lưu và tiếp tục quay. Kiểm thử hình học kiểm tra chân đèn trong viền ở các kích thước marquee mới.
