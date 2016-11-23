/**
 * @module button-editor-view
 * @exports ButtonEditorView
 * @requires text!button-editor-path/tmpl/button-editor.html
 * @requires template-engine
 * @requires i18n!button-editor-path/nls/button-editor
 * @requires galileo-lib/modules/services/usage-tracking
 * @requires underscore
 * @requires galileo-lib/modules/services/activation-service
 * @requires galileo-lib/modules/util/console
 * @requires galileo-lib/modules/events
 * @requires backbone
 * @requires galileo-lib/modules/fed-components/views/modal-view
 * @requires galileo-lib/modules/views/link-modal/link-modal-view
 * @requires galileo-lib/modules/services/font-management-service
 * @requires galileo-lib/modules/services/color-picker-service
 * @requires galileo-lib/modules/utils
 * @requires uiBasePath/core/components/ccTools/ctct.src
 * @requires jquery-ui
 * @requires button-editor-path/lib/galileo-jquery-ui-mobile-shim
 */
import template from 'text!button-editor-path/tmpl/button-editor.html';
import mustache from 'template-engine';
import i18n from 'i18n!button-editor-path/nls/button-editor';
import usageTracking from 'galileo-lib/modules/services/usage-tracking';
import _ from 'underscore';
import activationService from 'galileo-lib/modules/services/activation-service';
import utilConsole from 'galileo-lib/modules/util/console';
import galileoEvents from 'galileo-lib/modules/events';
import Backbone from 'backbone';
import ModalView from 'galileo-lib/modules/fed-components/views/modal-view';
import LinkModalView from 'galileo-lib/modules/views/link-modal/link-modal-view';
import fontManagementService from 'galileo-lib/modules/services/font-management-service';
import colorPickerService from 'galileo-lib/modules/services/color-picker-service';
import utils from 'galileo-lib/modules/utils';
import 'uiBasePath/core/components/ccTools/ctct.src';
import 'jquery-ui';
import 'button-editor-path/lib/galileo-jquery-ui-mobile-shim';
LinkModalView = LinkModalView.default;
/**
 * The button selected class.
 * @type {String}
 */
let BUTTON_SELECTED_CLASS = 'e-btn-selected';
if (typeof _ === 'undefined' || _ === null) {
  ({
    _
  } = window);
}
// IE9 and the color picker got beef. This prevents the
// "are you sure you want to leave" message.
$(document).on(
  'click',
  `#aloha-justifyleft,
#aloha-justifycenter,
#aloha-justifyright,
[data-js=font-family-dropdown] a[data-val],
[data-js=delete-button],
#fontsize-dropdown-btn-group a[data-val]`,
  e => e.preventDefault());
/**
 * The parse CSV.
 */
let parseCSV = csv => csv.split(/,\s?/);
let debounce = (delay, fn) => _.debounce((function () {
  return fn.call(this);
}), delay);
/**
 * The need to update model.
 * @type {Boolean}
 */
let needToUpdateModel = false;
// Defines the view that goes inside the galileo toolbar popup
// See https://jira.roving.com/browse/VN-1338
/**
 * The class ButtonEditorView.
 * @extends Backbone.View
 */
