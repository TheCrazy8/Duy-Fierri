# Flavorverse Implementation Summary

This document describes the modular systems implemented for the Flavorverse game.

## Completed Systems

### 1. **Plugin Architecture** (`js/core/plugin.js`)
- `Flavorverse.registerPlugin(plugin)` - Register plugins with lifecycle hooks
- `Flavorverse.dispatchHook(hookName, data)` - Trigger hooks across all plugins
- Supported hooks: `onCardPlay`, `onTurnStart`, `onTurnEnd`, `onEnemySpawn`, `onSynergy`, `onStatusApply`, `onInit`

**Example Usage:**
```javascript
Flavorverse.registerPlugin({
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  hooks: {
    onCardPlay: (data) => console.log('Card played:', data),
    onInit: () => console.log('Plugin initialized')
  }
});
```

### 2. **Synergy System** (`js/core/synergy.js`)
- Tracks last 2 card tags played
- Detects combos: Spice-Umami, Spice-Sweet, Umami-Sweet, Double combinations
- `Synergy.recordCardPlay(tags, gameState)` - Record card with tags
- `Synergy.getAvailableSynergies()` - Get combo list

**Example Usage:**
```javascript
const card = { tags: ['Spice'] };
const result = Flavorverse.Synergy.recordCardPlay(card.tags, gameState);
if (result) console.log(result); // "Synergy: Savory Heat! +2 Spicecraft, +2 Umami"
```

### 3. **Status System** (`js/core/status.js`)
- Unified status framework with tick phases
- Built-in statuses: Burn, Sap, Blandness, Fortify, Vigor, Regen, Stick
- `Status.applyStatus(target, name, stacks, duration)` - Apply status
- `Status.tickStatuses(target, phase)` - Process status effects
- Tick phases: `startTurn`, `endTurn`, `passive`, `onDamage`

**Example Usage:**
```javascript
Flavorverse.Status.applyStatus(enemy, 'Burn', 3, 2);
const messages = Flavorverse.Status.tickStatuses(enemy, 'endTurn');
```

### 4. **Relic System** (`js/core/relics.js`)
- Persistent passive modifiers
- Sample relics: Tweezers of Precision, Scorch Fragment, Umami Anchor, Spice Lens, Crystal Vial, Donkey Charm
- `Relics.addRelic(id)` - Acquire relic
- `Relics.triggerHook(hookName, state)` - Apply relic effects

**Example Usage:**
```javascript
Flavorverse.Relics.addRelic('tweezers-of-precision');
const messages = Flavorverse.Relics.triggerHook('onTurnStart', gameState);
```

### 5. **Tarot System** (`js/core/tarot.js`)
- 3-card spread at run start
- Modifies starting stats and run parameters
- `Tarot.drawSpread(seed)` - Draw spread (optional seed for daily)
- `Tarot.applySpread(state)` - Apply effects to game state

**Example Usage:**
```javascript
const spread = Flavorverse.Tarot.drawSpread();
const effects = Flavorverse.Tarot.applySpread(gameState);
console.log('Tarot effects:', effects);
```

### 6. **Achievements System** (`js/core/achievements.js`)
- Tracks player milestones
- Auto-saves to localStorage via Persistence
- `Achievements.check(event, data)` - Check for unlocks
- 7 achievement definitions included

**Example Usage:**
```javascript
const unlocked = Flavorverse.Achievements.check('synergy', {});
if (unlocked.length > 0) {
  unlocked.forEach(a => console.log(`🎉 ${a.name}`));
}
```

### 7. **Persistence System** (`js/core/persistence.js`)
- localStorage adapter for save/load
- `Persistence.save(data)` - Save profile
- `Persistence.load()` - Load profile
- `Persistence.export()` / `Persistence.import(json)` - JSON export/import

**Example Usage:**
```javascript
Flavorverse.Persistence.save({ achievements, relics, stats });
const profile = Flavorverse.Persistence.load();
```

