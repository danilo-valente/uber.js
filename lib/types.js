var _ = require('lodash');

var isNumeric = function (arg) {
    return _.isNumber(arg) && isFinite(arg);
};

module.exports = {

    '*': function () {
        return 1;
    },

    '...': function (arg, index, args) {
        return args.length - index;
    },

    'null': function (arg) {
        return arg === null;
    },

    'undefined': function (arg) {
        return arg === undefined;
    },

    'bool': function (arg) {
        return _.isBoolean(arg);
    },

    'int': function (arg) {
        return isNumeric(arg) && arg % 1 === 0;
    },

    'real': function (arg) {
        return isNumeric(arg);
    },

    'number': function (arg) {
        return _.isNumber(arg);
    },

    'string': function (arg) {
        return _.isString(arg);
    },

    'array': function (arg) {
        return _.isArray(arg);
    },

    'plain': function (arg) {
        return _.isPlainObject(arg);
    },

    'date': function (arg) {
        return _.isDate(arg);
    },

    'regex': function (arg) {
        return _.isRegExp(arg);
    },

    'function': function (arg) {
        return _.isFunction(arg);
    }

};