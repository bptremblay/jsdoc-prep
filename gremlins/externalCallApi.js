define(function(require) {
    var is = require('blue/is');
    return require('blue/declare')({
        constructor: function ExternalCallApi(contr) {
            var externalController = contr;
            var externalCallData = {};
            var externalCallReturnData = {};
            var log = function(data) {
                if (data.hasOwnProperty('logName')) {
                    externalController.context.logger.name = data.logName;
                }
                externalController.context.logger[data.type || 'info'](data.message);
            };
            var hasPromise = function() {
                return (externalCallData.hasOwnProperty('promise'));
            };
            var resetExternalCallData = function() {
                externalCallData = {};
            };
            var restoreStateData = {};
            var switchUrl = function(url) {
                window.history.replaceState({}, '', url);
            };
            return {
                getExternalCallData: function() {
                    return externalCallData;
                },
                getExternalCallReturnData: function() {
                    return externalCallReturnData;
                },
                getRestoreStateData: function() {
                    return restoreStateData;
                },
                hasPromise: hasPromise,
                hasReturnData: function(prop) {
                    prop = prop || null;
                    if (!(is.null(externalCallReturnData) || is.empty(externalCallReturnData))) {
                        return (prop === null) ? true : externalCallReturnData.hasOwnProperty(prop);
                    } else {
                        return false;
                    }
                },
                hasStateData: function() {
                    return (!(is.null(restoreStateData) || is.empty(restoreStateData)));
                },
                isExternalCall: function() {
                    return (externalCallData.hasOwnProperty('caller'));
                },
                makeExternalCall: function(trigger, params) {
                    externalController.controllerChannel.emit(trigger, params);
                    if (params.data.hasOwnProperty('url')) {
                        switchUrl(params.data.url);
                    }
                },
                resetExternalCallData: resetExternalCallData,
                resetExternalCallReturnData: function() {
                    externalCallReturnData = {};
                    restoreStateData = {};
                },
                returnToCaller: function(data) {
                    data = data || {};
                    var cancel = data.cancel || false;
                    var result = data.result || {};
                    var resolve = data.resolve || function() {
                        log({logName: '[externalCallApi::returnToCaller]', message: 'promise ' + ((cancel) ? 'cancelled' : 'finished')});
                    };
                    var reject = data.reject || function(err) {
                        log({logName: '[externalCallApi::returnToCaller]', message: ['promise failed', err]});
                    };
                    var url = externalCallData.caller + ((cancel) ? '' : ((!externalCallData.hasOwnProperty('noFlag') || externalCallData.noFlag) ? '' : '&newPayFromAccount=true'));
                    if (hasPromise()) {
                        externalCallData.promise(result).then(resolve, reject);
                    }
                    resetExternalCallData();
                    externalController.state(url);
                },
                setExternalCallData: function(data) {
                    externalCallData = data;
                },
                setExternalCallReturnData: function(data) {
                    externalCallReturnData = data;
                },
                setRestoreStateData: function(data) {
                    restoreStateData = data;
                },
                switchUrl: switchUrl
            };
        }
    });
});
