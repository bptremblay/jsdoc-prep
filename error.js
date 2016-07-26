/**
 * Is dev mode.
 *  Returns true if is dev mode.
 * @return {Boolean} boolean
 */
var isDevMode = function () {
  if (window.wf && window.wf.constants) {
    return window.wf.constants.ENV === "D";
  } else {
    /**
     * Loc.
     *  The loc.
     */
    var loc = window.location.toString();
    return loc.indexOf("127.0.0.1") !== -1 || loc.indexOf("csnzoo") !== -1;
  }
}();
window.wf.constants = window.wf.constants || {};
window.wf.constants.IS_AMD_DEBUG_MODE = window.wf.constants.CAN_ADMIN_LOGON && window.location && typeof window.location.search === "string" && window.location.search.indexOf(
  "amd_debug_mode=true") !== -1;
/**
 * The matches lazy.
 * @type {Object}
 */
var matchesLazy = /^lazy!/i;
/**
 * The matches defer.
 * @type {Object}
 */
var matchesDefer = /^@defer\//i;
/**
 * The lazy prefix length.
 */
var lazyPrefixLength = "lazy!".length;
/**
 * The defer prefix length.
 */
var deferPrefixLength = "@defer/".length;
/**
 * The $.
 */
var $ = window.$.noConflict();
/**
 * Creates a new instance of class AsynchronousModuleDefinition..
 * @constructor
 * @param {Logger} Logger
 */
