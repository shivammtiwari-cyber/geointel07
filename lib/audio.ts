/**
 * Tactical Audio Alert System
 * Generates synthesized 'Command Center' alert sounds.
 */

class AudioAlertSystem {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Plays a high-pitched 'Redline' alert beep.
   */
  public playRedlineAlert() {
    this.initCtx();
    if (!this.ctx) return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.start();
    oscillator.stop(this.ctx.currentTime + 0.5);
  }

  /**
   * Plays a sublte 'Update' blip.
   */
  public playUpdateBlip() {
    this.initCtx();
    if (!this.ctx) return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(220, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.start();
    oscillator.stop(this.ctx.currentTime + 0.1);
  }
}

export const audioAlerts = typeof window !== 'undefined' ? new AudioAlertSystem() : null;
