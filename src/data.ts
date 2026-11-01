import { extraDishes, sinhTuVenues } from "./expanded-data";
import { additionalVenues } from "./venue-expansion";
import venuePhotos from "./venue-photos.json";
export const RESEARCHED_AT = "2026-11-01";
export const RESEARCHED_LABEL = "01/11/2026";
export type Source = { label: string; url: string; date?: string };
export type VenuePhoto = {
  src: string;
  alt: string;
  kind: "exterior" | "interior" | "dish" | "brand";
  source: Source;
  credit: string;
  license: string;
};
export type Venue = {
  id: string;
  name: string;
  address: string;
  area: string;
  priceMin: number;
  priceMax: number;
  unit: string;
  priceType: "menu" | "reference";
  priceNote: string;
  priceSource: Source;
  infoSource: Source;
  hours?: string;
  phone?: string;
  note: string;
  tags: string[];
  video?: Source;
  brand?: string;
  reason?: string;
  photo?: VenuePhoto;
};
export type Dish = {
  id: string;
  name: string;
  type: string;
  protein: string;
  flavor: string;
  texture: string;
  area: string;
  description: string;
  image: string;
  photoId: string;
  venues: Venue[];
  intents: ("meal" | "snack")[];
  cuisine: string;
  proteins: string[];
  mealTimes: string[];
  spicy: boolean;
};
export type ReelKey = "type" | "protein" | "flavor" | "texture" | "cuisine";
export type Criteria = Pick<Dish, ReelKey>;
export type Filters = {
  budget: number;
  area: string;
  intent?: "all" | "meal" | "snack";
  cuisine?: string;
  mealTime?: string;
  excludedProteins?: string[];
  noSpicy?: boolean;
};
const src = (label: string, url: string, date?: string): Source => ({
  label,
  url,
  date,
});
const v = (
  id: string,
  name: string,
  address: string,
  area: string,
  min: number,
  max: number,
  unit: string,
  priceSource: Source,
  note: string,
  extra: Partial<Venue> = {},
): Venue => ({
  id,
  name,
  address,
  area,
  priceMin: min * 1000,
  priceMax: max * 1000,
  unit,
  priceType: "reference",
  priceNote:
    "Giá tham khảo từ nguồn công khai; kiểm tra lại với quán khi gọi món.",
  priceSource,
  infoSource: priceSource,
  note,
  tags: [],
  ...extra,
});
const venues = {
  batdan: v(
    "bat-dan",
    "Phở Gia Truyền Bát Đàn",
    "49 Bát Đàn, Hà Nội",
    "Hoàn Kiếm",
    55,
    70,
    "bát",
    src(
      "CafeF / Phụ Nữ Mới · 16/04/2026",
      "https://cafef.vn/pho-bat-dan-tang-gia-chong-mat-sau-20-nam-chi-co-qua-trung-la-con-nuong-tay-voi-vi-tien-cua-thuc-khach-188260416211108027.chn",
      "2026-04-16",
    ),
    "Quán phở bò truyền thống, thường xếp hàng và tự mang phở về bàn. Nên ghé ngoài giờ cao điểm.",
    { hours: "Khoảng 06:00–11:00 và 17:00–21:30", tags: ["Phở gia truyền"] },
  ),
  nguyet: v(
    "nguyet",
    "Phở Gà Nguyệt",
    "5B Phủ Doãn, Hà Nội",
    "Hoàn Kiếm",
    55,
    120,
    "bát",
    src(
      "Cổng ATTP Hà Nội · 14/10/2026",
      "https://antoanthucpham.hanoi.gov.vn/quan-pho-ga-noi-tieng-pho-co-ha-noi-tu-vai-chiec-ghe-nhua-den-dia-chi-hut-khach-quoc-te-239261009102607237.htm",
      "2026-10-14",
    ),
    "Chuyên phở gà nước và trộn. Khoảng giá thay đổi theo phần thịt; phần đùi thường cao hơn.",
    {
      infoSource: src(
        "MICHELIN Guide · địa chỉ & giờ",
        "https://guide.michelin.com/vn/en/ha-noi/ha-noi_2974158/restaurant/pho-ga-nguyet",
      ),
      hours: "06:30–00:00",
      phone: "0919106192",
      tags: ["MICHELIN Guide"],
      priceNote:
        "Khoảng 55–120 nghìn tùy phần thịt, theo bài 14/10/2026; không phải mọi bát đều cùng giá.",
    },
  ),
  huonglien: v(
    "huong-lien",
    "Bún Chả Hương Liên",
    "24 Lê Văn Hưu, Hà Nội",
    "Hai Bà Trưng",
    60,
    110,
    "suất",
    src(
      "Phụ Nữ Thủ Đô · 06/01/2026",
      "https://doisonggiadinh.baophunuthudo.vn/am-thuc/4-quan-bun-cha-hot-nhat-ha-noi-co-noi-duoc-michelin-khen-ngoi-120000-dongsuat-van-dong-nuom-nuop-c80a47103.html",
      "2026-01-06",
    ),
    "Địa chỉ thường được gọi là “bún chả Obama”. Chả miếng và chả viên ăn cùng bún, rau, nước chấm; nem gọi thêm.",
    {
      infoSource: src(
        "VnExpress · 30/08/2026",
        "https://vnexpress.net/5-quan-bun-cha-du-khach-nen-thu-khi-den-ha-noi-dip-2-9-5114839.html",
        "2026-08-30",
      ),
      phone: "02439434106",
      tags: ["MICHELIN Selected"],
      priceNote:
        "Báo ghi 60–110 nghìn tùy topping; chưa có bảng giá tháng 11/2026 được quán xác nhận.",
    },
  ),
  dackim: v(
    "dac-kim",
    "Bún Chả Đắc Kim",
    "1 Hàng Mành, Hà Nội",
    "Hoàn Kiếm",
    60,
    80,
    "suất",
    src(
      "Vietnammm · tổng hợp MICHELIN 2026",
      "https://vietnammm.com/michelin-guide-viet-nam/",
      "2026",
    ),
    "Một lựa chọn bún chả khác trong phố cổ. Phần ăn và món gọi thêm có thể khiến tổng bill cao hơn khoảng tham khảo.",
    {
      infoSource: src(
        "VnExpress · 30/08/2026",
        "https://vnexpress.net/5-quan-bun-cha-du-khach-nen-thu-khi-den-ha-noi-dip-2-9-5114839.html",
        "2026-08-30",
      ),
      tags: ["Trong MICHELIN Guide"],
    },
  ),
  baduc: v(
    "ba-duc",
    "Bún Thang Bà Đức",
    "48 Cầu Gỗ, Hà Nội",
    "Hoàn Kiếm",
    30,
    55,
    "bát",
    src(
      "Eva · 17/06/2026",
      "https://eva.vn/di-dau-xem-gi/7-mon-ngon-dac-san-pho-co-ha-noi-gia-chi-vai-chuc-nghin-dong-sang-trua-chieu-toi-muon-an-la-co-c40a674127.html",
      "2026-06-17",
    ),
    "Bát bún gà xé, trứng thái chỉ, giò lụa và nước dùng thanh. Quán ở trong ngõ nhỏ, cần chú ý số nhà.",
    {
      infoSource: src(
        "Tripadvisor · địa chỉ quán",
        "https://www.tripadvisor.com.vn/Restaurant_Review-g293924-d8845163-Reviews-Bun_Thang_Ba_Duc-Hanoi.html",
      ),
    },
  ),
  cotuyen: v(
    "co-tuyen",
    "Bún Đậu Cô Tuyến",
    "31 ngõ 29 Hàng Khay, Hà Nội",
    "Hoàn Kiếm",
    70,
    70,
    "mẹt 1 người",
    src(
      "Kamereo · 10/2026",
      "https://kamereo.vn/blog/vi/top-quan-bun-dau-hang-khay-ha-noi/",
      "2026-10",
    ),
    "Mẹt bún đậu với thịt, chả cốm và đồ ăn kèm. Quán trong ngõ nhỏ; giá phụ thuộc topping và số người.",
    {
      priceNote:
        "Nguồn 10/2026 ước tính mẹt một người khoảng 70.000đ; không dùng khoảng giá combo cho giá một suất.",
      tags: ["Phố cổ"],
    },
  ),
  thanglong: v(
    "thang-long",
    "Chả Cá Thăng Long",
    "19–21 Đường Thành, Hà Nội",
    "Hoàn Kiếm",
    150,
    170,
    "người",
    src(
      "PasGo · khoảng giá quán",
      "https://pasgo.vn/nha-hang/nha-hang-cha-ca-thang-long-duong-thanh-hoan-kiem-918",
    ),
    "Cá lăng ướp nghệ đảo cùng hành, thì là, ăn với bún và lạc. Phù hợp một bữa thong thả, đi cùng bạn bè.",
    {
      phone: "02438286007",
      priceNote:
        "Khoảng giá trên PasGo, nguồn không ghi ngày cập nhật menu; nguồn lưu ý giá chưa gồm VAT. Hỏi quán để biết tổng thanh toán.",
      tags: ["Chả cá Hà Nội"],
    },
  ),
  thanhvan: v(
    "thanh-van",
    "Bánh Cuốn Gia Truyền Thanh Vân",
    "14 Hàng Gà, Hà Nội",
    "Hoàn Kiếm",
    45,
    65,
    "đĩa",
    src(
      "VietKings / VietNamNet · 16/06/2026",
      "https://kyluc.vn/tin-tuc/thong-tin/3-quan-banh-cuon-gia-truyen-ha-noi-duoc-michelin-khen-ngoi-co-gi-khac-nhau",
      "2026-06-16",
    ),
    "Bánh tráng tại chỗ, có nhân thịt, gà hoặc tôm. Giá trong bài: thịt 45k, gà 50k, tôm 65k; giò chả gọi riêng.",
    {
      infoSource: src(
        "MICHELIN Guide · địa chỉ & giờ",
        "https://guide.michelin.com/us/en/ha-noi/ha-noi_2974158/restaurant/banh-cuon-gia-truyen-thanh-van-hang-ga-street",
      ),
      hours: "07:00–13:30 và 17:00–21:00",
      phone: "02438280108",
      tags: ["MICHELIN Guide"],
      priceNote:
        "45k nhân thịt, 50k nhân gà, 65k nhân tôm theo bài tháng 6/2026; đồ ăn kèm tính riêng.",
    },
  ),
  banhmi25: v(
    "banh-mi-25",
    "Bánh Mì 25",
    "25 Hàng Cá, Hà Nội",
    "Hoàn Kiếm",
    35,
    50,
    "ổ",
    src(
      "VietVoice · 10/2026",
      "https://vietvoice.jp/hanoi-gourmet/",
      "2026-10",
    ),
    "Quầy gọi món ở số 25, khu ngồi bên kia đường ở số 30 Hàng Cá. Quán được báo chí ghi nhận thường có khách xếp hàng.",
    {
      infoSource: src("Website chính thức Bánh Mì 25", "https://banhmi25.net/"),
      hours: "07:00–21:00",
      phone: "0942548214",
      tags: ["Được báo chí giới thiệu"],
      priceNote:
        "35–50 nghìn theo bài tham khảo tháng 10/2026; phần đặc biệt hoặc topping có thể khác.",
    },
  ),
  xoiyen: v(
    "xoi-yen",
    "Xôi Yến",
    "35B Nguyễn Hữu Huân, Hà Nội",
    "Hoàn Kiếm",
    83,
    83,
    "phần thập cẩm",
    src("Menu online Xôi Yến", "https://xoiyen.vn/"),
    "Xôi xéo đỗ xanh và hành phi, thêm các topping mặn. Giá dưới đây ứng với đúng phần xôi xéo thập cẩm, không phải xôi cơ bản.",
    {
      priceType: "menu",
      phone: "02462593818",
      tags: ["Có menu online"],
      priceNote:
        "83.000đ là giá online cho Xôi Xéo Thập Cẩm khi tra cứu. Giá ăn tại quán, phí giao hàng hoặc khuyến mãi có thể khác.",
    },
  ),
  huongmai: v(
    "huong-mai",
    "Phở Cuốn Hương Mai",
    "25 Ngũ Xã, Hà Nội",
    "Ba Đình",
    50,
    100,
    "phần / người",
    src(
      "Kamereo · 2026",
      "https://kamereo.vn/blog/vi/pho-cuon-ha-noi/",
      "2026",
    ),
    "Phở cuốn thịt bò và rau, ăn cùng nước chấm. Thương hiệu có thêm phở chiên phồng và phở chiên trứng.",
    {
      infoSource: src(
        "Website Phở Cuốn Hương Mai",
        "https://phocuon.vn/menus/?orderby=popularity",
      ),
      tags: ["Ngũ Xã"],
      priceNote:
        "Khoảng 50–100 nghìn tham khảo từ bài tổng hợp 2026; số cuốn trong phần cần hỏi quán. Cổng du lịch còn hiển thị mức thấp hơn nhưng không có ngày cập nhật nên không dùng làm giá hiện tại.",
    },
  ),
  dongthinh: v(
    "dong-thinh",
    "Miến Lươn Đông Thịnh",
    "87 Hàng Điếu, Hà Nội",
    "Hoàn Kiếm",
    45,
    55,
    "bát nước / trộn",
    src(
      "CafeF · 03/07/2025",
      "https://cafef.vn/khong-phai-pho-bo-hay-ga-mon-an-chua-toi-70000-dong-nay-moi-la-cai-ten-lot-top-7-ngon-nhat-the-gioi-188250703065804864.chn",
      "2025-07-03",
    ),
    "Có miến nước, trộn, xào; lươn giòn hoặc mềm. Chọn rõ loại miến khi gọi vì miến xào và đồ thêm có thể khác giá.",
    {
      infoSource: src(
        "MICHELIN Guide · thông tin quán",
        "https://guide.michelin.com/en/ha-noi/ha-noi_2974158/restaurant/mien-luon-%C4%91ong-thinh",
      ),
      phone: "02438267943",
      tags: ["MICHELIN Guide"],
      priceNote:
        "Nguồn giá riêng cho bát nước/trộn từ 07/2025, chưa xác minh được menu mới hơn tại Hà Nội. Cần hỏi lại quán; không lấy giá chi nhánh TP.HCM áp sang Hà Nội.",
    },
  ),
  banhgio: v(
    "banh-gio",
    "Bánh Giò Hồ Tây",
    "5 Thụy Khuê, Hà Nội",
    "Tây Hồ",
    20,
    33,
    "chiếc + đồ kèm",
    src(
      "Vinpearl · 2025",
      "https://vinpearl.com/vi/banh-gio-dong-cac-va-nhung-dia-chi-ngon-nhat-khong-the-bo-qua",
      "2025",
    ),
    "Bánh giò cỡ lớn, nhân thịt mộc nhĩ; có giò chả và đồ ăn thêm. Đồ gọi kèm làm giá phần ăn thay đổi.",
    {
      infoSource: src(
        "Cổng du lịch Hà Nội",
        "https://myhanoi.vn/vi/banhgiohotay",
      ),
      priceNote:
        "20–33 nghìn theo bài 2025; cổng du lịch hiển thị bánh 20k và giò 5k nhưng không ghi ngày cập nhật. Chưa xác nhận trực tiếp giá tháng 11/2026.",
    },
  ),
  banhduc: v(
    "banh-duc",
    "Bánh Đúc Nóng Lê Ngọc Hân",
    "Số 8, ngõ 8B Lê Ngọc Hân, Hà Nội",
    "Hai Bà Trưng",
    25,
    30,
    "bát",
    src(
      "Vietnammm · 08/10/2026",
      "https://vietnammm.com/banh-duc-nong-le-ngoc-han/",
      "2026-10-08",
    ),
    "Bánh đúc nóng với thịt băm, mộc nhĩ và hành phi. Nằm sâu trong ngõ, không gian nhỏ; hợp một bữa quà chiều.",
    {
      priceNote:
        "Bài 10/2026 dẫn lại mức 25–30 nghìn của MIA 01/2025; đây là ước lượng, chưa phải bảng giá mới do quán công bố.",
    },
  ),
  banhtom: v(
    "banh-tom",
    "Nhà Hàng Bánh Tôm Hồ Tây",
    "1 Thanh Niên, Hà Nội",
    "Tây Hồ",
    100,
    100,
    "đĩa 5 cái",
    src(
      "Vietnam Airlines · cẩm nang bánh tôm",
      "https://www.vietnamairlines.com/at/vi/plan-book/travel/travel-guide/banh-tom-ho-tay",
    ),
    "Bánh tôm chiên giòn ăn cùng rau và nước chấm. Không gian ven hồ; nên hỏi rõ khẩu phần trước khi gọi.",
    {
      infoSource: src(
        "Cổng du lịch Hà Nội",
        "https://myhanoi.vn/vi/nhahangbanhtomho",
      ),
      priceNote:
        "100.000đ / phần 5 cái theo cẩm nang Vietnam Airlines. Nguồn không ghi ngày cập nhật thực đơn; giá này là tham khảo, đồ uống và món khác tính riêng.",
      tags: ["Ven hồ"],
    },
  ),
  bachphuong: v(
    "bach-phuong",
    "Bún Bò Nam Bộ Bách Phương",
    "73–75 Hàng Điếu, Hà Nội",
    "Hoàn Kiếm",
    70,
    70,
    "bát",
    src(
      "Trip.com · review 15/03/2026",
      "https://vn.trip.com/restaurant/vietnam/hanoi/detail/bch-phng-bn-b-nam-b-137902053/",
      "2026-03-15",
    ),
    "Bún bò trộn rau, lạc và hành phi, thêm nước trộn chua ngọt. Địa chỉ trên hồ sơ hiện tại là 73–75 Hàng Điếu.",
    {
      hours: "07:30–22:30 (theo hồ sơ Trip.com)",
      phone: "0911529166",
      priceNote:
        "70.000đ là mức một thực khách ghi nhận ngày 15/03/2026, không phải giá được quán xác nhận hôm nay.",
      tags: ["Có review 2026"],
    },
  ),
  pizza: v(
    "pizza-4ps",
    "Pizza 4P’s Tràng Tiền",
    "43 Tràng Tiền, Hà Nội",
    "Hoàn Kiếm",
    168,
    168,
    "pizza nguyên chiếc",
    src(
      "Menu chính thức Pizza 4P’s",
      "https://pizza4ps.com/vn/menu?lang=vietnamese",
    ),
    "Pizza Margherita với cà chua, mozzarella và húng quế. Giá theo cả bánh, phù hợp gọi chia sẻ; nên đặt bàn trước.",
    {
      priceType: "menu",
      infoSource: src(
        "Pizza 4P’s · cơ sở Tràng Tiền",
        "https://pizza4ps.com/vn/location/922",
      ),
      hours: "10:30–23:00 · nhận món cuối 22:30",
      phone: "19006043",
      tags: ["Menu chính thức"],
      priceNote:
        "168.000đ / bánh Margherita trên menu chính thức khi tra cứu. Kiểm tra thuế, phí và menu tại cơ sở khi thanh toán. Không gợi ý cơ sở Bảo Khánh vì website báo đang sửa chữa.",
    },
  ),
  udon: v(
    "udon-shimizu",
    "UDON shimizu",
    "17 Phan Kế Bính, Giảng Võ, Hà Nội",
    "Ba Đình",
    150,
    150,
    "bát",
    src("Menu chính thức UDON shimizu", "https://www.r-su.co.jp/en/udon/"),
    "Udon bò trứng ấm, sợi mì làm thủ công. Tầng 1 có quầy nhìn bếp; tầng 2 có bàn cho nhóm nhỏ.",
    {
      priceType: "menu",
      hours: "T2–T6: 11:00–14:30, 17:00–23:30 · T7–CN: 11:00–23:30",
      phone: "0865200068",
      tags: ["Menu chính thức", "Có video review"],
      priceNote:
        "150.000đ cho Warm Egg and Beef Udon trên menu chính thức khi tra cứu. Hỏi quán về thuế/phí hoặc topping gọi thêm.",
      video: src(
        "Video review · Nhật Ký Ăn Ngon",
        "https://www.r-su.co.jp/en/udon/#access",
      ),
    },
  ),
};
function dish(
  id: string,
  name: string,
  type: string,
  protein: string,
  flavor: string,
  description: string,
  places: Venue[],
  photoId = id,
): Dish {
  return {
    id,
    name,
    type,
    protein,
    flavor,
    texture: "Dai mềm",
    area: places[0].area,
    description,
    image: `/food/${photoId}.jpg`,
    photoId,
    venues: places,
    intents: ["meal"],
    cuisine: id === "pizza" ? "Ý" : id === "udon" ? "Nhật" : "Việt",
    proteins: [protein],
    mealTimes: ["morning", "noon", "evening"],
    spicy: false,
  };
}
const baseDishes: Dish[] = [
  dish(
    "pho-bo",
    "Phở bò Hà Nội",
    "Món nước",
    "Thịt bò",
    "Thanh ngọt",
    "Nước dùng trong, bánh phở mềm và thịt bò. Một bữa rất Hà Nội.",
    [venues.batdan],
  ),
  dish(
    "pho-ga",
    "Phở gà",
    "Món nước",
    "Thịt gà",
    "Thanh ngọt",
    "Gà chắc ngọt, nước dùng thanh và chút lá chanh thơm.",
    [venues.nguyet],
  ),
  dish(
    "bun-cha",
    "Bún chả",
    "Bún & miến khô",
    "Thịt heo",
    "Đậm đà",
    "Chả nướng thơm, bún trắng và nước chấm chua ngọt. Trúng ngay món quen.",
    [venues.huonglien, venues.dackim],
  ),
  dish(
    "bun-thang",
    "Bún thang",
    "Món nước",
    "Thịt gà",
    "Thanh ngọt",
    "Gà xé, trứng thái chỉ, giò lụa và nước dùng thanh trong.",
    [venues.baduc],
  ),
  dish(
    "bun-dau",
    "Bún đậu mắm tôm",
    "Bún & miến khô",
    "Thịt heo",
    "Đậm đà",
    "Đậu giòn, bún lá và đồ ăn kèm. Một mẹt cho chiếc bụng đang đói.",
    [venues.cotuyen],
  ),
  dish(
    "cha-ca",
    "Chả cá Hà Nội",
    "Món chảo",
    "Cá & hải sản",
    "Đậm đà",
    "Cá thơm nghệ, hành và thì là xèo xèo trên chảo nóng.",
    [venues.thanglong],
  ),
  dish(
    "banh-cuon",
    "Bánh cuốn",
    "Bánh & cuốn",
    "Thịt heo",
    "Thanh ngọt",
    "Bánh cuốn mỏng mềm, nhân thịt mộc nhĩ và hành phi thơm.",
    [venues.thanhvan],
  ),
  dish(
    "banh-mi",
    "Bánh mì thịt nướng",
    "Bánh & cuốn",
    "Thịt heo",
    "Đậm đà",
    "Vỏ bánh giòn, thịt nướng và rau tươi. Gọn một ổ, vui cả bữa.",
    [venues.banhmi25],
  ),
  dish(
    "xoi",
    "Xôi xéo thập cẩm",
    "Cơm & xôi",
    "Thịt heo",
    "Béo bùi",
    "Nếp dẻo, đỗ xanh, hành phi và topping mặn. Một phần no thật lâu.",
    [venues.xoiyen],
  ),
  dish(
    "pho-cuon",
    "Phở cuốn bò",
    "Bánh & cuốn",
    "Thịt bò",
    "Thanh ngọt",
    "Bánh phở ôm thịt bò và rau, chấm nước mắm chua ngọt.",
    [venues.huongmai],
  ),
  dish(
    "mien-luon",
    "Miến lươn trộn",
    "Bún & miến khô",
    "Cá & hải sản",
    "Đậm đà",
    "Miến dai, lươn giòn và hành phi. Trộn đều là bắt đầu bữa ngon.",
    [venues.dongthinh],
  ),
  dish(
    "banh-gio",
    "Bánh giò",
    "Bánh & cuốn",
    "Thịt heo",
    "Béo bùi",
    "Bánh giò mềm nóng, nhân thịt mộc nhĩ. Quà chiều giản dị mà đủ vui.",
    [venues.banhgio],
  ),
  dish(
    "banh-duc",
    "Bánh đúc nóng",
    "Bánh & cuốn",
    "Thịt heo",
    "Đậm đà",
    "Bánh đúc mềm, nước chan ấm cùng thịt băm và hành phi.",
    [venues.banhduc],
  ),
  dish(
    "banh-tom",
    "Bánh tôm Hồ Tây",
    "Bánh & cuốn",
    "Cá & hải sản",
    "Giòn thơm",
    "Bánh tôm vàng giòn, rau mát và nước chấm. Hẹn một buổi dạo hồ.",
    [venues.banhtom],
  ),
  dish(
    "bun-bo-nam-bo",
    "Bún bò Nam Bộ",
    "Bún & miến khô",
    "Thịt bò",
    "Chua ngọt",
    "Bò xào, bún, rau xanh và lạc rang. Món trộn tươi vui cho ngày mới.",
    [venues.bachphuong],
  ),
  dish(
    "pizza",
    "Pizza Margherita",
    "Pizza & mì Ý",
    "Phô mai",
    "Béo bùi",
    "Cà chua, mozzarella và húng quế trên đế bánh nướng. Đổi gió một bữa.",
    [venues.pizza],
  ),
  dish(
    "udon",
    "Udon bò trứng",
    "Món nước",
    "Thịt bò",
    "Đậm đà",
    "Udon dai mềm cùng bò và trứng ấm, một lựa chọn Nhật giữa Hà Nội.",
    [venues.udon],
  ),
];
// Apply consistent categories; these are food characteristics, not restaurant opening claims.
for (const d of baseDishes) {
  if (["banh-gio", "banh-duc", "banh-tom"].includes(d.id))
    d.intents = ["meal", "snack"];
  if (d.id === "banh-mi") d.type = "Bánh mì & burger";
  if (["banh-gio", "banh-cuon", "pho-cuon", "banh-duc"].includes(d.id))
    d.type = "Bánh & cuốn";
  if (d.id === "banh-tom") d.type = "Đồ chiên & nướng";
  if (d.id === "cha-ca") d.type = "Món hầm & chảo";
  if (["banh-duc", "banh-tom", "cha-ca", "pizza"].includes(d.id))
    d.mealTimes = ["noon", "afternoon", "evening"];
  if (d.id === "pho-ga") d.mealTimes.push("late");
  if (d.id === "bun-thang")
    d.proteins = ["Thịt gà", "Thịt heo", "Trứng", "Cá & hải sản"];
  if (d.id === "bun-dau")
    d.proteins = ["Thịt heo", "Đậu & nấm", "Cá & hải sản"];
  if (d.id === "xoi") d.proteins = ["Thịt heo", "Thịt gà", "Trứng"];
  if (d.id === "udon") d.proteins = ["Thịt bò", "Trứng"];
  if (d.id === "bun-cha") d.venues.push(...sinhTuVenues(65, 80, "suất"));
  if (d.id === "bun-bo-nam-bo") d.venues.push(...sinhTuVenues(80));
  if (d.id === "pho-cuon") d.venues.push(...sinhTuVenues(65, 80, "phần"));
  if (d.id === "banh-cuon") d.venues.push(...sinhTuVenues(65));
  if (d.id === "banh-tom") d.venues.push(...sinhTuVenues(30, 30, "cái"));
}
export const dishes: Dish[] = [...baseDishes, ...extraDishes];
for (const d of dishes) {
  d.venues.push(...(additionalVenues[d.id] || []));
  for (const venue of d.venues) {
    const photo = venuePhotos.find((p) => p.venueId === venue.id);
    if (photo) venue.photo = photo as VenuePhoto;
  }
}
// Dominant mouthfeel of the named serving. Editorial descriptions, not laboratory measurements.
const textureGroups: Record<string, string[]> = {
  "Giòn rụm": [
    "banh-mi",
    "mien-luon",
    "banh-tom",
    "bun-nem",
    "nem-hai-san",
    "ga-ran",
    "ga-ran-phan",
    "khoai-tay",
  ],
  "Dẻo mềm": ["xoi", "banh-gio", "tteokbokki"],
  "Xốp mềm": ["burger-tom"],
  "Mềm mọng": [
    "bun-cha",
    "bun-dau",
    "cha-ca",
    "ga-ham-sam",
    "com-ga",
    "com-tron-ga",
  ],
  "Mịn mượt": ["tao-pho", "banh-duc"],
  "Sánh mịn": ["chao-suon"],
  "Giòn sần sật": ["nom-bo", "salad-ga"],
  "Núng nính": ["che-khuc-bach", "che-thai"],
  "Kéo sợi": ["pho-mai-que"],
};
for (const d of dishes) {
  d.texture =
    Object.entries(textureGroups).find(([, ids]) => ids.includes(d.id))?.[0] ||
    "Dai mềm";
  if (d.flavor === "Giòn thơm") d.flavor = "Mặn ngọt";
}
export const textureHints: Record<string, string> = {
  "Giòn rụm": "Vỡ giòn khi cắn · bánh mì, đồ chiên",
  "Dai mềm": "Mềm nhưng có độ dai khi nhai · phở, udon, cuốn",
  "Dẻo mềm": "Dẻo, hơi dính và kết khối · xôi, bánh giò, bánh gạo",
  "Xốp mềm": "Nhẹ, có lỗ khí, dễ cắn · phần bánh burger",
  "Mềm mọng": "Mềm, còn độ ẩm · thịt nướng, cá, gà hầm",
  "Mịn mượt": "Ít lợn cợn, trượt mềm trong miệng · tào phớ, bánh đúc",
  "Sánh mịn": "Đặc vừa, mịn và có độ sánh · cháo",
  "Giòn sần sật": "Giòn nhưng vẫn có lực nhai · rau củ trong nộm, salad",
  "Núng nính": "Mềm, rung nhẹ và đàn hồi · thạch trong chè",
  "Kéo sợi": "Phô mai nóng chảy, kéo thành sợi",
};
export const reelFields = [
  { key: "type", label: "Nhóm món", icon: "🍜" },
  { key: "protein", label: "Nguyên liệu", icon: "🥩" },
  { key: "flavor", label: "Vị", icon: "🌶️" },
  { key: "texture", label: "Kết cấu", icon: "🫧" },
  { key: "cuisine", label: "Phong cách", icon: "🌏" },
] as const;
export const areas = [
  "Hoàn Kiếm",
  "Ba Đình",
  "Đống Đa",
  "Hai Bà Trưng",
  "Tây Hồ",
  "Cầu Giấy",
  "Thanh Xuân",
  "Hoàng Mai",
  "Long Biên",
  "Hà Đông",
  "Nam Từ Liêm",
  "Bắc Từ Liêm",
  "Gia Lâm",
];
export const values = {
  ...Object.fromEntries(
    reelFields.map((f) => [f.key, [...new Set(dishes.map((d) => d[f.key]))]]),
  ),
  area: areas,
} as Record<ReelKey | "area", string[]>;
export const cuisines = [...new Set(dishes.map((d) => d.cuisine))];
export const criteriaOf = (d: Dish): Criteria => ({
  type: d.type,
  protein: d.protein,
  flavor: d.flavor,
  texture: d.texture,
  cuisine: d.cuisine,
});
export function emojiFor(key: ReelKey | "area", value: string) {
  const icons: Record<string, string> = {
    "Món nước": "🍜",
    "Bún & miến khô": "🍝",
    "Món hầm & chảo": "🥘",
    "Bánh & cuốn": "🥟",
    "Cơm & xôi": "🍚",
    "Pizza & mì Ý": "🍕",
    "Bánh mì & burger": "🥖",
    "Đồ chiên & nướng": "🍗",
    "Chè & đồ ngọt": "🍨",
    "Nộm & món trộn": "🥗",
    "Cháo & súp": "🥣",
    "Thịt bò": "🥩",
    "Thịt gà": "🍗",
    "Thịt heo": "🥓",
    "Cá & hải sản": "🍤",
    "Phô mai": "🧀",
    "Rau củ": "🥔",
    "Đậu & nấm": "🫘",
    "Sữa & hạt": "🥛",
    "Trái cây": "🥭",
    Trứng: "🍳",
    "Thanh ngọt": "🌿",
    "Đậm đà": "✨",
    "Béo bùi": "🥜",
    "Chua ngọt": "🍋",
    "Mặn ngọt": "🍯",
    "Cay đậm": "🌶️",
    "Giòn rụm": "🥐",
    "Dai mềm": "🍥",
    "Dẻo mềm": "🍡",
    "Xốp mềm": "🍞",
    "Mềm mọng": "🍗",
    "Mịn mượt": "🥄",
    "Sánh mịn": "🥣",
    "Giòn sần sật": "🥒",
    "Núng nính": "🍮",
    "Kéo sợi": "🧀",
    Việt: "🇻🇳",
    Nhật: "🇯🇵",
    Hàn: "🇰🇷",
    Ý: "🇮🇹",
    "Đồ nhanh": "🍔",
    "Ngọt mát": "🧊",
  };
  return (
    icons[value] ||
    (key === "area" ? "📍" : reelFields.find((f) => f.key === key)!.icon)
  );
}
export const money = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "đ";
export const priceLabel = (p: Venue) =>
  p.priceMin === p.priceMax
    ? money(p.priceMin)
    : `${new Intl.NumberFormat("vi-VN").format(p.priceMin)}–${money(p.priceMax)}`;
