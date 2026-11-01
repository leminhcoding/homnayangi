# hôm nay ăn gì.

Máy slot chọn món chạy trên localhost bằng React, TypeScript và Vite. Thiết kế máy đỏ rượu vang, đồng vàng, cần gạt tương tác, ảnh đồ ăn thật, âm thanh Web Audio và popup chốt món. Không cần backend, tài khoản hay API key.

## Chạy tại máy

Cần Node.js 22.12+ và npm.

```bash
npm ci
npm run dev
```

Mở địa chỉ Vite in ra, mặc định http://localhost:5173. Nếu cổng đang bận, Vite chọn cổng tiếp theo.

## Trải nghiệm hiện tại

- 5 cuộn: **Nhóm món · Nguyên liệu · Vị · Kết cấu · Phong cách**. Điện thoại dọc dùng 3 + 2; khung thấp chuyển hai ô phụ sang dạng ngang gọn. Điện thoại ngang, tablet và laptop dùng một hàng khi đủ chiều rộng. Thân máy được căn giữa độc lập với cần gạt.
- Bố cục chia chiều cao `svh` giữa thanh điều khiển và máy, có lề an toàn dưới. Khu vực/giá gộp thành một dòng mở bộ lọc trên điện thoại; màn hình rất thấp gộp thêm hoàn cảnh ăn uống. Nút hướng dẫn chuyển lên header để dành chỗ cho máy. Khung cực thấp vẫn cho cuộn trang thay vì cắt nội dung.
- Hình trong cuộn là **43 minh họa tiêu chí riêng**, không lấy lại ảnh món ở popup. Nguyên liệu dùng vật thể riêng, vị dùng dấu gợi liên tưởng, kết cấu thể hiện cấu trúc và phong cách dùng dụng cụ/đặc trưng ẩm thực. Các hình đứng yên, đang quay và trong bảng chọn cùng một phong cách; nhãn chữ luôn hiển thị.
- 39 món, 11 nhóm món, 10 mô tả kết cấu, 5 phong cách và 77 địa điểm/chi nhánh thuộc 51 quán/thương hiệu ở 13 khu vực Hà Nội. Các chi nhánh được tính riêng; số món không nhân theo số quán.
- Chọn nhanh ăn no/ăn chơi, khu vực và giá; khẩu vị, bữa ăn, loại nguyên liệu muốn tránh nằm trong bộ lọc bổ sung.
- Chạm một ô để chọn và giữ tiêu chí; danh sách ghi số món còn phù hợp. Không thể chọn tổ hợp có 0 món. Các ô đang giữ vẫn được giữ khi quay.
- Kéo hoặc bấm cần gạt để quay, hoặc dùng Space khi không đứng trong nút/ô nhập. Đã bỏ hàng số món, nút quay và nút đặt lại khỏi mặt máy.
- Các cuộn dừng theo một món có thật trong dữ liệu, không ghép ngẫu nhiên thành món không tồn tại. Ưu tiên món ít xuất hiện trong lịch sử, tránh lặp 5 món gần nhất khi còn lựa chọn.
- Máy luôn có nhịp đèn chạy, phản chiếu trên viền và vòng sáng mời kéo cần khi chờ. Lõi đèn trắng ấm nằm trong chân đèn tối, vị trí bám theo đường cong thực tế khi đổi kích thước.
- Đèn sân khấu bật khi kéo cần, quét khi quay, sáng theo từng ô dừng và hội tụ khi chốt món. Có công tắc riêng trong bộ lọc; tôn trọng giảm chuyển động của hệ điều hành.
- Popup giữ ảnh món lớn, cho so sánh tối đa 3 quán cùng lúc và xem thêm khi cần. Chọn quán giữ nguyên món; các cơ sở cùng chuỗi gộp chung, chọn chi nhánh bằng dropdown. **Đi ăn thôi** mở đúng địa chỉ đang chọn trên Google Maps.
- 51 ảnh chụp riêng cho thẻ quán, phủ 77 địa điểm/chi nhánh. Ghi rõ mặt tiền, không gian, món tại quán hoặc ảnh thương hiệu. Ảnh thương hiệu được dùng chung trong cùng chuỗi, không khẳng định là ảnh chụp từng cơ sở. Nguồn ảnh và chi tiết quán nằm trong mục thu gọn.
- Âm thanh mở khóa bằng thao tác người dùng, có bật/tắt; hỗ trợ giảm chuyển động, Escape, giữ focus trong hộp thoại. Tùy chọn và lịch sử 200 lượt lưu cục bộ bằng localStorage.

## Dữ liệu và mức độ xác minh

Nguồn công khai được tra cứu ngày **01/11/2026**. Website **không cập nhật giá, giờ mở cửa hay tình trạng món theo thời gian thực**. Ngày tra cứu không đồng nghĩa ngày nguồn cập nhật.

