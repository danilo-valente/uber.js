Uber
====

Uber is a function overloading tool for Node.js.

## Installation

Install Uber with npm by running
 
```sh
npm install uber.js
```

## Basic Usage

First of all, you need to `require` Uber:

```js
var uber = require('uber.js');
```

Now you just have to replace your long function implementations with lots of arguments
validations with Uber calls, so your code that looks like this:

```js
var addToArray = function (array, value, index) {
    if (!(array instanceof array)) {
        throw new Error('Must provide a valid array');
    }
    if (typeof index === 'number' && isFinite(index)) {
        array[index] === value;
    } else {
        array.push(value);
    }
};
```

Turns into this:

```js
var addToArray = uber([
    ['array', '*', 'int', function (array, value, index) {
        array[index] = value;
    }],
    ['array', '*', function (array, value) {
        array.push(value);
    }]
]);
```

Or this:

```js
var addToArray = uber({
    'array,*,int': function (array, value, index) {
        array[index] = value;
    },
    'array,*': function (array, value) {
        array.push(value);
    }
});
```

And then Uber does the magic for you:

```js
var myArray = [];
addToArray(myArray, 'node.js');
addToArray(myArray, 'ie');
addToArray(myArray, 'chrome', 1);
```

## Class instances types

You can also tell Uber to match arguments by their prototype:

```js
var User = function (name) {
    this.name = name;
};

var logUser = uber([
    [User.prototype, function (user) {
        console.log(user.name);
    }],
    ['string', function (name) {
        console.log(name);
    }],
    ['null', function (user) {
        console.error('You provided a null user');
    }]
]);

logUser(new User('Ryan Dahl'));
logUser('John Resig');
logUser(null);
```

## Custom argument types

You can define your own type definitions by simply passing a function instead of a string
in your implementation:

```js
var repeatTimes = uber([
    [function (arg, index, args) {
        return typeof arg === 'number' && isFinite(arg) && arg >= 0;
    }, 'function', function (times, fn) {
        for (var i = 0; i < times; i++) {
            fn(i);
        }
    }]
]);
repeatTimes(10, function (i) {
    console.log((10 - i) + '...');
});
```

Uber will call your function with 3 arguments:

 - `arg`: The current argument
 - `index`: The current argument's index
 - `args`: The actual array of arguments

And your function must either return a boolean or a positive integer, which represents the number
of arguments it matches.

If you want to create reusable type definitions you can register them using `uber.registerType`:

```js
uber.registerType('pos_int', function (arg, index, args) {
    return typeof arg === 'number' && isFinite(arg) && arg >= 0;
});

var repeatTimes = uber([
    ['pos_int', 'function', function (times, fn) {
        for (var i = 0; i < times; i++) {
            fn(i);
        }
    }]
]);
repeatTimes(10, function (i) {
    console.log((10 - i) + '...');
});
```

## Custom error handling

Notice that if Uber can't find a suitable implementation for the given arguments, it will throw
an error:

```js
var dummy = uber([
    ['bool', function (bool) {
        return bool;
    }]
]);

dummy(1, 2, 3); // Will throw 'Could not resolve function with given arguments'
```

If you want to handle these errors in your own way, you can add a function to the last index of
your implementations array and it will get all the actual arguments:

```js
var dummy = uber([
    ['bool', function (bool) {
        return bool;
    }],
    function () {
        console.error('Oops! I don\'t know what to do with these', arguments);
    }
]);

dummy(1, 2, 3); // Logs an error message
```

## Class instance methods

Let's say you have a `Person` class:

```js
var Person = function (name) {
    this.name = name;
};
```

And you want to add a new method to its prototype. Do this:

```js
Person.prototype.walk = uber([
    ['real', function (distance) {
        return this.name + ' is walking ' + distance + ' meters';
    }]
]);
```

What if you want to add it to an instance? Then Uber lets you tell what's the function's context:

```js
var walter = new Person('Walter White');
walter.sayMyName = uber(['string', function (aka) {
    if (this.name === 'Walter White' && aka === 'Heisenberg') {
        return 'You\'re god damn right!';
    }
}], walter);
```

See? It's the second argument (`walter`). This way your implementation will be `.apply`'ed with `walter`:

```js
walter.sayMyName('Heisenberg');
walter.walk(10);
``` 

## Map vs Array of implementations

As seen before, you can also call Uber with a map of implementations instead of an array. Even though
it has a cleaner syntax, it lacks some features, since the keys must be strings. That's why you can't
define error handler implementations by using maps. You may, however, declare an implementation that
takes no arguments:

```js
uber({
    '': function () {
        console.log('I don\'t have any arguments');
    }
});
```

Also notice that Uber splits those keys and commas (`,`) are delimiters and they are not `.trim`'med,
so all whitespaces are kept. Thus, `'bool, int'` is **NOT** the same as `'bool,int'` since they are
respectively parsed into `['bool', 'int']` and `['bool', ' int']`.

## `uber.def`

You can also can `uber.def` instead of `uber`. This way you should pass each argument as a function
signature, which means that this code:

```js
uber([
    ['int', function (n) {}],
    ['string', function (str) {}]
]);
```

Is the same as this one:

```js
uber.def(['int', function (n) {}],
         ['string', function (str) {}]);
```

**Note:** This method does not support the `context` argument.

## List of supported argument types

Type      | Matches              | Number of matches
--------- | -------------------- | -----------------
*         | Anything             | `1`
...       | Anything             | Everything starting from the current argument until the end
null      | `null`               | `1`
undefined | `undefined`          | `1`
bool      | Booleans             | `1`
int       | Integers             | `1`
real      | Real                 | `1`
number    | JavaScript numbers   | `1`
string    | Strings              | `1`
array     | Arrays               | `1`
plain     | Plain objects (`{}`) | `1`
date      | `Date` instances     | `1`
regex     | Regexes              | `1`
function  | Functions            | `1`

## License

Please refer to file LICENSE.
