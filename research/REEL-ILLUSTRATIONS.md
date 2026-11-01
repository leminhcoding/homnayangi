# Bộ minh họa tiêu chí cho máy slot

Nghiên cứu và thực hiện: 01/11/2026.

## Vấn đề

Ảnh chụp món trong cuộn từng được dùng lại từ popup. Điều này làm người dùng có thể tưởng cuộn đang báo trước món trúng; các tiêu chí như “Thịt bò” cũng bị minh họa quá cụ thể bằng một tô bún. Bộ hình mới dành riêng cho tiêu chí và không tham chiếu thư viện ảnh món.

## Cơ sở thiết kế

- [NN/g — Icon Usability](https://www.nngroup.com/articles/icon-usability/): chọn vật thể quen thuộc, giảm chi tiết để dễ đọc ở kích thước nhỏ; nhãn chữ luôn hiển thị giúp giải nghĩa trong ngữ cảnh.
- [NN/g — Usability Testing of Icons](https://www.nngroup.com/articles/icon-testing/): nhận ra vật thể và hiểu ý nghĩa trong sản phẩm là hai việc cần kiểm tra riêng.
- [IBM — Pictogram Usage](https://www.ibm.com/design/language/iconography/pictograms/usage/): căn giữa quang học, tỷ lệ nhất quán, có khoảng trống và tránh cắt mất đối tượng trong khung.
- [Google Material — Icon Principles](https://m1.material.io/style/icons.html): thống nhất ý tưởng và cách thể hiện trong cùng một bộ hình.

Đây là các nguyên tắc tham khảo cho quyết định thiết kế, không phải tuyên bố bộ hình đã đạt một tiêu chuẩn được chứng nhận hoặc đã được khảo sát với người dùng Hà Nội. Các hướng dẫn riêng cho nét vẽ/palette của từng thương hiệu không được coi là quy tắc bắt buộc cho app này.

## Quy tắc áp dụng

- **Nhóm món:** dụng cụ và hình dáng chung của nhóm, không dùng ảnh một món/quán cụ thể.
- **Nguyên liệu:** nguyên liệu riêng lẻ như thịt bò, thịt gà, đậu/nấm, rau củ.
- **Vị:** liên tưởng quen thuộc như chanh + đường, ớt, dừa + lạc. Không khẳng định hình đó là thành phần bắt buộc của tất cả món mang vị tương ứng.
- **Kết cấu:** hình thể hiện cấu trúc/cảm giác như vụn bánh giòn, ruột bánh có lỗ khí, bột nếp kéo dính và phô mai kéo sợi. Giữ nhãn và ví dụ vì “dai”, “dẻo”, “mịn”, “sánh” không có icon phổ quát được mọi người hiểu giống nhau.
- **Phong cách:** dụng cụ ăn uống/nguyên liệu đặc trưng làm dấu gợi liên tưởng, không dùng cờ hoặc ảnh món đang nằm trong danh sách kết quả.
- Giữ một phong cách minh họa vật thể có chiều sâu, ánh sáng ấm, màu tự nhiên; viền đồng lấy từ giao diện hiện có. Không dùng emoji làm nội dung cuộn.
- Không bỏ nhãn chữ hay tên tiêu chí. Minh họa trang trí không tạo tiếng đọc thừa cho trình đọc màn hình.
- Cùng bộ hình được dùng cho ô đứng yên, hàng lân cận, dải quay và hộp chọn tiêu chí.
- **Ảnh popup tiếp tục là ảnh món thật**, có ghi nguồn riêng như trước.

## Triển khai

43 hình mô tả tiêu chí được đóng gói trong 5 atlas WebP nền trong suốt (có PNG gốc). Mỗi atlas là một tài nguyên hình; SVG viewport chỉ lấy ô tương ứng để không méo tỷ lệ ảnh. Có khoảng đệm và giữ đối tượng nằm gọn trong khung.

- Ánh xạ tiêu chí và mô tả: `src/reel-illustrations.ts`.
- Metadata kích thước/grid: `src/reel-illustration-atlases.json`.
- Tài nguyên: `public/illustrations/reel-*.webp`; bản gốc `design/reel-illustrations/`.
- Prompt và phương thức tạo: `research/slot-illustration-prompts.json`; dùng công cụ imagegen tích hợp, không dùng API/CLI dự phòng.

Kiểm tra bằng build, kiểm thử đủ ánh xạ, kích thước/crop và tách biệt tài nguyên khỏi ảnh món. Kiểm tra trực quan ở kích thước desktop và điện thoại. Đây là kiểm tra của người triển khai; chưa thay thế kiểm thử nhận biết với nhóm người dùng đại diện.
