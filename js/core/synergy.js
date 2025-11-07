/**
 * Synergy System
 * Tracks card tags and detects combos
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Synergy = {
  // Track last N played card tags
  recentTags: [],
  maxRecent: 2,
  
  // Synergy lookup table
  combos: {
    'Spice-Umami': {
      name: 'Savory Heat',
      effect: 'Bonus +2 Spicecraft, +2 Umami',
      apply: (state) => {
        state.spicecraft += 2;
        state.umami += 2;
        return 'Synergy: Savory Heat! +2 Spicecraft, +2 Umami';
      }
    },
    'Spice-Sweet': {
      name: 'Caramelized Fire',
      effect: 'Bonus +3 Sweetness, apply Burn',
      apply: (state) => {
        state.sweetness += 3;
        if (state.applyEnemyStatus) {
          state.applyEnemyStatus('Burn', 2, 2);
        }
        return 'Synergy: Caramelized Fire! +3 Sweetness, enemy Burn x2';
      }
    },
    'Umami-Sweet': {
      name: 'Rich Harmony',
      effect: 'Restore 2 energy, +1 to all stats',
      apply: (state) => {
        state.energy = Math.min(state.energy + 2, state.baseEnergy + 3);
        state.spicecraft += 1;
        state.umami += 1;
        state.sweetness += 1;
        state.heat += 1;
        return 'Synergy: Rich Harmony! +2 Energy, +1 all stats';
      }
    },
    'Spice-Spice': {
      name: 'Double Heat',
      effect: 'Massive burn damage',
      apply: (state) => {
        if (state.applyEnemyStatus) {
          state.applyEnemyStatus('Burn', 3, 3);
        }
        return 'Synergy: Double Heat! Enemy Burn x3';
      }
    },
    'Umami-Umami': {
      name: 'Deep Broth',
      effect: 'Heal and boost Umami',
      apply: (state) => {
        state.umami += 4;
        return 'Synergy: Deep Broth! +4 Umami';
      }
    },
    'Sweet-Sweet': {
      name: 'Sugar Rush',
      effect: 'Extra card draw',
      apply: (state) => {
        state.sweetness += 3;
        return 'Synergy: Sugar Rush! +3 Sweetness (draw bonus on next turn)';
      }
    }
  },
  
  /**
   * Record a card play with its tags
   * @param {Array<string>} tags - Tags from the played card
   * @param {Object} gameState - Current game state
   */
  recordCardPlay(tags, gameState) {
    if (!tags || tags.length === 0) return null;
    
    // Add to recent tags
    tags.forEach(tag => {
      this.recentTags.push(tag);
      if (this.recentTags.length > this.maxRecent) {
        this.recentTags.shift();
      }
    });
    
    // Check for synergies if we have enough tags
    if (this.recentTags.length >= 2) {
      return this.checkSynergy(gameState);
    }
    
    return null;
  },
  
  /**
   * Check if recent tags form a synergy
   * @param {Object} gameState - Current game state
   */
  checkSynergy(gameState) {
    if (this.recentTags.length < 2) return null;
    
    // Get last two tags
    const tag1 = this.recentTags[this.recentTags.length - 2];
    const tag2 = this.recentTags[this.recentTags.length - 1];
    
    // Try both orderings
    const key1 = `${tag1}-${tag2}`;
    const key2 = `${tag2}-${tag1}`;
    
    const combo = this.combos[key1] || this.combos[key2];
    
    if (combo) {
      const result = combo.apply(gameState);
      
      // Dispatch plugin hook
      if (window.Flavorverse.dispatchHook) {
        window.Flavorverse.dispatchHook('onSynergy', {
          combo: combo.name,
          tags: [tag1, tag2],
          result: result
        });
      }
      
      // Clear recent tags after synergy
      this.recentTags = [];
      
      return result;
    }
    
    return null;
  },
  
  /**
   * Reset synergy tracker
   */
  reset() {
    this.recentTags = [];
  },
  
  /**
   * Get available synergies for display
   */
  getAvailableSynergies() {
    return Object.entries(this.combos).map(([key, combo]) => ({
      tags: key,
      name: combo.name,
      effect: combo.effect
    }));
  }
};

console.log('Synergy system initialized');