### 8. **Flavorwave Tracker** (`js/core/flavorwave.js`)
- Monitors stat delta amplitude
- Detects resonance patterns (positive, negative, oscillation)
- `Flavorwave.computeAmplitude(stats)` - Calculate delta
- `Flavorwave.getWaveState()` - Get current state with resonance

**Example Usage:**
```javascript
const amplitude = Flavorverse.Flavorwave.computeAmplitude(currentStats);
const waveState = Flavorverse.Flavorwave.getWaveState();
if (waveState.resonance) {
  console.log('Resonance detected:', waveState.resonance.type);
}
```

### 9. **Run Modifiers** (`js/core/modifiers.js`)
- Global run modifiers affecting gameplay
- 6 modifiers: High Heat, Sweet Expansion, Umami Regen, Fragile Power, Energy Surge, Spice Mastery
- `Modifiers.addModifier(id, state)` - Apply modifier
- `Modifiers.getAvailable()` - Get selection list

**Example Usage:**
```javascript
Flavorverse.Modifiers.addModifier('high-heat', gameState);
const active = Flavorverse.Modifiers.getActive();
```

### 10. **Glossary System** (`js/core/glossary.js`)
- Auto-extracts capitalized flavor terms from lore
- `Glossary.indexLore(sections)` - Build glossary
- `Glossary.search(query)` - Search terms
- `Glossary.getTerms(minCount)` - Get frequent terms

**Example Usage:**
```javascript
const sections = [{ id: 'character', text: loreText }];
Flavorverse.Glossary.indexLore(sections);
const terms = Flavorverse.Glossary.getTerms(2);
```

### 11. **Test Harness** (`js/core/testHarness.js`)
- Basic testing framework
- 6 built-in tests for core systems
- `TestHarness.runTests()` - Execute all tests
- Returns PASS/FAIL results

**Example Usage:**
```javascript
Flavorverse.TestHarness.runTests();
// Output: ✓ Synergy: Spice-Umami combo
//         ✓ Status: Burn application and tick
//         Results: 6 passed, 0 failed
```

## JSON Schemas

Complete schemas created for:
- `schemas/card.schema.json` - Card definitions
- `schemas/enemy.schema.json` - Enemy entities
- `schemas/status.schema.json` - Status effects
- `schemas/relic.schema.json` - Relic items
- `schemas/tarot.schema.json` - Tarot cards

## Service Worker

- `sw.js` - Placeholder with commented implementation
- Not registered by default (awaits configuration)
- Instructions included for offline caching

## Integration Guide

### Basic Integration into game.html

```html
<!-- Add before closing </head> tag -->
<script src="../js/core/plugin.js"></script>
<script src="../js/core/persistence.js"></script>
<script src="../js/core/status.js"></script>
<script src="../js/core/synergy.js"></script>
<script src="../js/core/relics.js"></script>
<script src="../js/core/tarot.js"></script>
<script src="../js/core/achievements.js"></script>
<script src="../js/core/flavorwave.js"></script>
<script src="../js/core/modifiers.js"></script>
<script src="../js/core/glossary.js"></script>
<script src="../js/core/testHarness.js"></script>
```

### Initialization Flow

```javascript
// 1. Initialize achievements from save
const saveData = Flavorverse.Persistence.load();
Flavorverse.Achievements.init(saveData);

// 2. Draw tarot spread
const spread = Flavorverse.Tarot.drawSpread();
const effects = Flavorverse.Tarot.applySpread(gameState);

// 3. Add starting relics
Flavorverse.Relics.addRelic('umami-anchor');
Flavorverse.Relics.triggerHook('onCombatStart', gameState);

// 4. Set flavorwave baseline
Flavorverse.Flavorwave.setBaseline(gameState);

// 5. Apply run modifiers (if any)
// User selection UI needed
```

### Card Play Integration

