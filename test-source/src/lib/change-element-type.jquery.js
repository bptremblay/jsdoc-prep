define(['jquery'], function($) {
  $.fn.changeElementType = function(newType) {
    var attrs = {};

    $.each(this, function(idx, el) {
      $.each(el.attributes, function(idx, attr) {
        attrs[attr.nodeName] = attr.nodeValue;
      });
    });

    var newEl = $("<" + newType + "/>", attrs).append(this.contents());

    this.parent().empty().append(newEl);
    return newEl;
  };
})
