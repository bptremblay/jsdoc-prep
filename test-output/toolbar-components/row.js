/**
 * @module row
 * @exports Row
 * @requires ../component
 * @requires ../lib/jquery
 * @requires ../../../../bower_components/mustache.js/mustache
 * @requires text!./templates/row.html
 */
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