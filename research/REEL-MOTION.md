# Sửa animation dừng cuộn bị kéo lên trên

Ngày 01/11/2026.

Bố cục responsive mới đặt cửa sổ chọn ở `top: 0; height: 100%; transform: none`. Keyframes dừng cuộn cũ vẫn ghi `transform: translateY(-50%)` và cộng thêm độ nhún. Khi animation chạy, nó ghi đè vị trí căn giữa mới và đẩy kết quả lên nửa chiều cao cửa sổ. Ở khung 1280×620, phép đo trước sửa ghi lệch tới 91,64px. Rule `.landed` còn làm animation dừng chạy lại khi animation ăn mừng kết thúc và popup mở.

Sửa bằng cách dùng `scale` riêng cho nhịp nhún nhẹ quanh tâm, không ghi đè `transform` bố cục. Animation dừng chỉ áp dụng trong `phase-spinning`; khi sang ăn mừng hoặc mở popup, nó không chạy lại. Các ô còn quay vẫn dùng dải hình chuyển động như trước.

Tham khảo: [MDN — scale độc lập với transform](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scale).

## Kiểm tra chuyển động thực

`research/reel-motion-checks.json` ghi baseline trước sửa và sáu kịch bản sau sửa. Native Chrome kích hoạt cần gạt; trang kiểm tra lấy vị trí DOM/CSS mỗi 25ms qua các pha quay, dừng từng ô, ăn mừng và mở popup.

Khung sau sửa: 1280×620, 375×667, 320×500, 1440×800, 568×320; thêm đổi từ 1280×620 sang 375×667 khi animation dừng đầu tiên đang chạy. Mỗi lượt có khoảng 180 mẫu. Ở các lượt sau sửa, tâm cửa sổ chọn lệch 0px khi dừng/ăn mừng, các dải quay có nhiều vị trí khác nhau và animation dừng không còn hiện sau khi popup mở. Đây là kiểm tra Chromium theo khung, không phải thiết bị vật lý.

Bài kiểm tra thủ công giữ tại `tests/browser/reel-motion.html`, không nằm trong bản build production. Chạy Vite và mở `/tests/browser/reel-motion.html?w=1280&h=620`, kéo cần và chờ PASS. Có thể tải mẫu đo thành JSON. Mở lại trang cho mỗi lượt; thêm `&resize=1` để đổi kích thước giữa lượt quay. Bộ kiểm thử React cũng kiểm tra dừng lần lượt và trạng thái sau popup.
