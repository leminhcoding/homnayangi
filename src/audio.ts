/** Original synthesized sound design. Audio only starts after a user gesture. */
export class SlotAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = true;
  private ticker: ReturnType<typeof setInterval> | undefined;
  private tickIndex = 0;
  setEnabled(value: boolean) {
    this.enabled = value;
    if (this.context && this.master)
      this.master.gain.setTargetAtTime(
        value ? 0.5 : 0,
        this.context.currentTime,
        0.025,
      );
  }
  unlock() {
    try {
      if (!this.context) {
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.gain.value = this.enabled ? 0.5 : 0;
        this.master.connect(this.context.destination);
      }
      void this.context.resume().catch(() => {});
    } catch {
      /* Silent fallback when Web Audio is unavailable. */
    }
  }
  private tone(
    frequency: number,
    duration: number,
    delay = 0,
    volume = 0.15,
    type: OscillatorType = "sine",
  ) {
    const c = this.context;
    if (!c || !this.master) return;
    const osc = c.createOscillator(),
      gain = c.createGain(),
      when = c.currentTime + delay;
    osc.type = type;
    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(this.master);
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(volume, when + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.start(when);
    osc.stop(when + duration + 0.01);
  }
  private click(delay = 0, volume = 0.12) {
    const c = this.context;
    if (!c || !this.master) return;
    const buffer = c.createBuffer(
      1,
      Math.floor(c.sampleRate * 0.025),
      c.sampleRate,
    );
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i++)
      channel[i] = (Math.random() * 2 - 1) * (1 - i / channel.length);
    const node = c.createBufferSource(),
      filter = c.createBiquadFilter(),
      gain = c.createGain();
    node.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    filter.Q.value = 0.7;
    gain.gain.value = volume;
    node.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    node.start(c.currentTime + delay);
  }
  pull() {
    this.unlock();
    this.tone(130, 0.16, 0, 0.23, "triangle");
    this.click(0.06, 0.25);
  }
  spin() {
    this.unlock();
    this.stop();
    this.tickIndex = 0;
    this.ticker = setInterval(() => {
      this.click(0, 0.1);
      this.tone(190 + (this.tickIndex++ % 7) * 12, 0.03, 0, 0.025, "triangle");
    }, 67);
  }
  stopReel(index: number) {
    this.click(0, 0.28);
    this.tone(150, 0.09, 0, 0.24, "triangle");
    this.tone(
      [523.25, 659.25, 783.99, 1046.5, 1318.5][index % 5],
      0.25,
      0.035,
      0.15,
    );
  }
  win() {
    this.stop();
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((n, i) =>
      this.tone(n, 0.42, i * 0.095, 0.15, "triangle"),
    );
    [523.25, 659.25, 783.99, 1046.5].forEach((n) =>
      this.tone(n, 0.9, 0.55, 0.08),
    );
    for (let i = 0; i < 10; i++)
      this.tone(1500 + (i % 4) * 320, 0.11, 0.8 + i * 0.06, 0.035);
  }
  stop() {
    clearInterval(this.ticker);
    this.ticker = undefined;
  }
  destroy() {
    this.stop();
    void this.context?.close().catch(() => {});
    this.context = null;
    this.master = null;
  }
}
