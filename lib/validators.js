var _ = require('lodash');

module.exports = {

    'not_null': function (arg) {
        return arg !== null;
    },

    'defined': function (arg) {
        return arg !== undefined;
    },

    'valid': function (arg) {
        return arg !== undefined && arg !== null;
    },

    'not_empty': function (arg) {
        return (_.isString(arg) || _.isArray(arg)) && arg.length > 0;
    },

    'positive': function (arg) {
        return _.isNumber(arg) && arg >= 0;
    }

};