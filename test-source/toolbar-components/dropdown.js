import Component from '../component';
import $ from '../lib/jquery';
import TemplateEngine from '../../../../bower_components/mustache.js/mustache';
import template from 'text!./templates/dropdown.html';
/**
 * The class DropdownMenu.
 * @extends Component
 */
class DropdownMenu extends Component {
  /**
   * @function
   */
  constructor() {
    super();
    this.valueChangeHandler = null;
    this.setTemplate(template);
  }
  /**
   * @param $o
   * @return {Object} AssignmentExpression
   */
  extendBSDropdown($o) {
    let activeItem = $o.find('.active');
    let newActiveItem = null;
    let oldVal = null;
    const _this = this;
    const $button = $o.find('[data-js=primary-button]');
    /**
     * @param val
     * @param triggerChange
     * @return {Object} AssignmentExpression
     */
    $o.val = function(val, triggerChange) {
      if (triggerChange == null) {
        triggerChange = false;
      }
      if (val != null) {
        $button.text(val);
        $o.data('val', val);
        if ((oldVal !== val) && triggerChange) {
          $o.trigger('change');
        }
        if (activeItem != null) {
          activeItem.removeClass('active');
        }
        activeItem = newActiveItem || $o.find(`[data-val='${val}']`);
        activeItem.addClass('active');
        return oldVal = val;
      } else {
        return $button.text();
      }
    };
    $o.find('li a').click(function(e) {
      newActiveItem = $(e.target);
      const val = newActiveItem.data('val');
      const finalVal = $o.val(val, true);
      if (_this.valueChangeHandler) {
        _this.valueChangeHandler(finalVal);
      }
      return finalVal;
    });
    return $o;
  }
  /**
   * @param domParent
   */
  onDomAdd(domParent) {
    super.onDomAdd(domParent);
    this.$el.find('.dropdown-toggle').dropdown();
    let _this = this;
    this.extendBSDropdown(this.$el);
  }
  /**
   * @param handler
   */
  handleValueChange(handler) {
    this.valueChangeHandler = handler;
  }
}
export default DropdownMenu;
