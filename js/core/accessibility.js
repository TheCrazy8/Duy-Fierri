/**
 * Accessibility System
 * Provides accessibility toggles and enhancements
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Accessibility = {
  settings: {
    reduceMotion: false,
    highContrast: false,
    fontSize: 'normal' // 'small', 'normal', 'large'
  },
  
  /**
   * Initialize from saved settings
   */
  init() {
    const saved = localStorage.getItem('flavorverse_accessibility');
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
        this.apply();
      } catch (e) {
        console.error('Failed to load accessibility settings:', e);
      }
    }
    
    // Check system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.setReduceMotion(true);
    }
    
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.setHighContrast(true);
    }
  },
  
  /**
   * Toggle reduced motion
   */
  setReduceMotion(enabled) {
    this.settings.reduceMotion = enabled;
    this.save();
    this.apply();
  },
  
  /**
   * Toggle high contrast
   */
  setHighContrast(enabled) {
    this.settings.highContrast = enabled;
    this.save();
    this.apply();
  },
  
  /**
   * Set font size
   */
  setFontSize(size) {
    this.settings.fontSize = size;
    this.save();
    this.apply();
  },
  
  /**
   * Apply all settings to DOM
   */
  apply() {
    const html = document.documentElement;
    
    // Reduced motion
    if (this.settings.reduceMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }
    
    // High contrast
    if (this.settings.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    // Font size
    html.classList.remove('font-small', 'font-normal', 'font-large');
    html.classList.add(`font-${this.settings.fontSize}`);
  },
  
  /**
   * Save settings
   */
  save() {
    localStorage.setItem('flavorverse_accessibility', JSON.stringify(this.settings));
  },
  
  /**
   * Get current settings
   */
  getSettings() {
    return { ...this.settings };
  },
  
  /**
   * Reset to defaults
   */
  reset() {
    this.settings = {
      reduceMotion: false,
      highContrast: false,
      fontSize: 'normal'
    };
    this.save();
    this.apply();
  }
};

// CSS to add to pages:
/*
.reduce-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  transform: none !important;
}

.high-contrast {
  --bg: #000;
  --bg-alt: #111;
  --bg-panel: #222;
  --text: #fff;
  --accent: #ffff00;
  --border: #fff;
}

.font-small { font-size: 14px; }
.font-normal { font-size: 16px; }
.font-large { font-size: 18px; }
*/

console.log('Accessibility system initialized');
