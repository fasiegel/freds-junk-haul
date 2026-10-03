import { useRef, useState } from "react";
import { setStick } from "./input";

function deadzone(x: number, y: number, dz = 0.12) {
  const m = Math.hypot(x, y);
  if (m < dz) return { x: 0, y: 0 };
  const scale = (m - dz) / (1 - dz) / m;
  return { x: x * scale, y: y * scale };
}

export function Joystick() {
  const base = useRef<HTMLDivElement>(null);
  const pointer = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  function point(e: React.PointerEvent) {
    const rect = base.current?.getBoundingClientRect();
    if (!rect) return;
    const max = rect.width * 0.36;
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const m = Math.hypot(dx, dy);
    if (m > max) {
      dx = (dx / m) * max;
      dy = (dy / m) * max;
    }
    setKnob({ x: dx, y: dy });
    const z = deadzone(dx / max, dy / max);
    setStick(z.x, z.y);
  }

  function down(e: React.PointerEvent) {
    pointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    point(e);
  }

  function move(e: React.PointerEvent) {
    if (pointer.current !== e.pointerId) return;
    point(e);
  }

  function up(e: React.PointerEvent) {
    if (pointer.current !== e.pointerId) return;
    pointer.current = null;
    setKnob({ x: 0, y: 0 });
    setStick(0, 0);
  }

  return (
    <div className="stick-dock absolute z-20" style={{ touchAction: "none" }}>
      <div
        ref={base}
        role="slider"
        aria-label="Move Fred"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className="relative h-32 w-32 rounded-full border-2 border-cream/40 bg-ink/45"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div
          className="absolute left-1/2 top-1/2 h-14 w-14 rounded-full bg-gold"
          style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
        />
      </div>
    </div>
  );
}
