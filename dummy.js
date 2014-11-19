/**
 * @author Jeff Rose and Mark Saunders
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module blue/service
 * @requires blue/compose
 * @requires blue/object/extend
 * @requires blue/service/interceptor/header
 * @requires blue/is
 * @requires mout/array/slice
 * @requires blue/store/enumerable/session
 * @requires ./compose
 * @requires ./object/extend
 * @requires ./service/interceptor/header
 * @requires ./is
 * @requires ./store/enumerable/session
 * @requires ./declare
 * @requires ./http
 * @requires ./intercept
 */
define(function (require, exports, module) {
    var compose = require('./compose'),
        extend = require('./object/extend'),
        header = require('./service/interceptor/header'),
        is = require('./is'),
        sessionStore = new(require('./store/enumerable/session'))(
            'servicesettings');
    config = module.config(), services = config.services;
    return require('./declare')
        (
            function () {
                var servicePrototype = /** @lends module:blue/service# */ {
                    /**
                     * @member {Function} http
                     * @see {@link http://api.jquery.com/jQuery.ajax/}
                     */
                    http: require('./http'),
                    /**
                     * @constructs module:service
                     * @augments {null}
                     * @param {String}
                     *            this.serviceCalls - defined in derived
                     *            classes
                     *
                     * @example passed in html file prior to index.js
                     *          <script> var envConfig = { config: {
                     *          'service' : { primaryUrl :
                     *          'http://localhost:9000/bluejs-mvc/',
                     *          backupUrl :
                     *          'http://localhost:9000/bluejs-mvc/' },
                     *          serviceMappings : { //readDetail :
                     *          'rl/readDetail/list', readDetail:
                     *          'data/detail.json' } } }; </script>
                     *
                     * @example this.serviceCalls = { readDetail : {
                     *          settings : { type: 'GET', xhrFields: {
                     *          withCredentials: true } } } }
                     */
                    constructor: function Service() {
                        if (arguments.length) {
                            var args = require('mout/array/slice')(
                                arguments);
                            args.unshift(this);
                            compose.apply(compose, args);
                        }
                        var descriptor = this.serviceCalls,
                            defaults = {
                                type: 'POST',
                                dataType: 'json',
                                contentType: 'application/x-www-form-urlencoded',
                                timeout: 5000,
                                redirect: true,
                                crossDomain: true,
                                xhrFields: {
                                    withCredentials: true
                                }
                            };
                        is.plainObject(descriptor) && Object
                            .keys(descriptor)
                            .forEach(
                                function (key) {
                                    var settings = extend(
                                        true, {},
                                        defaults,
                                        this.serviceCalls[key].settings);
                                    // for now we are
                                    // only going to use
                                    // the primaryURL,
                                    // retry logic is
                                    // not currently in
                                    // scope
                                    services
                                        .forEach(function (
                                            service) {
                                            if (service.name === key) {
                                                if (is
                                                    .defined(service.urls[0])) {
                                                    settings.url = service.urls[0];
                                                }
                                            }
                                        });
                                    this[key] = function (
                                        data) {
                                        this
                                            .prerequest(
                                                settings,
                                                data);
                                        return this
                                            .request(settings);
                                    };
                                    // assist with testing
                                    this[key].getSettings = function () {
                                        return settings;
                                    };
                                }, this);
                        this
                            .enableInterceptors(this.interceptors || []);
                        this.addInterceptor(header);
                        is['function'](this.init) && this.init.call(this);
                    },
                    prerequest: function (settings, data) {
                        var fqdn;
                        settings.data = data || {};
                        if (settings.url.substr(0, 4).toLowerCase()
                            .indexOf('http') !== 0) {
                            fqdn = sessionStore.get('serviceFQDN');
                            settings.url = (fqdn) ? (fqdn + settings.url) : settings.url;
                        }
                        // assist with testing
                        return settings;
                    },
                    request: function (settings) {
                        return new Promise(function (resolve, reject) {
                            this.http.request(settings).then(
                                function (data) {
                                    resolve(data);
                                })['catch'](function (denied) {
                                reject(denied);
                            });
                        }.bind(this));
                    },
                    // Support IE logging
                    toString: function () {
                        return 'Service';
                    }
                };
                compose(servicePrototype, function () {
                    require('./intercept').withInterceptors.call(this,
                        'request');
                });
                return servicePrototype;
            });
});