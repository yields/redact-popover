var assert = require('assert');
var redact = require('redact-popover');
var position = require('selection-range');

var container = document.createElement('div');
container.id = 'content';
container.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi odio mauris, auctor ut varius non, tempus nec nisi. Quisque at tellus risus. Aliquam erat volutpat. Proin et dolor magna. Sed vel metus justo. Mauris eu metus massa. Duis viverra ultricies nisl, ut pharetra eros hendrerit non. Phasellus laoreet libero non eros rhoncus sed iaculis ante molestie. Etiam arcu purus, dictum a tincidunt id, ornare sed orci. Curabitur ornare ornare nulla quis tincidunt. Morbi nisi elit, mattis nec bibendum vel, facilisis eu ipsum. Phasellus non dolor erat, in placerat lacus. Aliquam pulvinar, est eu commodo vulputate, neque elit molestie lorem, sed vestibulum felis erat et risus. Nulla non velit odio.';
document.body.appendChild(container);

describe('RedactPopover', function(){

  beforeEach(function(){
    this.popover = redact(container);
    this.popover.add('bold', 'B');
    this.popover.add('italic', 'I');
    this.popover.add('underline', 'U');
  });

  afterEach(function(){
    this.popover.unbind();
    delete this.popover;
  });

  it('should be built & bind', function(){
    assert(this.popover);
    assert(this.popover instanceof redact);
    assert(this.popover.editor);
    assert(this.popover.bound);
    assert(this.popover.classes.has('redact-popover'));
  });

  describe('#add', function(){
    it('should add options', function(){
      assert(this.popover.get('bold'));
      var el = this.popover.get('bold');
      assert(el.textContent === 'B');
      assert(el.getAttribute('data-id') === 'bold');
    });
  });

  describe('#remove', function(){
    it('should remove options', function(){
      this.popover.remove('bold');
      assert(!this.popover.get('bold'));
    });
  });

  describe('#onselect', function(){
    it('should show our tip', function(){
      position(container, 5, 20);
      this.popover.onselect();
      assert(!!document.querySelector('.tip'));
      this.popover.hide();
      position(container, 1);
    });
  });

  describe('#hide', function(){
    it('should hide our tip', function(){
      position(container, 5, 20);
      this.popover.onselect();
      this.popover.hide();
      assert(!document.querySelector('.tip'));
      position(container, 1);
    });
  });

  describe('#get', function(){
    it('should return an element', function(){
      assert(this.popover.get('bold'));
    });
  });

});