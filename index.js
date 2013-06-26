var util = require('util');

function MetaClass() {
  this.constructor_ = function() {};
};
MetaClass.prototype.create = function() {
  var obj = new this.constructor_(Array.prototype.slice(arguments));
  obj.class = this;
  return obj;
};

/**
 * Class declaration function
 */
function Class(super_, definition) {
  if (!super_)
    super_ = MetaClass;
  else if (typeof super_ !== 'function') {
    if (typeof super_.constructor === 'function')
      super_ = super_.constructor;
    else
      throw new Error('Bad super class');
  }

  definition = definition ? definition() : {};
  function class_() {
    super_.call(this);

    function constructor_() {};
    util.inherits(constructor_, this.constructor_);
    constructor_.prototype.super_ = this.constructor_.prototype;
    this.constructor_ = constructor_;

    if (definition.instance)
      definition.instance.call(this.constructor_.prototype);
  }

  util.inherits(class_, super_);
  class_.prototype.super_ = super_.prototype;

  if (definition.static)
    definition.static.call(class_.prototype);

  return new class_();
}

///////////////////////////////////////////////////////////////////////////////

var MyClass = Class(null, function() {
  var privateClassVar = 'private static variable';

  function privateClassMethod() {
    console.log('private static class method called');
  };

  return {
    static: function() {
      this.publicClassMethod = function() {
        console.log('public static class method called');
        privateClassMethod();
      };

      this.publicClassVar = 'public static variable';
    },

    instance: function() {
      var privateInstanceVar = 'private instance variable';
      var privateInstanceMethod = function() {
        console.log('private instance method');
      };

      this.publicInstanceVar = 'public static variable';
      this.publicInstanceMethod = function() {
        console.log('Private instance variable: ' + privateInstanceVar);
        console.log('Private instance method: ' + privateInstanceMethod());
        console.log('public instance method called');
      };
    }
  };
});

var MyObject = MyClass.create();

var MyClass2 = Class(MyClass, function() {
  return {
    instance: function(proto) {
      this.publicInstanceVar = 'Overridden instance variable';
    }
  };
});

var MyObject2 = MyClass2.create();

var MyClass3 = Class(MyClass2, function() {
  return {
    instance: function(proto) {
      this.publicInstanceVar = 'Overridden twice instance variable';
    }
  };
});

var MyObject3 = MyClass3.create();

/*
// Namespace declaration
var MyNamespace = {};

// Class definition
MyNamespace.MyClass = Class(null, function(class_) {
  var privateStaticVar = undefined;
  class_.publicStaticVar = undefined;

  function privateStaticMethod() {
  }

  class_.publicStaticMethod = function() {
  }

  class_.prototype.publicInstanceMethod = function() {
  }
}, function() {
  this.publicInstanceVar = undefined;
});

// Access public static variable:
MyNamespace.MyClass.publicStaticVar = 'foo';

// Call public static method:
MyNamespace.MyClass.publicStaticMethod();

// Instantiate class:
var myObject = new MyNamespace.MyClass();

// Access public instance variable:
myObject.publicInstanceVar = 'bar';

// Call public instance method:
myObject.publicInstanceMethod();

global.MyClass2 = Class(MyNamespace.MyClass, null, function(arg) {
  this.instanceVar = arg;
});

myObject2 = new MyClass2();
*/
console.log(MyObject3.super_().super_().publicInstanceVar);
