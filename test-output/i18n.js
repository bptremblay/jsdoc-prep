/*jslint regexp: true */
/*global require: false, navigator: false, define: false */
'use strict';
const nlsRegExp = /(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;
/**
 * @param locale  
 * @param master  
 * @param needed  
 * @param toLoad  
 * @param prefix  
 * @param suffix
 */
function addPart(locale, master, needed, toLoad, prefix, suffix) {
  if (master[locale]) {
    needed.push(locale);
    if (master[locale] === true || master[locale] === 1) {
      toLoad.push(prefix + locale + '/' + suffix);
    }
  }
}
/**
 * @param req  
 * @param locale  
 * @param toLoad  
 * @param prefix  
 * @param suffix
 */
function addIfExists(req, locale, toLoad, prefix, suffix) {
  const fullName = prefix + locale + '/' + suffix;
  if (require._fileExists(req.toUrl(fullName))) {
    toLoad.push(fullName);
  }
}
/**
 * @param target  
 * @param source  
 * @param force
 */
function mixin(target, source, force) {
  let prop;
  for (prop in source) {
    if (source.hasOwnProperty(prop) && (!target.hasOwnProperty(prop) || force)) {
      target[prop] = source[prop];
    } else if (typeof source[prop] === 'object') {
      mixin(target[prop], source[prop], force);
    }
  }
}
define(['module'],
  /**
   * @exports src/i18n
   * @requires module
   */
  function (module) {
    const masterConfig = module.config();
    return {
      version: '2.0.1',
      /**
       * @param name  
       * @param req  
       * @param onLoad  
       * @param config
       */
      load(name, req, onLoad, config) {
        config = config || {};
        if (config.locale) {
          masterConfig.locale = config.locale;
        }
        let masterName,
          match = nlsRegExp.exec(name),
          prefix = match[1],
          locale = match[4],
          suffix = match[5],
          parts = locale.split("-"),
          toLoad = [],
          value = {},
          i, part, current = "";
        if (match[5]) {
          prefix = match[1];
          masterName = prefix + suffix;
        } else {
          masterName = name;
          suffix = match[4];
          ({
            locale
          } = masterConfig);
          if (!locale) {
            locale = masterConfig.locale =
              typeof navigator === "undefined" ? "root" :
              (navigator.language ||
                navigator.userLanguage || "root").toLowerCase();
          }
          parts = locale.split("-");
        }
        if (config.isBuild) {
          toLoad.push(masterName);
          addIfExists(req, "root", toLoad, prefix, suffix);
          for (i = 0; i < parts.length; i++) {
            part = parts[i];
            current += (current ? "-" : "") + part;
            addIfExists(req, current, toLoad, prefix, suffix);
          }
          req(toLoad, function () {
            onLoad();
          });
        } else {
          req([masterName], function (master) {
            let needed = [],
              part;
            addPart("root", master, needed, toLoad, prefix, suffix);
            for (i = 0; i < parts.length; i++) {
              part = parts[i];
              current += (current ? "-" : "") + part;
              addPart(current, master, needed, toLoad, prefix, suffix);
            }
            req(toLoad, function () {
              let i, partBundle, part;
              for (i = needed.length - 1; i > -1 && needed[i]; i--) {
                part = needed[i];
                partBundle = master[part];
                if (partBundle === true || partBundle === 1) {
                  partBundle = req(prefix + part + '/' + suffix);
                }
                mixin(value, partBundle);
              }
              onLoad(value);
            });
          });
        }
      }
    };
  });