import { describe, expect, it } from "vitest";
import { marqueeBulbs } from "../src/marquee-geometry";

function inside(x: number, y: number, width: number, height: number, top: number, bottom: number) {
  if (x < 0 || x > width || y < 0 || y > height) return false;
  if (y < top && (x < top || x > width - top)) return Math.hypot(x - (x < top ? top : width - top), y - top) <= top;
  if (y > height - bottom && (x < bottom || x > width - bottom)) return Math.hypot(x - (x < bottom ? bottom : width - bottom), y - (height - bottom)) <= bottom;
  return true;
}

describe("Marquee border alignment", () => {
  it.each([
    { width: 740, height: 135, top: 80, bottom: 13, padding: 19, lamp: 12 },
    { width: 500, height: 117, top: 62, bottom: 10, padding: 15, lamp: 9 },
    { width: 290, height: 106, top: 44, bottom: 8, padding: 12, lamp: 8 },
    { width: 247, height: 106, top: 44, bottom: 8, padding: 12, lamp: 8 },
  ])("keeps whole lamps on the brass ring at $width px", ({ width, height, top, bottom, padding, lamp }) => {
    const points = marqueeBulbs(width, height, top, bottom, padding / 2);
    expect(points).toHaveLength(36);
    for (const p of points) {
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const x = p.x + Math.cos(angle) * lamp / 2, y = p.y + Math.sin(angle) * lamp / 2;
        expect(inside(x, y, width, height, top, bottom)).toBe(true);
        expect(inside(x - padding, y - padding, width - 2 * padding, height - 2 * padding, top - padding, Math.max(0, bottom - padding))).toBe(false);
      }
      expect(points.filter((q) => q !== p).every((q) => Math.hypot(q.x - p.x, q.y - p.y) > lamp)).toBe(true);
    }
    expect(points.some((p) => p.x < top && p.y < top && p.x > padding)).toBe(true);
    expect(points.some((p) => p.x > width - top && p.y < top && p.x < width - padding)).toBe(true);
  });
});
