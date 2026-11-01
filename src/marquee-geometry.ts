/** Equally spaced lamp centres on the middle of the actual rounded brass border. */
export function marqueeBulbs(width: number, height: number, topRadius: number, bottomRadius: number, inset: number, count = 36) {
  const scale = Math.min(1, width / (2 * topRadius || 1), width / (2 * bottomRadius || 1), height / (topRadius + bottomRadius || 1));
  const w = width - 2 * inset, h = height - 2 * inset;
  const rt = Math.max(0, topRadius * scale - inset), rb = Math.max(0, bottomRadius * scale - inset);
  type Point = { x: number; y: number };
  const line = (a: Point, b: Point) => ({ length: Math.hypot(b.x - a.x, b.y - a.y), point: (t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }) });
  const arc = (x: number, y: number, radius: number, angle: number) => ({ length: Math.PI * radius / 2, point: (t: number) => ({ x: x + radius * Math.cos(angle + t * Math.PI / 2), y: y + radius * Math.sin(angle + t * Math.PI / 2) }) });
  const segments = [
    line({ x: rt, y: 0 }, { x: w - rt, y: 0 }), arc(w - rt, rt, rt, -Math.PI / 2),
    line({ x: w, y: rt }, { x: w, y: h - rb }), arc(w - rb, h - rb, rb, 0),
    line({ x: w - rb, y: h }, { x: rb, y: h }), arc(rb, h - rb, rb, Math.PI / 2),
    line({ x: 0, y: h - rb }, { x: 0, y: rt }), arc(rt, rt, rt, Math.PI),
  ];
  const perimeter = segments.reduce((sum, s) => sum + s.length, 0);
  return Array.from({ length: count }, (_, i) => {
    let distance = perimeter * (i + 0.5) / count;
    for (const s of segments) {
      if (distance <= s.length && s.length > 0) {
        const p = s.point(distance / s.length);
        return { x: p.x + inset, y: p.y + inset };
      }
      distance -= s.length;
    }
    return { x: inset + rt, y: inset };
  });
}
