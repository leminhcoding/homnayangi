// @vitest-environment jsdom
import React from "react";
import { readFileSync, statSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import App from "../src/App";
import {
  areas,
  criteriaOf,
  dishes,
  mapsUrl,
  matchingDishes,
  reelFields,
  selectDish,
  textureHints,
  values,
  type Filters,
} from "../src/data";
import credits from "../src/photo-credits.json";
import venuePhotos from "../src/venue-photos.json";
import { groupVenues } from "../src/venue-options";
import { artFor, reelIllustrations } from "../src/reel-art";

const audio = vi.hoisted(() => ({
  unlock: vi.fn(),
  pull: vi.fn(),
  spin: vi.fn(),
  stopReel: vi.fn(),
  win: vi.fn(),
  setEnabled: vi.fn(),
  destroy: vi.fn(),
}));
vi.mock("../src/audio", () => ({
  SlotAudio: class {
    unlock = audio.unlock;
    pull = audio.pull;
    spin = audio.spin;
    stopReel = audio.stopReel;
    win = audio.win;
    setEnabled = audio.setEnabled;
    destroy = audio.destroy;
  },
}));
const noFilters: Filters = { budget: 0, area: "" };
beforeEach(() => {
  const entries = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, String(value));
    },
    removeItem: (key) => {
      entries.delete(key);
    },
    key: (index) => [...entries.keys()][index] ?? null,
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
  });
  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
  });
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn(() => ({ matches: false })),
    configurable: true,
  });
  Object.defineProperty(window, "PointerEvent", {
    value: MouseEvent,
    configurable: true,
  });
  window.HTMLElement.prototype.setPointerCapture = vi.fn();
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0);
  vi.clearAllMocks();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
const finish = () =>
  act(() => {
    vi.runAllTimers();
  });
const spin = () => {
  fireEvent.click(screen.getByRole("button", { name: "Kéo cần gạt để quay" }));
  finish();
};
const dialog = () => screen.getByRole("dialog");

