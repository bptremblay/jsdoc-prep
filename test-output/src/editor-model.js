/**
 * @module editor-model
 * @exports ButtonEditorModel
 * @requires backbone
 */
import Backbone from 'backbone';
/**
 * The class ButtonEditorModel.
 * @extends Backbone.Model
 */
class ButtonEditorModel extends Backbone.Model {
  static initClass() {
      this.prototype.defaults = {
        linkWasTested: false,
        doneWasClicked: false
      };
    }
    /**
     * @param val
     */
  doneWasClicked(val) {
      if (val != null) {
        return this.set('doneWasClicked', val);
      } else {
        return this.get('doneWasClicked');
      }
    }
    /**
     * @param val
     */
  linkWasTested(val) {
    if (val != null) {
      return this.set('linkWasTested', val);
    } else {
      return this.get('linkWasTested');
    }
  }
}
ButtonEditorModel.initClass();
export default ButtonEditorModel;