Ưu tiên menu/địa chỉ chính thức; đối chiếu báo chí và nền tảng đặt món khi cần. Mỗi đề xuất lưu nguồn giá, nguồn địa chỉ, loại giá, khoảng giá và ghi chú. Một số menu chưa có ngày cập nhật; menu ảnh Sinh Từ đang được website đăng có đường dẫn tệp tháng 10/2024, nên đã đánh dấu giá tham khảo. Giá Lotteria ngoài Nguyễn Khánh Toàn lấy cơ sở này làm tham chiếu, không khẳng định đã xác nhận riêng từng chi nhánh. Menu Don Chicken là menu chung hệ thống Hà Nội, chưa xác nhận từng cơ sở.

Ngân sách lọc theo giá thấp nhất của món tại quán; topping/khẩu phần cao hơn có thể vượt mức chọn. Giá là theo **bát/phần/miếng/combo/bánh nguyên** ghi trên popup, không mặc định tổng bill một người. Bữa ăn là ngữ cảnh phù hợp, không phải bảo đảm quán đang mở. Tên khu vực theo tên quận quen thuộc, không phải danh mục đơn vị hành chính mới.

Mô tả kết cấu là phân loại biên tập theo thành phần/cảm giác nổi bật, có thể thay đổi theo công thức và cách chế biến. Bộ lọc nguyên liệu/ít cay là sở thích, không phải xác nhận dị ứng hoặc thành phần tuyệt đối. Không gắn rating, mức độ trendy hay trạng thái mở cửa thiếu nguồn.

## Build và deploy

```bash
npm test
npm run build
npm run preview
```

Upload **dist/** lên hosting static. Với hosting build từ source: install `npm ci`, build `npm run build`, output `dist`. Không cần biến môi trường. Bản hiện tại dùng đường dẫn tài nguyên từ gốc tên miền; nếu deploy dưới thư mục con, cần đổi `base` và đường dẫn ảnh/favicon.

## Sửa và mở rộng

- `src/App.tsx`: giao diện, cần gạt, chuỗi animation, bộ lọc, popup và lưu cục bộ.
- `src/responsive.css`: bố cục theo chiều rộng/chiều cao và container; điện thoại dọc/ngang, tablet và laptop.
- `src/data.ts`: món Hà Nội ban đầu, schema, 5 cuộn, phân loại kết cấu, bộ lọc và thuật toán chọn.
- `src/expanded-data.ts`: món bổ sung, menu chuỗi và chi nhánh đã đối chiếu.
- `src/venue-expansion.ts`: 29 địa điểm bổ sung cùng nguồn giá/địa chỉ và lý do chọn.
- `src/venue-photos.json` và `public/venues/`: ảnh chụp thật dành cho thẻ quán, nguồn và ghi công theo địa điểm.
- `src/MarqueeLights.tsx` và `src/marquee-geometry.ts`: đo viền máy, phân bố đèn đều theo đường cong ở mọi kích thước.
- `src/venue-options.ts`: gộp các chi nhánh cùng thương hiệu; `src/StageLighting.tsx`: đèn sân khấu.
- `src/reel-illustrations.ts`: ánh xạ mỗi tiêu chí tới một hình minh họa; `src/reel-illustration-atlases.json` lưu grid và kích thước ảnh; `src/reel-art.ts` là điểm truy cập cho giao diện.
- `src/audio.ts`: âm thanh tổng hợp gốc, không dùng âm thanh của casino.
- `src/photo-credits.json`: nguồn, tác giả và tình trạng giấy phép từng ảnh.
- `public/food/`: ảnh thật cho popup; `public/illustrations/`: atlas WebP nền trong suốt cho cuộn; `design/reel-illustrations/`: bản PNG gốc.
- `research/UX-AND-DATA.md`, `research/REEL-ILLUSTRATIONS.md`, `research/STAGE-AND-CHOICES.md` và `research/RESPONSIVE.md`: cơ sở thiết kế và nguồn nghiên cứu. Prompt tạo ảnh bằng imagegen tích hợp nằm trong `research/slot-illustration-prompts.json`.
- `tests/App.test.tsx`: dữ liệu/ảnh, bộ lọc, tính đa dạng, khóa ô, cần gạt, đổi quán và các luồng chính.

Khi thêm món, thêm địa điểm có nguồn, ảnh đúng món và credit; gán nhóm món/nguyên liệu/vị/kết cấu/phong cách, thêm ánh xạ ảnh cho tiêu chí mới. Nếu tạo tiêu chí mới, bổ sung minh họa riêng và chạy kiểm thử/build. Không thêm lựa chọn rỗng chỉ để làm danh mục trông phong phú.

Ảnh trong popup là ảnh chụp thật, không bảo đảm chụp tại chính quán gợi ý. Hình tiêu chí trên cuộn là minh họa được tạo bằng imagegen, không phải ảnh chụp thực phẩm hay ảnh của quán. Trong các ảnh popup, một số là Creative Commons; một số là ảnh thực đơn/báo chí còn bản quyền, **không có xác nhận cấp phép tái sử dụng**. Xem `THIRD_PARTY_NOTICES.md` và trang ghi công trước khi đưa tài nguyên ảnh đó lên website công khai. Font tải Google Fonts, có font hệ thống dự phòng.
