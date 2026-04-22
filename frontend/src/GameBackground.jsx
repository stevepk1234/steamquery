import { useEffect, useRef } from "react";

const GAME_IDS = [
  620, 570, 730, 440, 1091500, 1245620, 292030, 1174180, 813780, 1086940,
  367520, 251570, 322330, 242760, 413150, 489830, 105600, 227300, 218620,
  261550, 374320, 49520, 550, 4000, 289070, 524220, 271590, 945360, 1817070,
  1850570, 1551360, 1422450, 814380, 1203220, 1145360, 1238810, 1938090, 990080,
  1172470, 578080, 1332010, 1716740, 2358720, 892970, 1196590, 1240440, 397540,
  1449850, 601150, 275850, 252490, 264710, 460950, 239140, 346110, 238960,
  381210, 1817190, 2310, 1151640, 529340, 1313140, 2552430, 444090, 548430,
  782330, 1328670, 1245080, 306130, 242920, 377160, 236390, 379720, 227080,
  205100, 212680, 248820, 427520, 362890, 268500, 211820, 255710, 219740,
  250900, 304930, 413410, 312530, 394360, 107410, 236110, 367500, 220, 340, 400,
  70, 240, 320, 10, 2767030, 3065800, 1085660, 1808500, 739630, 2357570,
  1693980,
];

const NORMAL_SPEED = 0.5; // px per frame at 60fps
const SLOW_SPEED = 0.15;
const LERP_FACTOR = 0.03; // how quickly speed transitions

function GameBackground({ visible, slow }) {
  const scrollRef = useRef(null);
  const offsetRef = useRef(0);
  const speedRef = useRef(NORMAL_SPEED);
  const targetSpeedRef = useRef(NORMAL_SPEED);
  const rafRef = useRef(null);

  useEffect(() => {
    targetSpeedRef.current = slow ? SLOW_SPEED : NORMAL_SPEED;
  }, [slow]);

  useEffect(() => {
    let prevTime = performance.now();

    function tick(now) {
      const delta = (now - prevTime) / 16.67; // normalize to ~60fps
      prevTime = now;

      // Smoothly lerp current speed toward target
      speedRef.current +=
        (targetSpeedRef.current - speedRef.current) * LERP_FACTOR;

      offsetRef.current += speedRef.current * delta;

      const el = scrollRef.current;
      if (el) {
        const halfHeight = el.scrollHeight / 2;
        if (halfHeight > 0 && offsetRef.current >= halfHeight) {
          offsetRef.current -= halfHeight;
        }
        el.style.transform = `translateY(-${offsetRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const EAGER_COUNT = 7; // first visible row

  const images = GAME_IDS.map((id, i) => (
    <img
      key={id}
      src={`https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`}
      alt=""
      draggable={false}
      loading={i < EAGER_COUNT ? "eager" : "lazy"}
      fetchPriority={i < EAGER_COUNT ? "high" : "auto"}
    />
  ));

  return (
    <div className={`game-bg-wrap${visible ? "" : " game-bg-hidden"}`}>
      <div className="game-bg-scroll" ref={scrollRef}>
        <div className="game-bg-grid">{images}</div>
        <div className="game-bg-grid" aria-hidden="true">
          {images}
        </div>
      </div>
      <div className="game-bg-overlay" />
    </div>
  );
}

export default GameBackground;
