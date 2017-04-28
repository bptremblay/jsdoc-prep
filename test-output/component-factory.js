/**
 * @module component-factory
 * @exports ComponentFactory
 * @requires ./component
 * @requires ./component-editor
 * @requires ./layout-editor
 * @requires ./toolbar
 * @requires ./lib/jquery
 */
import Component from './component';
import ComponentEditor from './component-editor';
import LayoutEditor from './layout-editor';
import getToolbar from './toolbar';
import $ from './lib/jquery';
const CLONE_DOC_DATA = true;
let cloneCounter = 0;
/**
 * @param dataIn  
 * @param pathForClonedData  
 * @param dataNode
 */
function createOrModifyNameSpace(dataIn, pathForClonedData, dataNode) {
  let pathSplitter = pathForClonedData.split('.');
  let index = 0;
  let branch = '';
  let leaf = '';
  let tempValue = dataIn;
  let leafSplitter = null;
  let branchValue = null;
  for (index = 0; index < pathSplitter.length; index++) {
    branch = pathSplitter[index].trim();
    if (branch.indexOf(':') !== -1) {
      leafSplitter = branch.split(':');
      branch = leafSplitter[0];
      leaf = leafSplitter[1];
    }
    if (!tempValue[branch]) {
      tempValue[branch] = {};
    }
    branchValue = tempValue;
    tempValue = branchValue[branch];
    if (leaf.length) {
      if (!tempValue[leaf]) {
        tempValue[leaf] = {};
      }
      tempValue = tempValue[leaf];
    }
  }
  branchValue[branch] = dataNode;
  console.log(dataIn);
  cloneCounter++;
}
/**
 * @param dataIn  
 * @param pathIn
 */
function cloneDataNode(dataIn, pathIn) {
  let pathForClonedData = '';
  let dataNode = null;
  if (pathIn.trim() === '.') {
    dataNode = dataIn;
  } else {
    let pathSplitter = pathIn.split('.');
    let index = 0;
    let branch = '';
    let leaf = '';
    let tempValue = dataIn;
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
    dataNode = tempValue;
  }
  pathForClonedData = `clonedInstances.${cloneCounter}.${pathIn}`;
  console.log('New location for cloned data: ', pathForClonedData);
  dataNode = $.extend({}, dataNode);
  createOrModifyNameSpace(dataIn, pathForClonedData, dataNode);
  return pathForClonedData;
}
/**
 * The class ComponentFactory.
 */
class ComponentFactory {
  /**
   * @function
   */
  constructor() {
      this.domParent = null;
      this.components = [];
      this.components.push(getToolbar());
    }
    /**
     * @param parentIn
     */
  setDomParent(parentIn) {
      this.domParent = parentIn;
    }
    /**
     * @param dataIn  
     * @param pathIn  
     * @param templateIn  
     * @param parentComponent
     */
  createComponent(dataIn, pathIn, templateIn, parentComponent) {
      let comp = null;
      let schemaName = pathIn.split('.').pop().trim();
      if (CLONE_DOC_DATA) {
        pathIn = cloneDataNode(dataIn, pathIn);
      }
      if (schemaName === 'layout' || schemaName === 'col') {
        comp = new LayoutEditor();
      } else {
        comp = new ComponentEditor();
      }
      comp.setTemplate(templateIn);
      comp.setData(dataIn, pathIn);
      if (!parentComponent) {
        this.components.push(comp);
      } else {
        parentComponent.addChild(comp);
      }
      return comp;
    }
    /**
     * @function
     */
  render() {
    let buffer = [];
    for (let index = 0; index < this.components.length; index++) {
      let comp = this.components[index];
      buffer.push(comp.render());
    }
    this.domParent.html(buffer.join('\n'));
    for (let index = 0; index < this.components.length; index++) {
      let comp = this.components[index];
      comp.setDomParent(this.domParent);
    }
  }
}
export default ComponentFactory;