
/**
 * Dependencies
 */

var onselect = require('on-select');
var Emitter = require('emitter');
var events = require('events');
var slug = require('slug');
var Tip = require('tip');

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
  var self = this;
  this.options = {};
  this.tip = new Tip('');
  this.el = this.tip.inner;
  this.classes = this.tip.classes;
  this.classes.add('redact-popover');
  this.events = events(this.el, this);
  this.events.bind('mousedown');
  this.events.bind('click');
  this.editorEvents = events(el, this);
  this.editorEvents.bind('mouseup', 'onchange');
  this.editorEvents.bind('keyup', 'onchange');
  this.editorEvents.bind('blur');
  onselect(el, function(e){
    self.onselect(e);
  });
}

/**
 * Mixins
 */

Emitter(RedactPopover.prototype);

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
 * Get the bounding client range of cursor
 *
 * @return {Object}
 * @api private
 */

RedactPopover.prototype.boundary = function(){
  return window
    .getSelection()
    .getRangeAt(0)
    .getBoundingClientRect();
};

/**
 * on-mousedown
 *
 * @param {Event} e
 * @api private
 */

RedactPopover.prototype.onmousedown = function(e){
  this.ignore = true;
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
  this.ignore = true;
};

/**
 * on-select
 *
 * @param {Event} e
 * @api private
 */

RedactPopover.prototype.onselect = function(e){
  var a = this.boundary();
  var b = this.size;
  var x = a.left + (a.width / 2) - (b.width / 2)
  var y = a.top + -b.height + window.scrollY;
  this.tip.show(x, y);
};

/**
 * on-focus.
 *
 * TODO: optimize
 *
 * @param {Event} e
 * @api private
 */

RedactPopover.prototype.onchange = function(e){
  var sel = window.getSelection();
  if ('Range' != sel.type) return this.hide();
  var range = sel.getRangeAt(0);
  var start = range.startOffset;
  var end = range.endOffset;
  if (start == end) this.hide();
};

/**
 * on-blur.
 *
 * @param {Event} e
 * @api private
 */

RedactPopover.prototype.onblur = function(e){
  if (!this.ignore) this.hide();
  this.ignore = null;
};
