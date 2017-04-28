/**
 * @module component-editor
 * @exports ComponentEditor
 * @requires ./component
 * @requires ./toolbar
 * @requires ./lib/jquery
 */
import Component from './component';
import getToolbar from './toolbar';
import $ from './lib/jquery';
/**
 * The class ComponentEditor.
 * @extends Component
 */
class ComponentEditor extends Component {
  /**
   * @function
   */
  constructor() {
      super();
      this.active = false;
      this.toolbar = getToolbar();
      this.buttonTrigger = null;
    }
    /**
     * @param activeIn  
     * @param targ
     */
  setActive(activeIn, targ) {
      this.active = activeIn;
      if (this.active) {
        this.toolbar.applyProperties(this.getData(), {});
        this.toolbar.setVisible(true, targ);
      }
    }
    /**
     * @function
     */
  getActive() {
      return this.active;
    }
    /**
     * @param domParent
     */
  onDomAdd(domParent) {
    super.onDomAdd(domParent);
    let actualButton = this.$el.find('.button_content_inner');
    if (actualButton.length === 0) {
      actualButton = this.$el;
    }
    let _this = this;
    /**
     * @function
     */
    this.buttonTrigger = function () {
      _this.setActive(true, $(this));
    };
    actualButton.on('click', this.buttonTrigger);
  }
}
export default ComponentEditor;