export const mapsUrl = (p: Venue) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + " " + p.address)}`;
export function matchingDishes(
  criteria: Criteria,
  locked: ReelKey[],
  filters: Filters,
) {
  return dishes.flatMap((d) => {
    if (!locked.every((k) => d[k] === criteria[k])) return [];
    if (
      filters.intent &&
      filters.intent !== "all" &&
      !d.intents.includes(filters.intent)
    )
      return [];
    if (filters.cuisine && d.cuisine !== filters.cuisine) return [];
    if (filters.mealTime && !d.mealTimes.includes(filters.mealTime)) return [];
    if (filters.noSpicy && d.spicy) return [];
    if (filters.excludedProteins?.some((p) => d.proteins.includes(p)))
      return [];
    const eligible = d.venues.filter(
      (v) =>
        (!filters.budget || v.priceMin <= filters.budget) &&
        (!filters.area || v.area === filters.area),
    );
    return eligible.length
      ? [{ ...d, area: eligible[0].area, venues: eligible }]
      : [];
  });
}
export function selectDish(
  pool: Dish[],
  recent: string[],
  random = Math.random,
): Dish | null {
  if (!pool.length) return null;
  const counts = new Map<string, number>();
  recent.forEach((id) => counts.set(id, (counts.get(id) || 0) + 1));
  const least = Math.min(...pool.map((d) => counts.get(d.id) || 0));
  const balanced = pool.filter((d) => (counts.get(d.id) || 0) === least);
  const fresh = balanced.filter((d) => !recent.slice(0, 5).includes(d.id));
  const choices = fresh.length ? fresh : balanced;
  return choices[
    Math.min(choices.length - 1, Math.floor(random() * choices.length))
  ];
}
