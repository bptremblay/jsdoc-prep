import Component from './component';
import getToolbar from './layout-toolbar';
import $ from './lib/jquery';
/**
 * The class LayoutEditor.
 * @extends Component
 */
class LayoutEditor extends Component {
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
  }
}
export default LayoutEditor;
