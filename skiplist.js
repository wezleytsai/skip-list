var Skiplist = function() {
  this.head = new Node(-Infinity);
};

Skiplist.prototype.insert = function(value) {
  // var at = this.head;
  var drops = [];
  return (function search(at, value) {
    var base, promote, drop, newHead;
    // value already exists, insertion fail
    if( at.value === value ) return false;

    if( at.right ) {
      // right value is greater
      if( at.right.value > value ) {
        // has down -> move down, continue search
        if( at.down ) {
          drops.push(at);
          return search.call(this, at.down, value);
        // no down -> insert
        } else {
          base = new Node(value);
          base.right = at.right;
          at.right.left = base;
          at.right = base;
          base.left = at;

          while( coinFlip() ) {
            promote = new Node(value);
            base.up = promote;
            promote.down = base;
            base = promote;

            drop = drops.pop();
            if( drop ) {
              promote.right = drop.right;
              if( drop.right) drop.right.left = promote;
              drop.right = promote;
              promote.left = drop;
            } else {
              newHead = new Node(-Infinity);
              newHead.down = this.head;
              this.head.up = newHead;

              newHead.right = promote;
              promote.left = newHead;
              this.head = newHead;
            }
          }

          // insert complete
          return true;
        }
      // right value is smaller or eq -> move right
      } else {
        return search.call(this, at.right, value);
      }
    // no right
    } else {
      // has down -> move down, continue search
      if( at.down ) {
        drops.push(at);
        return search.call(this, at.down, value);
      // no right, no down -> insert
      } else {
        base = new Node(value);
        at.right = base;
        base.left = at;

        while( coinFlip() ) {
          // flip successful -> promote
          promote = new Node(value);
          base.up = promote;
          promote.down = base;
          base = promote;

          drop = drops.pop();
          if( drop ) {
            drop.right = promote;
            promote.left = drop;
          } else {
            newHead = new Node(-Infinity);
            newHead.down = this.head;
            this.head.up = newHead;

            newHead.right = promote;
            promote.left = newHead;
            this.head = newHead;
          }
        }

        // insert complete
        return true;
      }
    }
  }.bind(this))(this.head, value);
};

Skiplist.prototype.search = function(target) {

};

Skiplist.prototype.delete = function(value) {

};

var nodes = [];

var Node = function(value) {
  this.value = value;
  this.up    = null;
  this.right = null;
  this.down  = null;
  this.left  = null;
  nodes.push(this);
};

var coinFlip = function() {
  return Math.random() < 0.5;
};

var s = new Skiplist();
s.insert(3);
s.insert(5);
s.insert(4);
// console.log(nodes);
console.log(nodes.map(function(node) { return node.value; }));