function AsynchronousModuleDefinition(Logger) {
  /**
   * Amd.
   *  The amd.
   */
  var amd = this;
  /**
   * Amd defines.
   *  The amd defines.
   */
  var AMD_DEFINES = {};
  /**
   * Shims loaded.
   *  The shims loaded.
   * @type {Boolean}
   *
   */
  var shimsLoaded = false;
  /**
   * Procedure to install shims.
   */
  this.installShims = function installShims() {
    if (shimsLoaded) {
      return;
    }
    shimsLoaded = true;
    amd.define("logger", [], function () {
      return window.wf.logger;
    });
    AMD_DEFINES.logger.shimmed = true;
    amd.define("underscore", [], function () {
      return window._;
    });
    AMD_DEFINES.underscore.shimmed = true;
    amd.define("backbone", [], function () {
      return window.Backbone;
    });
    AMD_DEFINES.backbone.shimmed = true;
    amd.define("jquery", [], function () {
      return $;
    });
    AMD_DEFINES.jquery.shimmed = true;
  };
  /**
   * @param {String} name
   * @param {Array} deps
   * @param {Function} callback
   */
  this.define = function (name, deps, callback) {
    if (AMD_DEFINES[name] != null && AMD_DEFINES[name].shimmed !== true && AMD_DEFINES[name].deferred !== true) {
      if (!(window.wf && window.wf.features && window.wf.features.use_single_lazy_bundle)) {
        Logger.info("AMD define already defined " + name);
      }
      return;
    }
    /**
     * Promise.
     *  The promise.
     */
    var promise;
    if (AMD_DEFINES[name] && AMD_DEFINES[name].deferred) {
      promise = AMD_DEFINES[name].promise;
    }
    if (typeof name !== "string") {
      if (isDevMode) {
        Logger.warn("wf_amd.define() called without all required parameters.  Check to make sure any new plugins are not using AMD loader without name parameter.");
      }
      return;
    }
    callback.requires = deps;
    callback.creating = false;
    /**
     * Shimmed.
     *  The shimmed.
     * @type {Boolean}
     *
     */
    var shimmed = false;
    if (AMD_DEFINES[name] != null) {
      shimmed = AMD_DEFINES[name].shimmed === true;
    }
    AMD_DEFINES[name] = callback;
    callback.shimmed = shimmed;
    if (promise) {
      if (window.wf.modules.moduleToBundlesMap && window.wf.modules.moduleToBundlesMap[name]) {
        window.wf.modules.moduleToBundlesMap[name].allBundlesLoadedPromise.done(function () {
          promise.resolve(amd.require(name));
        });
      } else {
        Logger.warn("No bundles loaded promise found for module " + name);
      }
    }
  };
  amd.unresolvedModules = {};
  /**
   * @return {Array}
   */
  this.getUnresolvedModules = function () {
    /**
     * Result.
     *  The result.
     */
    var result = [];
    for (var u in amd.unresolvedModules) {
      if (amd.unresolvedModules.hasOwnProperty(u)) {
        result.push(u);
      }
    }
    return result;
  };
  /**
   * Require.
   * @param {Array} deps
   * @param {Function} callback
   * @return {Object} Emulates output of require.js method under different conditions.
   */
  this.require = function (deps, callback) {
    /**
     * Modules not found.
     *  The modules not found.
     */
    var modulesNotFound;
    /**
     * Str dep.
     *  The str dep.
     */
    var strDep = typeof deps === "string";
    if (strDep) {
      deps = [deps];
    }
    /**
     * Resolved deps.
     *  The resolved deps.
     */
    var resolvedDeps = [];
    /**
     * Module.
     *  The module.
     * @type {Object}
     *
     */
    var module = null;
    /**
     * Dep.
     *  The dep.
     * @type {String}
     *
     */
    var dep = "";
    /**
     * Is lazy.
     *  The is lazy.
     */
    var isLazy;
    /**
     * Is deferred.
     *  The is deferred.
     */
    var isDeferred;
    /**
     * Instance.
     *  The instance.
     */
    var instance;
    var requiresCallback = function () {
      if (window.Logger != null) {
        Logger = window.Logger;
      }
      if (window.wf.constants.IS_AMD_DEBUG_MODE) {
        module.instance = module.apply(window, arguments);
      } else {
        try {
          /**
           * The log module load time.
           */
          module.instance = module.apply(window, arguments);
          logModuleLoadTime();
        } catch (requireError) {
          requireError.name = 'Error during require() in module "' + dep + '": ' + requireError.name;
          requireError.message = 'in module "' + dep + '"--> ' + requireError.message;
          throw requireError;
        }
      }
      if (module.instance == null) {
        module.instance = (new Date).getTime() * Math.random();
      }
      if (isLazy || isDeferred) {
        if (!module.deferred) {
          if (!module.promise) {
            module.promise = $.Deferred();
            module.promise.load = $.noop;
          }
          module.promise.resolve(module.instance);
        }
        resolvedDeps.push(module.promise);
      } else {
        resolvedDeps.push(module.instance);
      }
    };
    /**
     * Index.
     * @type {Number}
     *
     */
    for (var index = 0; index < deps.length; index++) {
      dep = deps[index];
      isLazy = false;
      isDeferred = false;
      if (matchesLazy.test(dep)) {
        dep = dep.substr(lazyPrefixLength);
        isLazy = true;
      }
      if (matchesDefer.test(dep)) {
        dep = dep.substr(deferPrefixLength);
        isDeferred = true;
      }
      module = AMD_DEFINES[dep];
      if (!module && (isLazy || isDeferred)) {
        instance = $.Deferred();
        if (isLazy) {
          instance.load = _getLazyLoader(dep);
        }
        if (module == null) {
          module = {
            requires: [],
            creating: false,
            deferred: true,
            instance: instance
          };
          AMD_DEFINES[dep] = module;
        }
        module.promise = instance;
      }
      if (module != null) {
        if (module.creating) {
          throw new Error('AMD: circular dependencies in module "' + dep + '".');
        }
        /**
         * Requires.
         *  The requires.
         */
        var requires = module.requires;
        if (module.instance == null) {
          module.creating = true;
          if (requires.length === 0) {
            try {
              module.instance = module.apply(window, arguments);
              if (isLazy || isDeferred) {
                if (!module.deferred) {
                  if (!module.promise) {
                    module.promise = $.Deferred();
                    module.promise.load = $.noop;
                  }
                  module.promise.resolve(module.instance);
                }
                resolvedDeps.push(module.promise);
              } else {
                resolvedDeps.push(module.instance);
              }
            } catch (requireError) {
              requireError.name = 'Error during require() in module "' + dep + '": ' + requireError.name;
              requireError.message = 'in module "' + dep + '"--> ' + requireError.message;
              throw requireError;
            }
          } else {
            amd.require(requires, requiresCallback);
          }
          module.creating = false;
        } else {
          if (isLazy || isDeferred) {
            if (!module.deferred) {
              if (!module.promise) {
                module.promise = $.Deferred();
                module.promise.load = $.noop;
              }
              module.promise.resolve(module.instance);
            }
            resolvedDeps.push(module.promise);
          } else {
            resolvedDeps.push(module.instance);
          }
        }
      } else {
        amd.unresolvedModules[dep] = false;
        resolvedDeps.push(null);
      }
    }
    if (typeof callback === "function") {
      callback.apply(window, resolvedDeps);
    }
    if (isDevMode) {
      modulesNotFound = amd.getUnresolvedModules();
      if (modulesNotFound.length > 0) {
        /**
         * Error message.
         *  The error message.
         * @type {String}
         *
         */
        var errorMessage = "Loading has been halted because modules were not found. ";
        /**
         * Q string.
         *  The q string.
         */
        var qString = window.location.search;
        if (typeof qString === "string") {
          /**
           * Missing templates.
           *  The missing templates.
           * @type {Boolean}
           *
           */
          var missingTemplates = false;
          /**
           * I.
           * @type {Number}
           *
           */
          for (var i = 0; i < modulesNotFound.length; i++) {
            if (modulesNotFound[i].indexOf("@Templates") > -1) {
              missingTemplates = true;
              break;
            }
          }
          errorMessage += " Double check that your resources ";
          if (missingTemplates) {
            errorMessage += "and templates ";
          }
          errorMessage += "repos are up to date.";
          /**
           * New q string.
           *  The new q string.
           */
          var newQString = qString.indexOf("?") > -1 ? "&" : "?";
          if (qString.indexOf("js_memcache_down") === -1) {
            newQString += "js_memcache_down=true&";
          }
          if (missingTemplates && qString.indexOf("compile_js_templates") === -1) {
            newQString += "compile_js_templates=true";
          }
          if (newQString.length > 1) {
            window.location.search += newQString;
          }
        }
        Logger.warn(errorMessage);
        throw new Error("Module(s) " + JSON.stringify(modulesNotFound) + " have not been defined.");
      }
    }
    return strDep ? resolvedDeps[0] : resolvedDeps;
  };
  window.define = amd.define;
  window.require = amd.require;
  this.getDefs = function () {
    return AMD_DEFINES;
  };
  this.purgeCache = function () {
    for (var p in AMD_DEFINES) {
      if (AMD_DEFINES[p] != null) {
        delete AMD_DEFINES[p];
      }
    }
    AMD_DEFINES = {};
  };
};
/**
 * Get lazy loader.
 * @param dep
 * @return {Function}
 */
var _getLazyLoader = function (dep) {
  return function () {
    window.loadLazyModule(dep);
  };
};
/**
 * Wf amd.
 *  The wf amd.
 * @type {Object}
 *
 */
var wfAmd = null;
/**
 * Get amd.
 * @param Logger
 */
window.getAmd = function getAmd(Logger) {
  if (wfAmd === null) {
    wfAmd = new AsynchronousModuleDefinition(Logger);
  }
  return wfAmd;
};
}