/**
 * Status Effect Framework
 * Unified status system with tick phases and modular definitions
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Status = {
  // Status definitions
  definitions: {
    'Burn': {
      category: 'debuff',
      tickPhase: 'endTurn',
      icon: '🔥',
      effects: [{
        type: 'damage',
        target: 'holder',
        amount: 'stacks'
      }],
      onTick(holder, stacks) {
        if (holder.hp !== undefined) {
          holder.hp -= stacks;
          return `${holder.name || 'Target'} suffers ${stacks} Burn damage`;
        } else if (holder.heat !== undefined) {
          holder.heat -= 1;
          return `Heat Resistance eroded by Burn`;
        }
      }
    },
    'Sap': {
      category: 'debuff',
      tickPhase: 'startTurn',
      icon: '🍯',
      effects: [{
        type: 'energyDrain',
        amount: 1
      }],
      onTick(holder, stacks) {
        if (holder.energy !== undefined) {
          holder.energy = Math.max(0, holder.energy - 1);
          return `Sap drains 1 energy`;
        }
      }
    },
    'Blandness': {
      category: 'debuff',
      tickPhase: 'passive',
      icon: '🌫️',
      effects: [{
        type: 'statReduction',
        stat: 'spicecraft',
        amount: 'stacks'
      }],
      onTick(holder, stacks) {
        return `Blandness reduces effectiveness`;
      }
    },
    'Fortify': {
      category: 'buff',
      tickPhase: 'passive',
      icon: '🛡️',
      effects: [{
        type: 'damageReduction',
        amount: 'stacks'
      }],
      onTick(holder, stacks) {
        return `Fortify provides ${stacks} damage reduction`;
      }
    },
    'Vigor': {
      category: 'buff',
      tickPhase: 'startTurn',
      icon: '💪',
      effects: [{
        type: 'statBoost',
        stats: ['spicecraft', 'umami'],
        amount: 1
      }],
      onTick(holder, stacks) {
        if (holder.spicecraft !== undefined) {
          holder.spicecraft += 1;
        }
        if (holder.umami !== undefined) {
          holder.umami += 1;
        }
        return `Vigor boosts stats`;
      }
    },
    'Regen': {
      category: 'buff',
      tickPhase: 'endTurn',
      icon: '💚',
      effects: [{
        type: 'heal',
        amount: 'stacks'
      }],
      onTick(holder, stacks) {
        if (holder.hp !== undefined && holder.maxHp !== undefined) {
          const healed = Math.min(stacks, holder.maxHp - holder.hp);
          holder.hp += healed;
          return `Regen heals ${healed} HP`;
        }
      }
    },
    'Stick': {
      category: 'debuff',
      tickPhase: 'passive',
      icon: '🍬',
      effects: [{
        type: 'damageReduction',
        target: 'attacks',
        percent: 25
      }],
      onTick(holder, stacks) {
        return `Stick reduces attack power by 25%`;
      }
    }
  },
  
  /**
   * Create a new status effect instance
   */
  createStatus(name, stacks = 1, duration = 2) {
    const def = this.definitions[name];
    if (!def) {
      console.warn(`Unknown status: ${name}`);
      return null;
    }
    
    return {
      name,
      category: def.category,
      stacks,
      duration,
      tickPhase: def.tickPhase,
      icon: def.icon,
      effects: def.effects,
      onTick: def.onTick
    };
  },
  
  /**
   * Apply a status to a target
   */
  applyStatus(target, name, stacks = 1, duration = 2) {
    if (!target.statuses) {
      target.statuses = [];
    }
    
    const existing = target.statuses.find(s => s.name === name);
    
    if (existing) {
      existing.stacks += stacks;
      existing.duration = Math.max(existing.duration, duration);
    } else {
      const newStatus = this.createStatus(name, stacks, duration);
      if (newStatus) {
        target.statuses.push(newStatus);
      }
    }
    
    // Dispatch plugin hook
    if (window.Flavorverse.dispatchHook) {
      window.Flavorverse.dispatchHook('onStatusApply', {
        target: target.name || 'unknown',
        status: name,
        stacks,
        duration
      });
    }
  },
  
  /**
   * Tick all statuses for a target in a specific phase
   */
  tickStatuses(target, phase) {
    if (!target.statuses) return [];
    
    const messages = [];
    
    target.statuses.forEach(status => {
      if (status.tickPhase === phase) {
        const msg = status.onTick(target, status.stacks);
        if (msg) messages.push(msg);
        status.duration -= 1;
      }
    });
    
    // Remove expired statuses
    target.statuses = target.statuses.filter(s => s.duration > 0);
    
    return messages;
  },
  
  /**
   * Get status modifier for calculations
   */
  getStatusModifier(target, modifierType) {
    if (!target.statuses) return 0;
    
    let modifier = 0;
    target.statuses.forEach(status => {
      status.effects.forEach(effect => {
        if (effect.type === modifierType) {
          modifier += (effect.amount === 'stacks') ? status.stacks : (effect.amount || 0);
        }
      });
    });
    
    return modifier;
  },
  
  /**
   * Check if target has a specific status
   */
  hasStatus(target, statusName) {
    if (!target.statuses) return false;
    return target.statuses.some(s => s.name === statusName);
  },
  
  /**
   * Clear all statuses from target
   */
  clearStatuses(target) {
    if (target.statuses) {
      target.statuses = [];
    }
  }
};

console.log('Status system initialized');
