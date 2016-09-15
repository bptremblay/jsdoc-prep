// Generated by CoffeeScript 1.10.0
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['underscore', 'backbone', 'column-and-block-layout-editor-path/models/content-editor'], function(_, Backbone, ContentEditor) {
  var ContentEditors;
  return ContentEditors = (function(superClass) {
    extend(ContentEditors, superClass);

    function ContentEditors() {
      return ContentEditors.__super__.constructor.apply(this, arguments);
    }

    ContentEditors.prototype.model = ContentEditor;

    ContentEditors.prototype.getEditors = function() {
      return this.invoke('getEditor');
    };

    ContentEditors.prototype.deactivate = function() {
      return this.invoke('deactivate');
    };

    ContentEditors.prototype.getWidthPx = function() {
      return this.block.getWidthPx();
    };

    ContentEditors.prototype.initialize = function(models, opts) {
      return this.block = opts.block;
    };

    return ContentEditors;

  })(Backbone.Collection);
});
