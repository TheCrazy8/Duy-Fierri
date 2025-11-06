/**
 * Flavorwave Amplitude Tracker
 * Monitors statistical deltas for resonance triggers
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Flavorwave = {
  baseline: null,
  history: [],
  maxHistory: 10,
  
  /**
   * Set baseline for amplitude calculation
   */
  setBaseline(stats) {
    this.baseline = {
      spicecraft: stats.spicecraft || 0,
      umami: stats.umami || 0,
      sweetness: stats.sweetness || 0,
      heat: stats.heat || 0,
      timestamp: Date.now()
    };
  },
  
  /**
   * Compute amplitude delta
   */
  computeAmplitude(currentStats) {
    if (!this.baseline) {
      this.setBaseline(currentStats);
      return 0;
    }
    
    const delta = 
      (currentStats.spicecraft - this.baseline.spicecraft) +
      (currentStats.umami - this.baseline.umami) +
      (currentStats.sweetness - this.baseline.sweetness) +
      (currentStats.heat - this.baseline.heat);
    
    const amplitude = {
      value: delta,
      timestamp: Date.now(),
      stats: { ...currentStats }
    };
    
    // Add to history
    this.history.push(amplitude);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    
    // Update baseline for next measurement
    this.setBaseline(currentStats);
    
    return delta;
  },
  
  /**
   * Check for resonance pattern
   * Resonance occurs when amplitude swings are consistent
   */
  checkResonance() {
    if (this.history.length < 3) {
      return null;
    }
    
    const recent = this.history.slice(-3);
    const amplitudes = recent.map(h => h.value);
    
    // Check for positive resonance (consistent growth)
    if (amplitudes.every(a => a > 5)) {
      return {
        type: 'positive',
        strength: Math.min(...amplitudes),
        effect: 'All stats gain +1 bonus'
      };
    }
    
    // Check for negative resonance (consistent decline)
    if (amplitudes.every(a => a < -5)) {
      return {
        type: 'negative',
        strength: Math.max(...amplitudes),
        effect: 'Energy cost reduction'
      };
    }
    
    // Check for oscillation (alternating pattern)
    const signs = amplitudes.map(a => Math.sign(a));
    if (signs[0] !== signs[1] && signs[1] !== signs[2]) {
      return {
        type: 'oscillation',
        strength: Math.abs(amplitudes[1]),
        effect: 'Synergy chance increased'
      };
    }
    
    return null;
  },
  
  /**
   * Get current wave state
   */
  getWaveState() {
    const current = this.history[this.history.length - 1];
    if (!current) {
      return { amplitude: 0, trend: 'stable' };
    }
    
    let trend = 'stable';
    if (current.value > 3) trend = 'rising';
    else if (current.value < -3) trend = 'falling';
    
    return {
      amplitude: current.value,
      trend,
      resonance: this.checkResonance()
    };
  },
  
  /**
   * Get amplitude history for visualization
   */
  getHistory() {
    return this.history.map(h => ({
      value: h.value,
      timestamp: h.timestamp
    }));
  },
  
  /**
   * Reset tracker
   */
  reset() {
    this.baseline = null;
    this.history = [];
  }
};

console.log('Flavorwave system initialized');
