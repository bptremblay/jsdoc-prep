/**
 * @module move-handle-view
 * @exports MoveHandleView
 * @requires underscore
 * @requires backbone
 * @requires plugins/drag
 */
import _ from 'underscore';
import Backbone from 'backbone';
import 'plugins/drag';
/**
 * The class MoveHandleView.
 * @extends Backbone.View
 */
class MoveHandleView extends Backbone.View {
  static initClass() {
      this.prototype.tagName = 'a';
      this.prototype.attributes = {
        href: '#',
        draggable: true,
        class: 'gl-button-move-handle'
      };
      this.prototype.events = {
        click: '_preventDefault'
      };
    }
    /**
     * @param params
     * @return {Object} AssignmentExpression
     */
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
          /**
           * The ui event.
           */
          let uiEvent = event.originalEvent;
          /**
           * The offset.
           */
          let offset = $(event.target).offset();
          /**
           * The x offset.
           */
          let xOffset = uiEvent.pageX - offset.left;
          /**
           * The y offset.
           */
          let yOffset = uiEvent.pageY - offset.top;
          return __guardMethod__(uiEvent.dataTransfer, 'setDragImage', o => o.setDragImage(
            this.$elToGhost.get(0), xOffset, yOffset
          ));
        }
      });
      return this;
    }
    /**
     * @private 
     * @param event
     */
  _preventDefault(event) {
    return event.preventDefault();
  }
}
MoveHandleView.initClass();
export default MoveHandleView;