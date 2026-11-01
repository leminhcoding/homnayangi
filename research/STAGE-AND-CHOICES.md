# Đèn sân khấu, lựa chọn quán và ảnh thật

Tra cứu và triển khai ngày 01/11/2026. Đây là quyết định thiết kế từ phản hồi chủ dự án và tài liệu, chưa phải kết quả phỏng vấn người dùng.

## Popup giúp chốt địa điểm

Người dùng đã thích món vừa quay nhưng có thể muốn đổi vì giá, khu vực, khẩu phần hoặc kiểu phục vụ. Hiện 3 thương hiệu đồng thời giúp so sánh mà không cần nhớ quán trước. Thứ tự thông tin cố định: ảnh → khu vực → tên → giá/đơn vị → lý do cân nhắc → địa chỉ. Trên điện thoại dùng các hàng ảnh bên trái, thông tin bên phải. Khi chỉ có 1–2 thương hiệu, thẻ tự giãn để tránh cột trống. Có xem thêm từng 3 quán.

[NN/g — Comparison Tables](https://www.nngroup.com/articles/comparison-tables/) nhấn mạnh nội dung nhất quán, dễ quét và bố cục đơn giản khi so sánh một số lựa chọn. Áp dụng nguyên tắc đó vào thẻ, không dựng bảng nhiều cột trên điện thoại. Chi nhánh cùng chuỗi gộp một thẻ để không lấn át các quán khác. Radio chọn thương hiệu, dropdown chọn chi nhánh; Google Maps luôn lấy đúng bản ghi đang chọn và chỉ có chi nhánh còn khớp bộ lọc.

Lý do chọn lấy từ nguồn về quán hoặc thuộc tính kiểm chứng được: tự phục vụ, không gian nhỏ, bán phần/combo, topping tùy chọn, khu vực/cơ sở. Không tạo rating, khoảng cách, trạng thái mở cửa hoặc mức độ đông theo thời gian thực.

## Nhịp ánh sáng

Kéo cần bật hai đèn vàng/kem; quay có quét chậm và đèn viền chạy; ô dừng có một vệt sáng cục bộ; chốt món hội tụ ánh sáng rồi mở popup. Không dùng màn hình trắng chớp toàn trang. Chu kỳ đèn viền 1,45 giây, ăn mừng 1,2 giây; quét 2,8–3,2 giây. Các beam dựng bằng gradient/transform, không tải video hoặc thư viện hiệu ứng.

Tham khảo [W3C — Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) và [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Có công tắc đèn và CSS giảm chuyển động. Đây là lựa chọn giảm hiệu ứng mạnh, chưa phải tuyên bố đã audit toàn bộ WCAG hay đo ngưỡng flash bằng công cụ chuyên dụng.

## Dữ liệu và ảnh

Thêm 29 địa điểm, nâng tổng lên 77 địa điểm/chi nhánh thuộc 51 quán/thương hiệu. Giá thêm lấy từ menu chính thức Anh Vũ, menu ảnh Bún Chả Ta 2026, menu beFood và báo chí có ngày. Giá cũ như các quán phở trong bài Dân trí 12/2024, Phở Tiến 01/2025 và Phở Châm 01/2025 vẫn ghi rõ thời điểm và là tham khảo; không gọi là giá tháng 11/2026 đã xác nhận. Không gọi điện cho quán.

- [Anh Vũ — menu và 5 cơ sở](https://chacaanhvu.vn/).
- [Bún Chả Ta — menu 2026](https://bunchata.com/menu-bun-cha-ta.html).
- [VietNamNet — 3 quán bánh cuốn, 06/2026](https://vietnamnet.vn/3-quan-banh-cuon-gia-truyen-ha-noi-duoc-michelin-khen-ngon-co-gi-khac-nhau-2525260.html).
- [beFood — Phở Hằng](https://food.be.com.vn/ha-noi/pho-hang-pho-ga-bun-thang-truyen-thong-doi-can-33452), [Hiền Anh](https://food.be.com.vn/ha-noi/tao-pho-hien-anh-nghia-tan-142889), [Bảo Bảo](https://food.be.com.vn/ha-noi/bao-bao-com-tron-va-do-an-han-quoc-sai-dong-54273). Các nguồn khác lưu theo từng bản ghi trong `src/venue-expansion.ts`.

51 ảnh thật trong `public/venues`, không lấy bộ minh họa AI của ô slot để giả làm ảnh quán. Mỗi địa điểm có ảnh và nguồn trong `src/venue-photos.json`. Chuỗi chia sẻ một ảnh đại diện có nhãn rõ. Phần lớn là ảnh món tại quán; có mặt tiền/không gian khi nguồn xác định được. Một số ảnh nguồn được chụp trước 2026. Không suy diễn ảnh menu thành ảnh mặt tiền. Loại ảnh mặc định beFood, logo thay ảnh và ảnh nhầm địa chỉ khỏi kết quả cuối. Nguồn ảnh gốc tải về lưu trong các JSON `research/venue-photo-*-downloads.json` và trang ghi công; quyền ảnh theo từng chủ sở hữu.

## Kiểm tra

Kiểm thử dữ liệu/ảnh, gộp đúng thương hiệu và lọc chi nhánh, chọn quán giữ món, đổi Maps, xem thêm, trạng thái đèn và lưu công tắc. Kiểm tra luồng thực qua Chrome ở localhost. Tất cả ảnh phục vụ từ thư mục local để không phụ thuộc hotlink khi người dùng quay.
