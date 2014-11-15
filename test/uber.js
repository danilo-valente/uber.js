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
            }]
        ]);

        it('should return `\'string-string\'`', function () {
            expect(sampleFn('foo', 'bar')).to.equal('string-string');
        });

        it('should return `\'string-int\'`', function () {
            expect(sampleFn('foo', 1)).to.equal('string-int');
        });

        // TODO: Add more unit tests
    });

    describe('special types', function () {

        var sampleFn = uber([
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
            }]
        ]);

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

        var sampleFn = uber([
            [String.prototype, function () {
                return 'String';
            }],
            [Number.prototype, function () {
                return 'Number';
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
    });

    describe('type validators', function () {
        // TODO
    });

});