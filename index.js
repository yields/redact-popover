
/**
 * Dependencies
 */

var selected = require('get-selected-text');
var monitor = require('monitor-text-selection');
var Emitter = require('emitter');
var events = require('events');
var slug = require('slug');
var trim = require('trim');
var Tip = require('tip');
var selectionPosition = require('selection-position');

/**
 * Export `RedactPopover`
 */

module.exports = RedactPopover;

/**
 * Initialize `RedactPopover`
 *
 * @param {Element} el
 * @api public
 */

function RedactPopover(el){
  if (!(this instanceof RedactPopover)) return new RedactPopover(el);
  this.options = {};
  this.tip = new Tip('');
  this.el = this.tip.inner;
  this.classes = this.tip.classes;
  this.classes.add('redact-popover');
  this.events = events(this.el, this);
  this.winEvents = events(window, this);
  this.editor = el;
  this.bind();
}

/**
 * Mixins
 */

Emitter(RedactPopover.prototype);

/**
 * Bind internal events.
 *
 * @return {RedactPopover}
 * @api public
 */

RedactPopover.prototype.bind = function(){
  if (this.bound) return this;
  
  this.monitor = monitor(this.editor);
  this.monitorEvents = events(this.monitor, this);
  this.monitorEvents.bind('selected', 'onselect');
  this.monitorEvents.bind('deselected', 'hide');

  this.winEvents.bind('resize', 'onselect');

  this.events.bind('click');
  this.bound = true;
  return this;
};

/**
 * Unbind internal events.
 *
 * @return {RedactPopover}
 * @api public
 */

RedactPopover.prototype.unbind = function(){
  if (!this.bound) return this;
  this.monitorEvents.unbind();
  this.monitor.unbind();
  this.winEvents.unbind();
  this.events.unbind();
  this.bound = null;
  return this;
};

/**
 * Add option `id`.
 *
 * @param {String} id
 * @param {String} label
 * @return {RedactPopover}
 * @api public
 */

RedactPopover.prototype.add = function(id, label){
  if (this.get(id)) return this;
  var el = document.createElement('a');
  el.href = 'javascript:;';
  el.className = 'redact-button ' + slug(id);
  el.textContent = label || '';
  el.setAttribute('data-id', id);
  this.el.appendChild(el);
  this.options[id] = el;
  this.emit('add', el);
  this.refresh();
  return this;
};

/**
 * Remove option `id`.
 *
 * @param {String} id
 * @return {RedactPopover}
 * @api public
 */

RedactPopover.prototype.remove = function(id){
  var el = this.get(id);
  if (!el) return this;
  this.el.removeChild(el);
  this.emit('remove', el);
  delete this.options[id];
  this.refresh();
  return this;
};

/**
 * Get option `id` or the popover element.
 *
 * @param {String} id
 * @return {Element}
 * @api public
 */

RedactPopover.prototype.get = function(id){
  return null != id
    ? this.options[id]
    : this.el;
};

/**
 * Refresh the tip size.
 *
 * @return {RedactPopover}
 * @api public
 */

RedactPopover.prototype.refresh = function(){
  this.tip.show(-500, -500);
  this.size = this.tip.el.getBoundingClientRect();
  this.hide();
  return this;
};

/**
 * Hide
 *
 * TODO: component/tip / component/events bug?
 *
 * @api private
 */

RedactPopover.prototype.hide = function(){
  try {
    this.tip.hide();
  } catch (e) {}
};


/**
 * on-click.
 *
 * @param {Event} e
 * @api private
 */

RedactPopover.prototype.onclick = function(e){
  e.preventDefault();
  var el = e.delegateTarget || e.target;
  var id = el.getAttribute('data-id');
  this.emit('click', id, el);
  this.emit('click ' + id, el);
  this.onselect(e);
};

/**
 * on-select
 *
 * TODO: component/tip classes bug.
 *
 * @param {Event} e
 * @api private
 */

RedactPopover.prototype.onselect = function(e){
  if ('' == trim(selected())) return;
  var pos = this.position();
  this.tip.position(pos.at);
  this.classes.add('redact-popover');
  this.tip.show(pos.x, pos.y);
};

/**
 * Calculate position.
 *
 * @return {Object}
 * @api private
 */

RedactPopover.prototype.position = function(){
  var a = selectionPosition();
  var b = this.size;
  var x = a.left + (a.width / 2) - (b.width / 2);
  var y = a.top + -b.height;
  var sx = window.scrollX;
  var sy = window.scrollY;
  var at = 'south';

  // north
  if (a.top < b.height) {
    y = a.top + (b.height / 2);
    at = 'north';
  }

  return {
    x: x + sx,
    y: y + sy,
    at: at
  };
};
