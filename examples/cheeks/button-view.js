define([
  'underscore',
  'button-editor-path/button-model',
  'button-editor-path/move-handle-view',
  'backbone',
  'button-editor-path/lib/change-element-type.jquery'
], function(_, ButtonModel, MoveHandleView, Backbone) {

  let KEY_CODE_TAB = 9;
  let KEY_CODE_END = 35;
  let KEY_CODE_HOME = 36;
  let KEY_CODE_UP = 38;
  let KEY_CODE_DOWN = 40;
  let KEY_CODE_INSERT = 45;
  let KEY_CODE_B = 66;
  let KEY_CODE_I = 73;

  if (typeof _ === 'undefined' || _ === null) { ({ _ } = window); }

  $.fn.stripHTML = function() {
    return this.html(this.text());
  };

  class ButtonView extends Backbone.View {
    constructor(...args) {
      super(...args);
      this.onKeyDown = this.onKeyDown.bind(this);
      this.saveText = this.saveText.bind(this);
      this.update = this.update.bind(this);
      this.highlightBlock = this.highlightBlock.bind(this);
    }

    static initClass() {
  
      this.prototype.events =
        {'focusout': 'deactivate'};
    }

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

    onPossibleTextChange(e) {
      if (e.type === 'paste') {
        return $(e.target).stripHTML();
      }
    }

    onKeyDown(e) {
      let isMetaKey = keyCode =>
        [
          KEY_CODE_TAB,
          KEY_CODE_END,
          KEY_CODE_HOME,
          KEY_CODE_UP,
          KEY_CODE_DOWN,
          KEY_CODE_INSERT
        ].includes(keyCode)
      ;

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

    isBoldAccelerator(e) {
      return this.isAccelerator(e) && e.keyCode === KEY_CODE_B;
    }

    isItalicAccelerator(e) {
      return this.isAccelerator(e) && e.keyCode === KEY_CODE_I;
    }

    isAccelerator(e) {
      return e.ctrlKey || e.metaKey;
    }

    // The system bold and italic functions only operate on the
    // selected text, similar to how the text editor works. In the case
    // of button, we want the formatting to apply across the entire button text.
    preventSystemFormatting(e) {
      if (this.isBoldAccelerator(e) || this.isItalicAccelerator(e)) {
        return e.preventDefault();
      }
    }

    saveText() {
      let newText = this.editableContent();
      if (newText !== this.model.text()) {
        return this.model.text(newText);
      }
    }

    editableContent(val) {
      if (val != null) {
        return this.findTextContainer().text(val);
      } else {
        return this.findTextContainer().text();
      }
    }

    update(model, options) {
      let { changed } = this.model;

      if (__guard__(options, x => x.changedByGalileo) ||
          (changed.text == null)) {
        return this.render();
      }
    }

    render() {
      let json = this.model.toJSON();

      let buttonText = _.escape(json.text).trim();

      this.$el.css({
        'background-color': this.model.getBackgroundColor()});

      this.$el.parent().attr('align', json.alignment);

      let textStyleObject = {};
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
        let moveHandle = new MoveHandleView({
          descriptorProviderFn: this.descriptorProviderFn,
          $elToGhost: this.$el
        });

        this.$('td').append(moveHandle.render().$el);
      }

      return this;
    }

    getCalculatedCssProperties($textContainer = this.findTextContainer()) {
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

    highlightBlock(toggle) {
      return this.$el.toggleClass('delete-hover', toggle);
    }

    publishHTML() {
      return this.el.outerHTML;
    }
  }
  return ButtonView.initClass();
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}