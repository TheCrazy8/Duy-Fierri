/**
 * Glossary System
 * Auto-generates glossary from capitalized flavor terms in lore
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.Glossary = {
  terms: new Map(),
  stopWords: new Set(['The', 'A', 'An', 'And', 'Or', 'But', 'For', 'With', 'From', 'To', 'In', 'On', 'At', 'By']),
  
  /**
   * Extract capitalized terms from text
   */
  extractTerms(text) {
    // Match capitalized words (2+ letters)
    const regex = /\b[A-Z][a-z]{1,}(?:\s+[A-Z][a-z]{1,})*\b/g;
    const matches = text.match(regex) || [];
    
    return matches.filter(term => {
      // Filter out stop words and single letters
      if (this.stopWords.has(term)) return false;
      if (term.length < 2) return false;
      return true;
    });
  },
  
  /**
   * Index all lore sections
   */
  indexLore(sections) {
    this.terms.clear();
    
    sections.forEach(section => {
      const terms = this.extractTerms(section.text);
      
      terms.forEach(term => {
        if (!this.terms.has(term)) {
          this.terms.set(term, {
            term,
            count: 0,
            sections: []
          });
        }
        
        const entry = this.terms.get(term);
        entry.count++;
        
        if (!entry.sections.includes(section.id)) {
          entry.sections.push(section.id);
        }
      });
    });
    
    console.log(`Glossary indexed ${this.terms.size} unique terms`);
  },
  
  /**
   * Get all terms sorted by frequency
   */
  getTerms(minCount = 2) {
    return Array.from(this.terms.values())
      .filter(entry => entry.count >= minCount)
      .sort((a, b) => b.count - a.count);
  },
  
  /**
   * Search for a term
   */
  search(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.terms.values())
      .filter(entry => entry.term.toLowerCase().includes(lowerQuery))
      .sort((a, b) => b.count - a.count);
  },
  
  /**
   * Get term details
   */
  getTerm(term) {
    return this.terms.get(term);
  },
  
  /**
   * Export glossary as JSON
   */
  export() {
    const entries = Array.from(this.terms.values());
    return JSON.stringify(entries, null, 2);
  }
};

console.log('Glossary system initialized');
