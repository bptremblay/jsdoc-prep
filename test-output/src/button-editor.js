//fixed constructor order in class
$(define([
  'jquery',
  'underscore',
  'backbone',
  'template-engine',
  'galileo-lib/modules/events',
  'galileo-lib/modules/services/descriptors/content/button-content-descriptor',
  'button-editor-path/delete-atomic-content',
  'button-editor-path/state-migrations',
  'button-editor-path/button-model',
  'button-editor-path/button-view',
  'button-editor-path/button-editor-view',
  'button-editor-path/editor-model',
  'button-editor-path/legacy-color-check',
  'toolbar',
  'text!button-editor-path/tmpl/button.html',
  'i18n!button-editor-path/nls/button-editor',
  'text!button-editor-path/tmpl/content-decorator.html',
  'button-editor-path/lib/change-element-type.jquery',
  'css!button-editor-path/css/button-editor'
], function ($, _, Backbone, Mustache, galileoEvents, ButtonContentDescriptor, deleteAtomicContent, stateMigrations,
  ButtonModel, ButtonView, ButtonEditorView, ButtonEditorModel, legacyColorCheck, toolbar,
  buttonTemplate, i18n, contentDecorator) {
  /**
   * The button editor view.
   * @type {object}
   */
  let buttonEditorView = null;
  galileoEvents.on(galileoEvents.TYPES.EDITOR_REINIT, () => buttonEditorView = null);
  /**
   * @param html
   */
  let scrapeStyleFromHTML = function (html) {
    /**
     * The falsy defaults.
     */
    let falsyDefaults = (obj, defaults) =>
      (() => {
        /**
         * The result.
         */
        let result = [];
        for (let key of Object.keys(defaults)) {
          /**
           * The value.
           */
          let value = defaults[key];
          /**
           * The item.
           */
          let item;
          if (value && !obj[key]) {
            item = obj[key] = defaults[key];
          }
          result.push(item);
        }
        return result;
      })();
    /**
     * @param string
     */
    let stripQuotes = function (string) {
      /**
       * The quote regex.
       * @type {object}
       */
      let quoteRegex = /['"]([^']*)['"]/;
      /**
       * The matches.
       */
      let matches = quoteRegex.exec(string);
      if (matches != null) {
        return matches[1];
      } else {
        return string;
      }
    };
    /**
     * @param o
     */
    let styleObject = function (o) {
      /**
       * The retval.
       */
      let retval = {};
      for (let pair of o.cssText.split(/;\s?/)) {
        /**
         * The ?.
         */
        let [key, value] = pair.split(/:\s?/);
        if ((key != null) && (value != null)) {
          key = `${key}`;
          retval[key] = value;
        }
      }
      return retval;
    };
    /**
     * The $el.
     */
    let $el = $(html);
    /**
     * The el.
     */
    let el = $el[0];
    /**
     * The style.
     */
    let style = _.extend({}, styleObject(el.style));
    for (var key of Object.keys(style)) {
      /**
       * The value.
       */
      let value = style[key];
      style[key] = stripQuotes(value);
    }
    $el.find('[style]').each(function () {
      falsyDefaults(style, styleObject(this.style));
      return (() => {
        /**
         * The result.
         */
        let result = [];
        for (key of Object.keys(style)) {
          /**
           * The value.
           */
          let value = style[key];
          result.push(style[key] = stripQuotes(value));
        }
        return result;
      })();
    });
    return style;
  };
  /**
   * The find text.
   */
  let findText = markup => $('.MainTextFullWidth', markup).text();
  // A way that wouldn't depend on how the markup is written but doesn't
  // seem to work in some situations:
  // textNodeFilter = -> @nodeType is 3
  // @$el.contents().filter(textNodeFilter).parent()
  /**
   * The class ButtonEditor.
   */
  class ButtonEditor {
    static initClass() {
        this.prototype.$ = Backbone.View.prototype.$;
      }
      /**
       * @constructor
       * @param layoutEditor
       * @param config
       */
    constructor(layoutEditor, config) {
        this._cleanup = this._cleanup.bind(this);
        this.renderForPublish = this.renderForPublish.bind(this);
        this.init = this.init.bind(this);
        this._stateUpdated = this._stateUpdated.bind(this);
        this.layoutEditor = layoutEditor;
        this.config = config;
        this.events = _.extend({}, Backbone.Events);
        this.buttonModel = new ButtonModel(this.state);
        this.model = new ButtonEditorModel(this.state);
        this.buttonView = new ButtonView({
          model: this.buttonModel,
          editorModel: this.model,
          editor: this,
          contentMovable: this.config.featureSupport.contentMove,
          descriptorProviderFn: this.config.descriptorProviderFn
        });
        Backbone.listenTo(this.model, 'change:doneWasClicked', () => {
          toolbar.hide();
          return this.model.doneWasClicked(false);
        });
        // For some unknown reason using `Backbone.listenTo` wasn't working
        // here, so using `Model::on` instead.
        // Backbone.listenTo @buttonModel, 'change', @_stateUpdated
        this.buttonModel.on('change', this._stateUpdated, this);
        galileoEvents.on(galileoEvents.TYPES.EDITOR_REINIT, this._cleanup);
        // VN-3024: Backbone will trigger a change event for each field updated,
        // debounce the stateUpdated event handler to group changes into a single
        // state change
        this._lazyUpdate = _.debounce(function () {
          return this.config.eventHandlers.stateUpdated(this);
        }, 10, true);
        Backbone.listenTo(this.buttonModel, 'change:alignment', () => {
          // This needs to be deferred because the button view needs to be re-rendered
          // before updating the toolbar, or else the toolbar will be rendered in
          // the previous (incorrect) location.
          if (toolbar.getToolbar().is(':visible')) {
            return _.defer(() => {
              return toolbar.updateAndShow(this.buttonView.$el, 'button-editor-tools', 'button tools');
            });
          }
        });
        // Prevent toolbar from closing when user clicks on the color picker
        // by adding the color picker to what the toolbar considers part of
        // itself.
        toolbar.registerToolbarEventCondition(function (evt) {
          /**
           * The click target.
           */
          let clickTarget = evt.originalEvent.target;
          return $(clickTarget).closest('#colorPicker').length;
        });
      }
      /**
       * @private 
       */
    _cleanup() {
        galileoEvents.off(galileoEvents.TYPES.EDITOR_REINIT, this._cleanup);
        this.buttonView.editor = null;
        this.buttonModel.off();
        return Backbone.stopListening(this.model);
      }
      /**
       * @param contentDescriptor
       */
    static createMarkup(contentDescriptor) {
        return Mustache.render(buttonTemplate, contentDescriptor);
      }
      /**
       * @return {array}
       */
    static getContentDescriptors() {
        return [
          new ButtonContentDescriptor({
            thumbnailUrl: require.toUrl('button-editor-path/img/button.svg'),
            payload: {
              text: i18n.placeholder_text
            }
          })
        ];
      }
      /**
       * @param contentId
       */
    static getContentDecorators(contentId) {
        /**
         * The deco prop name.
         */
        let decoPropName = contentId + '!' + contentId;
        // pull this in from an external file (module)
        /**
         * The result.
         */
        let result = {};
        result[decoPropName] = {
          fromEditor: true,
          version: '1.1.0',
          markup: contentDecorator
        };
        return result;
      }
      // Returns the content display element for the editor,
      // wrapped in the expected object.
      // @return [Array] An array of content decorators.
    static getContentDisplayElement() {
      /**
       * The result.
       */
      let result = {
        fromEditor: true,
        version: '1.0.0',
        markup: buttonTemplate
      };
      return result;
    }
    getStateVersion() {
      return {
        major: 1,
        minor: 2,
        patch: 0
      };
    }
    getStateMigrations() {
      return stateMigrations;
    }
    renderForEdit() {
      return this.$el;
    }
    renderForPublish() {
      /**
       * The $html.
       */
      let $html = this.$el.clone();
      $html.find('[data-gl-remove-on-publish]').remove();
      $html.find('.MainTextFullWidth > div')
        .attr({
          'href': this.buttonModel.get('link') || '#',
          'data-original-href': this.buttonModel.get('link'),
          'contentEditable': false
        })
        .changeElementType('a');
      // auth-platform will reject the document if it contains &quot;
      // Some browsers (Chrome, Firefox) will change this to a " which
      // will also be rejected by auth-platform.
      // change them to single quotes (this will be for the font-family)
      return $html[0].outerHTML.replace(/&quot;/g, '');
    }
    setStyles() {}
    getState() {
        return _.extend(this.state, this.model.toJSON(), this.buttonModel.toJSON());
      }
      /**
       * @param state
       */
    setState(state) {
      this.state = _.extend(this.createState(), state);
      this.buttonModel.set(state, {
        changedByGalileo: true
      });
      return undefined;
    }
    init() {
        this.$el = Backbone.$(this.state.markup);
        this.$el.attr('data-editor-name', this._getName());
        /**
         * The original href.
         */
        let originalHref = this.$el.find('[href]').attr('href');
        this.hasEditableURL = __guard__(originalHref, x => x.indexOf('${')) === -1;
        if (!this.hasEditableURL) {
          this.buttonModel.setLink(originalHref, {
            noProtocol: true,
            changedByGalileo: true
          });
        }
        /**
         * The $button.
         */
        let $button = this.$el.find('table');
        if (buttonEditorView == null) {
          this._setupToolbar();
        }
        this.buttonEditorView = buttonEditorView;
        this.buttonView.setElement($button).render();
        return this.buttonView.$el.on('click', () => {
          buttonEditorView.setButtonView(this.buttonView);
          buttonEditorView.setModel(this.model);
          buttonEditorView.setButtonModel(this.buttonModel);
          buttonEditorView.setEditor(this);
          buttonEditorView.update();
          toolbar.updateAndShow(this.buttonView.$el, 'button-editor-tools', 'button tools');
          return this._setupDeleteAtomicContent();
        });
      }
      /**
       * @param type
       * @param data
       */
    receiveMessage(type, data) {}
    activate() {}
    deactivate() {
      return toolbar.hide();
    }
    destroy() {}
      /**
       * @param $hovered
       */
    getDefaultColorId($hovered) {
        // determine if we're changing the text color or the bg color
        /**
         * The color id.
         */
        let colorId = $hovered.data('style-color');
        if (colorId == null) {
          colorId = this.$el.find('[data-style-background-color]').data('style-background-color');
        }
        return colorId.toLowerCase();
      }
      /**
       * @param colors
       * @param preview
       * @return {boolean}
       */
    applyColors(colors, preview) {
        if (this.buttonModel.usingLocalColors()) {
          return true;
        }
        if (!legacyColorCheck.usesLegacyGlobalColors($(this.buttonModel.get('markup')))) {
          return true;
        }
        // Other wise, apply global colors using this legacy behavior
        /**
         * The get.
         */
        let get = cssColorProperty => {
          /**
           * The key.
           */
          let key = __guard__($('<div>').append(this.state.markup)
            .find(`[data-style-${cssColorProperty}]`)
            .data(`style-${cssColorProperty}`), x => x.toLowerCase());
          return colors[key];
        };
        if (!preview) {
          if (get('background-color') != null) {
            this.buttonModel.setGlobalBackgroundColor(get('background-color'), {
              changedByGalileo: true
            });
          }
          if (get('color') != null) {
            this.buttonModel.fontColor(get('color'), {
              changedByGalileo: true
            });
          }
        }
        return false;
      }
      /**
       * @private 
       */
    _setupDeleteAtomicContent() {
        return this.buttonEditorView.setupDeleteAtomicContent(deleteAtomicContent, galileoEvents, this.layoutEditor, this._getName());
      }
      /**
       * @private 
       */
    _setupToolbar() {
        buttonEditorView = new ButtonEditorView({
          model: this.model,
          buttonModel: this.buttonModel,
          hasEditableURL: this.hasEditableURL,
          atomicDelete: this._atomicDelete(this.config)
        });
        return buttonEditorView.setElement(toolbar.getTools('button-editor-tools', '')).render();
      }
      // Determines if atomic delete functionality should be enabled.
      //
      // @return [boolean] true if the editor config's featureSupport.contentDeletion flag is set to true;
      //                   false if it is set to false or if featureSupport does not contain a
      //                   contentDeletion flag
      /**
       * @private 
       * @return {boolean}
       */
    _atomicDelete() {
        return __guard__(this.config.featureSupport, x => x.contentDeletion) || false;
      }
      /**
       * @private 
       * @param model
       * @param options
       */
    _stateUpdated(model, options) {
      if (!__guard__(options, x => x.changedByGalileo)) {
        return this._lazyUpdate(this);
      }
    }
  }
  ButtonEditor.initClass();
  /**
   * @param markup
   * @param name
   */
  ButtonEditor.import = function (markup, name) {
    /**
     * The style.
     */
    let style = scrapeStyleFromHTML(markup);
    /**
     * The state.
     */
    let state = {
      markup,
      color: style['background-color'],
      fontColor: style['color'] || '',
      fontFamily: style['font-family'] || '',
      fontSize: __guard__(style['font-size'], x => x.replace('px', '')) || '',
      text: findText(markup)
    };
    /**
     * The $button.
     */
    let $button = $(markup);
    /**
     * The markup alignment.
     */
    let markupAlignment = $button.find('td:first').attr('align');
    if (markupAlignment) {
      state.alignment = markupAlignment;
    }
    return $.Deferred().resolve(state).promise();
  };
  return ButtonEditor;
}));
/**
 * @private 
 * @param value
 * @param transform
 * @return {object} ConditionalExpression
 */
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}