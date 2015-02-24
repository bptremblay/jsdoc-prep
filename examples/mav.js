define(
  /**
   * @exports mvc/mav
   * @requires blue/is
   * @requires blue/view
   * @requires blue/observable
   * @requires blue/declare
   * @requires blue/with/viewResolution
   * @requires ../deferred
   */
  function (require) {
    var is = require('blue/is'),
      View = require('blue/view'),
      observable = require('blue/observable');
    return require('blue/declare')( /** @lends module:mvc/mav~ModelAndView# */ {
      /**
       * @constructor module:mvc/mav~ModelAndView
       * @param {String|View} [view] The optional view name or view instance. If not provided, it assumed it will be provided by resolving the model.
       * @param {Promise|PlainObject|Model} model The data or promise of data.
       */
      constructor: function ModelAndView(view, model) {
        require('blue/with/viewResolution').call(this);
        // Assume this is a model promise and that the view or viewName will be given when that promise resolves.
        if (is.thenable(view) && is.undefined(model)) {
          model = view;
          view = undefined;
        }
        this.hasModel = false;
        this.hasView = false;
        /**
         * @member {View} module:mvc/mav#view
         */
        this.view = undefined;
        /**
         * @member {Model} module:mvc/mav#model
         */
        this.model = undefined;
        /**
         * @member {String}
         */
        this.viewName = undefined;
        view && this.setView(view);
        this.setModel(model);
        /**
         * @member {Deferred}
         */
        this.resolving = new(require('../deferred'))();
        /**
         * @member {Promise}
         */
        this.resolved = this.resolving.promise;
      },
      /**
       * @function
       */
      resolve: function () {
        if (this.isReady()) {
          this.resolving.resolve([this.view, this.model]);
        }
      },
      /**
       * @function
       * @param {Promise|PlainObject|Model} model
       */
      setModel: function (model) {
        var modelResolved;
        if (!is.thenable(model)) {
          model = Promise.resolve(model);
        }
        modelResolved = model.then(function (mav) {
          var model;
          // view and model returned
          if (is.array(mav)) {
            model = mav[1];
            this.setView(mav[0]);
            // model returned
          } else {
            model = mav;
          }
          this.model = model;
          this.hasModel = true;
          this.resolve();
        }.bind(this));
      },
      /**
       * @function
       * @param {String|View} view
       */
      setView: function (view) {
        var viewResolved;
        // A view name given
        if (is.string(view)) {
          this.viewName = view;
          viewResolved = this.resolveView(this.viewName);
          // A view instance given
        } else {
          viewResolved = observable.once(view); //Promise.resolve( view );
        }
        viewResolved.onValue(function (view) {
          // require logger
          // logger.info( 'viewResolved.onValue view = ', view );
          if (!!(view && is['function'](view.replaceIn) && is['function'](view.appendTo))) {
            this.view = view;
          } else {
            this.view = new View(view);
          }
          this.hasView = true;
          this.resolve();
        }.bind(this));
      },
      /**
       * @function
       * @return {Boolean} Whether or not the ModelAndView has been resolved, i.e. it contains both a model and view instance.
       */
      isReady: function () {
        return this.hasModel && this.hasView;
      },
      // Support IE logging
      /**
       * @return {String}
       */
      toString: function () {
        return ' MAV ';
      }
    });
  });