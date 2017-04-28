import Component from '../component';
import $ from '../lib/jquery';
import TemplateEngine from '../../../../bower_components/mustache.js/mustache';
import template from 'text!./templates/row.html';
/**
 * The class Row.
 * @extends Component
 */
class Row extends Component {
  /**
   * @function
   */
  constructor() {
    super();
    this.setTemplate(template);
    this.setData({}, '.');
  }
}
export default Row;
