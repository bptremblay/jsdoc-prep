/**
 * @constructor
 */
function BaseUiComponent() {
  // make it like a Backbone.View
  this.initFields();
  this.elements = {};
  this.templates = {};
  this.initInheritance();
}
/**
 * Stores a reference to a jQuery selection.
 * @param {String} selector  
 * @param {Boolean} compile  
 * @return {$element}
 */
BaseUiComponent.prototype.addElementSelection = function (selector, compile) {
  var keyName = this.getKeyName(selector);
  // el[] could be zero or N number of elements
  var el = $(selector);
  this.elements[keyName] = el;
  if (compile) {
    this.compileTemplate(selector);
  }
  return el;
};
/**
 * @param {String} selector  
 * @return {string}
 */
BaseUiComponent.prototype.getKeyName = function (selector) {
  var keyName = selector;
  if (keyName.indexOf('#') === 0) {
    keyName = 'id_' + keyName;
  } else if (keyName.indexOf('.') === 0) {
    keyName = 'class_' + keyName;
  } else {
    keyName = 'element_' + keyName;
  }
  return keyName;
};
/**
 * @param keyName
 */
BaseUiComponent.prototype.getElementByKeyName = function (keyName) {};
/**
 * @param selector
 */
BaseUiComponent.prototype.getElementBySelector = function (selector) {};
/**
 * @param cookieId
 */
BaseUiComponent.prototype.getCookie = function (cookieId) {};
/**
 * @param cookieId  
 * @param cookieValue
 */
BaseUiComponent.prototype.setCookie = function (cookieId, cookieValue) {};
/**
 * @param cookieId  
 * @param cookieField
 */
BaseUiComponent.prototype.getSubCookie = function (cookieId, cookieField) {};
/**
 * @param cookieId  
 * @param cookieField  
 * @param cookieValue
 */
BaseUiComponent.prototype.setSubCookie = function (cookieId, cookieField,
  cookieValue) {};
/**
 * @param selector  
 */
BaseUiComponent.prototype.compileTemplate = function (selector) {
  var el = this.getElementBySelector(selector);
  if (el == null) {
    Logger.error("BaseUiComponent.compileTemplate() failed for '" + selector + "'.");
    return null;
  }
  var template = Handlebars.compile(el.html());
  var keyName = this.getKeyName(selector);
  this.templates[keyName] = template;
  return template;
};