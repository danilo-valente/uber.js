var _ = require('lodash');

var isNumeric = function (arg) {
    return _.isNumber(arg) && arg > -Infinity && arg < Infinity;
};

module.exports = {

    '*': function () {
        return 1;
    },

    '...': function (arg, index, args) {
        return args.length - index;
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
    }

};