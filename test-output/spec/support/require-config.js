/* Regex for proxy checking */
/**
 * Returns true if is localhost.
 * @param hostname
 * @return {Object} boolean
 */
function isLocalhost(hostname) {
  if (typeof window.requireConfig.localhosts !== 'object') {
    warn('You are missing the "localhosts" config section in /spec/index.coffee. You cannot view specs on any localhosts not in that list');
    return false;
  }
  /**
   * The localhosts.
   */
  var localhosts = window.requireConfig.localhosts.slice(0);
  /**
   * @type {Number}
   */
  for (var i = 0; i < localhosts.length; i++) {
    localhosts[i] = escapeRegExp(localhosts[i]);
  };
  /**
   * The pattern.
   */
  var pattern = '(' + localhosts.join('|') + '|^\/)';
  /**
   * The proxy regex.
   */
  var proxy_regex = new RegExp(pattern, 'i');
  if (proxy_regex.test(hostname) === true) {
    return true;
  } else {
    warn(hostname + ' is not in your localhosts list. Add it to /spec/index.coffee to enable access');
    return false;
  }
}
/**
 * @param str
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
/**
 * @param msg
 */
function warn(msg) {
  if (console && console.warn)
    console.warn(msg);
}
window.Galileo = {
  path: ''
};
window.requireConfig = {
  localhosts: [],
  baseUrl: './',
  map: {
    '*': {
      'backbone': 'backbone-private',
    },
    'backbone-private': {
      'backbone': 'backbone'
    }
  },
  paths: {
    // root path for this project
    'button-editor-path': '/src',
    /* Files for all projects */
    'i18n': '/src/lib/i18n',
    'specs': '/spec/javascripts',
    'text': '/src/lib/text',
    'css': '/src/lib/require-css/css',
    'css-builder': '/src/lib/require-css/css-builder',
    'normalize': '/src/lib/require-css/normalize',
    'vendor': '/src/vendor',
    'uiBasePath': 'https://ui.l1.constantcontact.com/',
    /* jQuery from their CDN */
    'jquery': '//code.jquery.com/jquery-2.0.3.min',
    'jquery-ui': '//code.jquery.com/ui/1.11.0/jquery-ui.min',
    /* Editor to map paths that were loader-related living in platform */
    'galileo-editor': '//static.ctctcdn.com/h/galileo-editor/1.0.1/galileo-editor-min',
    /* Locally hosted engine downloaded from an app config */
    'galileo-engine': '/tmp/galileo-engine'
  },
  shim: {
    'sanitize': {
      exports: 'Sanitize'
    },
    'underscore': {
      exports: '_',
      init: function () {
        return this._.noConflict();
      }
    },
    'galileo-editor': {
      deps: ['jquery']
    },
    'galileo-engine': {
      deps: ['jquery', 'jquery-ui', 'galileo-editor']
    },
    'jquery-ui': {
      deps: ['jquery']
    }
  },
  locale: 'none',
  /* Don't use a locale so the main bundle is used */
  config: {
    /* Configure the text plugin to properly download *.html from the platform */
    text: {
      /**
       * @param url
       * @param protocol
       * @param hostname
       * @param port
       */
      useXhr: function (url, protocol, hostname, port) {
        return isLocalhost(hostname);
      },
      /* From: https://github.roving.com/ES/auth-platform/blob/development/auth-platform-webapp/app/assets/javascripts/modules/galileo-init.js.coffee.erb#L49 */
      createXhr: function () {
        /**
         * The build proxied url.
         */
        var buildProxiedUrl, xdr, xhr, _xhrOpen;
        /**
         * @param url
         */
        buildProxiedUrl = function (url) {
          if (!isLocalhost(url)) {
            return "https://auth-platform.d1.constantcontact.com/cors_light/proxy?asset_url=" + url + "&referrer_url=" + window.location.origin;
          }
          return url;
        };
        if (window.XDomainRequest) {
          xdr = new XDomainRequest();
          xhr = {
            open: function (method, url) {
              url = buildProxiedUrl(url);
              xdr.open(method, url, true);
              xdr.onload = function () {
                xhr.readyState = 4;
                xhr.responseText = xdr.responseText;
                return xhr.onreadystatechange();
              };
              xdr.onerror = function () {
                throw "Error loading " + url + " with requireJS text plugin.";
              };
              xdr.onprogress = function () {};
              return xdr.ontimeout = function () {
                throw "Timeout loading " + url + " with requireJS text plugin.";
              };
            },
            send: function () {
              return setTimeout(function () {
                return xdr.send(null);
              }, 0);
            }
          };
        } else {
          xhr = new XMLHttpRequest();
          _xhrOpen = xhr.open;
          /**
           * @param method
           * @param url
           */
          xhr.open = function (method, url) {
            return _xhrOpen.call(xhr, method, buildProxiedUrl(url), true);
          };
        }
        return xhr;
      }
    }
  },
  waitSeconds: 15
}