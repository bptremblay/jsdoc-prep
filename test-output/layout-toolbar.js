/**
 * @module layout-toolbar
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
let doneClick = null;
let deleteClick = null;
/**
 * The class LayoutToolbar.
 * @extends Component
 */
class LayoutToolbar extends Component {
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
  _setupChildren() {}
    /**
     * @param visibleIn  
     * @param targetComponent
     */
  setVisible(visibleIn, targetComponent) {
      this.visibile = visibleIn;
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
  }
}
/**
 * @function
 */
function getToolbar() {
  if (TB) {
    return TB;
  }
  TB = new LayoutToolbar();
  window.TB = TB;
  return TB;
}
export default getToolbar;