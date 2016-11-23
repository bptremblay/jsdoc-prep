define([
  'backbone'
], function(Backbone) {

  class ButtonEditorModel extends Backbone.Model {
    static initClass() {
      this.prototype.defaults = {
        linkWasTested: false,
        doneWasClicked: false
      };
    }
    doneWasClicked(val) {
      if (val != null) {
        return this.set('doneWasClicked', val);
      } else {
        return this.get('doneWasClicked');
      }
    }
    linkWasTested(val) {
      if (val != null) {
        return this.set('linkWasTested', val);
      } else {
        return this.get('linkWasTested');
      }
    }
  }
  return ButtonEditorModel.initClass();
});


