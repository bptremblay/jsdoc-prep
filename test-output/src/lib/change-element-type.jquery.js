/**
 * @module change-element-type.jquery
 * @exports null
 * @requires jquery
 */
import $ from 'jquery';
/**
 * @param newType
 */
$.fn.changeElementType = function (newType) {
  /**
   * The attrs.
   */
  var attrs = {};
  $.each(this, function (idx, el) {
    $.each(el.attributes, function (idx, attr) {
      attrs[attr.nodeName] = attr.nodeValue;
    });
  });
  /**
   * The new el.
   */
  var newEl = $("<" + newType + "/>", attrs).append(this.contents());
  this.parent().empty().append(newEl);
  return newEl;
};