describe("Hanoi data and selection integrity", () => {
  it("has a different real photo, image credit, venue and sourced price for every dish", () => {
    expect(dishes.length).toBeGreaterThanOrEqual(39);
    expect(new Set(dishes.map((d) => d.image)).size).toBe(dishes.length);
    for (const d of dishes) {
      const file = new URL("../public" + d.image, import.meta.url);
      expect(statSync(file).size).toBeGreaterThan(10000);
      const bytes = readFileSync(file);
      expect(bytes[0]).toBe(0xff);
      expect(bytes[1]).toBe(0xd8);
      const credit = credits.find((c) => c.id === d.photoId)!;
      expect(credit).toBeTruthy();
      expect(credit.page).toMatch(/^https:\/\//);
      expect(credit.artist.length).toBeGreaterThan(0);
      expect(credit.license.length).toBeGreaterThan(0);
      for (const v of d.venues) {
        expect(v.address).toContain("Hà Nội");
        expect(v.priceMin).toBeGreaterThan(0);
        expect(v.priceMax).toBeGreaterThanOrEqual(v.priceMin);
        expect(v.priceSource.url).toMatch(/^https:\/\//);
        expect(v.infoSource.url).toMatch(/^https:\/\//);
        expect(v.priceNote.length).toBeGreaterThan(30);
        expect(mapsUrl(v)).toContain(encodeURIComponent(v.address));
        expect(v.name).not.toContain("Bảo Khánh");
      }
    }
  });
  it("covers every criterion with a distinct illustration, independent of result photos", () => {
    const cells = new Set<string>();
    for (const field of reelFields)
      for (const value of values[field.key]) {
        const art = artFor(field.key, value);
        expect(reelIllustrations[field.key][value]).toBeTruthy();
        expect(art.description.trim()).not.toBe("");
        expect(art.src).toMatch(/^\/illustrations\/reel-.*\.webp$/);
        const bytes = readFileSync(
          new URL("../public" + art.src, import.meta.url),
        );
        expect(bytes.subarray(0, 4).toString()).toBe("RIFF");
        expect(bytes.subarray(8, 12).toString()).toBe("WEBP");
        expect(dishes.every((d) => d.image !== art.src)).toBe(true);
        expect(art.index).toBeLessThan(art.columns * art.rows);
        const [x, y, size, height] = art.viewBox.split(" ").map(Number);
        expect(x).toBeGreaterThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(size).toBe(height);
        expect(x + size).toBeLessThanOrEqual(art.width);
        expect(y + size).toBeLessThanOrEqual(art.height);
        cells.add(art.atlas + ":" + art.index);
      }
    expect(cells.size).toBe(
      reelFields.reduce((sum, f) => sum + values[f.key].length, 0),
    );
    render(<App />);
    expect(
      document.querySelectorAll(".reel-selection svg.reel-glyph image"),
    ).toHaveLength(5);
    expect(document.querySelector(".reel-selection img")).toBeNull();
  });
  it("uses only eligible venues for the area reel and budget, including a secondary location", () => {
    const result = matchingDishes(criteriaOf(dishes[0]), [], {
      budget: 80000,
      area: "Hoàn Kiếm",
    });
    const buncha = result.find((d) => d.id === "bun-cha")!;
    expect(buncha).toBeTruthy();
    expect(buncha.area).toBe("Hoàn Kiếm");
    expect(buncha.venues.some((v) => v.id === "dac-kim")).toBe(true);
    expect(
      result.every((d) =>
        d.venues.every((v) => v.area === "Hoàn Kiếm" && v.priceMin <= 80000),
      ),
    ).toBe(true);
  });
  it("has local sourced venue photos and groups only eligible branches", () => {
    const uniqueVenues = new Map(dishes.flatMap((d) => d.venues).map((v) => [v.id, v]));
    expect(uniqueVenues.size).toBeGreaterThanOrEqual(77);
    for (const photo of venuePhotos) {
      expect(uniqueVenues.has(photo.venueId)).toBe(true);
      expect(photo.source.url).toMatch(/^https:\/\//);
      expect(photo.credit).not.toBe("");
      const bytes = readFileSync(new URL("../public" + photo.src, import.meta.url));
      expect(bytes[0]).toBe(0xff);
      expect(bytes[1]).toBe(0xd8);
      expect(bytes.length).toBeGreaterThan(2000);
      expect(dishes.every((d) => d.image !== photo.src)).toBe(true);
    }
    expect([...uniqueVenues.values()].every((v) => v.photo)).toBe(true);
    const buncha = dishes.find((d) => d.id === "bun-cha")!;
    const sinhTu = groupVenues(buncha.venues).find((g) => g.name === "Bún Chả Sinh Từ")!;
    expect(sinhTu.venues).toHaveLength(8);
    const filtered = matchingDishes(criteriaOf(buncha), [], { budget: 80000, area: "Ba Đình" }).find((d) => d.id === "bun-cha")!;
    const filteredGroups = groupVenues(filtered.venues);
    expect(filteredGroups.every((g) => g.venues.every((v) => v.area === "Ba Đình" && v.priceMin <= 80000))).toBe(true);
    expect(filteredGroups.find((g) => g.name === "Bún Chả Sinh Từ")!.venues).toHaveLength(1);
  });
  it("never relaxes held criteria silently and handles an impossible match", () => {
    const c = { ...criteriaOf(dishes[0]), protein: "Phô mai" };
    expect(matchingDishes(c, ["type", "protein"], noFilters)).toEqual([]);
    expect(selectDish([], [])).toBeNull();
  });
  it("covers every area, intent, texture and cuisine with real selectable dishes", () => {
    expect(areas).toHaveLength(13);
    expect(reelFields).toHaveLength(5);
    for (const area of areas)
      expect(
        matchingDishes(criteriaOf(dishes[0]), [], { ...noFilters, area })
          .length,
      ).toBeGreaterThan(0);
    for (const value of values.texture) {
      expect(textureHints[value]).toBeTruthy();
      expect(
        matchingDishes(
          { ...criteriaOf(dishes[0]), texture: value },
          ["texture"],
          noFilters,
        ).length,
      ).toBeGreaterThan(0);
    }
    const snacks = matchingDishes(criteriaOf(dishes[0]), [], {
      ...noFilters,
      intent: "snack",
    });
    expect(snacks.length).toBeGreaterThan(10);
    expect(snacks.every((d) => d.intents.includes("snack"))).toBe(true);
    const noBeef = matchingDishes(criteriaOf(dishes[0]), [], {
      ...noFilters,
      excludedProteins: ["Thịt bò"],
    });
    expect(noBeef.every((d) => !d.proteins.includes("Thịt bò"))).toBe(true);
    const korean = matchingDishes(criteriaOf(dishes[0]), [], {
      ...noFilters,
      cuisine: "Hàn",
      noSpicy: true,
    });
    expect(korean.length).toBeGreaterThan(0);
    expect(korean.every((d) => d.cuisine === "Hàn" && !d.spicy)).toBe(true);
  });
  it("offers every dish before repeating when the pool stays unchanged", () => {
    let recent: string[] = [];
    for (let n = 0; n < dishes.length; n++) {
      const next = selectDish(dishes, recent, () => 0.5)!;
      expect(recent).not.toContain(next.id);
      recent = [next.id, ...recent];
    }
    expect(new Set(recent).size).toBe(dishes.length);
  });
  it("avoids the previous five dishes when possible, falling back when all choices are recent", () => {
    const recent = dishes.slice(0, 5).map((d) => d.id);
    expect(selectDish(dishes, recent, () => 0)!.id).toBe(dishes[5].id);
    expect(selectDish([dishes[0]], recent, () => 0)!.id).toBe(dishes[0].id);
  });
});

describe("Slot machine interaction", () => {
  it("spins from the lever, prevents double spins and opens the result popup automatically", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Kéo cần gạt để quay" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Kéo cần gạt để quay" }),
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Kéo cần gạt để quay",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    finish();
    expect(dialog().getAttribute("aria-label")).toBe(
      "Hôm nay ăn Phở bò Hà Nội",
    );
    expect(
      within(dialog())
        .getByRole("img", { name: "Ảnh thật món Phở bò Hà Nội" })
        .getAttribute("src"),
    ).toBe(dishes[0].image);
    expect(
      within(dialog()).getByRole("heading", { name: "Phở Gia Truyền Bát Đàn" }),
    ).toBeTruthy();
    expect(
      within(dialog())
        .getByRole("link", { name: "Đi ăn thôi" })
        .getAttribute("href"),
    ).toBe(mapsUrl(dishes[0].venues[0]));
    expect(JSON.parse(localStorage.getItem("angi-hanoi-recent")!)).toHaveLength(
      1,
    );
    expect(audio.pull).toHaveBeenCalledTimes(1);
    expect(audio.stopReel).toHaveBeenCalledTimes(5);
    expect(audio.win).toHaveBeenCalledTimes(1);
  });
  it("lands reels in order while the others keep rolling, without replaying the landing on popup", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Kéo cần gạt để quay" }));
    act(() => { vi.advanceTimersByTime(180); });
    expect(document.querySelectorAll(".rolling")).toHaveLength(5);
    act(() => { vi.advanceTimersByTime(1170); });
    expect(document.querySelectorAll(".landed")).toHaveLength(1);
    expect(document.querySelectorAll(".rolling")).toHaveLength(4);
    expect(document.querySelector(".phase-spinning .landed .reel-selection")).not.toBeNull();
    act(() => { vi.advanceTimersByTime(500); });
    expect(document.querySelectorAll(".landed")).toHaveLength(2);
    expect(document.querySelectorAll(".rolling")).toHaveLength(3);
    finish();
    expect(document.querySelectorAll(".rolling")).toHaveLength(0);
    expect(document.querySelectorAll(".phase-spinning .landed")).toHaveLength(0);
    expect(document.querySelector(".phase-idle")).not.toBeNull();
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
  it("supports dragging the lever past its threshold", () => {
    render(<App />);
    const lever = screen.getByRole("button", { name: "Kéo cần gạt để quay" });
    fireEvent.pointerDown(lever, { clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(lever, { clientY: 95, pointerId: 1 });
    fireEvent.pointerUp(lever, { clientY: 95, pointerId: 1 });
    finish();
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(audio.pull).toHaveBeenCalledTimes(1);
  });
  it("holds a chosen ingredient across a spin", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", { name: "Chọn nguyên liệu: Thịt bò" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Phô mai/ }));
    expect(
      screen
        .getByRole("button", { name: "Mở khóa nguyên liệu" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    spin();
    expect(
      within(dialog()).getByRole("heading", { name: "Pizza Margherita" }),
    ).toBeTruthy();
    expect(audio.stopReel).toHaveBeenCalledTimes(4);
  });
  it("combines budget, intent and area preferences and persists them", () => {
    render(<App />);
    fireEvent.change(
      screen.getByRole("combobox", { name: "Khu vực ăn uống" }),
      { target: { value: "Ba Đình" } },
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: "Ngân sách cho món" }),
      { target: { value: "100000" } },
    );
    fireEvent.click(screen.getByRole("button", { name: /Ăn no/ }));
    spin();
    const eligible = matchingDishes(criteriaOf(dishes[0]), [], { budget: 100000, area: "Ba Đình", intent: "meal" });
    expect(within(dialog()).getByRole("heading", { name: eligible[0].name })).toBeTruthy();
    expect(within(dialog()).getByRole("link", { name: "Đi ăn thôi" }).getAttribute("href")).toBe(mapsUrl(eligible[0].venues[0]));
    expect(JSON.parse(localStorage.getItem("angi-hanoi-filters")!)).toEqual(
      expect.objectContaining({
        budget: 100000,
        area: "Ba Đình",
        intent: "meal",
      }),
    );
  });
  it("opens area and budget from the compact mobile summary and persists the choice", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Đổi khu vực và giá món" }));
    fireEvent.click(within(dialog()).getByRole("button", { name: "Chọn kiểu ăn: Ăn chơi" }));
    fireEvent.change(within(dialog()).getByRole("combobox", { name: "Khu vực" }), { target: { value: "Ba Đình" } });
    fireEvent.click(within(dialog()).getByRole("button", { name: "Đến 50k" }));
    fireEvent.click(within(dialog()).getByRole("button", { name: "Áp dụng" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Đổi khu vực và giá món" }).textContent).toContain("Ba Đình");
    expect(screen.getByRole("button", { name: "Đổi khu vực và giá món" }).textContent).toContain("Đến 50k");
    expect(JSON.parse(localStorage.getItem("angi-hanoi-filters")!)).toEqual(expect.objectContaining({ area: "Ba Đình", budget: 50000, intent: "snack" }));
    spin();
    expect(within(dialog()).getByRole("link", { name: "Đi ăn thôi" }).getAttribute("href")).toContain(encodeURIComponent("Hà Nội"));
  });
  it("shows a no-match state and recovers by changing area", () => {
    render(<App />);
    fireEvent.change(
      screen.getByRole("combobox", { name: "Khu vực ăn uống" }),
      { target: { value: "Gia Lâm" } },
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: "Ngân sách cho món" }),
      { target: { value: "30000" } },
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Kéo cần gạt để quay",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(screen.getByText("Chưa có món khớp lựa chọn.")).toBeTruthy();
    fireEvent.change(
      screen.getByRole("combobox", { name: "Khu vực ăn uống" }),
      { target: { value: "Cầu Giấy" } },
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Kéo cần gạt để quay",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false);
    spin();
    expect(dialog()).toBeTruthy();
  });
  it("keeps the food while switching to another matching venue", () => {
    localStorage.setItem(
      "angi-hanoi-filters",
      JSON.stringify({ cuisine: "Hàn" }),
    );
    render(<App />);
    spin();
    const food = within(dialog()).getByRole("heading", {
      name: "Tteokbokki truyền thống",
    });
    const original = within(dialog())
      .getByRole("link", { name: "Đi ăn thôi" })
      .getAttribute("href");
    expect(within(dialog()).getAllByRole("radio")).toHaveLength(3);
    fireEvent.change(within(dialog()).getByRole("combobox", { name: "Chọn cơ sở Don Chicken" }), { target: { value: "don-tx" } });
    expect(food.isConnected).toBe(true);
    expect(
      within(dialog())
        .getByRole("link", { name: "Đi ăn thôi" })
        .getAttribute("href"),
    ).not.toBe(original);
    fireEvent.click(within(dialog()).getByRole("radio", { name: "Chọn Bảo Bảo" }));
    expect(food.isConnected).toBe(true);
    expect(within(dialog()).queryByRole("combobox", { name: "Chọn cơ sở Don Chicken" })).toBeNull();
    expect(within(dialog()).getByRole("link", { name: "Đi ăn thôi" }).getAttribute("href")).toContain(encodeURIComponent("Sài Đồng"));
    fireEvent.click(within(dialog()).getByRole("button", { name: "Xem thêm 1 quán" }));
    expect(within(dialog()).getAllByRole("radio")).toHaveLength(4);
  });
  it("activates stage lighting only during the spin and persists its switch", () => {
    render(<App />);
    const stage = document.querySelector(".stage-show")!;
    expect(stage.getAttribute("data-active")).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "Kéo cần gạt để quay" }));
    expect(stage.getAttribute("data-active")).toBe("true");
    finish();
    expect(stage.getAttribute("data-active")).toBe("false");
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Thêm bộ lọc" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Đèn sân khấu khi quay" }));
    expect(localStorage.getItem("angi-stage-effects")).toBe("false");
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Kéo cần gạt để quay" }));
    expect(stage.getAttribute("data-active")).toBe("false");
  });
  it("has five readable criteria, explains texture choices and holds the selected texture", () => {
    render(<App />);
    expect(
      screen.getAllByRole("button", {
        name: /^Chọn (nhóm món|nguyên liệu|vị|kết cấu|phong cách):/,
      }),
    ).toHaveLength(5);
    expect(screen.queryByRole("button", { name: "Quay món" })).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Chọn kết cấu: Dai mềm" }),
    );
    expect(screen.getByText(textureHints["Xốp mềm"])).toBeTruthy();
    fireEvent.click(within(dialog()).getByRole("button", { name: /Xốp mềm/ }));
    expect(
      screen
        .getByRole("button", { name: "Mở khóa kết cấu" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    spin();
    expect(
      within(dialog()).getByRole("heading", { name: "Burger tôm" }),
    ).toBeTruthy();
  });
  it("supports Space, Escape, another spin and history-based variety", () => {
    render(<App />);
    fireEvent.keyDown(window, { code: "Space", key: " " });
    finish();
    expect(
      within(dialog()).getByRole("heading", { name: "Phở bò Hà Nội" }),
    ).toBeTruthy();
    fireEvent.click(
      within(dialog()).getByRole("button", { name: "Quay món khác" }),
    );
    finish();
    expect(
      within(dialog()).getByRole("heading", { name: "Phở gà" }),
    ).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("lets the player mute sound and retains the setting", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Tắt âm thanh" }));
    expect(
      screen
        .getByRole("button", { name: "Bật âm thanh" })
        .getAttribute("aria-pressed"),
    ).toBe("false");
    expect(JSON.parse(localStorage.getItem("angi-casino-sound")!)).toBe(false);
    spin();
    expect(audio.setEnabled).toHaveBeenLastCalledWith(false);
  });
});