class ButtonEditorView extends Backbone.View {
  /**
   * @constructor
   * @param undefined
   */
  constructor(...args) {
    super(...args);
    this._cleanup = this._cleanup.bind(this);
    this.update = this.update.bind(this);
    this.updateModelFontFamily = this.updateModelFontFamily.bind(this);
    this.addOrUpdateLink = this.addOrUpdateLink.bind(this);
    this.removeLink = this.removeLink.bind(this);
  }
  static initClass() {
      this.prototype.events = {
        'focusout [data-js=link-input]': 'updateModelLink',
        'keypress [data-js=link-input]': 'delayedPoliteUpdateModel',
        'click [data-action=bold]': 'toggleBold',
        'click [data-action=italic]': 'toggleItalic',
        'click [data-js=font-family-dropdown]': 'updateModelFontFamily',
        'click [data-js=font-size-dropdown]': 'updateModelFontSize',
        'click [data-js=delete-button]': 'triggerRemoveBlock',
        'click #aloha-justifyleft': 'justifyLeft',
        'click #aloha-justifycenter': 'justifyCenter',
        'click #aloha-justifyright': 'justifyRight',
        'click [data-js=test-link-button]': 'testLink',
        'click [data-js=done-button]': 'done',
        'click [data-js=link-button]': 'showLinkModal',
        'mouseenter [data-js=delete-button]': '_highlightBlock',
        'mouseleave [data-js=delete-button]': '_highlightBlock',
        // The next four are just about preventing IE from interpreting <ENTER> as
        // a form submission (VN-2890)
        'submit': 'justDont',
        'keypress input': 'stopSubmitOnEnter',
        'keydown input': 'stopSubmitOnEnter',
        'keyup input': 'stopSubmitOnEnter'
      };
      this.prototype.delayedUpdateModel = debounce(2000, function () {
        if (needToUpdateModel) {
          return this.updateModelLink();
        }
      });
    }
    /**
     * @param undefined
     */
  initialize(options = {}) {
      this.options = options;
      this.atomicDelete = this.options.atomicDelete;
      this.setButtonModel(this.options.buttonModel);
      return galileoEvents.on(galileoEvents.TYPES.EDITOR_REINIT, this._cleanup);
    }
    /**
     * @private 
     */
  _cleanup() {
      this.model = null;
      this.options = null;
      return galileoEvents.off(galileoEvents.TYPES.EDITOR_REINIT, this._cleanup);
    }
    // Internal: Make sure that an event effect is NIL
    /**
     * @param e
     * @return {Boolean}
     */
  justDont(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
  toggleBold() {
    return this.buttonModel.toggleBold();
  }
  toggleItalic() {
      return this.buttonModel.toggleItalic();
    }
    /**
     * @param e
     */
  stopSubmitOnEnter(e) {
      if ((e.keyCode || e.which || e.charCode) === 13) {
        return this.justDont(e);
      } else {
        return true;
      }
    }
    /**
     * @param model
     */
  setButtonModel(model) {
      if (this.buttonModel != null) {
        this.stopListening(this.buttonModel);
      }
      this.listenTo(model, 'change', model => this.update(model.changed));
      this.listenTo(model, 'limit:fontSize', model => this.update({
        fontSize: model.attributes.fontSize
      }));
      this.listenTo(model, 'change:fontSize', function (model, changes, options) {
        if (!__guard__(options, x => x.changedByGalileo)) {
          return this.trackUsage('fontsize-dropdown', changes);
        }
      });
      this.listenTo(model, 'change:fontFamily', (model, changes, options) => {
        if (!__guard__(options, x => x.changedByGalileo)) {
          return this.trackUsage('fontfamily-dropdown', changes);
        }
      });
      return this.buttonModel = model;
    }
    /**
     * @param model
     * @return {Object} AssignmentExpression
     */
  setModel(model) {
      return this.model = model;
    }
    /**
     * @param editor
     * @return {Object} AssignmentExpression
     */
  setEditor(editor) {
      return this.editor = editor;
    }
    /**
     * @param buttonView
     * @return {Object} AssignmentExpression
     */
  setButtonView(buttonView) {
      return this.buttonView = buttonView;
    }
    /**
     * @return {Boolean}
     */
  getCalculatedCssProperties() {
      return __guard__(this.buttonView, x => x.getCalculatedCssProperties()) || {};
    }
    /**
     * @param undefined
     */
  update(attributes = this.buttonModel.toJSON()) {
    /**
     * The calculated css properties.
     */
    let calculatedCssProperties = this.getCalculatedCssProperties();
    for (var attributeName in calculatedCssProperties) {
      /**
       * The value.
       */
      var value = calculatedCssProperties[attributeName];
      switch (attributeName) {
      case 'fontFamily':
        // If the font family is in quotes, remove the quotes
        /**
         * The font family.
         */
        let fontFamily = utils.string.unquote(parseCSV(value)[0]);
        this.ui.fontFamilyDropdown.val(fontFamily);
        this.ui.fontFamilyButton.css('font-family', value);
        break;
      case 'fontSize':
        this.ui.fontSizeDropdown.val(parseInt(value));
        break;
      case 'fontColor':
        this.ui.fontColorPreviewArea.css('background-color', value);
        break;
      case 'backgroundColor':
        this.ui.colorPreviewArea.css('background-color', value);
        break;
      }
    }
    for (attributeName in attributes) {
      /**
       * The value.
       */
      var value = attributes[attributeName];
      switch (attributeName) {
      case 'fontWeight':
        if (value === 'bold') {
          this.ui.boldButton.addClass(BUTTON_SELECTED_CLASS);
        }
        if (value === 'normal') {
          this.ui.boldButton.removeClass(BUTTON_SELECTED_CLASS);
        }
        break;
      case 'fontStyle':
        if (value === 'italic') {
          this.ui.italicButton.addClass(BUTTON_SELECTED_CLASS);
        }
        if (value === 'normal') {
          this.ui.italicButton.removeClass(BUTTON_SELECTED_CLASS);
        }
        break;
      case 'alignment':
        switch (value) {
        case 'left':
          this._selectAlignmentButton(this.ui.alignLeftButton);
          this._setAlignmentIcon('left');
          break;
        case 'center':
          this._selectAlignmentButton(this.ui.alignCenterButton);
          this._setAlignmentIcon('center');
          break;
        case 'right':
          this._selectAlignmentButton(this.ui.alignRightButton);
          this._setAlignmentIcon('right');
          break;
        }
        break;
      case 'link':
        if (!this.buttonModel.isValid() && (value != null) && value !== '') {
          this.ui.linkInput.parent().addClass('error');
          this.ui.testLinkButton.addClass('disabled');
        } else {
          this.ui.linkInput.parent().removeClass('error');
          this.ui.testLinkButton.removeClass('disabled');
        }
        this.ui.linkInput.val(value || '');
        break;
      }
    }
    // kill coffeescript loop comprehension
    return null;
  }
  delayedPoliteUpdateModel() {
    needToUpdateModel = true;
    return this.delayedUpdateModel();
  }
  updateModelLink() {
      needToUpdateModel = false;
      return this.buttonModel.setLink(this.ui.linkInput.val());
    }
    /**
     * @param e
     */
  updateModelFontSize(e) {
      /**
       * The font size.
       */
      let fontSize = parseInt(e.target.innerHTML);
      needToUpdateModel = false;
      return this.buttonModel.set('fontSize', fontSize);
    }
    /**
     * @param e
     */
  updateModelFontFamily(e) {
      /**
       * The font family.
       */
      let fontFamily = e.target.innerHTML;
      needToUpdateModel = false;
      fontFamily = fontManagementService.getFamilyForFont(fontFamily);
      return this.buttonModel.set('fontFamily', fontFamily);
    }
    /**
     * @private 
     * @param theButton
     */
  _selectAlignmentButton(theButton) {
      for (let otherButton of[this.ui.alignLeftButton, this.ui.alignCenterButton, this.ui.alignRightButton]) {
        otherButton.removeClass('e-btn-selected');
      }
      return theButton.addClass('e-btn-selected');
    }
    /**
     * @private 
     * @param justify
     */
  _setAlignmentIcon(justify) {
    return this.ui.alignDropdown.find('span')
      .removeClass('icon-left-justify icon-center-justify icon-right-justify')
      .addClass(`icon-${justify}-justify`);
  }
  justifyLeft() {
    this.buttonModel.set('alignment', 'left');
    this._selectAlignmentButton(this.ui.alignLeftButton);
    this._setAlignmentIcon('left');
    return this.trackUsage('justifyleft');
  }
  justifyCenter() {
    this.buttonModel.set('alignment', 'center');
    this._selectAlignmentButton(this.ui.alignCenterButton);
    this._setAlignmentIcon('center');
    return this.trackUsage('justifycenter');
  }
  justifyRight() {
    this.buttonModel.set('alignment', 'right');
    this._selectAlignmentButton(this.ui.alignRightButton);
    this._setAlignmentIcon('right');
    return this.trackUsage('justifyright');
  }
  done() {
    this.model.doneWasClicked(true);
    if ($('[data-editor-type="button"]').hasClass('editable-active')) {
      activationService.deactivateLayout();
    }
    return this.trackUsage('done');
  }
  render() {
      this.$el.html(mustache.render(template, _.extend(this.buttonModel.toJSON(), {
        nls: i18n,
        hasEditableURL: this.options.hasEditableURL,
        trashcanVisibility: this._trashcanVisibility()
      })));
      /**
       * The $font family group.
       */
      let $fontFamilyGroup = this.$el.find('#fontfamily-dropdown-group');
      fontManagementService.appendFontSelection($fontFamilyGroup);
      this.ui = {
        linkInput: this.placeholderShim(this.$('[data-js=link-input]')),
        colorDropdown: this.$('[data-js=color-dropdown]'),
        textColorDropdown: this.$('[data-js=text-color-dropdown]'),
        boldButton: this.$('[data-action=bold]'),
        italicButton: this.$('[data-action=italic]'),
        fontSizeButton: this.$('#fontsize-dropdown'),
        fontSizeDropdown: this.extendBSDropdown(this.$('[data-js=font-size-dropdown]')),
        fontFamilyDropdown: this.extendBSDropdown(this.$('[data-js=font-family-dropdown]')),
        fontFamilyButton: this.$('[data-js=font-family-dropdown] [data-js=primary-button]'),
        alignDropdown: this.$('#alignment-dropdown'),
        alignLeftButton: this.$('#aloha-justifyleft'),
        alignCenterButton: this.$('#aloha-justifycenter'),
        alignRightButton: this.$('#aloha-justifyright'),
        colorPreviewArea: this.$('[data-js=color-preview-area]'),
        fontColorPreviewArea: this.$('[data-js=font-color-preview-area]'),
        testLinkButton: this.$('[data-js=test-link-button]'),
        doneButton: this.$('[data-js=done-button]'),
        fontList: this.$('#fontfamily-dropdown-group .dropdown-menu'),
        trashcanButton: this.$('[data-js=delete-button]'),
        linkButton: this.$('[data-js=link-button]')
      };
      colorPickerService.setupColorPicker({
        $clickTarget: this.ui.colorDropdown,
        $colorTarget: this.ui.colorPreviewArea,
        onColorPicked: values => {
          this.buttonModel.setLocalBackgroundColor(values.color);
          return this.trackUsage('color', {
            color: values.color,
            source: values.originatedFrom
          });
        }
      });
      colorPickerService.setupColorPicker({
        $clickTarget: this.ui.textColorDropdown,
        $colorTarget: this.ui.fontColorPreviewArea,
        onColorPicked: values => {
          this.buttonModel.fontColor(values.color);
          return this.trackUsage('fontcolor', {
            color: values.color,
            source: values.originatedFrom
          });
        }
      });
      __guardMethod__(this.$('[data-xtoggle=dropdown]'), 'dropdown', o => o.dropdown());
      return this.update(this.buttonModel.toJSON());
    }
    /**
     * @return {Boolean}
     */
  testLink() {
      if (this.buttonModel.link() === null ||
        this.buttonModel.link() === '' || !this.buttonModel.isValid()) {
        return false;
      }
      this.model.linkWasTested(true);
      this.trackUsage('testlink');
      return window.open(this.buttonModel.link(), '_blank');
    }
    /**
     * @param action
     * @param detail
     */
  trackUsage(action, detail) {
      /**
       * The actions to events.
       */
      let actionsToEvents = {
        'justifyleft': 'g_block_action>edit>alignment',
        'justifycenter': 'g_block_action>edit>alignment',
        'justifyright': 'g_block_action>edit>alignment',
        'testlink': 'g_block_action>edit>test button',
        'fontcolor': 'g_block_action>edit>fontcolor',
        'fontfamily-dropdown': 'g_block_action>edit>fontface',
        'fontsize-dropdown': 'g_block_action>edit>fontsz',
        'done': 'g_block_action>edit>done',
        'color': 'g_block_action>edit>bckgrnd color',
        'triggerRemoveBlock': 'g_block_action>content>delete'
      };
      /**
       * The justify detail.
       */
      let justifyDetail = {
        'justifyright': 'g_right',
        'justifycenter': 'g_center',
        'justifyleft': 'g_left'
      };
      if (action.indexOf('justify') !== -1) {
        detail = justifyDetail[action];
      }
      if (action === 'fontcolor' || action === 'color') {
        detail = `${detail.source}:${detail.color}`;
      }
      /**
       * The context.
       */
      let context = {
        actionIdentifier: actionsToEvents[action],
        blockTitle: 'g_Button'
      };
      if (detail != null) {
        context.blockDetail = detail;
      }
      /**
       * The event.
       */
      let event = actionsToEvents[action];
      return usageTracking.track('editor_action', context);
    }
    // Public: Extend a twitter bootstrap dropdown widget so that it can be
    //         used somewhat like an HTML select element. It's only a method
    //         rather than a stand-alone function to make it easy to test but at
    //         some point it should be stand-alone.
    //
    // $o - a jQuery object
    //
    // Returns the argued jQuery object
    /**
     * @param $o
     * @return {Object} AssignmentExpression
     */
  extendBSDropdown($o) {
      /**
       * The active item.
       */
      let activeItem = $o.find('.active');
      /**
       * The new active item.
       * @type {Object}
       */
      let newActiveItem = null;
      /**
       * The old val.
       * @type {Object}
       */
      let oldVal = null;
      /**
       * The $button.
       */
      let $button = $o.find('[data-js=primary-button]');
      $o.val = function (val, triggerChange = false) {
        if (val != null) {
          $button.text(val);
          $o.data('val', val);
          if (oldVal !== val && triggerChange) {
            // this will update the model, due to event bindings
            // so we've added a flag to prevent recursion if we're
            // just setting the dropdown's value from the model
            $o.trigger('change');
          }
          __guard__(activeItem, x => x.removeClass('active'));
          activeItem = newActiveItem || $o.find(`[data-val='${val}']`);
          activeItem.addClass('active');
          return oldVal = val;
        } else {
          return $button.text();
        }
      };
      $o.find('li a').click(function (e) {
        newActiveItem = $(e.target);
        /**
         * The val.
         */
        let val = newActiveItem.data('val');
        return $o.val(val, true);
      });
      return $o;
    }
    /**
     * @param $o
     */
  placeholderShim($o) {
      if (!Modernizr.input.placeholder) {
        /**
         * The original method.
         */
        let originalMethod = _.bind($o.val, $o);
        $o.on('focusin', function () {
          if (originalMethod() === $o.attr('placeholder')) {
            return originalMethod('');
          }
        });
        $o.on('focusout', function () {
          if (originalMethod() === '') {
            return originalMethod($o.attr('placeholder'));
          }
        });
        /**
         * @param value
         */
        $o.val = function (value) {
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
    }
    /**
     * @param dac
     * @param galileoEvents
     * @param layoutEditor
     * @param editorName
     * @return {Object} AssignmentExpression
     */
  setupDeleteAtomicContent(dac, galileoEvents, layoutEditor, editorName) {
    this.dac = dac;
    this.galileoEvents = galileoEvents;
    this.layoutEditor = layoutEditor;
    return this.editorName = editorName;
  }
  triggerRemoveBlock() {
      this.trackUsage('triggerRemoveBlock');
      this.dac.default.triggerRemoveBlock(this.layoutEditor, this.galileoEvents, this.editorName);
      activationService.deactivateLayout();
      return this.model.doneWasClicked(true);
    }
    /**
     * @private 
     * @param evt
     */
  _highlightBlock(evt) {
      /**
       * The toggle.
       */
      let toggle = evt.type === 'mouseenter';
      return this.editor.events.trigger('highlight-block', toggle);
    }
    /**
     * @param event
     */
  showLinkModal(event) {
      event.preventDefault();
      /**
       * The modal.
       */
      let modal = new ModalView({
        disableClose: true,
        childView: new LinkModalView({
          text: this.buttonView.findTextContainer().text(),
          textLabel: i18n.link_text_label,
          link: this.buttonModel.get('link'),
          type: this.buttonModel.get('linkType') || 'web',
          addCallback: (link, body, type, style) => this.addOrUpdateLink(link, body, type, style),
          removeCallback: this.removeLink
        })
      });
      return modal.show();
    }
    /**
     * @param link
     * @param text
     * @param type
     * @param style
     */
  addOrUpdateLink(link, text, type, style) {
    this.buttonModel.set('link', link);
    this.buttonModel.set('text', text);
    this.buttonModel.set('linkType', type);
    return this.buttonView.render();
  }
  removeLink() {
      this.buttonModel.set('link', null);
      return this.buttonModel.set('linkType', null);
    }
    // To show or not to show the toolbar trashcan icon.
    //
    // Some layout editors support the deletion of atomic
    // images and others do not. This value will be passed
    // to the template.
    //
    // returns either *visible* or *hidden*
    //
    /**
     * @private 
     * @return {String}
     */
  _trashcanVisibility() {
    if (this.atomicDelete) {
      return 'visible';
    } else {
      return 'hidden';
    }
  }
}
ButtonEditorView.initClass();
export default ButtonEditorView;