define [
  'underscore'
  'button-editor-path/button-model'
  'button-editor-path/move-handle-view'
  'backbone'
  'button-editor-path/lib/change-element-type.jquery'
], (_, ButtonModel, MoveHandleView, Backbone) ->

  KEY_CODE_TAB = 9
  KEY_CODE_END = 35
  KEY_CODE_HOME = 36
  KEY_CODE_UP = 38
  KEY_CODE_DOWN = 40
  KEY_CODE_INSERT = 45
  KEY_CODE_B = 66
  KEY_CODE_I = 73

  _ ?= window._

  $.fn.stripHTML = ->
    @html @text()

  class ButtonView extends Backbone.View

    initialize: (params) ->
      @editor = params.editor
      @contentMovable = params.contentMovable
      @descriptorProviderFn = params.descriptorProviderFn
      Backbone.listenTo @model, 'change', @update
      Backbone.listenTo @editor.events, 'highlight-block', @highlightBlock

    events:
      'focusout': 'deactivate'

    deactivate: ->
      if @editableContent().length is 0
        @editableContent(ButtonModel::defaults.text)

    onPossibleTextChange: (e) ->
      if e.type is 'paste'
        $(e.target).stripHTML()

    onKeyDown: (e) =>
      isMetaKey = (keyCode) ->
        keyCode in [
          KEY_CODE_TAB
          KEY_CODE_END
          KEY_CODE_HOME
          KEY_CODE_UP
          KEY_CODE_DOWN
          KEY_CODE_INSERT
        ]

      @preventSystemFormatting e

      if @isBoldAccelerator e
        @model.toggleBold()
        @findTextContainer().focus()
      else if @isItalicAccelerator e
        @model.toggleItalic()
        @findTextContainer().focus()
      else if isMetaKey(e.keyCode)
        e.preventDefault()
        e.returnValue = false # Thanks, IE
        false

    isBoldAccelerator: (e) ->
      @isAccelerator(e) and e.keyCode is KEY_CODE_B

    isItalicAccelerator: (e) ->
      @isAccelerator(e) and e.keyCode is KEY_CODE_I

    isAccelerator: (e) ->
      e.ctrlKey or e.metaKey

    # The system bold and italic functions only operate on the
    # selected text, similar to how the text editor works. In the case
    # of button, we want the formatting to apply across the entire button text.
    preventSystemFormatting: (e) ->
      if @isBoldAccelerator(e) or @isItalicAccelerator(e)
        e.preventDefault()

    saveText: =>
      newText = @editableContent()
      if newText isnt @model.text()
        @model.text newText

    editableContent: (val) ->
      if val?
        @findTextContainer().text val
      else
        @findTextContainer().text()

    update: (model, options) =>
      changed = @model.changed

      if options?.changedByGalileo or
          not changed.text?
        @render()

    render: ->
      json = @model.toJSON()

      buttonText = _.escape(json.text).trim()

      @$el.css
        'background-color': @model.getBackgroundColor()

      @$el.parent().attr 'align', json.alignment

      textStyleObject = {}
      $textContainer = @findTextContainer()

      textStyleObject['color'] = json.fontColor
      textStyleObject['font-size'] = if json.fontSize then "#{json.fontSize}px" else ''
      textStyleObject['font-family'] = json.fontFamily
      textStyleObject['font-weight'] = json.fontWeight
      textStyleObject['font-style'] = json.fontStyle

      $textContainer.html(buttonText)
        .css textStyleObject
        .attr
          'contentEditable': 'true'
          'data-original-href': json.link
        .changeElementType('div') # NOTE: returns a new, distinct JQuery selector object!
        .on('keydown', @onKeyDown)
        .on('keydown paste blur', (_.debounce @onPossibleTextChange, 100))
        .on('keydown paste blur', (_.debounce @saveText, 1000))

      if @contentMovable and _.isFunction(@descriptorProviderFn)
        moveHandle = new MoveHandleView
          descriptorProviderFn: @descriptorProviderFn
          $elToGhost: @$el

        @$('td').append moveHandle.render().$el

      this

    getCalculatedCssProperties: ($textContainer = @findTextContainer()) ->
      properties =
        fontColor: $textContainer.css 'color'
        fontSize: $textContainer.css 'font-size'
        fontFamily: $textContainer.css('font-family')
        backgroundColor: @$el.css 'background-color'

    findTextContainer: ->
      @$('.MainTextFullWidth > a, .MainTextFullWidth > div')
      # A way that wouldn't depend on how the markup is written but doesn't
      # seem to work in some situations:
      # textNodeFilter = -> @nodeType is 3
      # @$el.contents().filter(textNodeFilter).parent()

    highlightBlock: (toggle) =>
      @$el.toggleClass 'delete-hover', toggle

    publishHTML: ->
      @el.outerHTML
