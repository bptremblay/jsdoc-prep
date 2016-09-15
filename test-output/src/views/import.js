define(['jquery', 'backbone', 'template-engine', 'galileo-lib/modules/managers/error-manager', 'column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/views/import
   * @requires jquery
   * @requires backbone
   * @requires template-engine
   * @requires galileo-lib/modules/managers/error-manager
   * @requires column-and-block-layout-editor-path/constants
   * @requires underscore
   */
  function ($, Backbone, mustache, errorManager,
    constants) {
    /**
     * The import view.
     */
    var ImportView;
    return ImportView = ( /**@lends module:src/views/import~ImportView# */ function (superClass) {
      extend(ImportView, superClass);
      /**
       * @constructor
       */
      function ImportView() {
        return ImportView.__super__.constructor.apply(this, arguments);
      }
      /**
       * @todo Add some jsDoc comments here!
       */
      ImportView.prototype._containerMarkup = function () {
        return $('<div/>').append(this.$el.clone()).html();
      };
      /**
       * @param $layout
       */
      ImportView.prototype._removeActivationAttributes = function ($layout) {
        return $layout.find('.editable-active').removeClass('editable-active').end().removeClass('layout-active layout-hover layout-tools-hover');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ImportView.prototype._onElementCreated = function () {
        return this.setElement(this.editView.el);
      };
      /**
       * @param opts
       */
      ImportView.prototype.initialize = function (opts) {
        this.editView = opts.editView;
        return this.editView.on(constants.EVENTS.ELEMENT_CREATED, this._onElementCreated, this);
      };
      /**
       * @return {Boolean}
       */
      ImportView.prototype.render = function () {
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
                return editor.renderForImport() || '';
              } catch (error) {
                e = error;
                errorManager.error("Couldn't render content for " + editor.name);
                return null;
              }
            })();
            /**
             * @param editor
             * @param content
             */
            callback = function (editor, content) {
              return {
                editor: editor,
                content: content
              };
            };
            results.push($.when(output).then(callback.bind(this, editor)));
          }
          return results;
        }).call(this);
        return $.when.apply(this, deferreds).then(((function (_this) {
          return function () {
            /**
             * The $published.
             */
            var $published, arg, i, len;
            $published = $(_this._containerMarkup());
            $published.removeAttr('data-layout-addable');
            for (i = 0, len = arguments.length; i < len; i++) {
              arg = arguments[i];
              $published.find("[data-editor-name='" + arg.editor.name + "']").closest('[data-content-editor-instance-id]').replaceWith(arg.content);
            }
            return _this._removeActivationAttributes($published).appendTo('<p>').parent().html();
          };
        })(this)), function (message) {
          return errorManager.error("Failed to render document: " + message);
        });
      };
      return ImportView;
    })(Backbone.View);
  });