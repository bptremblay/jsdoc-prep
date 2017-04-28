/**
 * @module component
 * @exports Component
 * @requires ../../../bower_components/mustache.js/mustache
 * @requires ./lib/observer
 * @requires ./lib/jquery
 * @requires ./delegator
 */
import TemplateEngine from '../../../bower_components/mustache.js/mustache';
import sightglass from './lib/observer';
import $ from './lib/jquery';
import Delegator from './delegator';
/**
 * The class Component.
 */
class Component {
  /**
   * @constructs Component~constructor
   */
  constructor() {
      this.observers = {};
      this.children = [];
      this.rootReference = {};
      this.dataPath = '';
      this.template = '';
      this.domParent = null;
      this.$el = null;
      this.eventHandlers = {};
      this.componentParent = null;
      this.uid = Delegator.addDelegatedListener(this);
    }
    /**
     * @param rootObject  
     * @param pathIn
     */
  setData(rootObject, pathIn) {
      let path = pathIn;
      let myself = this;
      this.observers[path] = sightglass(rootObject, path, function () {
        myself.update();
      });
      this.rootReference = rootObject;
      this.dataPath = pathIn;
      let properties = this.getData();
      for (let p in properties) {
        if (properties.hasOwnProperty(p) && p !== 'component') {
          const myPath = path + '.' + p;
          this.observers[p] = sightglass(rootObject, myPath, function () {
            myself.update();
          });
        }
      }
    }
    /**
     * @function
     */
  getData() {
      if (this.dataPath.trim() === '.') {
        return this.rootReference;
      }
      let pathSplitter = this.dataPath.split('.');
      let index = 0;
      let branch = '';
      let leaf = '';
      let tempValue = this.rootReference;
      let leafSplitter = null;
      for (index = 0; index < pathSplitter.length; index++) {
        branch = pathSplitter[index].trim();
        if (branch.indexOf(':') !== -1) {
          leafSplitter = branch.split(':');
          branch = leafSplitter[0];
          leaf = leafSplitter[1];
        }
        tempValue = tempValue[branch];
        if (leaf.length) {
          tempValue = tempValue[leaf];
        }
      }
      if (tempValue.hasOwnProperty('children')) {
        tempValue.children = null;
        delete tempValue.children;
      }
      return tempValue;
    }
    /**
     * @param templateIn
     */
  setTemplate(templateIn) {
      this.template = templateIn;
    }
    /**
     * @function
     */
  getTemplate() {
      return this.template;
    }
    /**
     * @function
     */
  detachFromParent() {
      if (this.domParent) {}
      this.domParent = null;
    }
    /**
     * @param parentIn
     */
  setDomParent(parentIn) {
      if (this.domParent) {}
      this.domParent = parentIn;
      $(this.domParent).append(this.$el);
      const _this = this;
      window.setTimeout(function () {
        _this.onDomAdd(parentIn);
      }, 1);
    }
    /**
     * @function
     */
  getDomParent() {
      return this.domParent;
    }
    /**
     * @function
     */
  remove() {
      this.$el.remove();
      this.observers = null;
      let index = 0;
      for (index = 0; index < this.children.length; index++) {
        let child = this.children[index];
        child.remove();
      }
      this.children = null;
      this.rootReference = null;
      this.dataPath = null;
      this.template = null;
      this.domParent = null;
      this.$el = null;
    }
    /**
     * @param childIn
     */
  addChild(childIn) {
      if (this.children.indexOf(childIn) === -1) {
        this.children.push(childIn);
      }
      return this.children;
    }
    /**
     * @param childIn
     */
  removeChild(childIn) {
      let where = this.children.indexOf(childIn);
      if (where !== -1) {
        this.children.splice(where, 1);
      }
      return this.children;
    }
    /**
     * @function
     */
  getChildren() {
      return this.children;
    }
    /**
     * @function
     */
  update() {
      console.warn('Component.update base method called. You must override this?');
    }
    /**
     * @function
     */
  render() {
      let $bufferEl = $('<div></div>');
      let childrenBuffer = [];
      let index = 0;
      for (index = 0; index < this.children.length; index++) {
        let child = this.children[index];
        childrenBuffer.push(child.render());
      }
      let templateData = $.extend({}, this.getData(), {
        children: childrenBuffer.join('\n')
      });
      let output = TemplateEngine.render(this.template, templateData);
      $bufferEl.html(output);
      $bufferEl.find('a').attr('href', 'javascript:void(0)');
      $bufferEl.find(":first").attr('data-render', this.uid);
      output = $bufferEl.html();
      return output;
    }
    /**
     * @param evt
     */
  uiEvent(evt) {}
    /**
     * @param elementRef  
     * @param eventId  
     * @param handler
     */
  bindEvent(elementRef, eventId, handler) {}
    /**
     * @param elementRef  
     * @param eventId  
     * @param handler
     */
  unbindEvent(elementRef, eventId, handler) {}
    /**
     * @function
     */
  unbindAll() {}
    /**
     * @param key  
     * @param value
     */
  setProperty(key, value) {
      this.observers[key].setValue(value);
    }
    /**
     * @param key
     */
  getProperty(key) {
      return this.getData()[key];
    }
    /**
     * @param domParent
     */
  onDomAdd(domParent) {
    this.$el = $(`[data-render=${this.uid}]`);
    if (this.$el.length === 0) {
      throw (new Error(`onDomAdd: ${this.uid}, no element found!`));
    } else {}
    let index = 0;
    for (index = 0; index < this.children.length; index++) {
      let child = this.children[index];
      child.onDomAdd(this.$el);
    }
  }
}
export default Component;