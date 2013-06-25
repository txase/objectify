var util = require('util');

function MetaClass() {
  this.constructor_ = function() {};
};
MetaClass.prototype.create = function() {
  return new this.constructor_(Array.prototype.slice(arguments));
};

/**
 * Class declaration function
 */
function Class(super_, definition) {
  if (typeof super_ !== 'function') {
    if (typeof super_.constructor === 'function')
      super_ = super_.constructor;
    else if (!super_)
      super_ = MetaClass;
    else
      throw new Error('Bad super class');
  }

  definition = definition ? definition() : {};
  function class_() {
    super_.call(this);
    if (definition.constructor)
      definition.constructor.call(this, this.constructor_.prototype);
  }

  util.inherits(class_, super_);

  if (definition.prototype)
    definition.prototype(class_);

  return new class_();
}

///////////////////////////////////////////////////////////////////////////////

var MyClass = Class(null, function() {
  var privateStaticVar = 'private static variable';

  function privateStaticMethod() {
    console.log('private static class method called');
  };

  return {
    prototype: function(class_) {
      class_.prototype.publicStaticMethod = function() {
        console.log('public static class method called');
        privateStaticMethod();
      };

      class_.prototype.publicStaticVar = 'public static variable';
    },

    constructor: function(proto) {
      var privateInstanceVar = 'private instance variable';
      var privateInstanceMethod = function() {
        console.log('private instance method');
      };

      proto.publicInstanceVar = 'public static variable';
      proto.publicInstanceMethod = function() {
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
    constructor: function(proto) {
      proto.publicInstanceVar = 'Overridden instance variable';
    }
  };
});

var MyObject2 = MyClass2.create();

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
console.log('done!');
