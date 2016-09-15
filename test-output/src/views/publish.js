define(['jquery', 'backbone', 'galileo-lib/modules/managers/error-manager', 'column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/views/publish
   * @requires jquery
   * @requires backbone
   * @requires galileo-lib/modules/managers/error-manager
   * @requires column-and-block-layout-editor-path/constants
   * @requires underscore
   */
  function ($, Backbone, errorManager, constants) {
    /**
     * The publish view.
     */
    var PublishView;
    return PublishView = ( /**@lends module:src/views/publish~PublishView# */ function (superClass) {
      extend(PublishView, superClass);
      /**
       * @constructor
       */
      function PublishView() {
        return PublishView.__super__.constructor.apply(this, arguments);
      }
      /**
       * @todo Add some jsDoc comments here!
       */
      PublishView.prototype._containerMarkup = function () {
        /**
         * The $container.
         */
        var $container;
        $container = this._removeUnpublishableElements(this.$el.clone());
        return $container.prop('outerHTML');
      };
      /**
       * @param $container
       */
      PublishView.prototype._removeUnpublishableElements = function ($container) {
        $container.find(constants.SELECTORS.REMOVE_ON_PUBLISH).remove();
        return $container;
      };
      /**
       * @return {Boolean}
       */
      PublishView.prototype._render = function () {
        /**
         * The callback.
         */
        var callback, deferreds, e, editor, output;
        deferreds = (function () {
          /**
           * The i.
           */
          var i, len, ref, results;
          ref = this.model.getContentEditors();
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            editor = ref[i];
            output = (function () {
              /**
               * The error.
               */
              var error;
              try {
                return editor.renderForPublish() || '';
              } catch (error) {
                e = error;
                e.message = "Couldn't render content for " + editor.name + " - " + e.message;
                errorManager.error(e);
                return null;
              }
            })();
            /**
             * @param editor
             * @param content
             */
            callback = function (editor, content) {
              return $.Deferred().resolve({
                editor: editor,
                content: content
              });
            };
            results.push($.when(output).then(callback.bind(this, editor)));
          }
          return results;
        }).call(this);
        return $.when.apply(this, deferreds).then(((function (_this) {
          return function () {
            /**
             * The $markup to replace.
             */
            var $markupToReplace, $published, arg, i, len;
            $published = $(_this._containerMarkup());
            for (i = 0, len = arguments.length; i < len; i++) {
              arg = arguments[i];
              $markupToReplace = $published.find("[data-editor-name='" + arg.editor.name + "']");
              if ($markupToReplace.length) {
                $markupToReplace.replaceWith(arg.content);
              } else {
                errorManager.error(new Error("Failed to render document: could not find an editor with the name " + arg.editor.name));
                if (typeof console !== "undefined" && console !== null) {
                  if (typeof console.error === "function") {
                    console.error('Layout Markup: ', $published.prop('outerHTML'));
                  }
                }
                return $.Deferred().reject();
              }
            }
            return $published.appendTo('<p>').parent().html();
          };
        })(this)), function (message) {
          return errorManager.error(new Error("Failed to render document: " + message));
        });
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      PublishView.prototype._onElementCreated = function () {
        return this.setElement(this.editView.el);
      };
      /**
       * @param opts
       */
      PublishView.prototype.initialize = function (opts) {
        this.editView = opts.editView;
        return this.editView.on(constants.EVENTS.ELEMENT_CREATED, this._onElementCreated, this);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      PublishView.prototype.render = function () {
        if (this.model.isLayoutIncluded()) {
          return this._render();
        } else {
          return '';
        }
      };
      return PublishView;
    })(Backbone.View);
  });