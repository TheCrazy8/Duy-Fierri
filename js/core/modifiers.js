/**
 * Run Modifiers System
 * Global modifiers that affect the entire run
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Modifiers = {
  definitions: {
    'high-heat': {
      id: 'high-heat',
      name: 'High Heat',
      description: '-1 base energy, but Burn application chance increases',
      icon: '🔥',
      difficulty: 'hard',
      effects: {
        baseEnergy: -1,
        burnChance: 0.3
      },
      apply(state) {
        state.baseEnergy = Math.max(1, state.baseEnergy - 1);
        state.energy = state.baseEnergy;
        state.burnChance = (state.burnChance || 0) + 0.3;
        return 'High Heat active: -1 energy, +30% burn chance';
      }
    },
    'sweet-expand': {
      id: 'sweet-expand',
      name: 'Sweet Expansion',
      description: '+1 hand size, -2 starting Sweetness',
      icon: '🍬',
      difficulty: 'medium',
      effects: {
        maxHand: 1,
        sweetness: -2
      },
      apply(state) {
        state.maxHand += 1;
        state.sweetness -= 2;
        return 'Sweet Expansion active: +1 hand size, -2 Sweetness';
      }
    },
    'umami-regen': {
      id: 'umami-regen',
      name: 'Umami Regeneration',
      description: '+1 Umami per enemy action',
      icon: '🍜',
      difficulty: 'easy',
      effects: {
        umamiPerEnemyAction: 1
      },
      apply(state) {
        state.umamiPerEnemyAction = (state.umamiPerEnemyAction || 0) + 1;
        return 'Umami Regen active: +1 Umami per enemy action';
      }
    },
    'fragile-power': {
      id: 'fragile-power',
      name: 'Fragile Power',
      description: '+5 to all starting stats, but take double Burn damage',
      icon: '💎',
      difficulty: 'hard',
      effects: {
        allStats: 5,
        burnMultiplier: 2
      },
      apply(state) {
        state.spicecraft += 5;
        state.umami += 5;
        state.sweetness += 5;
        state.heat += 5;
        state.burnMultiplier = 2;
        return 'Fragile Power active: +5 all stats, 2x Burn damage';
      }
    },
    'energy-surge': {
      id: 'energy-surge',
      name: 'Energy Surge',
      description: '+1 base energy, but hand size -1',
      icon: '⚡',
      difficulty: 'medium',
      effects: {
        baseEnergy: 1,
        maxHand: -1
      },
      apply(state) {
        state.baseEnergy += 1;
        state.energy = state.baseEnergy;
        state.maxHand = Math.max(1, state.maxHand - 1);
        return 'Energy Surge active: +1 energy, -1 hand size';
      }
    },
    'spice-mastery': {
      id: 'spice-mastery',
      name: 'Spice Mastery',
      description: 'Spice-tagged cards cost 1 less, others cost 1 more',
      icon: '🌶️',
      difficulty: 'medium',
      effects: {
        spiceDiscount: 1,
        otherCostIncrease: 1
      },
      apply(state) {
        state.spiceDiscount = 1;
        state.otherCostIncrease = 1;
        return 'Spice Mastery active: Spice cards cheaper, others more expensive';
      }
    }
  },
  
  active: [],
  
  /**
   * Add a modifier to the run
   */
  addModifier(modifierId, state) {
    const def = this.definitions[modifierId];
    if (!def) {
      console.warn(`Unknown modifier: ${modifierId}`);
      return false;
    }
    
    if (this.active.find(m => m.id === modifierId)) {
      console.warn(`Modifier already active: ${def.name}`);
      return false;
    }
    
    const modifier = { ...def };
    this.active.push(modifier);
    
    // Apply effects to state
    if (state) {
      const msg = modifier.apply(state);
      console.log(msg);
    }
    
    return true;
  },
  
  /**
   * Remove a modifier
   */
  removeModifier(modifierId) {
    const index = this.active.findIndex(m => m.id === modifierId);
    if (index !== -1) {
      this.active.splice(index, 1);
      return true;
    }
    return false;
  },
  
  /**
   * Get all active modifiers
   */
  getActive() {
    return this.active.map(m => ({
      id: m.id,
      name: m.name,
      description: m.description,
      icon: m.icon,
      difficulty: m.difficulty
    }));
  },
  
  /**
   * Get available modifiers for selection
   */
  getAvailable() {
    return Object.entries(this.definitions).map(([id, def]) => ({
      id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      difficulty: def.difficulty
    }));
  },
  
  /**
   * Apply modifier hook during gameplay
   */
  applyHook(hookName, state, data) {
    const messages = [];
    
    this.active.forEach(modifier => {
      // Apply passive effects based on hook
      if (hookName === 'onEnemyAction' && modifier.effects.umamiPerEnemyAction) {
        state.umami += modifier.effects.umamiPerEnemyAction;
        messages.push(`+${modifier.effects.umamiPerEnemyAction} Umami (${modifier.name})`);
      }
    });
    
    return messages;
  },
  
  /**
   * Reset modifiers
   */
  reset() {
    this.active = [];
  }
};

console.log('Modifiers system initialized');
