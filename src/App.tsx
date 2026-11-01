import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  Info,
  LockKeyhole,
  MapPin,
  Navigation,
  Phone,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  UnlockKeyhole,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  areas,
  cuisines,
  criteriaOf,
  dishes,
  mapsUrl,
  matchingDishes,
  priceLabel,
  RESEARCHED_LABEL,
  reelFields,
  selectDish,
  textureHints,
  values,
  type Criteria,
  type Dish,
  type Filters,
  type ReelKey,
  type Venue,
} from "./data";
import { SlotAudio } from "./audio";
import photoCredits from "./photo-credits.json";
import { artFor } from "./reel-art";
import StageLighting from "./StageLighting";
import MarqueeLights from "./MarqueeLights";
import { groupVenues, venueReason, venuePhotoLabels } from "./venue-options";

type SlotStyle = CSSProperties & { [key: `--${string}`]: string | number };
type Phase = "idle" | "pulling" | "spinning" | "winning";
type Modal = "result" | "settings" | "help" | null;
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) ?? fallback) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Browser storage is optional. */
  }
}
const defaultFilters: Filters = {
  budget: 0,
  area: "",
  intent: "all",
  cuisine: "",
  mealTime: "",
  excludedProteins: [],
  noSpicy: false,
};
const mealLabels: Record<string, string> = {
  morning: "Bữa sáng",
  noon: "Bữa trưa",
  afternoon: "Buổi chiều",
  evening: "Bữa tối",
  late: "Ăn khuya",
};

