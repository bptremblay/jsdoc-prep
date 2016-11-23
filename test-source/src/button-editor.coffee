#fixed constructor order in class
$ define [
  'jquery'
  'underscore'
  'backbone'
  'template-engine'
  'galileo-lib/modules/events'
  'galileo-lib/modules/services/descriptors/content/button-content-descriptor'
  'button-editor-path/delete-atomic-content'
  'button-editor-path/state-migrations'
  'button-editor-path/button-model'
  'button-editor-path/button-view'
  'button-editor-path/button-editor-view'
  'button-editor-path/editor-model'
  'button-editor-path/legacy-color-check'
  'toolbar'
  'text!button-editor-path/tmpl/button.html'
  'i18n!button-editor-path/nls/button-editor'
  'text!button-editor-path/tmpl/content-decorator.html'
  'button-editor-path/lib/change-element-type.jquery'
  'css!button-editor-path/css/button-editor'
], ($, _, Backbone, Mustache, galileoEvents, ButtonContentDescriptor, deleteAtomicContent, stateMigrations,
ButtonModel, ButtonView, ButtonEditorView, ButtonEditorModel, legacyColorCheck, toolbar,
buttonTemplate, i18n, contentDecorator) ->

  buttonEditorView = null

  galileoEvents.on galileoEvents.TYPES.EDITOR_REINIT, ->
    buttonEditorView = null

  scrapeStyleFromHTML = (html) ->
    falsyDefaults = (obj, defaults) ->
      for own key, value of defaults
        if value and not obj[key]
          obj[key] = defaults[key]

    stripQuotes = (string) ->
      quoteRegex = /['"]([^']*)['"]/
      matches = quoteRegex.exec(string)
      if matches?
        matches[1]
      else
        string

    styleObject = (o) ->
      retval = {}
      for pair in o.cssText.split /;\s?/
        [key, value] = pair.split /:\s?/
        if key? and value?
          key = "#{key}"
          retval[key] = value
      retval

    $el = $(html)
    el = $el[0]
    style = _.extend {}, styleObject el.style

    for own key, value of style
      style[key] = stripQuotes value

    $el.find('[style]').each ->
      falsyDefaults style, styleObject @style
      for own key, value of style
        style[key] = stripQuotes value

    style

  findText = (markup) ->
    $('.MainTextFullWidth', markup).text()
    # A way that wouldn't depend on how the markup is written but doesn't
    # seem to work in some situations:
    # textNodeFilter = -> @nodeType is 3
    # @$el.contents().filter(textNodeFilter).parent()

  class ButtonEditor
    constructor: (@layoutEditor, @config) ->
      @events = _.extend {}, Backbone.Events
      @buttonModel = new ButtonModel @state
      @model = new ButtonEditorModel @state
      @buttonView = new ButtonView
        model: @buttonModel
        editorModel: @model
        editor: this
        contentMovable: @config.featureSupport.contentMove
        descriptorProviderFn: @config.descriptorProviderFn

      Backbone.listenTo @model, 'change:doneWasClicked', =>
        toolbar.hide()
        @model.doneWasClicked false

      # For some unknown reason using `Backbone.listenTo` wasn't working
      # here, so using `Model::on` instead.
      # Backbone.listenTo @buttonModel, 'change', @_stateUpdated
      @buttonModel.on 'change', @_stateUpdated, this

      galileoEvents.on galileoEvents.TYPES.EDITOR_REINIT, @_cleanup

      # VN-3024: Backbone will trigger a change event for each field updated,
      # debounce the stateUpdated event handler to group changes into a single
      # state change
      @_lazyUpdate = _.debounce ->
        @config.eventHandlers.stateUpdated this
      , 10, true

      Backbone.listenTo @buttonModel, 'change:alignment', =>
        # This needs to be deferred because the button view needs to be re-rendered
        # before updating the toolbar, or else the toolbar will be rendered in
        # the previous (incorrect) location.
        if toolbar.getToolbar().is(':visible')
          _.defer =>
            toolbar.updateAndShow @buttonView.$el, 'button-editor-tools', 'button tools'

      # Prevent toolbar from closing when user clicks on the color picker
      # by adding the color picker to what the toolbar considers part of
      # itself.
      toolbar.registerToolbarEventCondition (evt) ->
        clickTarget = evt.originalEvent.target
        $(clickTarget).closest('#colorPicker').length













































    _cleanup: =>
      galileoEvents.off galileoEvents.TYPES.EDITOR_REINIT, @_cleanup
      @buttonView.editor = null
      @buttonModel.off()
      Backbone.stopListening(@model)

    @createMarkup: (contentDescriptor) ->
      Mustache.render buttonTemplate, contentDescriptor

    @getContentDescriptors: ->
      [
        new ButtonContentDescriptor
          thumbnailUrl: require.toUrl 'button-editor-path/img/button.svg'
          payload:
            text: i18n.placeholder_text
      ]

    @getContentDecorators: (contentId) ->
      decoPropName = contentId + '!' + contentId
      # pull this in from an external file (module)
      result = {}
      result[decoPropName] = {
        fromEditor: true,
        version: '1.1.0',
        markup: contentDecorator
      }
      result

    # Returns the content display element for the editor,
    # wrapped in the expected object.
    # @return [Array] An array of content decorators.
    @getContentDisplayElement: ->
      result = {
        fromEditor: true,
        version: '1.0.0',
        markup: buttonTemplate
      }
      result

    getStateVersion: ->
      major: 1
      minor: 2
      patch: 0

    getStateMigrations: ->
      stateMigrations

    $: Backbone.View::$

    renderForEdit: ->
      @$el

    renderForPublish: =>
      $html = @$el.clone()
      $html.find('[data-gl-remove-on-publish]').remove()
      $html.find('.MainTextFullWidth > div')
        .attr
          'href': @buttonModel.get('link') or '#'
          'data-original-href': @buttonModel.get('link')
          'contentEditable': false
        .changeElementType('a')

      # auth-platform will reject the document if it contains &quot;
      # Some browsers (Chrome, Firefox) will change this to a %22 which
      # will also be rejected by auth-platform.
      # change them to single quotes (this will be for the font-family)
      $html[0].outerHTML.replace /&quot;/g, ''

    setStyles: ->

    getState: ->
      _.extend @state, @model.toJSON(), @buttonModel.toJSON()

    setState: (state) ->
      @state = _.extend @createState(), state
      @buttonModel.set state, changedByGalileo: true
      undefined

    init: =>
      @$el = Backbone.$(@state.markup)
      @$el.attr 'data-editor-name', @_getName()
      originalHref = @$el.find('[href]').attr 'href'
      @hasEditableURL = originalHref?.indexOf('${') is -1
      if not @hasEditableURL then @buttonModel.setLink originalHref,
                          noProtocol: true, changedByGalileo: true

      $button = @$el.find('table')

      @_setupToolbar() unless buttonEditorView?
      @buttonEditorView = buttonEditorView
      @buttonView.setElement($button).render()
      @buttonView.$el.on 'click', =>
        buttonEditorView.setButtonView @buttonView
        buttonEditorView.setModel @model
        buttonEditorView.setButtonModel @buttonModel
        buttonEditorView.setEditor this
        buttonEditorView.update()
        toolbar.updateAndShow @buttonView.$el, 'button-editor-tools', 'button tools'
        @_setupDeleteAtomicContent()

    receiveMessage: (type, data) ->

    activate: ->

    deactivate: ->
      toolbar.hide()

    destroy: ->

    getDefaultColorId: ($hovered) ->
      # determine if we're changing the text color or the bg color
      colorId = $hovered.data('style-color')
      unless colorId?
        colorId = @$el.find('[data-style-background-color]').data('style-background-color')
      colorId.toLowerCase()

    applyColors: (colors, preview) ->

      if @buttonModel.usingLocalColors()
        return true
      unless legacyColorCheck.usesLegacyGlobalColors($ @buttonModel.get 'markup')
        return true

      # Other wise, apply global colors using this legacy behavior
      get = (cssColorProperty) =>
        key = $('<div>').append(@state.markup)
          .find("[data-style-#{cssColorProperty}]")
          .data("style-#{cssColorProperty}")?.toLowerCase()
        colors[key]

      unless preview
        if get('background-color')?
          @buttonModel.setGlobalBackgroundColor get('background-color'),
                                                changedByGalileo: true

        if get('color')?
          @buttonModel.fontColor get('color'), changedByGalileo: true

      false

    _setupDeleteAtomicContent: ->
      @buttonEditorView.setupDeleteAtomicContent(deleteAtomicContent, galileoEvents, @layoutEditor, @_getName())

    _setupToolbar: ->
      buttonEditorView = new ButtonEditorView
        model: @model
        buttonModel: @buttonModel
        hasEditableURL: @hasEditableURL
        atomicDelete: @_atomicDelete(@config)
      buttonEditorView.setElement(toolbar.getTools 'button-editor-tools', '').render()

    # Determines if atomic delete functionality should be enabled.
    #
    # @return [boolean] true if the editor config's featureSupport.contentDeletion flag is set to true;
    #                   false if it is set to false or if featureSupport does not contain a
    #                   contentDeletion flag
    _atomicDelete: ->
      @config.featureSupport?.contentDeletion or false

    _stateUpdated: (model, options) =>
      if not options?.changedByGalileo
        @_lazyUpdate this

  ButtonEditor.import = (markup, name) ->
    style = scrapeStyleFromHTML(markup)
    state =
      markup: markup
      color: style['background-color']
      fontColor: style['color'] or ''
      fontFamily: style['font-family'] or ''
      fontSize: style['font-size']?.replace('px', '') or ''
      text: findText(markup)

    $button = $ markup
    markupAlignment = $button.find('td:first').attr('align')
    if markupAlignment
      state.alignment = markupAlignment

    $.Deferred().resolve(state).promise()

  ButtonEditor
