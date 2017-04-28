import Component from '../component';
import $ from '../lib/jquery';
import TemplateEngine from '../../../../bower_components/mustache.js/mustache';
import template from 'text!./templates/group.html';
/**
 * The class Group.
 * @extends Component
 */
class Group extends Component {
  /**
   * @function
   */
  constructor() {
    super();
    this.setTemplate(template);
  }
}
export default Group;
