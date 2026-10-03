const GAME_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
]);

const keys = new Set<string>();
let qaKeys: string[] | null = null;
let stickX = 0;
let stickY = 0;

function radialDeadzone(x: number, y: number, dz = 0.15) {
  const m = Math.hypot(x, y);
  if (m < dz) return { x: 0, y: 0 };
  const scale = (m - dz) / (1 - dz) / m;
  return { x: x * scale, y: y * scale };
}

function pressed(code: string) {
  if (qaKeys) return qaKeys.includes(code);
  return keys.has(code);
}

export function setStick(x: number, y: number) {
  stickX = x;
  stickY = y;
}

export function setQaKeys(codes: string[]) {
  qaKeys = codes;
}

/** Screen axes: +x right, +y down (toward the camera). Magnitude clamped to 1. */
export function getMove() {
  let x = 0;
  let y = 0;
  if (pressed("KeyA") || pressed("ArrowLeft")) x -= 1;
  if (pressed("KeyD") || pressed("ArrowRight")) x += 1;
  if (pressed("KeyW") || pressed("ArrowUp")) y -= 1;
  if (pressed("KeyS") || pressed("ArrowDown")) y += 1;

  if (!qaKeys) {
    x += stickX;
    y += stickY;
    const pads = navigator.getGamepads?.() ?? [];
    for (const pad of pads) {
      if (!pad || pad.mapping !== "standard") continue;
      const dz = radialDeadzone(pad.axes[0] ?? 0, pad.axes[1] ?? 0, 0.18);
      x += dz.x;
      y += dz.y;
    }
  }

  const m = Math.hypot(x, y);
  if (m > 1) {
    x /= m;
    y /= m;
  }
  return { x, y };
}

export function bindKeyboard() {
  const down = (e: KeyboardEvent) => {
    keys.add(e.code);
    if (GAME_KEYS.has(e.code)) e.preventDefault();
  };
  const up = (e: KeyboardEvent) => keys.delete(e.code);
  const clear = () => keys.clear();
  const vis = () => {
    if (document.hidden) keys.clear();
  };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", clear);
  document.addEventListener("visibilitychange", vis);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", clear);
    document.removeEventListener("visibilitychange", vis);
    keys.clear();
  };
}
