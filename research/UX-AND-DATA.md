# Ghi chú nghiên cứu và quyết định thiết kế

Tra cứu: 01/11/2026. Các quyết định dưới đây là suy luận thiết kế từ tài liệu và phản hồi của chủ dự án; chưa tiến hành phỏng vấn hoặc kiểm thử người dùng độc lập.

## Nhiệm vụ người dùng

Mục tiêu chính là chốt được **món gì, ở đâu, giá bao nhiêu**, với một thao tác quay vui. Phản hồi thực tế của chủ dự án: chữ nhỏ, nhiều nội dung không giúp chốt món, dữ liệu tập trung phố cổ, ít danh mục ăn vặt, popup chưa tạo cảm giác muốn đi ăn.

Ứng dụng:

- Ăn no/ăn chơi, khu vực và ngân sách ở ngoài để quyết định nhanh. Lọc chi tiết trong hộp thoại; bộ lọc đã áp dụng có thể nhìn thấy và gỡ.
- Popup cho ảnh thật lớn, tên món và tối đa 3 thẻ quán để so sánh; thông tin nguồn dài thu gọn. Chọn quán giữ nguyên món, các cơ sở cùng chuỗi gộp chung. Xem `STAGE-AND-CHOICES.md` về vòng cải tiến này.
- Máy chọn món trước rồi dừng các tiêu chí theo món ấy. Giữ ô không bị âm thầm nới điều kiện. Hiển thị số lựa chọn tương thích trong từng tùy chọn để tránh ngõ cụt.
- Không đếm một món thành nhiều món theo số cơ sở. Ưu tiên món chưa xuất hiện trong lịch sử giúp người dùng khám phá được toàn bộ dữ liệu trước khi lặp nếu bộ lọc giữ nguyên.
- Theo yêu cầu mới, bỏ toàn bộ hàng số món/nút quay/reset; cần gạt là thao tác trung tâm.

Tài liệu:

