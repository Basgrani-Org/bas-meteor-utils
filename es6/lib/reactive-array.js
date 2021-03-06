/* eslint-disable prefer-rest-params */
// https://github.com/ManuelDeLeon/ReactiveArray/

const hasProp = {}.hasOwnProperty;
const extend = function (child, parent) {
  for (const key in parent) {
    if (parent.hasOwnProperty(key) && hasProp.call(parent, key)) {
      child[key] = parent[key];
    }
  }
  function Ctor() {
    this.constructor = child;
  }

  Ctor.prototype = parent.prototype;
  child.prototype = new Ctor();
  child.__super__ = parent.prototype;
  return child;
};

const ReactiveArray = (function (superClass) {
// eslint-disable-next-line no-use-before-define
  extend(ReactiveArray, superClass);

  const isArray = function (obj) {
    return obj instanceof Array;
  };

  function ReactiveArray(p1, p2) {
    let dep;
    let item;
    let j;
    let len;
    let pause;
    dep = null;
    pause = false;
    this.changed = function () {
      if (dep && !pause) {
        return dep.changed();
      }
    };
    this.depend = function () {
      return dep.depend();
    };
    if (isArray(p1)) {
      for (j = 0, len = p1.length; j < len; j += 1) {
        item = p1[j];
        this.push(item);
      }
      dep = p2;
    } else {
      dep = p1;
    }
    if (!(dep instanceof Tracker.Dependency)) {
      dep = new Tracker.Dependency();
    }
    this.pause = function () {
      pause = true;
      return pause;
    };
    this.resume = function () {
      pause = false;
      return this.changed();
    };
  }

  ReactiveArray.prototype.array = function () {
    this.depend();
    return Array.prototype.slice.call(this);
  };

  ReactiveArray.prototype.list = function () {
    this.depend();
    return this;
  };

  ReactiveArray.prototype.depend = function () {
    this.depend();
    return this;
  };

  ReactiveArray.prototype.push = function () {
    const item = ReactiveArray.__super__.push.apply(this, arguments);
    this.changed();
    return item;
  };

  ReactiveArray.prototype.unshift = function () {
    const item = ReactiveArray.__super__.unshift.apply(this, arguments);
    this.changed();
    return item;
  };

  ReactiveArray.prototype.pop = function () {
    const item = ReactiveArray.__super__.pop.apply(this, arguments);
    this.changed();
    return item;
  };

  ReactiveArray.prototype.shift = function () {
    const item = ReactiveArray.__super__.shift.apply(this, arguments);
    this.changed();
    return item;
  };

  ReactiveArray.prototype.remove = function (valueOrPredicate) {
    const predicate = typeof valueOrPredicate === 'function' ? valueOrPredicate : function (value) {
      return value === valueOrPredicate;
    };
    const removedValues = [];
    const underlyingArray = this;
    let value;
    let i = 0;
    while (i < underlyingArray.length) {
      value = underlyingArray[i];
      if (predicate(value)) {
        removedValues.push(value);
        underlyingArray.splice(i, 1);
        i -= 1;
      }
      i += 1;
    }
    if (removedValues.length) {
      this.changed();
    }
    return removedValues;
  };

  ReactiveArray.prototype.clear = function () {
    while (this.length) {
      this.pop();
    }
    this.changed();
    return this;
  };

  ReactiveArray.prototype.concat = function () {
    let a;
    let j;
    let len;
    let ret = this.array();
    for (j = 0, len = arguments.length; j < len; j += 1) {
      a = arguments[j];
      if (a instanceof ReactiveArray) {
        ret = ret.concat(a.array());
      } else {
        ret = ret.concat(a);
      }
    }
    return new ReactiveArray(ret);
  };

  ReactiveArray.prototype.indexOf = function () {
    this.depend();
    return ReactiveArray.__super__.indexOf.apply(this, arguments);
  };

  ReactiveArray.prototype.join = function () {
    this.depend();
    return ReactiveArray.__super__.join.apply(this, arguments);
  };

  ReactiveArray.prototype.lastIndexOf = function () {
    this.depend();
    return ReactiveArray.__super__.lastIndexOf.apply(this, arguments);
  };

  ReactiveArray.prototype.reverse = function () {
    ReactiveArray.__super__.reverse.apply(this, arguments);
    this.changed();
    return this;
  };

  ReactiveArray.prototype.sort = function () {
    ReactiveArray.__super__.sort.apply(this, arguments);
    this.changed();
    return this;
  };

  ReactiveArray.prototype.splice = function () {
    const ret = ReactiveArray.__super__.splice.apply(this, arguments);
    this.changed();
    return ret;
  };

  return ReactiveArray;
}(Array));

// Set start point
BasMTR.ReactiveArray = ReactiveArray;
