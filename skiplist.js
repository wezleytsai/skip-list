// --- skiplist ---
var Skiplist = function() {
  this.head = new Node(-Infinity);
};

Skiplist.prototype.insert = function(value) {
  var drops = [];
  return function insert(at, value) {
    // value already exists, insertion fail
    if( at.value === value ) return false;

    // if right is smaller, go right
    if( at.right && at.right.value <= value ) {
      return insert.call(this, at.right, value);
    }

    // otherwise, go down if possible
    if( at.down ) {
      drops.push(at);
      return insert.call(this, at.down, value);
    }

    // if can't go down, insert
    var base = new Node(value);
    base.insertAfter(at);

    while( coinFlip() ) {
      var promote = new Node(value);
      promote.stackOnTop(base);
      base = promote;

      var drop = drops.pop();
      if( drop ) {
        promote.insertAfter(drop);
      } else {
        var newHead = new Node(-Infinity);
        newHead.stackOnTop(this.head);
        this.head = newHead;

        promote.insertAfter(this.head);
      }
    }

    // insert complete
    return true;
  }.call(this, this.head, value);
};

Skiplist.prototype.search = function(value) {
  return (function search(at, value) {
    // if value is found, return true
    if( at.value === value ) return true;

    // if right is smaller, go right
    if( at.right && at.right.value <= value ) {
      return search(at.right, value);
    }

    // otherwise, go down if possible
    if( at.down ) {
      return search(at.down, value);
    }

    return false;
  })(this.head, value);
};

Skiplist.prototype.remove = function(value) {
  return function remove(at, value) {
    // value found -> perform delete
    if( at.value === value ) {
      while( at ) {
        at.remove();
        // if nothing else is on this level // and not on level 1
        if( at.left === this.head && !at.right && this.head.down) {
          // set head to next level down
          this.head = this.head.down;
          this.head.up = null;
        }
        at = at.down;
      }
      // remove complete
      return true;
    }

    // if right is smaller, go right
    if( at.right && at.right.value <= value ) {
      return remove.call(this, at.right, value);
    }

    // otherwise, go down if possible
    if( at.down ) {
      return remove.call(this, at.down, value);
    }

    // value not found -> remove fail
    return false;
  }.call(this, this.head, value);
};

Skiplist.prototype.report = function() {
  // reports nodes in skip list in 2D array
  var nodes = [];
  var level = 0;
  var head = this.head;
  var at = this.head;
  while( at ) {
    nodes[level] = nodes[level] || [];
    nodes[level].push(at.value);
    if( at.right ) {
      at = at.right;
    } else {
      level ++;
      at = head.down;
      head = head.down;
    }
  }
  return nodes;
};

// --- node ---
var Node = function(value) {
  this.value = value;
};

Node.prototype.insertAfter = function(node) {
  // inserts `this` after the node argument
  this.right = node.right;
  node.right && (node.right.left = this);
  node.right = this;
  this.left = node;
};

Node.prototype.stackOnTop = function(node) {
  // places `this` on top of node argument
  this.up = node.up;
  node.up && (node.up.down = this);
  node.up = this;
  this.down = node;
};

Node.prototype.remove = function() {
  this.down && (this.down.up = this.up);
  this.left && (this.left.right = this.right);
  this.right && (this.right.left = this.left);
  this.up && (this.up.down = this.up);
};

var coinFlip = function() {
  return Math.random() < 0.5;
};


// tests
// var s = new Skiplist();
// s.insert(3);
// s.insert(5);
// s.insert(4);
// s.insert(6);
// console.log(s.search(3));
// console.log(s.search(4));
// console.log(s.search(5));
// console.log(s.search(6));

// console.log(s.report());

// console.log(s.remove(3));
// console.log(s.report());

// console.log(s.remove(4));
// console.log(s.remove(5));
// console.log(s.report());

// console.log(s.search(3));
// console.log(s.search(4));
// console.log(s.search(5));