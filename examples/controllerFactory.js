define([ 'when' ],
/**
 * @exports controllerFactory
 * @requires when
 * 
 * @description Wire.js plugin for a Controller Factory. Usage:
 * @example Configuration // Defining wire log module for app $plugins : [ {
 *          module : 'blue/wire/log', trace : true }, { module :
 *          'compdemo/framework-wip/controllerFactory', // what we use to build
 *          a controller with by default controllerDefaults : { // The module we
 *          use for ControllerRegistry. registry : { module :
 *          'blue/registry/controller' }, // The module we use as a prototype
 *          for each Controller. controllerBase : { module : 'blue/controller' }, //
 *          Default properties for each Controller... Does not merge! properties : {
 *          settings : { $ref : 'settings' } }, // Turn on console logging for
 *          the factory? trace : false } } ]
 * @example Wire Spec for Controllers controllerRegistry : { controllers : { //
 *          resolves 'index' to appName/controller/index // loads settings as a
 *          default property index : {}, list : { // provide the module name
 *          module : 'compdemo/controller/list', // long-hand spec for settings
 *          properties : { $ref : 'settings' } } } }
 */
function(when) {

    var exports = {
        wire$plugin : controllerPlugin
    };

    /**
     * @typedef PluginInstance
     * @description
     * A wire.js plugin instance. All plugins must return this exported instance.
     *
     * @see {@link https://github.com/cujojs/wire/blob/0.10.7/docs/plugins.md#authoring-plugins}
     */

    var appName = '?';
    var controllerParameters = {
        registry : {
            module : 'blue/registry/controller'
        },
        controllerBase : {
            module : 'blue/controller'
        },
        properties : {
            settings : {
                $ref : 'settings'
            }
        },
        trace : false
    };

    /** @type {PluginInstance} */
    var pluginInstance = {
        factories : {
            'controllers' : controllerFactory
        }
    };

    /**
     * @param {Object} options
     * @return {PluginInstance} The instance of the plugin.
     */
    function controllerPlugin(options) {
        if (options.controllerDefaults) {
            log('Setting defaults for controller factory: ');
            controllerParameters = options.controllerDefaults;
            log(controllerParameters);
        }
        return pluginInstance;
    }

    /**
     * @param {String|Object} msg
     */
    function log(msg) {
        if (controllerParameters.trace) {
            // TODO: whatever this should do
            console.warn("Controller Factory: ", msg);
        }
    }
    /**
     * @memberof pluginInstance
     * @param {Deferred}
     * @param {Object}
     * @param {Function}
     */
    function controllerFactory(resolver, spec, wire) {
        // log(spec);
        var type, controller;
        var controllers = spec.options;
        var factorySpec = {
            create : controllerParameters.registry.module,
            properties : {}
        };
        wire.resolveRef('appName').then(function(deref) {
            // log('Got ref to appName: ' + deref);
            appName = deref;
            for ( var c in controllers) {
                if (controllers.hasOwnProperty(c)) {
                    var moduleName = appName + '/controller/' + c;
                    var controllerSpec = controllers[c];
                    if (typeof controllerSpec === 'string') {
                        moduleName = controllerSpec;
                    } else if (controllerSpec.module != null) {
                        moduleName = controllerSpec.module;
                    }
                    var properties = {
                        settings : {
                            $ref : 'settings'
                        }
                    };
                    if (controllerSpec.properties != null) {
                        properties = controllerSpec.properties;
                    }
                    log('Create Controller: ' + moduleName);
                    var wireSpecForController = {
                        'create' : {
                            module : controllerParameters.controllerBase.module,
                            args : {
                                module : moduleName
                            }
                        },
                        'properties' : controllerParameters.properties
                    };
                    factorySpec.properties[c] = wireSpecForController;
                }
            }
            log('BUILD THIS SPEC: ');
            log(factorySpec);
            log('wire() begin...');
            wire(factorySpec).then(function(obj) {
                log('wire() completed');
                log(obj);
                resolver.resolve(obj);
            });
        });
    }

    return exports;
});