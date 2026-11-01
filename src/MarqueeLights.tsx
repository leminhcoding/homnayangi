import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { marqueeBulbs } from "./marquee-geometry";

export default function MarqueeLights() {
  const root = useRef<HTMLDivElement>(null);
  const [bulbs, setBulbs] = useState(() => marqueeBulbs(760, 140, 80, 13, 9.5));
  useLayoutEffect(() => {
    const frame = root.current?.parentElement;
    if (!frame) return;
    const measure = () => {
      if (!frame.clientWidth || !frame.clientHeight) return;
      const style = getComputedStyle(frame);
      setBulbs(marqueeBulbs(
        frame.clientWidth, frame.clientHeight,
        parseFloat(style.borderTopLeftRadius),
        parseFloat(style.borderBottomLeftRadius),
        parseFloat(style.paddingTop) / 2,
      ));
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(frame);
    window.addEventListener("resize", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  return <div className="marquee-lights" ref={root} aria-hidden="true">
    {bulbs.map((p, i) => <i key={i} style={{ left: p.x, top: p.y, "--bulb": i } as CSSProperties} />)}
  </div>;
}
