var _ = require('lodash');
var typeDefinitions = require('./types.js');
var validators = require('./validators.js');    // TODO

var extract = function (args, def) {
    'use strict';

    var types = _.initial(def);
    var fn = _.last(def);
    if (!(fn instanceof Function)) {
        return null;
    }

    var argsIndex = 0;
    var match = _.every(types, function (type, index) {
        var cur = args[argsIndex];

        var typedef = _.noop;
        if (_.isFunction(type)) {
            typedef = type;
        } else if (_.isObject(type)) {
            typedef = function () {
                return cur !== undefined && cur !== null && cur.constructor.prototype === type;
            };
        } else if (_.isString(type)) {
            typedef = typeDefinitions[type] || _.noop;
        } else {
            return false;
        }

        var count = +typedef(cur, index, args) || 0;
        argsIndex += count;
        return count > 0;
    });

    return match && argsIndex === args.length ? fn : null;
};

var uber = function (signature, context, name) {
    'use strict';

    // TODO: Accept _.isObject(signature)

    if (!_.isArray(signature)) {
        return signature;
    }

    return function () {
        var args = _.toArray(arguments);

        var impl = _.find(signature, function (def) {
            return _.isFunction(def) ? def : extract(args, def);
        });

        var message;
        if (!impl) {
            args = _.map(args, function (arg) {
                return '\'' + arg + '\'';
            });
            message = 'Could not resolve function' + (name ? ' ' + name : '') + ' with arguments [' + args.join(', ') + ']';
            throw new TypeError(message);
        }

        var fn = _.isFunction(impl) ? impl : _.last(impl);
        return fn.apply(context, args);
    };
};

uber.extract = extract;

module.exports = uber;