function Dialog({
  children,
  title,
  onClose,
  className = "",
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null),
    close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key !== "Tab") return;
      const els = root.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input, select, [tabindex="0"]',
      );
      if (!els?.length) return;
      const first = els[0],
        last = els[els.length - 1];
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === root.current)
      ) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === root.current)
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`dialog ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={root}
      >
        <button className="dialog-close" onClick={onClose} aria-label="Đóng">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

function ReelArt({ field, value }: { field: ReelKey; value: string }) {
  const art = artFor(field, value);
  return (
    <span className="photo-token illustration-token" aria-hidden="true">
      <span className="photo-token-inner">
        <svg className="reel-glyph" viewBox={art.viewBox} focusable="false">
          <image href={art.src} width={art.width} height={art.height} />
        </svg>
      </span>
      <span className="token-glint" />
    </span>
  );
}

export default function App() {
  const [criteria, setCriteria] = useState<Criteria>(criteriaOf(dishes[0]));
  const [locked, setLocked] = useState<ReelKey[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [rolling, setRolling] = useState<ReelKey[]>([]);
  const [landed, setLanded] = useState<ReelKey[]>([]);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<Dish | null>(null);
  const [venueIndex, setVenueIndex] = useState(0);
  const [visibleVenueCount, setVisibleVenueCount] = useState(3);
  const [stageEffects, setStageEffects] = useState(() =>
    read<boolean>("angi-stage-effects", true),
  );
  const [modal, setModal] = useState<Modal>(null);
  const [picker, setPicker] = useState<ReelKey | null>(null);
  const [sound, setSound] = useState(() =>
    read<boolean>("angi-casino-sound", true),
  );
  const [filters, setFilters] = useState<Filters>(() => ({
    ...defaultFilters,
    ...read<Filters>("angi-hanoi-filters", defaultFilters),
  }));
  const [draft, setDraft] = useState(filters);
  const [recent, setRecent] = useState<string[]>(() => {
    const saved = read<unknown>("angi-hanoi-recent", []);
    return Array.isArray(saved)
      ? saved.filter(
          (id): id is string =>
            typeof id === "string" && dishes.some((d) => d.id === id),
        )
      : [];
  });
  const [pull, setPull] = useState(0);
  const [message, setMessage] = useState("Món ngon đang chờ. Kéo cần thôi!");
  const [confetti, setConfetti] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audio = useRef<SlotAudio | null>(null);
  const busyRef = useRef(false);
  const dragStart = useRef<number | null>(null);
  const dragTriggered = useRef(false);
  const spinRef = useRef<() => void>(() => {});
  const mounted = useRef(true);
  const candidates = matchingDishes(criteria, locked, filters);
  const busy =
    phase === "pulling" || phase === "spinning" || phase === "winning";
  const filterCount =
    Number(!!filters.cuisine) +
    Number(!!filters.mealTime) +
    (filters.excludedProteins?.length || 0) +
    Number(!!filters.noSpicy);
  const ensureAudio = () => {
    if (!audio.current) audio.current = new SlotAudio();
    audio.current.setEnabled(sound);
    return audio.current;
  };
  const later = (callback: () => void, delay: number) => {
    timers.current.push(
      setTimeout(() => {
        if (mounted.current) callback();
      }, delay),
    );
  };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      timers.current.forEach(clearTimeout);
      audio.current?.destroy();
      audio.current = null;
    };
  }, []);
  useEffect(() => {
    write("angi-casino-sound", sound);
    audio.current?.setEnabled(sound);
  }, [sound]);
  useEffect(() => {
    write("angi-hanoi-filters", filters);
  }, [filters]);
  useEffect(() => {
    write("angi-hanoi-recent", recent);
  }, [recent]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.code === "Space" || e.key === " ") &&
        !e.repeat &&
        !modal &&
        !picker &&
        !(
          e.target instanceof HTMLElement &&
          e.target.closest("button,a,input,select,textarea,summary")
        )
      ) {
        e.preventDefault();
        spinRef.current();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [modal, picker]);

  const spin = () => {
    if (busyRef.current) return;
    const dish = selectDish(candidates, recent);
    if (!dish) {
      setMessage("Chưa khớp món. Thử mở khóa ô hoặc nới bộ lọc.");
      return;
    }
    busyRef.current = true;
    setPicker(null);
    setModal(null);
    setVenueIndex(0);
    setVisibleVenueCount(3);
    setRound((r) => r + 1);
    setConfetti(false);
    setLanded([]);
    setPhase("pulling");
    setPull(1);
    const s = ensureAudio();
    s.pull();
    if (navigator.vibrate) navigator.vibrate(20);
    const keys = reelFields
      .map((f) => f.key)
      .filter((k) => !locked.includes(k));
    later(() => {
      setPull(0);
      setPhase("spinning");
      setRolling(keys);
      setMessage("Đang tìm kèo ngon…");
      s.spin();
    }, 180);
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    keys.forEach((key, index) =>
      later(
        () => {
          setCriteria((c) => ({ ...c, [key]: dish[key] }));
          setRolling((r) => r.filter((k) => k !== key));
          setLanded((r) => [...r, key]);
          s.stopReel(index);
          if (index === keys.length - 2) setMessage("Còn một chút nữa…");
          if (navigator.vibrate) navigator.vibrate(12);
        },
        reduced ? 500 + index * 100 : 1350 + index * 500,
      ),
    );
    const end = keys.length
      ? reduced
        ? 800 + keys.length * 100
        : 1580 + (keys.length - 1) * 500
      : 800;
    later(() => {
      setRolling([]);
      setResult(dish);
      setCriteria(criteriaOf(dish));
      setPhase("winning");
      setMessage("Chốt kèo!");
      setConfetti(true);
      s.win();
      setRecent((r) => [dish.id, ...r].slice(0, 200));
      if (navigator.vibrate) navigator.vibrate([30, 30, 70]);
    }, end);
    later(
      () => {
        setModal("result");
        setPhase("idle");
        busyRef.current = false;
      },
      end + (reduced ? 250 : 900),
    );
    later(() => setConfetti(false), end + 3500);
  };
  spinRef.current = spin;
  const onLeverDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (busy || !candidates.length) return;
    ensureAudio().unlock();
    dragStart.current = e.clientY;
    dragTriggered.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onLeverMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (dragStart.current === null || dragTriggered.current || busy) return;
    const delta = Math.max(0, e.clientY - dragStart.current);
    setPull(Math.min(delta / 95, 1));
    if (delta > 60) {
      dragTriggered.current = true;
      dragStart.current = null;
      spin();
    }
  };
  const onLeverUp = () => {
    dragStart.current = null;
    if (!busyRef.current) setPull(0);
  };
  const toggleLock = (key: ReelKey) => {
    setLocked((l) =>
      l.includes(key) ? l.filter((k) => k !== key) : [...l, key],
    );
    setPicker(null);
  };
  const photo = result
    ? photoCredits.find((p) => p.id === result.photoId)
    : null;
  const places = result?.venues || [];
  const selectedVenue = places[venueIndex % (places.length || 1)];
  const venueGroups = groupVenues(places);
  const selectedGroup = venueGroups.find((g) =>
    g.venues.some((v) => v.id === selectedVenue?.id),
  );
  const poolWithoutLocks = matchingDishes(criteria, [], filters);
  const updateFilter = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setMessage("Đã đổi lựa chọn. Quay thôi!");
  };

  return (
    <div className={`arcade-app phase-${phase}`}>
      <div className="ambient" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <StageLighting
        enabled={stageEffects}
        active={busy}
        landedCount={landed.length}
      />
      <header className="app-header">
        <a href="#" className="wordmark" aria-label="hôm nay ăn gì.">
          <span className="wordmark-top" aria-hidden="true">hôm nay</span>
          <span className="wordmark-main" aria-hidden="true">ăn gì<span className="wordmark-dot">.</span></span>
          <svg className="wordmark-bowl" viewBox="0 0 124 17" fill="none" aria-hidden="true"><path d="M3 3c20 13 81 15 112-1M31 14h54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </a>
        <div className="header-buttons">
          <button
            className="utility-button"
            onClick={() => {
              setSound((v) => !v);
              if (!sound) {
                const a = ensureAudio();
                a.setEnabled(true);
                a.unlock();
              }
            }}
            aria-label={sound ? "Tắt âm thanh" : "Bật âm thanh"}
            aria-pressed={sound}
          >
            {sound ? <Volume2 size={21} /> : <VolumeX size={21} />}
          </button>
          <button
            className="more-filters"
            disabled={busy}
            onClick={() => {
              setDraft(filters);
              setModal("settings");
            }}
          >
            <SlidersHorizontal size={19} />
            <span>Thêm bộ lọc</span>
            {filterCount > 0 && <b>{filterCount}</b>}
          </button>
        </div>
      </header>
      <main className="arcade-stage">
        <section className="decision-bar" aria-label="Chọn hoàn cảnh ăn uống">
          <div
            className="intent-switch"
            role="group"
            aria-label="Bạn muốn ăn no hay ăn chơi"
          >
            {[
              ["all", "Tùy duyên"],
              ["meal", "Ăn no"],
              ["snack", "Ăn chơi"],
            ].map(([value, label]) => (
              <button
                key={value}
                disabled={busy}
                className={
                  (filters.intent || "all") === value ? "selected" : ""
                }
                aria-pressed={(filters.intent || "all") === value}
                onClick={() =>
                  updateFilter({ intent: value as "all" | "meal" | "snack" })
                }
              >
                {label}
              </button>
            ))}
          </div>
          <div className="quick-selects">
            <label className="quick-select">
              <MapPin size={17} />
              <select
                disabled={busy}
                aria-label="Khu vực ăn uống"
                value={filters.area}
                onChange={(e) => updateFilter({ area: e.target.value })}
              >
                <option value="">Cả Hà Nội</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} />
            </label>
            <label className="quick-select">
              <span className="price-symbol">₫</span>
              <select
                disabled={busy}
                aria-label="Ngân sách cho món"
                value={filters.budget}
                onChange={(e) =>
                  updateFilter({ budget: Number(e.target.value) })
                }
              >
                {[
                  [0, "Mọi mức giá"],
                  [30000, "Đến 30k"],
                  [50000, "Đến 50k"],
                  [100000, "Đến 100k"],
                  [200000, "Đến 200k"],
                ].map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
        </section>
        {filterCount > 0 && (
          <div className="applied-filters" aria-label="Bộ lọc đang áp dụng">
            {filters.cuisine && (
              <button onClick={() => updateFilter({ cuisine: "" })}>
                {filters.cuisine}
                <X size={13} />
              </button>
            )}
            {filters.mealTime && (
              <button onClick={() => updateFilter({ mealTime: "" })}>
                {mealLabels[filters.mealTime]}
                <X size={13} />
              </button>
            )}
            {filters.noSpicy && (
              <button onClick={() => updateFilter({ noSpicy: false })}>
                Ít cay
                <X size={13} />
              </button>
            )}
            {filters.excludedProteins?.map((p) => (
              <button
                key={p}
                onClick={() =>
                  updateFilter({
                    excludedProteins: filters.excludedProteins?.filter(
                      (x) => x !== p,
                    ),
                  })
                }
              >
                Tránh {p.toLowerCase()}
                <X size={13} />
              </button>
            ))}
          </div>
        )}
        <div className="machine-rig">
          <div
            className={`slot-machine ${phase === "winning" ? "jackpot" : ""}`}
          >
            <div className="marquee">
              <div className="marquee-inner">
                <h1>
                  HÔM NAY <span>ĂN GÌ?</span>
                </h1>
              </div>
              <MarqueeLights />
            </div>
            <div className="cabinet">
              <div className="cabinet-corner corner-tl" aria-hidden="true" />
              <div className="cabinet-corner corner-tr" aria-hidden="true" />
              <div className="ticker">
                <span className="ticker-dot" />
                <span key={message}>{message}</span>
                <Sparkles size={13} />
              </div>
              <div className="reel-assembly">
                <div className="reel-frame">
                  <div className="reel-grid">
                    {reelFields.map((field, index) => {
                      const list = values[field.key],
                        position = list.indexOf(criteria[field.key]),
                        isRolling = rolling.includes(field.key),
                        isLocked = locked.includes(field.key);
                      return (
                        <div className="reel-unit" key={field.key}>
                          <div className="reel-unit-label">{field.label}</div>
                          <div
                            className={`reel-column ${isRolling ? "rolling" : ""} ${landed.includes(field.key) ? "landed" : ""} ${isLocked ? "held" : ""}`}
                            style={{ "--column": index } as SlotStyle}
                          >
                            <div className="reel-viewport">
                              <div className="reel-shadow" />
                              <div
                                className="reel-neighbor neighbor-above"
                                aria-hidden="true"
                              >
                                <ReelArt
                                  field={field.key}
                                  value={
                                    list[
                                      (position + list.length - 1) % list.length
                                    ]
                                  }
                                />
                                <strong>
                                  {
                                    list[
                                      (position + list.length - 1) % list.length
                                    ]
                                  }
                                </strong>
                              </div>
                              <button
                                disabled={busy}
                                className="reel-selection"
                                onClick={() =>
                                  setPicker((p) =>
                                    p === field.key ? null : field.key,
                                  )
                                }
                                aria-label={`Chọn ${field.label.toLowerCase()}: ${criteria[field.key]}`}
                                aria-expanded={picker === field.key}
                              >
                                <ReelArt
                                  field={field.key}
                                  value={criteria[field.key]}
                                />
                                <strong>{criteria[field.key]}</strong>
                                <ChevronDown size={10} />
                              </button>
                              <div
                                className="reel-neighbor neighbor-below"
                                aria-hidden="true"
                              >
                                <ReelArt
                                  field={field.key}
                                  value={list[(position + 1) % list.length]}
                                />
                                <strong>
                                  {list[(position + 1) % list.length]}
                                </strong>
                              </div>
                              {isRolling && (
                                <div
                                  className="spinning-strip"
                                  key={round}
                                  aria-hidden="true"
                                >
                                  {Array.from({ length: 14 }, (_, i) => {
                                    const value =
                                      list[(i + index) % list.length];
                                    return (
                                      <div className="strip-cell" key={i}>
                                        <ReelArt
                                          field={field.key}
                                          value={value}
                                        />
                                        <strong>{value}</strong>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="hold-row">
                            {" "}
                            <button
                              disabled={busy}
                              className={
                                locked.includes(field.key) ? "is-held" : ""
                              }
                              onClick={() => toggleLock(field.key)}
                              aria-label={`${locked.includes(field.key) ? "Mở khóa" : "Khóa"} ${field.label.toLowerCase()}`}
                              aria-pressed={locked.includes(field.key)}
                            >
                              {locked.includes(field.key) ? (
                                <LockKeyhole size={11} />
                              ) : (
                                <UnlockKeyhole size={11} />
                              )}
                              <span>
                                {locked.includes(field.key) ? "Đã giữ" : "Giữ"}
                              </span>
                              <i />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="cabinet-bottom">
                <div className="speaker-grill" aria-hidden="true" />
              </div>
            </div>
            <div className="machine-base" aria-hidden="true">
              <span />
              <span />
            </div>
          </div>
          <div className="lever-mount">
            <div className="lever-socket" aria-hidden="true" />
            <button
              className={`lever ${busy ? "lever-busy" : ""}`}
              aria-label="Kéo cần gạt để quay"
              disabled={busy || !candidates.length}
              style={{ "--pull": pull } as SlotStyle}
              onPointerDown={onLeverDown}
              onPointerMove={onLeverMove}
              onPointerUp={onLeverUp}
              onPointerCancel={onLeverUp}
              onLostPointerCapture={onLeverUp}
              onClick={() => {
                if (!dragTriggered.current) spin();
                dragTriggered.current = false;
              }}
            >
              <span className="lever-arm">
                <i />
                <span className="lever-ball">
                  <i />
                </span>
              </span>
            </button>
            <div className="lever-hint" aria-hidden="true">
              <ArrowDown size={24} />
            </div>
          </div>
        </div>
        {!candidates.length && (
          <div className="no-match" role="status">
            <Info size={19} />
            <div>
              <strong>Chưa có món khớp lựa chọn.</strong>
              <p>
                {poolWithoutLocks.length
                  ? "Thử bỏ giữ các ô để mở thêm lựa chọn."
                  : "Thử đổi khu vực hoặc tăng mức giá."}
              </p>
            </div>
            {locked.length > 0 ? (
              <button onClick={() => setLocked([])}>Bỏ giữ ô</button>
            ) : (
              <button
                onClick={() => {
                  setDraft(filters);
                  setModal("settings");
                }}
              >
                Sửa bộ lọc
              </button>
            )}
          </div>
        )}
        <div className="stage-bottom">
          <button onClick={() => setModal("help")}>
            <Info size={15} />
            Cách chơi & dữ liệu
          </button>
        </div>
      </main>
      {confetti && (
        <div className="celebration" aria-hidden="true">
          <div className="win-flare" />
          {Array.from({ length: 55 }, (_, i) => (
            <i
              key={`${round}-${i}`}
              style={
                {
                  "--x": `${(i * 37) % 100}%`,
                  "--delay": `${(i % 11) * 0.04}s`,
                  "--drift": `${(i % 2 ? -1 : 1) * (40 + (i % 7) * 20)}px`,
                  "--rotate": `${i * 71}deg`,
                  "--color": ["#f5d27d", "#d5ac5b", "#b93b49", "#fff4be"][
                    i % 4
                  ],
                } as SlotStyle
              }
            />
          ))}
        </div>
      )}
      {modal === "result" && result && selectedVenue && (
        <Dialog
          title={`Hôm nay ăn ${result.name}`}
          className="result-dialog"
          onClose={() => setModal(null)}
        >
          <div className="result-photo">
            <img src={result.image} alt={`Ảnh thật món ${result.name}`} />
            <div className="result-photo-shade" />
            <div className="result-win-tag">
              <Sparkles size={16} />
              CHỐT KÈO!
            </div>
            <div className="result-photo-title">
              <h2>{result.name}</h2>
            </div>
          </div>
          <div className="result-body">
            <div className="result-match-line">
              <span>
                {filters.intent === "snack"
                  ? "Kèo ăn chơi"
                  : filters.intent === "meal"
                    ? "Kèo ăn no"
                    : "Đổi vị hôm nay"}{" "}
                · {result.cuisine}
              </span>
              <span>
                {result.flavor} · {result.texture}
              </span>
            </div>
            <p className="dish-description">{result.description}</p>
            <section
              className="venue-comparison"
              aria-labelledby="venue-comparison-title"
            >
              <div className="venue-comparison-heading">
                <div>
                  <h3 id="venue-comparison-title">Ăn ở đâu hợp bạn?</h3>
                  <p>So giá, vị trí · giữ món vừa thích</p>
                </div>
                <span>{venueGroups.length} quán</span>
              </div>
              <div
                className="venue-choice-grid"
                data-count={Math.min(venueGroups.length, visibleVenueCount)}
                role="radiogroup"
                aria-label="Chọn quán để đi ăn"
              >
                {venueGroups.slice(0, visibleVenueCount).map((group) => {
                  const isSelected = group.venues.some(
                    (v) => v.id === selectedVenue.id,
                  );
                  const venue = isSelected ? selectedVenue : group.venues[0];
                  return (
                    <article
                      className={`venue-choice-card ${isSelected ? "is-selected" : ""}`}
                      key={group.key}
                    >
                      <input
                        type="radio"
                        name="venue-choice"
                        id={`venue-${venue.id}`}
                        aria-label={`Chọn ${group.name}`}
                        checked={isSelected}
                        onChange={() =>
                          setVenueIndex(
                            places.findIndex((v) => v.id === venue.id),
                          )
                        }
                      />
                      <label htmlFor={`venue-${venue.id}`}>
                        <span className="venue-card-photo">
                          {venue.photo ? (
                            <>
                              <img
                                src={venue.photo.src}
                                alt={venue.photo.alt}
                                loading="lazy"
                              />
                              <small>
                                {venuePhotoLabels[venue.photo.kind]}
                              </small>
                            </>
                          ) : (
                            <span className="venue-photo-fallback">
                              <MapPin size={25} />
                              <strong>{venue.area}</strong>
                              <small>Chưa có ảnh xác minh</small>
                            </span>
                          )}
                          <span className="venue-choice-mark">
                            <Check size={15} />
                          </span>
                        </span>
                        <span className="venue-card-info">
                          <span className="venue-card-area">
                            {venue.area}
                            {group.venues.length > 1 &&
                              ` · ${group.venues.length} cơ sở`}
                          </span>
                          <span
                            className="venue-card-name"
                            role="heading"
                            aria-level={3}
                          >
                            {group.name}
                          </span>
                          <span className="venue-card-price">
                            {venue.priceType === "reference" ? "≈ " : ""}
                            {priceLabel(venue)}
                            <small> / {venue.unit}</small>
                          </span>
                          <span className="venue-card-reason">
                            {venueReason(venue)}
                          </span>
                          <span className="venue-card-address">
                            {venue.address}
                          </span>
                          <span className="venue-card-selected">
                            {isSelected ? "Đang chọn" : "Chọn quán này"}
                          </span>
                        </span>
                      </label>
                    </article>
                  );
                })}
              </div>
              {venueGroups.length > visibleVenueCount && (
                <button
                  className="more-venues"
                  onClick={() => setVisibleVenueCount((n) => n + 3)}
                >
                  Xem thêm {Math.min(3, venueGroups.length - visibleVenueCount)}{" "}
                  quán <ChevronDown size={16} />
                </button>
              )}
              {selectedGroup && selectedGroup.venues.length > 1 && (
                <label className="venue-branch-picker">
                  <span>Chọn cơ sở {selectedGroup.name}</span>
                  <select
                    aria-label={`Chọn cơ sở ${selectedGroup.name}`}
                    value={selectedVenue.id}
                    onChange={(e) =>
                      setVenueIndex(
                        places.findIndex((v) => v.id === e.target.value),
                      )
                    }
                  >
                    {selectedGroup.venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.area} · {v.address}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <details
                className="place-details selected-place-details"
                key={selectedVenue.id}
              >
                <summary>
                  Thông tin quán đang chọn & nguồn <ChevronDown size={16} />
                </summary>
                <strong>{selectedVenue.name}</strong>
                <p>{selectedVenue.address}</p>
                <p>{selectedVenue.note}</p>
                {selectedVenue.hours && (
                  <p>
                    <Clock3 size={14} />
                    {selectedVenue.hours}
                  </p>
                )}
                {selectedVenue.phone && (
                  <a href={`tel:${selectedVenue.phone}`}>
                    <Phone size={14} />
                    {selectedVenue.phone}
                  </a>
                )}
                <p className="price-explanation">{selectedVenue.priceNote}</p>
                <a
                  href={selectedVenue.priceSource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Nguồn giá · {selectedVenue.priceSource.label}
                  <ExternalLink size={13} />
                </a>
                {selectedVenue.infoSource.url !==
                  selectedVenue.priceSource.url && (
                  <a
                    href={selectedVenue.infoSource.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Thông tin địa điểm
                    <ExternalLink size={13} />
                  </a>
                )}
                {selectedVenue.photo && (
                  <>
                    <a
                      href={selectedVenue.photo.source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Nguồn ảnh quán · {selectedVenue.photo.source.label}
                      <ExternalLink size={13} />
                    </a>
                    <p className="venue-photo-credit">
                      {selectedVenue.photo.credit} ·{" "}
                      {selectedVenue.photo.license}
                    </p>
                  </>
                )}
              </details>
            </section>
            <div className="result-source-line">
              Tra cứu {RESEARCHED_LABEL} · giá có thể thay đổi
            </div>
            <details className="photo-credit">
              <summary>
                Ảnh món & ghi công <ChevronDown size={14} />
              </summary>
              <p>Ảnh chụp thật món ăn, không nhất thiết tại quán gợi ý.</p>
              {photo && (
                <p>
                  <a href={photo.page} target="_blank" rel="noreferrer">
                    {photo.artist === photo.provider
                      ? photo.provider
                      : `${photo.artist} · ${photo.provider}`}
                  </a>{" "}
                  ·{" "}
                  <a
                    href={photo.licenseUrl || photo.page}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {photo.license}
                  </a>
                </p>
              )}
            </details>
          </div>
          <div className="result-footer">
            <button
              className="another-spin"
              onClick={() => {
                setModal(null);
                spin();
              }}
            >
              <RotateCcw size={18} />
              Quay món khác
            </button>
            <a
              className="gold-button"
              href={mapsUrl(selectedVenue)}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation size={18} />
              Đi ăn thôi
              <ArrowUpRight size={17} />
            </a>
          </div>
        </Dialog>
      )}
      {picker && (
        <Dialog
          title={`Chọn ${reelFields.find((f) => f.key === picker)!.label.toLowerCase()}`}
          className="picker-dialog"
          onClose={() => setPicker(null)}
        >
          <h2>
            Chọn {reelFields.find((f) => f.key === picker)!.label.toLowerCase()}
          </h2>
          <p className="picker-intro">
            Chọn một gu để giữ, các ô còn lại sẽ quay theo.
          </p>
          <div className="criterion-options">
            {values[picker].map((value) => {
              const count = matchingDishes(
                { ...criteria, [picker]: value },
                [...locked.filter((k) => k !== picker), picker],
                filters,
              ).length;
              return (
                <button
                  key={value}
                  disabled={!count}
                  aria-pressed={
                    locked.includes(picker) && criteria[picker] === value
                  }
                  onClick={() => {
                    setCriteria((c) => ({ ...c, [picker]: value }));
                    setLocked((l) => (l.includes(picker) ? l : [...l, picker]));
                    setPicker(null);
                    setMessage("Đã giữ gu của bạn. Sẵn sàng quay!");
                  }}
                >
                  <ReelArt field={picker} value={value} />
                  <span>
                    <strong>{value}</strong>
                    {picker === "texture" && (
                      <small>{textureHints[value]}</small>
                    )}
                  </span>
                  <span className="option-count">{count} món</span>
                  {locked.includes(picker) && criteria[picker] === value && (
                    <Check size={16} />
                  )}
                </button>
              );
            })}
          </div>
          <p className="picker-footnote">
            Số món tính theo bộ lọc và các ô đang giữ.
            {picker === "texture"
              ? " Kết cấu mô tả cảm giác nổi bật của món, có thể khác theo cách chế biến."
              : ""}
          </p>
          {locked.includes(picker) && (
            <button
              className="picker-release"
              onClick={() => {
                setLocked((l) => l.filter((k) => k !== picker));
                setPicker(null);
              }}
            >
              <UnlockKeyhole size={16} /> Bỏ giữ ô này
            </button>
          )}
        </Dialog>
      )}
      {modal === "settings" && (
        <Dialog
          title="Tùy chỉnh khẩu vị"
          className="settings-dialog"
          onClose={() => setModal(null)}
        >
          <h2>Chọn theo gu của bạn</h2>
          <div className="setting-block">
            <label htmlFor="settings-area">Khu vực</label>
            <select
              id="settings-area"
              value={draft.area}
              onChange={(e) =>
                setDraft((d) => ({ ...d, area: e.target.value }))
              }
            >
              <option value="">Cả Hà Nội</option>
              {areas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
          </div>
          <div className="setting-block">
            <label>Giá món</label>
            <div className="choice-grid">
              {[
                [0, "Bất kỳ"],
                [30000, "Đến 30k"],
                [50000, "Đến 50k"],
                [100000, "Đến 100k"],
                [200000, "Đến 200k"],
              ].map(([value, label]) => (
                <button
                  className={draft.budget === value ? "selected" : ""}
                  key={value}
                  onClick={() =>
                    setDraft((d) => ({ ...d, budget: Number(value) }))
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="setting-block">
            <label>Ẩm thực</label>
            <div className="choice-grid">
              {["", ...cuisines].map((c) => (
                <button
                  key={c}
                  className={(draft.cuisine || "") === c ? "selected" : ""}
                  onClick={() => setDraft((d) => ({ ...d, cuisine: c }))}
                >
                  {c || "Tất cả"}
                </button>
              ))}
            </div>
          </div>
          <div className="setting-block">
            <label>Bữa nào?</label>
            <div className="choice-grid">
              {[["", "Bất kỳ"], ...Object.entries(mealLabels)].map(
                ([value, label]) => (
                  <button
                    key={value}
                    className={
                      (draft.mealTime || "") === value ? "selected" : ""
                    }
                    onClick={() => setDraft((d) => ({ ...d, mealTime: value }))}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
            <p>Gợi ý theo loại món, không phải trạng thái đang mở cửa.</p>
          </div>
          <div className="setting-block">
            <label>Nguyên liệu muốn tránh</label>
            <div className="choice-grid ingredient-choices">
              {values.protein.map((p) => (
                <button
                  key={p}
                  className={
                    draft.excludedProteins?.includes(p) ? "selected" : ""
                  }
                  aria-pressed={draft.excludedProteins?.includes(p) || false}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      excludedProteins: d.excludedProteins?.includes(p)
                        ? d.excludedProteins.filter((x) => x !== p)
                        : [...(d.excludedProteins || []), p],
                    }))
                  }
                >
                  {p}
                </button>
              ))}
            </div>
            <p>
              Dùng để chọn theo sở thích; thành phần và nước dùng cần hỏi lại
              quán nếu bạn có dị ứng.
            </p>
          </div>
          <label className="simple-checkbox">
            <input
              type="checkbox"
              checked={!!draft.noSpicy}
              onChange={(e) =>
                setDraft((d) => ({ ...d, noSpicy: e.target.checked }))
              }
            />
            Ưu tiên món ít cay
          </label>
          <label className="simple-checkbox stage-effect-setting">
            <input
              type="checkbox"
              checked={stageEffects}
              onChange={(e) => {
                setStageEffects(e.target.checked);
                write("angi-stage-effects", e.target.checked);
              }}
            />
            Đèn sân khấu khi quay
          </label>
          <div className="filter-preview">
            {matchingDishes(criteria, locked, draft).length} món phù hợp
          </div>
          <div className="settings-actions">
            <button
              onClick={() =>
                setDraft({ ...defaultFilters, intent: filters.intent })
              }
            >
              Đặt lại
            </button>
            <button
              className="gold-button"
              onClick={() => {
                setFilters(draft);
                setModal(null);
                setMessage("Sẵn sàng. Quay thôi!");
              }}
            >
              Áp dụng
              <Check size={18} />
            </button>
          </div>
        </Dialog>
      )}
      {modal === "help" && (
        <Dialog
          title="Cách chơi và nguồn dữ liệu"
          className="help-dialog"
          onClose={() => setModal(null)}
        >
          <h2>Kéo một cái. Có kèo ngon.</h2>
          <ol>
            <li>
              <strong>Chọn ăn no hay ăn chơi.</strong>
              <span>Thêm khu vực, giá món nếu bạn đã có ý định.</span>
            </li>
            <li>
              <strong>Giữ điều bạn thích.</strong>
              <span>
                Chạm vào cuộn để chọn. Bấm Giữ nếu muốn giữ tiêu chí cho lượt
                sau.
              </span>
            </li>
            <li>
              <strong>Kéo cần gạt để chốt món.</strong>
              <span>
                So sánh các quán theo ảnh, giá và khu vực, chọn một quán rồi bấm
                Đi ăn thôi.
              </span>
            </li>
          </ol>
          <details className="help-data">
            <summary>
              Dữ liệu có gì?
              <ChevronDown size={16} />
            </summary>
            <p>
              {dishes.length} món,{" "}
              {new Set(dishes.flatMap((d) => d.venues.map((v) => v.id))).size}{" "}
              địa điểm, {areas.length} khu vực. Đã tra cứu nguồn công khai ngày{" "}
              {RESEARCHED_LABEL}; không tự đồng bộ theo thời gian thực.
            </p>
            <p>
              Giá menu online và giá tham khảo được ghi riêng. Nguồn cũ hoặc giá
              lấy từ cơ sở khác được giải thích tại từng quán. Khu vực dùng tên
              quận quen thuộc để tìm kiếm.
            </p>
            <p>
              Ảnh thật của món được ghi nguồn trong popup. Không khẳng định ảnh
              chụp tại quán gợi ý. Hình trên cuộn là minh họa riêng cho tiêu
              chí, không phải ảnh món trúng.
            </p>
            <a
              className="all-photo-credits"
              href="/photo-credits.html"
              target="_blank"
              rel="noreferrer"
            >
              Nguồn và ghi công toàn bộ ảnh <ExternalLink size={14} />
            </a>
          </details>
          <button
            className="gold-button full-width"
            onClick={() => setModal(null)}
          >
            Quay thôi
            <ArrowRight size={18} />
          </button>
        </Dialog>
      )}
    </div>
  );
}
