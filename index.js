var util = require('util');

/** Class declaration function
 *
 */
function Class(super_, prototype, constructor) {
  function class_() {
    if (super_)
      super_.call(this);
    if (constructor)
      constructor.apply(this, Array.prototype.slice(arguments));
  }

  if (super_)
    util.inherits(class_, super_);

  // Inherit public static methods and variables
  for (var i in super_)
    class_[i] = super_[i];

  if (prototype)
    prototype(class_);

  return class_;
}

///////////////////////////////////////////////////////////////////////////////

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

console.log('done!');
