#fixed constructor order in class
define [
  'underscore'
  'backbone'
  'button-editor-path/legacy-color-check'
  'i18n!button-editor-path/nls/button-editor'
  'galileo-lib/modules/services/url-validator-service'
], (_, Backbone, legacyColorCheck, i18n, UrlValidator) ->

  _ ?= window._

  class ButtonModel extends Backbone.Model
    constructor: ->
      super
      @[method] ?= @_makeGetOrSet method for method in _.keys ButtonModel::defaults
      @fontSize = (val, options) ->
        if val?
          newval =
          if not isNaN parseInt val
            Math.max(0, Math.min val, @FONT_SIZE_MAX_VALUE)

          if newval isnt val
            @trigger 'limit:fontSize', this
            val = newval
          @set 'fontSize', val, options
        else
          @get 'fontSize'

    FONT_SIZE_MAX_VALUE: 48
    defaults:
      link: null
      linkType: 'web'
      text: i18n.placeholder_text
      backgroundColor:
        global: '#494'
        local: 'transparent'
      height: 24
      alignment: 'center'
      fontColor: ''
      fontFamily: ''
      fontSize: ''
      fontWeight: 'normal'
      fontStyle: 'normal'

















    _makeGetOrSet: (attr) ->
      (val, options) ->
        if val?
          @set attr, val, options
        else
          @get attr, val

    _cleanURL: (url) ->
      url = url.replace(/^http:\/\//, '').trim()
      # decode first because '%20' becomes '%2520' otherwise
      encodeURI decodeURI url if url.indexOf ' ' is not -1

    validate: (attrs, options) ->
      if attrs.link?
        urlValidator = new UrlValidator attrs.link

        unless urlValidator.isValid()
          return urlValidator.getError()

    getError: ->
      if not @isValid()
        @validationError

    setLink: (val, options) ->
      if not val
        @set 'link', null, options
        return

      val = val.trim()
      val = @_cleanURL val unless options?.noProtocol
      if options?.noProtocol
        @set 'link', val, options
      else if /^.+:/.test(val)
        @set 'link', val, options
      else if /^[\w\.-]+@[\w\.-]+\.\w+/.test(val)
        @set 'link', "mailto:#{val}", options
      else
        @set 'link', "http://#{val}", options

    toggleBold: ->
      @_toggle 'fontWeight', ['bold', 'normal']

    toggleItalic: ->
      @_toggle 'fontStyle', ['italic', 'normal']

    _toggle: (propertyName, options) ->
      property = @get propertyName
      if property is options[0]
        @set propertyName, options[1]
      else
        @set propertyName, options[0]

    usingLocalColors: ->
      @backgroundColor().local isnt 'transparent'

    getBackgroundColor: ->
      if @usingLocalColors()
        @backgroundColor().local
      else if legacyColorCheck.usesLegacyGlobalColors($ @get 'markup')
        @backgroundColor().global
      else ''

    setGlobalBackgroundColor: (newColor, options) ->
      setColorAttr(this, 'backgroundColor', 'global', newColor, options)

    setLocalBackgroundColor: (newColor) ->
      setColorAttr(this, 'backgroundColor', 'local', newColor)

    setColorAttr = (that, colorAttr, type, newColor, options) ->
      bgColor = _.clone that.get(colorAttr) # ensures change event is triggered
      bgColor[type] = newColor
      that.set colorAttr, bgColor, options
