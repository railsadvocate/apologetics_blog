Stack = (function($, window) {
  window.Stack = function() {
    this.stack = [];
    this.size = 0;
    this.nextToken = null;
  };

  Stack.prototype.push = function(element) {
    this.stack.push(element);
    this.size += 1;
    this.nextToken = element;
  }

  Stack.prototype.pop = function() {
    var element = this.stack.pop();
    this.size -= 1;
    this.nextToken = this.peek();
    return element;
  }

  Stack.prototype.peek = function() {
    var element = this.stack[this.size-1];
    return element;
  }
  return window.Stack;
})(jQuery, this.window, Stack = window.Stack || {});
