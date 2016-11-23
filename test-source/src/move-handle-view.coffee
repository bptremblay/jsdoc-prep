define [
  'underscore'
  'backbone'
  'plugins/drag'
], (_, Backbone) ->

  class MoveHandleView extends Backbone.View

    tagName: 'a'

    attributes:
      href: '#'
      draggable: true
      class: 'gl-button-move-handle'

    events:
      click: '_preventDefault'

    initialize: (params) ->
      @descriptorProviderFn = params.descriptorProviderFn
      @$elToGhost = params.$elToGhost

    render: ->
      @$el.attr 'data-gl-remove-on-publish', true
      @$el.drag
        type: 'block'
        data: @descriptorProviderFn
        start: (event) =>
          uiEvent = event.originalEvent

          offset = $(event.target).offset()
          xOffset = uiEvent.pageX - offset.left
          yOffset = uiEvent.pageY - offset.top

          uiEvent.dataTransfer.setDragImage?(
            @$elToGhost.get(0), xOffset, yOffset
          )

      this

    _preventDefault: (event) ->
      event.preventDefault()