```javascript
function playCard(card) {
  // Existing logic...
  
  // Add synergy tracking
  if (card.tags) {
    const synergy = Flavorverse.Synergy.recordCardPlay(card.tags, gameState);
    if (synergy) {
      log(synergy);
      Flavorverse.Achievements.check('synergy', {});
      Flavorverse.dispatchHook('onSynergy', { card, synergy });
    }
  }
  
  // Trigger plugin hook
  Flavorverse.dispatchHook('onCardPlay', { card, state: gameState });
  
  // Trigger relic hook
  const relicMessages = Flavorverse.Relics.triggerHook('onCardPlay', gameState, card);
  relicMessages.forEach(msg => log(msg));
}
```

### Turn End Integration

```javascript
function endTurn() {
  // Tick statuses
  const messages = Flavorverse.Status.tickStatuses(player, 'endTurn');
  messages.forEach(msg => log(msg));
  
  // Compute flavorwave
  const amplitude = Flavorverse.Flavorwave.computeAmplitude(gameState);
  const waveState = Flavorverse.Flavorwave.getWaveState();
  if (waveState.resonance) {
    log(`Flavorwave Resonance: ${waveState.resonance.effect}`);
  }
  
  // Trigger hooks
  Flavorverse.dispatchHook('onTurnEnd', { state: gameState });
  Flavorverse.Relics.triggerHook('onTurnEnd', gameState);
  
  // Save progress
  Flavorverse.Achievements.save();
}
```

## TODO: Remaining Features

### Accessibility Toggles
- [ ] Motion reduction CSS class toggle
- [ ] High contrast mode toggle
- [ ] Font size adjustment
- [ ] Add to both index.html and game.html

### Deck Evolution
- [ ] Track card play counts
- [ ] Mutation event after N plays
- [ ] Upgrade path system
- [ ] Visual indication of evolved cards

### Daily Seed System
- [ ] Generate seed from YYYY-MM-DD
- [ ] Seed tarot spread
- [ ] Seed modifier selection
- [ ] Daily leaderboard (local)

### Enhanced Export/Import
- [ ] Export full run state including seeds
- [ ] Import state to resume runs
- [ ] Share codes for daily challenges

### Glossary UI Integration
- [ ] Add glossary button to index.html
- [ ] Popup/modal for glossary display
- [ ] Search functionality
- [ ] Link terms to lore sections

### Print/PDF Button
- [ ] Add print stylesheet
- [ ] PDF export button (browser print)
- [ ] Format lore for printing

### Full Game Integration
- [ ] Link all systems into game.html
- [ ] Add UI panels for modifiers, relics, tarot
- [ ] Status display enhancements
- [ ] Achievement notifications
- [ ] Settings panel

## Testing

Run the test suite:
```javascript
Flavorverse.TestHarness.runTests();
```

Expected output:
```
✓ Synergy: Spice-Umami combo
✓ Status: Burn application and tick
✓ Status: Duration expiration
✓ Relics: Tweezers of Precision
✓ Tarot: Spread generation
✓ Persistence: Save and load

Results: 6 passed, 0 failed
```

## Architecture Benefits

1. **Modular** - Each system is independent and can be used/tested separately
2. **Extensible** - Plugin system allows custom modifications
3. **Type-Safe** - JSON schemas provide validation
4. **Testable** - Test harness ensures correctness
5. **Persistent** - Save/load functionality built-in
6. **Documented** - Inline comments and this guide

## Performance Considerations

- Systems are lazy-initialized
- localStorage used for persistence (5MB limit)
- Plugin hooks are try-catch protected
- Glossary indexing deferred to DOMContentLoaded
- Test harness runs on demand only

## Browser Compatibility

All systems use ES6+ features:
- Modern browsers (Chrome 60+, Firefox 60+, Safari 12+, Edge 79+)
- localStorage required for persistence
- No external dependencies

## Future Enhancements

See TODO sections above. Priority features:
1. Daily seed integration
2. Full UI integration into game.html
3. Accessibility toggles
4. Deck evolution mechanics
