/**
 * Achievements System
 * Tracks player milestones and unlocks
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Achievements = {
  definitions: {
    'first-burn': {
      id: 'first-burn',
      name: 'Feeling the Heat',
      description: 'Deal 10 Burn damage in a single run',
      icon: '🔥',
      threshold: 10,
      counter: 0,
      unlocked: false
    },
    'synergy-master': {
      id: 'synergy-master',
      name: 'Flavor Fusion',
      description: 'Trigger 5 synergies in a single run',
      icon: '✨',
      threshold: 5,
      counter: 0,
      unlocked: false
    },
    'relic-collector': {
      id: 'relic-collector',
      name: 'Artifact Hunter',
      description: 'Collect 3 relics',
      icon: '🏺',
      threshold: 3,
      counter: 0,
      unlocked: false
    },
    'perfect-victory': {
      id: 'perfect-victory',
      name: 'Flawless Chef',
      description: 'Defeat an enemy without taking damage',
      icon: '👨‍🍳',
      threshold: 1,
      counter: 0,
      unlocked: false
    },
    'deck-master': {
      id: 'deck-master',
      name: 'Culinary Architect',
      description: 'Build a deck with 15+ cards',
      icon: '🃏',
      threshold: 15,
      counter: 0,
      unlocked: false
    },
    'legendary-pull': {
      id: 'legendary-pull',
      name: 'Golden Spoon',
      description: 'Draw a legendary card',
      icon: '⭐',
      threshold: 1,
      counter: 0,
      unlocked: false
    },
    'stat-master': {
      id: 'stat-master',
      name: 'Balanced Palate',
      description: 'Reach 20+ in any stat',
      icon: '📈',
      threshold: 20,
      counter: 0,
      unlocked: false
    }
  },
  
  state: {},
  
  /**
   * Initialize achievements from save data
   */
  init(saveData) {
    if (saveData && saveData.achievements) {
      this.state = saveData.achievements;
    } else {
      // Initialize from definitions
      Object.keys(this.definitions).forEach(id => {
        this.state[id] = { ...this.definitions[id] };
      });
    }
  },
  
  /**
   * Increment achievement progress
   */
  increment(achievementId, amount = 1) {
    if (!this.state[achievementId]) {
      console.warn(`Unknown achievement: ${achievementId}`);
      return null;
    }
    
    const achievement = this.state[achievementId];
    
    if (achievement.unlocked) {
      return null; // Already unlocked
    }
    
    achievement.counter += amount;
    
    // Check if unlocked
    if (achievement.counter >= achievement.threshold) {
      achievement.unlocked = true;
      console.log(`🎉 Achievement unlocked: ${achievement.name}`);
      
      // Save to persistence
      this.save();
      
      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon
      };
    }
    
    return null;
  },
  
  /**
   * Check achievement triggers
   */
  check(event, data) {
    const unlocked = [];
    
    switch (event) {
      case 'burnDamage':
        const burn = this.increment('first-burn', data.amount);
        if (burn) unlocked.push(burn);
        break;
        
      case 'synergy':
        const synergy = this.increment('synergy-master', 1);
        if (synergy) unlocked.push(synergy);
        break;
        
      case 'relicAcquired':
        const relic = this.increment('relic-collector', 1);
        if (relic) unlocked.push(relic);
        break;
        
      case 'flawlessVictory':
        const perfect = this.increment('perfect-victory', 1);
        if (perfect) unlocked.push(perfect);
        break;
        
      case 'deckSize':
        if (data.size >= 15) {
          const deck = this.increment('deck-master', data.size);
          if (deck) unlocked.push(deck);
        }
        break;
        
      case 'legendaryCard':
        const legendary = this.increment('legendary-pull', 1);
        if (legendary) unlocked.push(legendary);
        break;
        
      case 'statThreshold':
        if (data.value >= 20) {
          const stat = this.increment('stat-master', data.value);
          if (stat) unlocked.push(stat);
        }
        break;
        
      default:
        console.warn(`Unknown achievement event: ${event}`);
        break;
    }
    
    return unlocked;
  },
  
  /**
   * Get all achievements with progress
   */
  getAll() {
    return Object.values(this.state);
  },
  
  /**
   * Get unlocked achievements
   */
  getUnlocked() {
    return Object.values(this.state).filter(a => a.unlocked);
  },
  
  /**
   * Get achievement progress percentage
   */
  getProgress() {
    const total = Object.keys(this.state).length;
    const unlocked = this.getUnlocked().length;
    return Math.floor((unlocked / total) * 100);
  },
  
  /**
   * Save achievements to persistence
   */
  save() {
    if (window.Flavorverse.Persistence) {
      const data = window.Flavorverse.Persistence.load() || {};
      data.achievements = this.state;
      window.Flavorverse.Persistence.save(data);
    }
  },
  
  /**
   * Reset all achievements
   */
  reset() {
    Object.keys(this.definitions).forEach(id => {
      this.state[id] = { ...this.definitions[id] };
    });
    this.save();
  }
};

console.log('Achievements system initialized');
