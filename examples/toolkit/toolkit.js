/**
 * @author btremblay
 */

YUI().add(
    'toolkit',
    function(Y) {
      'use strict';
      $(function() {
        Y.myStuff = Y.myStuff != null ? Y.myStuff : {};
        Y.myStuff.yui = true;

        var special = {
          /** @type {string} email address associated with the address */
          email_address : null,
          /** @type {string} first name */
          first_name : ''
        };

        /**
         * The internal reference to the Singleton instance.
         * 
         * @private
         */
        var instance = null;

        var foo = require('poc-amd-module');
        Y.Logger
            .info('YUI module called require() and got data from AMD module: '
                + foo.foo);

        /**
         * Create a new Toolkit.
         * 
         * @method
         * @constructor
         * @return {ToolKit}
         */
        function ToolKit() {
        }

        ToolKit.prototype.init = function() {
          return false;
        };

        /**
         * Get instance.
         * 
         * @method getInstance
         * @private
         * @return {ToolKit}
         */

        function getInstance() {
          if (instance === null) {
            instance = new ToolKit();
            instance.init();
          }

          return instance;
        }

        Y.ToolKit = getInstance();
      }); // on - domready
    }, '0.0.1', {
      requires : [ 'wf-logger' ]
    });
