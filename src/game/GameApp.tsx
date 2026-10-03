import { Canvas } from "@react-three/fiber";
import { useEffect, useLayoutEffect } from "react";
import { unlockAudio } from "./audio";
import { Scene } from "./Scene";
import { Joystick } from "./Joystick";
import { bindKeyboard, setQaKeys } from "./input";
import { playerSpeed, playerYaw } from "./pose";
import { Hud, Screens } from "./Overlay";
import { useGame } from "./store";

export default function GameApp() {
  const hydrate = useGame((s) => s.hydrate);
  const phase = useGame((s) => s.phase);

  useLayoutEffect(() => {
    const qa =
      import.meta.env.DEV || new URLSearchParams(window.location.search).has("qa");
    if (!qa) return;
    window.__controlsTest = {
      getYaw: () => playerYaw.current,
      getSpeed: () => playerSpeed.current,
      setKeys: (codes) => setQaKeys(codes),
    };
    return () => {
      delete window.__controlsTest;
    };
  }, []);

  useEffect(() => {
    hydrate();
    const off = bindKeyboard();
    const resume = () => unlockAudio();
    window.addEventListener("pointerdown", resume);
    document.addEventListener("visibilitychange", resume);
    return () => {
      off();
      window.removeEventListener("pointerdown", resume);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [hydrate]);

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ fov: 52, position: [-8, 11, 13], near: 0.1, far: 80 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
      <Hud />
      <Screens />
      {phase === "play" ? <Joystick /> : null}
    </div>
  );
}
