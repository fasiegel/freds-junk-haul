let ac: AudioContext | null = null;

export function unlockAudio() {
  if (typeof AudioContext === "undefined") return;
  if (!ac) ac = new AudioContext();
  if (ac.state === "suspended") void ac.resume();
}

export function blip(freq: number) {
  if (!ac || ac.state !== "running") return;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = "square";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.04, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
  o.connect(g);
  g.connect(ac.destination);
  o.start();
  o.stop(ac.currentTime + 0.12);
}
