/**
 * Plugin Architecture System
 * Allows registration of plugins with lifecycle hooks
 */

window.Flavorverse = window.Flavorverse || {};

Flavorverse.plugins = [];

/**
 * Register a plugin with the Flavorverse system
 * @param {Object} plugin - Plugin configuration
 * @param {string} plugin.id - Unique plugin identifier
 * @param {string} plugin.name - Human-readable plugin name
 * @param {string} plugin.version - Plugin version
 * @param {Object} plugin.hooks - Lifecycle hooks
 * @param {Function} plugin.hooks.onCardPlay - Called when a card is played
 * @param {Function} plugin.hooks.onTurnStart - Called at turn start
 * @param {Function} plugin.hooks.onTurnEnd - Called at turn end
 * @param {Function} plugin.hooks.onEnemySpawn - Called when enemy spawns
 * @param {Function} plugin.hooks.onSynergy - Called when synergy triggers
 * @param {Function} plugin.hooks.onStatusApply - Called when status is applied
 * @param {Function} plugin.hooks.onInit - Called on plugin initialization
 */
Flavorverse.registerPlugin = function(plugin) {
  if (!plugin.id) {
    console.error('Plugin must have an id');
    return false;
  }
  
  // Check if plugin already registered
  if (Flavorverse.plugins.find(p => p.id === plugin.id)) {
    console.warn(`Plugin ${plugin.id} already registered`);
    return false;
  }
  
  // Set defaults
  plugin.hooks = plugin.hooks || {};
  plugin.name = plugin.name || plugin.id;
  plugin.version = plugin.version || '1.0.0';
  
  Flavorverse.plugins.push(plugin);
  console.log(`Plugin registered: ${plugin.name} v${plugin.version}`);
  
  // Call init hook if available
  if (plugin.hooks.onInit) {
    plugin.hooks.onInit();
  }
  
  return true;
};

/**
 * Dispatch a hook event to all registered plugins
 * @param {string} hookName - Name of the hook to trigger
 * @param {*} data - Data to pass to the hook
 */
Flavorverse.dispatchHook = function(hookName, data) {
  Flavorverse.plugins.forEach(plugin => {
    if (plugin.hooks[hookName]) {
      try {
        plugin.hooks[hookName](data);
      } catch (e) {
        console.error(`Error in plugin ${plugin.id} hook ${hookName}:`, e);
      }
    }
  });
};

/**
 * Unregister a plugin
 * @param {string} pluginId - ID of plugin to remove
 */
Flavorverse.unregisterPlugin = function(pluginId) {
  const index = Flavorverse.plugins.findIndex(p => p.id === pluginId);
  if (index !== -1) {
    Flavorverse.plugins.splice(index, 1);
    console.log(`Plugin unregistered: ${pluginId}`);
    return true;
  }
  return false;
};

/**
 * Get list of registered plugins
 */
Flavorverse.getPlugins = function() {
  return Flavorverse.plugins.map(p => ({
    id: p.id,
    name: p.name,
    version: p.version
  }));
};

console.log('Plugin system initialized');
