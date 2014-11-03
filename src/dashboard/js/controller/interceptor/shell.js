define(function(require) {

    var pipeline = require('blue/pipeline');

    return function() {
        var hasRun = false,
            args = arguments;

        // TODO: Change pipeline listener to application
        // lifecycle-based event system
        pipeline.current
            .filter(function(message) {
                return message.siteEvent && message.siteEvent === 'appChange';
            })
            .map(function(message) {
                hasRun = false;
                return message;
            })
            .onValue();

        return {
            afterReturning: function(controllers) {
                if (!hasRun) {
                    Object.keys(args).forEach(function(key) {
                        controllers.unshift(args[key]);
                    });
                    hasRun = true;
                }

                return controllers;
            }
        };
    };
});