/**
 * @module button-view
 * @exports ButtonView
 * @requires underscore
 * @requires button-editor-path/button-model
 * @requires button-editor-path/move-handle-view
 * @requires backbone
 * @requires button-editor-path/lib/change-element-type.jquery
 */
import _ from 'underscore';
import ButtonModel from 'button-editor-path/button-model';
import MoveHandleView from 'button-editor-path/move-handle-view';
import Backbone from 'backbone';
import 'button-editor-path/lib/change-element-type.jquery';
/**
 * The key code tab.
 * @type {Number}
 */
let KEY_CODE_TAB = 9;
/**
 * The key code end.
 * @type {Number}
 */
let KEY_CODE_END = 35;
/**
 * The key code home.
 * @type {Number}
 */
let KEY_CODE_HOME = 36;
/**
 * The key code up.
 * @type {Number}
 */
let KEY_CODE_UP = 38;
/**
 * The key code down.
 * @type {Number}
 */
let KEY_CODE_DOWN = 40;
/**
 * The key code insert.
 * @type {Number}
 */
let KEY_CODE_INSERT = 45;
/**
 * The key code b.
 * @type {Number}
 */
let KEY_CODE_B = 66;
/**
 * The key code i.
 * @type {Number}
 */
let KEY_CODE_I = 73;
if (typeof _ === 'undefined' || _ === null) {
  ({
    _
  } = window);
}
$.fn.stripHTML = function () {
  return this.html(this.text());
};
/**
 * The class ButtonView.
 * @extends Backbone.View
 */
class ButtonView extends Backbone.View {
  /**
   * @constructor
   * @param undefined
   */
  constructor(...args) {
    super(...args);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.saveText = this.saveText.bind(this);
    this.update = this.update.bind(this);
    this.highlightBlock = this.highlightBlock.bind(this);
  }
  static initClass() {
      this.prototype.events = {
        'focusout': 'deactivate'
      };
    }
    /**
     * @param params
     */
  initialize(params) {
    this.editor = params.editor;
    this.contentMovable = params.contentMovable;
    this.descriptorProviderFn = params.descriptorProviderFn;
    Backbone.listenTo(this.model, 'change', this.update);
    return Backbone.listenTo(this.editor.events, 'highlight-block', this.highlightBlock);
  }
  deactivate() {
      if (this.editableContent().length === 0) {
        return this.editableContent(ButtonModel.prototype.defaults.text);
      }
    }
    /**
     * @param e
     */
  onPossibleTextChange(e) {
      if (e.type === 'paste') {
        return $(e.target).stripHTML();
      }
    }
    /**
     * @param e
     */
  onKeyDown(e) {
      /**
       * The is meta key.
       */
      let isMetaKey = keyCode => [
        KEY_CODE_TAB,
        KEY_CODE_END,
        KEY_CODE_HOME,
        KEY_CODE_UP,
        KEY_CODE_DOWN,
        KEY_CODE_INSERT
      ].includes(keyCode);
      this.preventSystemFormatting(e);
      if (this.isBoldAccelerator(e)) {
        this.model.toggleBold();
        return this.findTextContainer().focus();
      } else if (this.isItalicAccelerator(e)) {
        this.model.toggleItalic();
        return this.findTextContainer().focus();
      } else if (isMetaKey(e.keyCode)) {
        e.preventDefault();
        e.returnValue = false; // Thanks, IE
        return false;
      }
    }
    /**
     * Returns true if is bold accelerator.
     * @param e
     * @return {Object} boolean
     */
  isBoldAccelerator(e) {
      return this.isAccelerator(e) && e.keyCode === KEY_CODE_B;
    }
    /**
     * Returns true if is italic accelerator.
     * @param e
     * @return {Object} boolean
     */
  isItalicAccelerator(e) {
      return this.isAccelerator(e) && e.keyCode === KEY_CODE_I;
    }
    /**
     * Returns true if is accelerator.
     * @param e
     * @return {Object} boolean
     */
  isAccelerator(e) {
      return e.ctrlKey || e.metaKey;
    }
    // The system bold and italic functions only operate on the
    // selected text, similar to how the text editor works. In the case
    // of button, we want the formatting to apply across the entire button text.
    /**
     * @param e
     */
  preventSystemFormatting(e) {
    if (this.isBoldAccelerator(e) || this.isItalicAccelerator(e)) {
      return e.preventDefault();
    }
  }
  saveText() {
      /**
       * The new text.
       */
      let newText = this.editableContent();
      if (newText !== this.model.text()) {
        return this.model.text(newText);
      }
    }
    /**
     * @param val
     */
  editableContent(val) {
      if (val != null) {
        return this.findTextContainer().text(val);
      } else {
        return this.findTextContainer().text();
      }
    }
    /**
     * @param model
     * @param options
     */
  update(model, options) {
      /**
       * The ?.
       */
      let {
        changed
      } = this.model;
      if (__guard__(options, x => x.changedByGalileo) ||
        (changed.text == null)) {
        return this.render();
      }
    }
    /**
     * @return {Object} ThisExpression
     */
  render() {
      /**
       * The json.
       */
      let json = this.model.toJSON();
      /**
       * The button text.
       */
      let buttonText = _.escape(json.text).trim();
      this.$el.css({
        'background-color': this.model.getBackgroundColor()
      });
      this.$el.parent().attr('align', json.alignment);
      /**
       * The text style object.
       */
      let textStyleObject = {};
      /**
       * The $text container.
       */
      let $textContainer = this.findTextContainer();
      textStyleObject['color'] = json.fontColor;
      textStyleObject['font-size'] = json.fontSize ? `${json.fontSize}px` : '';
      textStyleObject['font-family'] = json.fontFamily;
      textStyleObject['font-weight'] = json.fontWeight;
      textStyleObject['font-style'] = json.fontStyle;
      $textContainer.html(buttonText)
        .css(textStyleObject)
        .attr({
          'contentEditable': 'true',
          'data-original-href': json.link
        })
        .changeElementType('div') // NOTE: returns a new, distinct JQuery selector object!
        .on('keydown', this.onKeyDown)
        .on('keydown paste blur', (_.debounce(this.onPossibleTextChange, 100)))
        .on('keydown paste blur', (_.debounce(this.saveText, 1000)));
      if (this.contentMovable && _.isFunction(this.descriptorProviderFn)) {
        /**
         * The move handle.
         */
        let moveHandle = new MoveHandleView({
          descriptorProviderFn: this.descriptorProviderFn,
          $elToGhost: this.$el
        });
        this.$('td').append(moveHandle.render().$el);
      }
      return this;
    }
    /**
     * @param undefined
     * @return {Object} AssignmentExpression
     */
  getCalculatedCssProperties($textContainer = this.findTextContainer()) {
    /**
     * The properties.
     */
    let properties;
    return properties = {
      fontColor: $textContainer.css('color'),
      fontSize: $textContainer.css('font-size'),
      fontFamily: $textContainer.css('font-family'),
      backgroundColor: this.$el.css('background-color')
    };
  }
  findTextContainer() {
      return this.$('.MainTextFullWidth > a, .MainTextFullWidth > div');
    }
    // A way that wouldn't depend on how the markup is written but doesn't
    // seem to work in some situations:
    // textNodeFilter = -> @nodeType is 3
    // @$el.contents().filter(textNodeFilter).parent()
    /**
     * @param toggle
     */
  highlightBlock(toggle) {
    return this.$el.toggleClass('delete-hover', toggle);
  }
  publishHTML() {
    return this.el.outerHTML;
  }
}
ButtonView.initClass();
export default ButtonView;