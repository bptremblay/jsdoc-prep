define([
  'underscore',
  'backbone',
  'plugins/drag'
], function(_, Backbone) {

  class MoveHandleView extends Backbone.View {
    static initClass() {
  
      this.prototype.tagName = 'a';
  
      this.prototype.attributes = {
        href: '#',
        draggable: true,
        class: 'gl-button-move-handle'
      };
  
      this.prototype.events =
        {click: '_preventDefault'};
    }

    initialize(params) {
      this.descriptorProviderFn = params.descriptorProviderFn;
      return this.$elToGhost = params.$elToGhost;
    }

    render() {
      this.$el.attr('data-gl-remove-on-publish', true);
      this.$el.drag({
        type: 'block',
        data: this.descriptorProviderFn,
        start: event => {
          let uiEvent = event.originalEvent;

          let offset = $(event.target).offset();
          let xOffset = uiEvent.pageX - offset.left;
          let yOffset = uiEvent.pageY - offset.top;

          return __guardMethod__(uiEvent.dataTransfer, 'setDragImage', o => o.setDragImage(
            this.$elToGhost.get(0), xOffset, yOffset
          ));
        }
      });

      return this;
    }

    _preventDefault(event) {
      return event.preventDefault();
    }
  }
  return MoveHandleView.initClass();
});

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}