- [NN/g — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): nội dung nâng cao xuất hiện khi cần.
- [Baymard — Applied Filters](https://baymard.com/research-articles/how-to-design-applied-filters): làm trạng thái lọc dễ thấy và dễ gỡ.
- [Baymard — Filter UI](https://baymard.com/blog/ecommerce-filter-ui): danh mục và trình bày bộ lọc.
- [W3C WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/): focus, bàn phím, giảm chuyển động. Thiết kế chọn nút tương tác chủ yếu từ 44px; không tuyên bố đã audit đạt toàn bộ WCAG.

## Phân loại các ô

5 ô hiện tại: Nhóm món, Nguyên liệu, Vị, Kết cấu, Phong cách. Ăn no/ăn chơi là **mục đích**, bữa ăn là **ngữ cảnh**, giá và khu vực là **điều kiện đi ăn** nên nằm ngoài cuộn để giữ chủ động. Không thêm thời gian chuẩn bị hay mức độ đông khách vì chưa có dữ liệu đủ tin cậy.

Kết cấu khác vị: giòn, dai, dính, xốp, độ mịn, độ sánh và độ ẩm là những khía cạnh thường gặp trong cảm quan thực phẩm. Đã đổi “Giòn thơm” khỏi ô Vị để tránh trộn hai chiều. Từ ngữ Việt được biên tập dễ hiểu, không khẳng định là bản dịch chuẩn hóa hay thang đo phòng thí nghiệm.

10 lựa chọn có món thật hỗ trợ: giòn rụm, dai mềm, dẻo mềm, xốp mềm, mềm mọng, mịn mượt, sánh mịn, giòn sần sật, núng nính, kéo sợi. Ví dụ và ảnh nhấn vào thành phần nổi bật (như bánh burger xốp, xôi dẻo, phô mai kéo sợi). Một món có thể chứa nhiều kết cấu; app chỉ dùng một kết cấu nổi bật để giữ cuộn dễ hiểu.

Nguồn nghiên cứu chính:

- [Bondu et al., 2022 — Texture wheel & lexicon](https://pmc.ncbi.nlm.nih.gov/articles/PMC9562153/).
- [Kumar & Chambers, 2019 — Consumer terminology in four languages](https://pmc.ncbi.nlm.nih.gov/articles/PMC6835815/): nhấn mạnh ngữ cảnh và khác biệt ngôn ngữ, không dịch máy các thuật ngữ cảm quan.
- [Szczesniak, 1963 — Classification of Textural Characteristics](https://ift.onlinelibrary.wiley.com/doi/10.1111/j.1365-2621.1963.tb00215.x).

## Hướng thị giác và animation

Tham khảo nhịp dừng cuộn, tương phản tiêu điểm và kích thước biểu tượng của [NetEnt Starburst](https://netent.com/games/starburst), [Pragmatic Play Gates of Olympus](https://www.pragmaticplay.com/en/games/gates-of-olympus/) và video [Fire Joker mobile gameplay](https://vimeo.com/1020620869) (đã xem khoảng 40 giây qua trình duyệt). Tham khảo thêm chủ đề thực phẩm và symbol từ [Fruit Shop](https://netent.com/games/fruit-shop) và [Fruit Party](https://www.pragmaticplay.com/en/games/fruit-party-slot/).

Bản thiết kế riêng dùng burgundy/đồng, bóng nổi và đèn marquee; cần gạt kéo theo con trỏ; 5 cuộn dừng lệch nhịp; tiếng dừng tăng cao độ; bật sáng và mở đáp án tự động. Bản đầu thay emoji bằng ảnh thật dạng huy hiệu; sau phản hồi về việc trùng ảnh popup, bản hiện tại dùng 43 minh họa tiêu chí riêng tạo bằng imagegen. Minh họa đặt trong khung đồng, có highlight và bóng đổ. Ảnh thật chỉ dùng cho popup. Xem `REEL-ILLUSTRATIONS.md` về cơ sở thiết kế và ánh xạ ngữ nghĩa. Không sao chép sprite, logo, nhạc hay tài nguyên casino. Không có cược hoặc tiền thưởng.

## Dữ liệu quán

39 món, 77 địa điểm/chi nhánh thuộc 51 quán/thương hiệu, 13 khu vực; dữ liệu chưa phủ toàn bộ Hà Nội. Một số khu vực như Gia Lâm còn ít món. Ưu tiên liên kết nguồn theo từng bản ghi hơn là gắn nhãn “hot/trendy” không chứng minh được.

Nguồn gốc quan trọng:

- [Sinh Từ — menu](https://bunchasinhtu.vn/product/menu-bun-cha-sinh-tu/) và [chi nhánh](https://bunchasinhtu.vn/). Ảnh menu ghi đường dẫn 10/2024: giá đánh dấu tham khảo dù trang còn công khai.
- [Lotteria — chi nhánh chính thức](https://www.lotteria.vn/danh-sach-so-dien-thoai-cua-hang-LOTTERIA); giá/ảnh từ [beFood Nguyễn Khánh Toàn](https://food.be.com.vn/ha-noi/lotteria-nguyen-khanh-toan-13247). Cơ sở khác là tham chiếu, không phải xác minh giá riêng.
- [Don Chicken Hà Nội — menu](https://donchickenhanoi.vn/home/menu/vn/45), [cơm/canh](https://donchickenhanoi.vn/home/menu/vn/15), [chi nhánh](https://donchickenhanoi.vn/vn/store.html). Website không ghi thời điểm cập nhật bảng giá, dùng menu chung.
- [Chang Hi — cơ sở chính thức](https://www.changhi.vn/) và nguồn tham khảo giá lưu riêng trong từng bản ghi.
- [Pizza 4P’s](https://pizza4ps.com/): giá bánh nguyên, loại cơ sở Bảo Khánh đang thông báo tạm đóng để sửa chữa.
- [UDON shimizu](https://www.r-su.co.jp/en/udon/): menu bát udon và thông tin quán.
- [MICHELIN — Phở Gà Nguyệt](https://guide.michelin.com/vn/en/ha-noi/ha-noi_2974158/restaurant/pho-ga-nguyet): sửa địa chỉ thành 5B Phủ Doãn.

Các bài giá món địa phương 2025–2026 và liên kết nguồn còn lại được lưu trực tiếp trong `src/data.ts`, `src/expanded-data.ts`. Ngày tra cứu không làm nguồn cũ trở thành bảng giá mới. Không gọi điện cho quán trong phiên làm việc này.
