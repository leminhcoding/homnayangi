import type { ReelKey } from "./data";
import atlases from "./reel-illustration-atlases.json";

type AtlasKey = keyof typeof atlases;
export type ReelIllustration = {
  atlas: AtlasKey;
  index: number;
  description: string;
};
const entry = (
  atlas: AtlasKey,
  index: number,
  description: string,
): ReelIllustration => ({ atlas, index, description });

// General visual metaphors only. Never reuse a result photograph or imply a winning dish.
// Visible text labels remain the authoritative criterion, especially for sensory concepts.
export const reelIllustrations: Record<
  ReelKey,
  Record<string, ReelIllustration>
> = {
  type: {
    "Món nước": entry("groups", 0, "Bát nước dùng và hơi nóng"),
    "Bún & miến khô": entry("groups", 1, "Vắt sợi trên đĩa nông"),
    "Món hầm & chảo": entry("groups", 2, "Nồi đất có nắp"),
    "Bánh & cuốn": entry("groups", 3, "Xửng tre và bánh gói"),
    "Bánh mì & burger": entry("groups", 4, "Ổ bánh mì và hai nửa bánh tròn"),
    "Cơm & xôi": entry("groups", 5, "Bát cơm và hạt nếp"),
    "Đồ chiên & nướng": entry("groups", 6, "Rổ chiên với lớp bột vàng"),
    "Pizza & mì Ý": entry("groups", 7, "Pasta và miếng bánh đế mỏng"),
    "Chè & đồ ngọt": entry("groups", 8, "Ly tráng miệng nhiều lớp"),
    "Nộm & món trộn": entry("groups", 9, "Bát rau và sợi rau củ"),
    "Cháo & súp": entry("groups", 10, "Bát sánh mịn và thìa"),
  },
  protein: {
    "Thịt bò": entry("ingredients", 0, "Miếng thịt bò đỏ có vân mỡ"),
    "Thịt gà": entry("ingredients", 1, "Đùi gà nguyên liệu"),
    "Thịt heo": entry("ingredients", 2, "Lát thịt ba chỉ"),
    "Cá & hải sản": entry("ingredients", 3, "Cá và tôm"),
    "Phô mai": entry("ingredients", 4, "Miếng phô mai vàng"),
    "Rau củ": entry("ingredients", 5, "Cà rốt, bông cải và lá xanh"),
    "Sữa & hạt": entry("ingredients", 6, "Bình sữa và hạt hạnh nhân"),
    "Trái cây": entry("ingredients", 7, "Các lát trái cây"),
    "Đậu & nấm": entry("ingredients", 8, "Đậu phụ và nấm"),
    Trứng: entry("ingredients", 9, "Trứng nguyên và trứng bổ đôi"),
  },
  flavor: {
    "Thanh ngọt": entry("flavors", 0, "Nước dùng trong và nhánh thảo mộc"),
    "Đậm đà": entry("flavors", 1, "Nước tương sẫm và nấm khô"),
    "Béo bùi": entry("flavors", 2, "Dừa và lạc"),
    "Mặn ngọt": entry("flavors", 3, "Muối và mật ong"),
    "Chua ngọt": entry("flavors", 4, "Chanh và viên đường"),
    "Ngọt mát": entry("flavors", 5, "Đá, lát quả và lá bạc hà"),
    "Cay đậm": entry("flavors", 6, "Ớt đỏ"),
  },
  texture: {
    "Dai mềm": entry("textures", 0, "Sợi cong có độ đàn hồi"),
    "Mềm mọng": entry("textures", 1, "Quả bổ đôi với giọt nước"),
    "Giòn rụm": entry("textures", 2, "Bánh giòn bẻ có vụn"),
    "Dẻo mềm": entry("textures", 3, "Dải bột nếp kéo dính"),
    "Mịn mượt": entry("textures", 4, "Thìa kem bề mặt mượt"),
    "Xốp mềm": entry("textures", 5, "Ruột bánh cắt lộ lỗ khí"),
    "Kéo sợi": entry("textures", 6, "Các sợi phô mai nối dài"),
    "Núng nính": entry("textures", 7, "Khối thạch mềm nghiêng nhẹ"),
    "Giòn sần sật": entry("textures", 8, "Dưa chuột và cần tây"),
    "Sánh mịn": entry("textures", 9, "Thìa nhấc dải sánh khỏi bát"),
  },
  cuisine: {
    Việt: entry("styles", 0, "Bát men lam, đũa tre và rau thơm"),
    Ý: entry("styles", 1, "Dầu ô liu, húng quế và cà chua"),
    Nhật: entry("styles", 2, "Bát sơn đỏ đen và đũa"),
    "Đồ nhanh": entry("styles", 3, "Hộp mang đi và cốc giấy"),
    Hàn: entry("styles", 4, "Bát đá, thìa và đũa kim loại"),
  },
};

export function illustrationFor(key: ReelKey, value: string) {
  const illustration = reelIllustrations[key][value];
  const atlas = atlases[illustration.atlas];
  const cellWidth = atlas.width / atlas.columns;
  const cellHeight = atlas.height / atlas.rows;
  const size = Math.min(cellWidth, cellHeight);
  const x =
    (illustration.index % atlas.columns) * cellWidth + (cellWidth - size) / 2;
  const y =
    Math.floor(illustration.index / atlas.columns) * cellHeight +
    (cellHeight - size) / 2;
  return { ...illustration, ...atlas, viewBox: `${x} ${y} ${size} ${size}` };
}
