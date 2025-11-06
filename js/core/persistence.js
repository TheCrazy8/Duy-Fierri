/**
 * Persistence System
 * LocalStorage adapter for save/load functionality
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Persistence = {
  storageKey: 'flavorverse_profile_v1',
  
  /**
   * Save profile data to localStorage
   */
  save(data) {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(this.storageKey, json);
      console.log('Profile saved');
      return true;
    } catch (e) {
      console.error('Failed to save profile:', e);
      return false;
    }
  },
  
  /**
   * Load profile data from localStorage
   */
  load() {
    try {
      const json = localStorage.getItem(this.storageKey);
      if (json) {
        const data = JSON.parse(json);
        console.log('Profile loaded');
        return data;
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
    return null;
  },
  
  /**
   * Clear saved profile
   */
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('Profile cleared');
      return true;
    } catch (e) {
      console.error('Failed to clear profile:', e);
      return false;
    }
  },
  
  /**
   * Export profile as JSON string
   */
  export() {
    const data = this.load() || {};
    return JSON.stringify(data, null, 2);
  },
  
  /**
   * Import profile from JSON string
   */
  import(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return this.save(data);
    } catch (e) {
      console.error('Failed to import profile:', e);
      return false;
    }
  },
  
  /**
   * Check if save data exists
   */
  exists() {
    return localStorage.getItem(this.storageKey) !== null;
  }
};

console.log('Persistence system initialized');
