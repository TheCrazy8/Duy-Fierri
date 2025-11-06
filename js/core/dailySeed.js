/**
 * Daily Seed System
 * Generates deterministic seeds based on date
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.DailySeed = {
  /**
   * Generate seed from date
   */
  generateSeed(date = new Date()) {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return this.hashString(dateStr);
  },
  
  /**
   * Simple string hash function
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  },
  
  /**
   * Get today's seed
   */
  getTodaySeed() {
    return this.generateSeed();
  },
  
  /**
   * Initialize daily run with seed
   */
  initDailyRun(gameState) {
    const seed = this.getTodaySeed();
    
    // Seed tarot spread
    const spread = window.Flavorverse.Tarot.drawSpread(seed);
    const effects = window.Flavorverse.Tarot.applySpread(gameState);
    
    // Seed modifier selection (pick 2 based on seed)
    const modifiers = window.Flavorverse.Modifiers.getAvailable();
    const mod1 = modifiers[seed % modifiers.length];
    const mod2 = modifiers[(seed + 1) % modifiers.length];
    
    if (mod1 && mod2 && mod1.id !== mod2.id) {
      window.Flavorverse.Modifiers.addModifier(mod1.id, gameState);
      window.Flavorverse.Modifiers.addModifier(mod2.id, gameState);
    }
    
    return {
      seed,
      date: new Date().toISOString().split('T')[0],
      spread,
      effects,
      modifiers: [mod1?.id, mod2?.id].filter(Boolean)
    };
  },
  
  /**
   * Check if daily run completed today
   */
  isCompletedToday() {
    const data = window.Flavorverse.Persistence.load();
    if (!data || !data.dailyRuns) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return data.dailyRuns && data.dailyRuns[today] && data.dailyRuns[today].completed;
  },
  
  /**
   * Mark daily run as completed
   */
  markCompleted(victory, stats) {
    const data = window.Flavorverse.Persistence.load() || {};
    if (!data.dailyRuns) data.dailyRuns = {};
    
    const today = new Date().toISOString().split('T')[0];
    data.dailyRuns[today] = {
      completed: true,
      victory,
      stats,
      timestamp: Date.now()
    };
    
    window.Flavorverse.Persistence.save(data);
  }
};

console.log('Daily seed system initialized');
