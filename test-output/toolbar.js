/**
 * @module toolbar
 * @requires ./component
 * @requires ../../../bower_components/mustache.js/mustache
 * @requires ./lib/position-affix-jquery
 * @requires text!./templates/toolbar-shell.html
 * @requires ./toolbar-components/row
 * @requires ./toolbar-components/group
 * @requires ./toolbar-components/delete-button
 * @requires ./toolbar-components/done-button
 * @requires ./toolbar-components/dropdown
 */
import Component from './component';
import TemplateEngine from '../../../bower_components/mustache.js/mustache';
import ToolBarPositioning from './lib/position-affix-jquery';
import template from 'text!./templates/toolbar-shell.html';
import Row from './toolbar-components/row';
import Group from './toolbar-components/group';
import DeleteButton from './toolbar-components/delete-button';
import DoneButton from './toolbar-components/done-button';
import Dropdown from './toolbar-components/dropdown';
const {
  $
} = window;
let TB = null;
const TB_DELETE_BTN = 'delete-button';
const TB_DONE_BTN = 'done-button';
const TB_ROW = 'row';
const TB_GROUP = 'group';
let doneClick = null;
let deleteClick = null;
/**
 * The class Toolbar.
 * @extends Component
 */
class Toolbar extends Component {
  /**
   * @param targ
   */
  positionNearTarget(targ) {
      if (targ) {
        let $toolbar = this.$el; //.find('#galileo-tools');
        $toolbar.positionAffix('updateTarget', targ);
      }
    }
    /**
     * @function
     */
  constructor() {
      super();
      this.visibile = false;
      this.targetComponent = null;
      this.setTemplate(template);
      this.setData({}, '.');
      this._setupChildren();
      this.render();
    }
    /**
     * @private
     * @private 
     */
  _setupPositioning() {
      let $toolbar = this.$el; //.find('#galileo-tools');
      let $title = [];
      let $pointer = [];
      $title = $toolbar.find('#galileo-tools-label');
      $pointer = $toolbar.find('.editor-pointer');
      $toolbar.find('#slot').css('width', 'auto');
      /**
       * @param theTitle
       */
      let setTitle = function (theTitle) {
        if (theTitle && !$toolbar.hasClass('below')) {
          return $title.html(theTitle).attr('title', theTitle).show();
        } else {
          return $title.hide();
        }
      };
      $toolbar.positionAffix({
        /**
         * @param pos
         */
        offset(pos) {
          let re;
          re = /\babove\b|\bbelow\b/g;
          if (pos === 'below') {
            $title.hide();
          }
          if (re.test(pos)) {
            return $pointer.outerHeight();
          } else {
            return $pointer.outerWidth();
          }
        },
        /**
         * @function
         */
        onUpdate() {
          return setTitle();
        }
      });
    }
    /**
     * @private
     * @private 
     */
  _setupChildren() {
      let currentRow = new Row();
      let group = new Group();
      group.setData({
        class: 'left tool-spacing'
      }, '.');
      let _this = this;
      let child = new Dropdown();
      child.setData({
        title: 'Font Family',
        currentFontFamily: 'Arial',
        items: [{
          active: true,
          value: 'Courier New',
          content: 'Courier New',
          style: 'font-family: Courier New,monospace'
        }]
      }, '.');
      child.handleValueChange(function (val) {
        console.log('FONT FAMILY: ', val);
      });
      group.addChild(child);
      currentRow.addChild(group);
      group = new Group();
      group.setData({
        class: 'editor-actions right'
      }, '.');
      child = new DeleteButton();
      group.addChild(child);
      child = new DoneButton();
      group.addChild(child);
      currentRow.addChild(group);
      this.addChild(currentRow);
    }
    /**
     * @param visibleIn  
     * @param targetComponent
     */
  setVisible(visibleIn, targetComponent) {
      this.targetComponent = targetComponent;
      this.visibile = visibleIn;
      if (this.visibile) {
        this.$el.show();
        if (this.targetComponent) {
          this.positionNearTarget(this.targetComponent);
        }
      } else {
        this.$el.hide();
      }
    }
    /**
     * @function
     */
  getVisible() {
      return this.visibile;
    }
    /**
     * @param properties  
     * @param bindings
     */
  applyProperties(properties, bindings) {
      let schema = {};
      for (let p in properties) {
        if (properties.hasOwnProperty(p) && p !== 'component' && p !== 'children' && p !== 'modifiers') {
          schema[p] = {
            componentChange: null,
            toolbarChange: null
          };
        }
      }
    }
    /**
     * @param domParent
     */
  onDomAdd(domParent) {
    super.onDomAdd(domParent);
    const _this = this;
    /**
     * @function
     */
    doneClick = function () {
      _this.setVisible(false);
    };
    /**
     * @function
     */
    deleteClick = function () {
      _this.targetComponent.remove();
      _this.setVisible(false);
    };
    this.$el.find('.btn-primary').text('Done');
    this.$el.find('.btn-primary').on('click', doneClick);
    this.$el.find('.delete-btn').on('click', deleteClick);
    this._setupPositioning();
    this.$el.hide();
  }
}
/**
 * @function
 */
function getToolbar() {
  if (TB) {
    return TB;
  }
  TB = new Toolbar();
  window.TB = TB;
  return TB;
}
export default getToolbar;