var expect = require('expect.js');
var uber = require('..');

describe('uber', function () {

    describe('single primitive types', function () {

        var sampleFn = uber([
            ['bool', function () {
                return 'bool';
            }],
            ['int', function () {
                return 'int';
            }],
            ['real', function () {
                return 'real';
            }],
            ['number', function () {
                return 'number';
            }],
            ['string', function () {
                return 'string';
            }],
            ['array', function () {
                return 'array';
            }],
            ['plain', function () {
                return 'plain';
            }],
            ['date', function () {
                return 'date';
            }],
            ['regex', function () {
                return 'regex';
            }],
            ['function', function () {
                return 'function';
            }],
            [function () {
                return '';
            }],
            function () {
                return null;
            }
        ]);

        it('should return `\'bool\'` when called with `false`', function () {
            expect(sampleFn(false)).to.equal('bool');
        });

        it('should return `\'bool\'` when called with `true`', function () {
            expect(sampleFn(true)).to.equal('bool');
        });

        it('should return `\'int\'` when called with `1`', function () {
            expect(sampleFn(1)).to.equal('int');
        });

        it('should return `\'int\'` when called with `0`', function () {
            expect(sampleFn(0)).to.equal('int');
        });

        it('should return `\'int\'` when called with `-1`', function () {
            expect(sampleFn(-1)).to.equal('int');
        });

        it('should return `\'real\'` when called with `Math.PI`', function () {
            expect(sampleFn(Math.PI)).to.equal('real');
        });

        it('should return `\'number\'` when called with `Infinity`', function () {
            expect(sampleFn(Infinity)).to.equal('number');
        });

        it('should return `\'number\'` when called with `NaN`', function () {
            expect(sampleFn(NaN)).to.equal('number');
        });

        it('should return `\'string\'` when called with `\'foo\'`', function () {
            expect(sampleFn('foo')).to.equal('string');
        });

        it('should return `\'string\'` when called with `\'\'`', function () {
            expect(sampleFn('')).to.equal('string');
        });

        it('should return `\'string\'` when called with `\'123\'`', function () {
            expect(sampleFn('123')).to.equal('string');
        });

        it('should return `\'array\'` when called with `[1, 2, 3]`', function () {
            expect(sampleFn([1, 2, 3])).to.equal('array');
        });

        it('should return `\'plain\'` when called with `{ foo: \'bar\' }`', function () {
            expect(sampleFn({ foo: 'bar' })).to.equal('plain');
        });

        it('should return `\'date\'` when called with `new Date()`', function () {
            expect(sampleFn(new Date())).to.equal('date');
        });

        it('should return `\'regex\'` when called with `/^/`', function () {
            expect(sampleFn(/^/)).to.equal('regex');
        });

        it('should return `\'regex\'` when called with `new RegExp(\'^\')`', function () {
            expect(sampleFn(new RegExp('^'))).to.equal('regex');
        });

        it('should return `\'function\'` when called with `function () {}`', function () {
            expect(sampleFn(function () {})).to.equal('function');
        });

        it('should return `\'\'` when called with no arguments at all', function () {
            expect(sampleFn()).to.equal('');
        });

        it('should return `null` when called with `null` (which means no other definition matches this set of argumetns)', function () {
            expect(sampleFn(null)).to.equal(null);
        });
    });

    describe('combined primitive types', function () {

        var sampleFn = uber([
            ['string', 'int', function () {
                return 'string-int';
            }],
            ['string', 'string', function () {
                return 'string-string';
            }],
            ['bool', 'string', 'number', function () {
                return 'bool-string-number';
            }],
            ['int', 'real', 'number', function () {
                return 'int-real-number';
            }],
            ['array', 'plain', 'date', 'regex', function () {
                return 'array-plain-date-regex';
            }]
        ]);

        it('should return `\'string-string\'`', function () {
            expect(sampleFn('foo', 'bar')).to.equal('string-string');
        });

        it('should return `\'string-int\'`', function () {
            expect(sampleFn('foo', 1)).to.equal('string-int');
        });

        it('should return `\'bool-string-number\'`', function () {
            expect(sampleFn(true, 'foo', NaN)).to.equal('bool-string-number');
        });

        it('should return `\'int-real-number\'`', function () {
            expect(sampleFn(1, Math.PI, -Infinity)).to.equal('int-real-number');
        });

        it('should return `\'array-plain-date-regex\'`', function () {
            expect(sampleFn([], {}, new Date(), /^/)).to.equal('array-plain-date-regex');
        });
    });

    describe('special types', function () {

        var sampleFn = uber([
            ['null', function () {
                return 'null';
            }],
            ['undefined', function () {
                return 'undefined';
            }],
            ['*', function () {
                return '*';
            }],
            ['bool', '*', 'int', function () {
                return 'bool-*-int';
            }],
            ['int', '...', function () {
                return 'int-...';
            }],
            ['bool', 'bool', '...', function () {
                return 'bool-bool-...';
            }],
            [function () {
                return '';
            }]
        ]);

        it('should return `\'\'`', function () {
            expect(sampleFn()).to.equal('');
        });

        it('should return `\'undefined\'`', function () {
            expect(sampleFn(undefined)).to.equal('undefined');
        });

        it('should return `\'null\'`', function () {
            expect(sampleFn(null)).to.equal('null');
        });

        it('should return `\'*\'`', function () {
            expect(sampleFn('')).to.equal('*');
        });

        it('should return `\'*\'`', function () {
            expect(sampleFn(0)).to.equal('*');
        });

        it('should return `\'*\'`', function () {
            expect(sampleFn(false)).to.equal('*');
        });

        it('should return `\'bool-*-int\'`', function () {
            expect(sampleFn(true, 'foo', 123)).to.equal('bool-*-int');
        });

        it('should return `\'int-...\'`', function () {
            expect(sampleFn(1, 2, 3, 4, 5, 6)).to.equal('int-...');
        });

        it('should return `\'bool-bool-...\'`', function () {
            expect(sampleFn(false, true, 1, 2, 3)).to.equal('bool-bool-...');
        });
    });

    describe('class types', function () {

        var ArrayLike = function () {
            Array.apply(this, arguments);
        };

        ArrayLike.prototype = new Array();
        ArrayLike.prototype.constructor = ArrayLike;

        var sampleFn = uber([
            [String.prototype, function () {
                return 'String';
            }],
            [Number.prototype, function () {
                return 'Number';
            }],
            [Array.prototype, function () {
                return 'Array';
            }],
            [ArrayLike.prototype, function () {
                return 'ArrayLike';
            }]
        ]);

        it('should return `\'String\'`', function () {
            expect(sampleFn('')).to.equal('String');
        });

        it('should return `\'String\'`', function () {
            expect(sampleFn(new String(''))).to.equal('String');
        });

        it('should return `\'Number\'`', function () {
            expect(sampleFn(123)).to.equal('Number');
        });

        it('should return `\'Number\'`', function () {
            expect(sampleFn(new Number(123))).to.equal('Number');
        });

        it('should return `\'Array\'`', function () {
            expect(sampleFn([1, 2, 3])).to.equal('Array');
        });

        it('should return `\'ArrayLike\'`', function () {
            expect(sampleFn(new ArrayLike(10))).to.equal('ArrayLike');
        });
    });

    describe('custom type definitions', function () {

        var ArrayLike = function () {
            Array.apply(this, arguments);
        };

        ArrayLike.prototype = new Array();
        ArrayLike.prototype.constructor = ArrayLike;

        var sampleFn = uber([
            [function (arg) {
                return arg instanceof Array;
            }, function () {
                return 'Array instance';
            }],
            [Boolean.prototype, function () {
                return 'Boolean';
            }]
        ]);

        it('should return `\'Array instance\'`', function () {
            expect(sampleFn([1, 2, 3])).to.equal('Array instance');
        });

        it('should return `\'Array instance\'`', function () {
            expect(sampleFn(new ArrayLike(10))).to.equal('Array instance');
        });

        it('should return `\'Boolean\'`', function () {
            expect(sampleFn(false)).to.equal('Boolean');
        });
    });

    describe('custom error handler', function () {

        var sampleFn = uber([
            ['int', function () {
                return 'int';
            }],
            function () {
                console.log('Could not match implementation for given arguments', arguments);
                return 'ok';
            }
        ]);

        it('should handle errors instead of throwing them', function () {
            expect(sampleFn()).to.equal('ok');
        });
    });

    describe('defined from plain object', function () {

        var sampleFn = uber({
            'int,string': function () {
                return 'int-string';
            },
            'bool,...': function () {
                return 'bool-...';
            },
            '': function () {
                return '';
            }
        });

        it('should return `\'int-string\'`', function () {
            expect(sampleFn(123, 'foo')).to.equal('int-string');
        });

        it('should return `\'bool-...\'`', function () {
            expect(sampleFn(false, 1, 2, 3)).to.equal('bool-...');
        });

        it('should return `\'\'`', function () {
            expect(sampleFn()).to.equal('');
        });
    });

});