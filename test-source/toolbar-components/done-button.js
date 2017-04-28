import Component from '../component';
import $ from '../lib/jquery';
import TemplateEngine from '../../../../bower_components/mustache.js/mustache';
import template from 'text!./templates/done-button.html';
/**
 * The class DoneButon.
 * @extends Component
 */
class DoneButon extends Component {
  /**
   * @function
   */
  constructor() {
    super();
    this.setTemplate(template);
    this.setData({
      title: 'dunne',
      content: 'dun'
    }, '.');
  }
}
export default DoneButon;
