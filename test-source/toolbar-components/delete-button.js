import Component from '../component';
import $ from '../lib/jquery';
import TemplateEngine from '../../../../bower_components/mustache.js/mustache';
import template from 'text!./templates/delete-button.html';
/**
 * The class DeleteButton.
 * @extends Component
 */
class DeleteButton extends Component {
  /**
   * @function
   */
  constructor() {
    super();
    this.setTemplate(template);
    this.setData({
      title: 'DELETE',
      visibility: 'visible'
    }, '.');
  }
}
export default DeleteButton;
