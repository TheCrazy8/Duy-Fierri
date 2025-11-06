/**
 * Relic System
 * Persistent modifiers and passive effects
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Relics = {
  // Relic definitions
  definitions: {
    'tweezers-of-precision': {
      name: 'Tweezers of Precision',
      rarity: 'uncommon',
      icon: '🔧',
      description: 'First card each turn costs 1 less energy',
      passive: true,
      onTurnStart(state) {
        state.firstCardDiscount = 1;
      },
      onCardPlay(state, card) {
        if (state.firstCardDiscount && state.firstCardDiscount > 0) {
          state.firstCardDiscount = 0;
          return 'Tweezers of Precision: -1 cost';
        }
      }
    },
    'scorch-fragment': {
      name: 'Scorch Fragment',
      rarity: 'rare',
      icon: '🔥',
      description: 'Every 4th turn, Burn ticks deal +1 damage',
      passive: true,
      counter: 0,
      onTurnEnd(state) {
        this.counter = (this.counter || 0) + 1;
        if (this.counter >= 4) {
          this.counter = 0;
          state.burnBonus = (state.burnBonus || 0) + 1;
          return 'Scorch Fragment: Burn intensity increased!';
        }
      }
    },
    'umami-anchor': {
      name: 'Umami Anchor',
      rarity: 'common',
      icon: '⚓',
      description: 'Start each combat with +3 Umami',
      passive: true,
      onCombatStart(state) {
        state.umami += 3;
        return 'Umami Anchor: +3 starting Umami';
      }
    },
    'spice-lens': {
      name: 'Spice Lens',
      rarity: 'rare',
      icon: '🔍',
      description: 'Spice-tagged cards deal double damage',
      passive: true,
      onCardPlay(state, card) {
        if (card.tags && card.tags.includes('Spice')) {
          return 'Spice Lens: Enhanced spice effect!';
        }
      }
    },
    'crystal-vial': {
      name: 'Crystal Vial',
      rarity: 'legendary',
      icon: '⚗️',
      description: 'Gain 1 of each stat every 3 turns',
      passive: true,
      counter: 0,
      onTurnEnd(state) {
        this.counter = (this.counter || 0) + 1;
        if (this.counter >= 3) {
          this.counter = 0;
          state.spicecraft += 1;
          state.umami += 1;
          state.sweetness += 1;
          state.heat += 1;
          return 'Crystal Vial: All stats increased!';
        }
      }
    },
    'donkey-charm': {
      name: 'Donkey Charm',
      rarity: 'legendary',
      icon: '🎭',
      description: 'Synergies trigger twice',
      passive: true,
      onSynergy(state, synergyData) {
        return 'Donkey Charm: Synergy doubled!';
      }
    }
  },
  
  // Active relics collection
  active: [],
  
  /**
   * Add a relic to the active collection
   */
  addRelic(relicId) {
    const def = this.definitions[relicId];
    if (!def) {
      console.warn(`Unknown relic: ${relicId}`);
      return false;
    }
    
    // Check if already have this relic
    if (this.active.find(r => r.id === relicId)) {
      console.warn(`Already have relic: ${def.name}`);
      return false;
    }
    
    const relic = {
      id: relicId,
      ...JSON.parse(JSON.stringify(def))
    };
    
    this.active.push(relic);
    console.log(`Relic acquired: ${relic.name}`);
    return true;
  },
  
  /**
   * Remove a relic
   */
  removeRelic(relicId) {
    const index = this.active.findIndex(r => r.id === relicId);
    if (index !== -1) {
      this.active.splice(index, 1);
      return true;
    }
    return false;
  },
  
  /**
   * Trigger relic hook
   */
  triggerHook(hookName, state, ...args) {
    const messages = [];
    
    this.active.forEach(relic => {
      if (relic[hookName]) {
        try {
          const msg = relic[hookName](state, ...args);
          if (msg) messages.push(msg);
        } catch (e) {
          console.error(`Error in relic ${relic.id} hook ${hookName}:`, e);
        }
      }
    });
    
    return messages;
  },
  
  /**
   * Get all active relics info
   */
  getActive() {
    return this.active.map(r => ({
      id: r.id,
      name: r.name,
      rarity: r.rarity,
      icon: r.icon,
      description: r.description
    }));
  },
  
  /**
   * Reset all relics
   */
  reset() {
    this.active = [];
  },
  
  /**
   * Get available relics for selection
   */
  getAvailableRelics() {
    return Object.entries(this.definitions).map(([id, def]) => ({
      id,
      name: def.name,
      rarity: def.rarity,
      icon: def.icon,
      description: def.description
    }));
  }
};

console.log('Relic system initialized');
