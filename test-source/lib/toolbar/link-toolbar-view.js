(function() {
  /**
   * @param fn
   * @param me
   * @return {Function}
   */
  var bind = function(fn, me) {
      return function() {
        return fn.apply(me, arguments);
      };
    },
    /**
     * @param child
     * @param parent
     */
    extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      /**
       * @function
       */
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  define(['jquery', 'underscore', 'backbone', 'text!root/templates/link-toolbar.html', 'template-engine', 'i18n!galileo-lib/modules/nls/engine', 'galileo-lib/modules/services/usage-tracking'],

    /**
     * @exports src/lib/toolbar/link-toolbar-view
     * @requires jquery
     * @requires underscore
     * @requires backbone
     * @requires text!root/templates/link-toolbar.html
     * @requires template-engine
     * @requires i18n!galileo-lib/modules/nls/engine
     * @requires galileo-lib/modules/services/usage-tracking
     */
    function($, _, Backbone, template, mustache, i18n, usageTracking) {
      var LinkToolbarView;
      return LinkToolbarView = (function(superClass) {
        var preserveInputStateDecorator;
        extend(LinkToolbarView, superClass);
        /**
         * @constructor
         */
        function LinkToolbarView() {
          this._removeLink = bind(this._removeLink, this);
          this.testInput = bind(this.testInput, this);
          this._updateModelURI = bind(this._updateModelURI, this);
          return LinkToolbarView.__super__.constructor.apply(this, arguments);
        }
        /**
         * @param method
         * @return {Function}
         */
        preserveInputStateDecorator = function(method) {
          return function() {
            var args, end, input, length, lengthDiff, start;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            input = this.ui.uriInput.get(0);
            start = typeof input.selectionStart === 'number' ? input.selectionStart : void 0;
            end = typeof input.selectionEnd === 'number' ? input.selectionEnd : void 0;
            length = input.value.length;
            method.apply(this, args);
            if ((start != null) && (end != null)) {
              lengthDiff = input.value.length - length;
              input.selectionStart = start + lengthDiff;
              return input.selectionEnd = end + lengthDiff;
            }
          };
        };
        LinkToolbarView.prototype._updateDomDelayShort = 200;
        LinkToolbarView.prototype._updateDomDelayLong = 1000;
        LinkToolbarView.prototype.className = 'link-properties insert-link editor-button toolbar-row left';
        /**
         * @param options1
         */
        LinkToolbarView.prototype.initialize = function(options1) {
          this.options = options1;
          return this.listenTo(this.model, 'change', (function(_this) {
            return function(model, event) {
              return _this.updateDOM(_this.model.changed, event);
            };
          })(this));
        };
        LinkToolbarView.prototype.events = {
          'focusout input': '_onLeaveInput',
          'click [data-js=link-toolbar-test-button]': function(event) {
            event.preventDefault();
            return this.testInput();
          },
          'click [data-js=link-toolbar-remove-button]': function(event) {
            event.preventDefault();
            return this._removeLink();
          },
          'submit': '_killEvent',
          'keyup input': '_onChangeInput'
        };
        /**
         * @private 
         * @param event
         * @return {Boolean}
         */
        LinkToolbarView.prototype._killEvent = function(event) {
          if (typeof event.preventDefault === "function") {
            event.preventDefault();
          }
          if (typeof event.stopImmediatePropagation === "function") {
            event.stopImmediatePropagation();
          }
          return false;
        };
        /**
         * @private 
         * @param event
         * @return {Object} ConditionalExpression
         */
        LinkToolbarView.prototype._onChangeInput = function(event) {
          var ref;
          if ((event.keyCode || event.which || event.charCode) === 13) {
            this._killEvent(event);
            this._updateModelURI();
            return (ref = this.options.onEnterInput) != null ? ref.call(this, event) : void 0;
          } else {
            if (this.model.uri() !== this.ui.uriInput.val()) {
              return this._updateModelURI();
            }
          }
        };
        /**
         * @private 
         * @param event
         */
        LinkToolbarView.prototype._onLeaveInput = function(event) {
          return this.updateDOM(null, {
            fromLinkToolbarView: true
          });
        };
        LinkToolbarView.prototype.updateDOM = (function() {
          var updateDOMTimeout;
          updateDOMTimeout = null;
          return function(data, event) {
            var showErrorFeedback, updateDOMDelay, uri;
            if (data == null) {
              data = this.model.toJSON();
            }
            if (event == null) {
              event = {};
            }
            uri = data.uri;
            showErrorFeedback = event.showErrorFeedback || (event.showErrorFeedback == null) && !this.model.isValidURI(uri);
            if (!(uri > '')) {
              this.ui.testLinkButton.hide();
            }
            if (!showErrorFeedback) {
              this.ui.uriInputContainer.removeClass('error');
              this._updateURILabel();
            }
            if (event.fromLinkToolbarView) {
              updateDOMDelay = this._updateDomDelayLong;
            } else {
              updateDOMDelay = this._updateDomDelayShort;
            }
            clearTimeout(updateDOMTimeout);
            updateDOMTimeout = setTimeout((function(_this) {
              return function() {
                if (showErrorFeedback) {
                  _this.ui.uriInputContainer.addClass('error');
                } else if (uri > '') {
                  _this.ui.testLinkButton.show();
                }
                if (_this.ui.uriInput.val() !== uri) {
                  return preserveInputStateDecorator(function() {
                    return _this.ui.uriInput.val(uri || '');
                  }).call(_this);
                }
              };
            })(this), updateDOMDelay);
            return this;
          };
        })();
        /**
         * @private 
         */
        LinkToolbarView.prototype._updateURILabel = function() {
          if (this.model.uriScheme() === 'mailto') {
            return this.ui.uriTypeLabel.text(i18n['link_type_label_email']);
          } else {
            return this.ui.uriTypeLabel.text(i18n['link_type_label_webpage']);
          }
        };
        /**
         * @private 
         * @param options
         */
        LinkToolbarView.prototype._updateModelURI = function(options) {
          return this.model.uri(this.ui.uriInput.val(), $.extend({}, options, {
            fromLinkToolbarView: true
          }));
        };
        /**
         * @param options
         * @return {Function}
         */
        LinkToolbarView.prototype.render = function(options) {
          if (options == null) {
            options = {};
          }
          this.$el.html(mustache.render(template, _.extend(this.model.toJSON(), {
            nls: i18n
          })));
          this.ui = {
            uriInput: this._placeholderShim((function(_this) {
              return function() {
                var $input;
                $input = _this.$('[data-js=link-toolbar-input]');
                if (_this.options.forcePlaceholderShim) {
                  delete $input.get(0).placeholder;
                }
                return $input;
              };
            })(this)()),
            uriInputContainer: this.$('[data-js=link-toolbar-input-container]'),
            testLinkButton: this.$('[data-js=link-toolbar-test-button]'),
            removeLinkbutton: this.$('[data-js=link-toolbar-remove-button]'),
            uriTypeLabel: this.$('label[for=link-href]')
          };
          this.updateDOM(null, options);
          return this;
        };
        LinkToolbarView.prototype.focus = preserveInputStateDecorator(function() {
          var base;
          return typeof(base = this.ui.uriInput.focus()).clearPlaceholder === "function" ? base.clearPlaceholder() : void 0;
        });
        /**
         * @function
         */
        LinkToolbarView.prototype.testInput = function() {
          var options;
          if (this.model.isValidURI()) {
            options = {
              block_name: 'Aloha Text Editor'
            };
            usageTracking.track('link_test', options);
            return window.open(this.model.uri(), '', 'width=800,height=600');
          }
        };
        /**
         * @private 
         */
        LinkToolbarView.prototype._removeLink = function() {
          this.ui.uriInput.val('');
          return this._updateModelURI({
            removeLink: true
          });
        };
        /**
         * @private 
         * @param $o
         */
        LinkToolbarView.prototype._placeholderShim = function($o) {
          var originalMethod;
          if (!('placeholder' in ($o.get(0) || {}))) {
            originalMethod = _.bind($o.val, $o);
            /**
             * @function
             */
            $o.clearPlaceholder = function() {
              if (originalMethod() === $o.attr('placeholder')) {
                return originalMethod('');
              }
            };
            $o.on('focusin focus click', $o.clearPlaceholder);
            $o.on('focusout', function() {
              if (originalMethod() === '') {
                return originalMethod($o.attr('placeholder'));
              }
            });
            /**
             * @param value
             */
            $o.val = function(value) {
              if (value != null) {
                if (value === '') {
                  return originalMethod($o.attr('placeholder'));
                } else {
                  return originalMethod(value);
                }
              } else {
                value = originalMethod();
                if (value !== $o.attr('placeholder')) {
                  return value;
                } else {
                  return '';
                }
              }
            };
            originalMethod($o.attr('placeholder'));
          }
          return $o;
        };
        return LinkToolbarView;
      })(Backbone.View);
    });
}).call(this);
