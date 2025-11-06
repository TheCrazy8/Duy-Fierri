/**
 * Tarot Spread System
 * 3-card reading that modifies starting stats and run parameters
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Tarot = {
  // Available tarot cards (subset from lore)
  deck: [
    { id: 'the-chef', name: 'The Chef', suit: 'Major', upright: '+1 base energy', reverse: '-1 card draw' },
    { id: 'the-flame', name: 'The Flame', suit: 'Major', upright: '+3 Spicecraft', reverse: '+2 Burn vulnerability' },
    { id: 'the-donkey', name: 'The Donkey', suit: 'Major', upright: 'Synergy chance +20%', reverse: 'Random chaos each turn' },
    { id: 'the-ladle', name: 'The Ladle', suit: 'Major', upright: '+3 Umami', reverse: '-2 Umami' },
    { id: 'the-garnish', name: 'The Garnish', suit: 'Major', upright: '+2 all stats', reverse: '-1 Sweetness' },
    { id: 'capsaicin-spark', name: 'Capsaicin Spark', suit: 'Spices', upright: '+2 Spicecraft', reverse: '-1 Heat Resistance' },
    { id: 'broth-depth', name: 'Broth Depth', suit: 'Sauces', upright: '+3 Umami', reverse: 'Slower energy regen' },
    { id: 'sugar-bloom', name: 'Sugar Bloom', suit: 'Grains', upright: '+3 Sweetness', reverse: '-1 base energy' },
    { id: 'sage-memory', name: 'Sage Memory', suit: 'Herbs', upright: 'Start with Vigor', reverse: 'Start with Sap' },
    { id: 'fermented-insight', name: 'Fermented Insight', suit: 'Sauces', upright: '+1 card draw', reverse: 'Delayed effects' }
  ],
  
  currentSpread: [],
  
  /**
   * Draw a 3-card tarot spread
   * @param {number} seed - Optional seed for deterministic draw
   */
  drawSpread(seed) {
    const shuffled = this.shuffleDeck(seed);
    this.currentSpread = [];
    
    for (let i = 0; i < 3; i++) {
      const card = shuffled[i];
      const reversed = Math.random() < 0.3; // 30% chance reversed
      
      this.currentSpread.push({
        ...card,
        reversed,
        effect: reversed ? card.reverse : card.upright
      });
    }
    
    return this.currentSpread;
  },
  
  /**
   * Shuffle the tarot deck
   */
  shuffleDeck(seed) {
    const deck = [...this.deck];
    
    if (seed !== undefined) {
      // Seeded shuffle
      let rng = seed;
      for (let i = deck.length - 1; i > 0; i--) {
        rng = (rng * 9301 + 49297) % 233280;
        const j = Math.floor((rng / 233280) * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    } else {
      // Random shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }
    
    return deck;
  },
  
  /**
   * Apply tarot spread effects to game state
   */
  applySpread(state) {
    if (!this.currentSpread || this.currentSpread.length === 0) {
      return [];
    }
    
    const effects = [];
    
    this.currentSpread.forEach(card => {
      const result = this.applyCardEffect(card, state);
      if (result) {
        effects.push(`${card.name} ${card.reversed ? '(Reversed)' : ''}: ${result}`);
      }
    });
    
    return effects;
  },
  
  /**
   * Apply individual card effect
   */
  applyCardEffect(card, state) {
    const effect = card.reversed ? card.reverse : card.upright;
    
    // Parse and apply effect
    if (effect.includes('+1 base energy')) {
      state.baseEnergy += 1;
      state.energy += 1;
      return '+1 base energy';
    } else if (effect.includes('-1 card draw')) {
      state.maxHand = Math.max(1, state.maxHand - 1);
      return '-1 card draw';
    } else if (effect.includes('+3 Spicecraft')) {
      state.spicecraft += 3;
      return '+3 Spicecraft';
    } else if (effect.includes('+2 Burn vulnerability')) {
      if (!state.vulnerabilities) state.vulnerabilities = [];
      state.vulnerabilities.push('Burn');
      return 'Vulnerable to Burn';
    } else if (effect.includes('Synergy chance +20%')) {
      state.synergyBonus = (state.synergyBonus || 0) + 0.2;
      return 'Synergy chance boosted';
    } else if (effect.includes('+3 Umami')) {
      state.umami += 3;
      return '+3 Umami';
    } else if (effect.includes('-2 Umami')) {
      state.umami -= 2;
      return '-2 Umami';
    } else if (effect.includes('+2 all stats')) {
      state.spicecraft += 2;
      state.umami += 2;
      state.sweetness += 2;
      state.heat += 2;
      return '+2 all stats';
    } else if (effect.includes('-1 Sweetness')) {
      state.sweetness -= 1;
      return '-1 Sweetness';
    } else if (effect.includes('+2 Spicecraft')) {
      state.spicecraft += 2;
      return '+2 Spicecraft';
    } else if (effect.includes('-1 Heat Resistance')) {
      state.heat -= 1;
      return '-1 Heat Resistance';
    } else if (effect.includes('+3 Sweetness')) {
      state.sweetness += 3;
      return '+3 Sweetness';
    } else if (effect.includes('-1 base energy')) {
      state.baseEnergy = Math.max(1, state.baseEnergy - 1);
      return '-1 base energy';
    } else if (effect.includes('Start with Vigor')) {
      if (window.Flavorverse.Status) {
        window.Flavorverse.Status.applyStatus(state, 'Vigor', 2, 5);
      }
      return 'Start with Vigor buff';
    } else if (effect.includes('Start with Sap')) {
      if (window.Flavorverse.Status) {
        window.Flavorverse.Status.applyStatus(state, 'Sap', 1, 3);
      }
      return 'Start with Sap debuff';
    } else if (effect.includes('+1 card draw')) {
      state.maxHand += 1;
      return '+1 card draw';
    }
    
    return effect;
  },
  
  /**
   * Get current spread for display
   */
  getSpread() {
    return this.currentSpread;
  },
  
  /**
   * Export spread for save/load
   */
  exportSpread() {
    return {
      spread: this.currentSpread
    };
  },
  
  /**
   * Import spread from save
   */
  importSpread(data) {
    if (data && data.spread) {
      this.currentSpread = data.spread;
      return true;
    }
    return false;
  }
};

console.log('Tarot system initialized');
