define [
  'text!button-editor-path/tmpl/button-editor.html'
  'template-engine'
  'i18n!button-editor-path/nls/button-editor'
  'galileo-lib/modules/services/usage-tracking'
  'underscore'
  'galileo-lib/modules/services/activation-service'
  'galileo-lib/modules/util/console'
  'galileo-lib/modules/events'
  'backbone'
  'galileo-lib/modules/fed-components/views/modal-view'
  'galileo-lib/modules/views/link-modal/link-modal-view'
  'galileo-lib/modules/services/font-management-service'
  'galileo-lib/modules/services/color-picker-service'
  'galileo-lib/modules/utils'
  'uiBasePath/core/components/ccTools/ctct.src'
  'jquery-ui'
  'button-editor-path/lib/galileo-jquery-ui-mobile-shim'
], (template, mustache, i18n, usageTracking, _, activationService,
    utilConsole, galileoEvents, Backbone, ModalView, LinkModalView, fontManagementService, colorPickerService, utils) ->

  LinkModalView = LinkModalView.default

  BUTTON_SELECTED_CLASS = 'e-btn-selected'

  _ ?= window._

  # IE9 and the color picker got beef. This prevents the
  # "are you sure you want to leave" message.
  $(document).on(
    'click',
    '''
    #aloha-justifyleft,
    #aloha-justifycenter,
    #aloha-justifyright,
    [data-js=font-family-dropdown] a[data-val],
    [data-js=delete-button],
    #fontsize-dropdown-btn-group a[data-val]
    '''
    (e) ->
      e.preventDefault()
  )

  parseCSV = (csv) ->
    csv.split(/,\s?/)

  debounce = (delay, fn) ->
    _.debounce (-> fn.call(this)), delay

  needToUpdateModel = false
  # Defines the view that goes inside the galileo toolbar popup
  # See https://jira.roving.com/browse/VN-1338
  class ButtonEditorView extends Backbone.View
    initialize: (@options = {}) ->
      @atomicDelete = @options.atomicDelete
      @setButtonModel @options.buttonModel
      galileoEvents.on galileoEvents.TYPES.EDITOR_REINIT, @_cleanup

    _cleanup: =>
      @model = null
      @options = null
      galileoEvents.off galileoEvents.TYPES.EDITOR_REINIT, @_cleanup

    events:
      'focusout [data-js=link-input]': 'updateModelLink'
      'keypress [data-js=link-input]': 'delayedPoliteUpdateModel'
      'click [data-action=bold]': 'toggleBold'
      'click [data-action=italic]': 'toggleItalic'
      'click [data-js=font-family-dropdown]' : 'updateModelFontFamily'
      'click [data-js=font-size-dropdown]' : 'updateModelFontSize'
      'click [data-js=delete-button]' : 'triggerRemoveBlock'
      'click #aloha-justifyleft': 'justifyLeft'
      'click #aloha-justifycenter': 'justifyCenter'
      'click #aloha-justifyright': 'justifyRight'
      'click [data-js=test-link-button]': 'testLink'
      'click [data-js=done-button]': 'done'
      'click [data-js=link-button]': 'showLinkModal'
      'mouseenter [data-js=delete-button]': '_highlightBlock'
      'mouseleave [data-js=delete-button]': '_highlightBlock'
      # The next four are just about preventing IE from interpreting <ENTER> as
      # a form submission (VN-2890)
      'submit': 'justDont'
      'keypress input': 'stopSubmitOnEnter'
      'keydown input': 'stopSubmitOnEnter'
      'keyup input': 'stopSubmitOnEnter'

    # Internal: Make sure that an event effect is NIL
    justDont: (e) ->
      e.preventDefault()
      e.stopImmediatePropagation()
      false

    toggleBold: ->
      @buttonModel.toggleBold()

    toggleItalic: ->
      @buttonModel.toggleItalic()

    stopSubmitOnEnter: (e) ->
      if (e.keyCode or e.which or e.charCode) is 13
        @justDont e
      else
        true

    setButtonModel: (model) ->
      @stopListening @buttonModel if @buttonModel?
      @listenTo model, 'change', (model) => @update(model.changed)
      @listenTo model, 'limit:fontSize', (model) => @update(fontSize: model.attributes.fontSize)
      @listenTo model, 'change:fontSize', (model, changes, options) ->
        unless options?.changedByGalileo
          @trackUsage 'fontsize-dropdown', changes
      @listenTo model, 'change:fontFamily', (model, changes, options) =>
        unless options?.changedByGalileo
          @trackUsage 'fontfamily-dropdown', changes
      @buttonModel = model

    setModel: (model) ->
      @model = model

    setEditor: (editor) ->
      @editor = editor

    setButtonView: (buttonView) ->
      @buttonView = buttonView

    getCalculatedCssProperties: ->
      @buttonView?.getCalculatedCssProperties() or {}

    update: (attributes = @buttonModel.toJSON()) =>
      calculatedCssProperties = @getCalculatedCssProperties()
      for attributeName, value of calculatedCssProperties
        switch attributeName
          when 'fontFamily'
            # If the font family is in quotes, remove the quotes
            fontFamily = utils.string.unquote parseCSV(value)[0]
            @ui.fontFamilyDropdown.val fontFamily
            @ui.fontFamilyButton.css('font-family', value)
          when 'fontSize'
            @ui.fontSizeDropdown.val parseInt value
          when 'fontColor'
            @ui.fontColorPreviewArea.css 'background-color', value
          when 'backgroundColor'
            @ui.colorPreviewArea.css 'background-color', value

      for attributeName, value of attributes
        switch attributeName
          when 'fontWeight'
            @ui.boldButton.addClass BUTTON_SELECTED_CLASS if value is 'bold'
            @ui.boldButton.removeClass BUTTON_SELECTED_CLASS if value is 'normal'
          when 'fontStyle'
            @ui.italicButton.addClass BUTTON_SELECTED_CLASS if value is 'italic'
            @ui.italicButton.removeClass BUTTON_SELECTED_CLASS if value is 'normal'
          when 'alignment'
            switch value
              when 'left'
                @_selectAlignmentButton @ui.alignLeftButton
                @_setAlignmentIcon 'left'
              when 'center'
                @_selectAlignmentButton @ui.alignCenterButton
                @_setAlignmentIcon 'center'
              when 'right'
                @_selectAlignmentButton @ui.alignRightButton
                @_setAlignmentIcon 'right'
          when 'link'
            if not @buttonModel.isValid() and value? and value isnt ''
              @ui.linkInput.parent().addClass('error')
              @ui.testLinkButton.addClass('disabled')
            else
              @ui.linkInput.parent().removeClass('error')
              @ui.testLinkButton.removeClass('disabled')
            @ui.linkInput.val value or ''
      # kill coffeescript loop comprehension
      null

    delayedPoliteUpdateModel: ->
      needToUpdateModel = true
      @delayedUpdateModel()

    delayedUpdateModel: debounce 2000, ->
      @updateModelLink() if needToUpdateModel

    updateModelLink: ->
      needToUpdateModel = false
      @buttonModel.setLink @ui.linkInput.val()

    updateModelFontSize:(e) ->
      fontSize = parseInt e.target.innerHTML
      needToUpdateModel = false
      @buttonModel.set 'fontSize', fontSize

    updateModelFontFamily: (e) =>
      fontFamily = e.target.innerHTML
      needToUpdateModel = false
      fontFamily = fontManagementService.getFamilyForFont fontFamily
      @buttonModel.set 'fontFamily', fontFamily

    _selectAlignmentButton: (theButton) ->
      for otherButton in [@ui.alignLeftButton, @ui.alignCenterButton, @ui.alignRightButton]
        otherButton.removeClass 'e-btn-selected'
      theButton.addClass 'e-btn-selected'

    _setAlignmentIcon: (justify) ->
      @ui.alignDropdown.find 'span'
        .removeClass 'icon-left-justify icon-center-justify icon-right-justify'
        .addClass "icon-#{justify}-justify"

    justifyLeft: ->
      @buttonModel.set 'alignment', 'left'
      @_selectAlignmentButton @ui.alignLeftButton
      @_setAlignmentIcon 'left'
      @trackUsage 'justifyleft'

    justifyCenter: ->
      @buttonModel.set 'alignment', 'center'
      @_selectAlignmentButton @ui.alignCenterButton
      @_setAlignmentIcon 'center'
      @trackUsage 'justifycenter'

    justifyRight: ->
      @buttonModel.set 'alignment', 'right'
      @_selectAlignmentButton @ui.alignRightButton
      @_setAlignmentIcon 'right'
      @trackUsage 'justifyright'

    done: ->
      @model.doneWasClicked true
      if $('[data-editor-type="button"]').hasClass('editable-active')
        activationService.deactivateLayout()
      @trackUsage 'done'

    render: ->
      @$el.html mustache.render template, _.extend @buttonModel.toJSON(),
        nls: i18n, hasEditableURL: @options.hasEditableURL, trashcanVisibility: @_trashcanVisibility()

      $fontFamilyGroup = @$el.find '#fontfamily-dropdown-group'
      fontManagementService.appendFontSelection $fontFamilyGroup

      @ui =
        linkInput: @placeholderShim @$ '[data-js=link-input]'
        colorDropdown: @$ '[data-js=color-dropdown]'
        textColorDropdown: @$ '[data-js=text-color-dropdown]'
        boldButton: @$ '[data-action=bold]'
        italicButton: @$ '[data-action=italic]'
        fontSizeButton: @$ '#fontsize-dropdown'
        fontSizeDropdown: @extendBSDropdown @$ '[data-js=font-size-dropdown]'
        fontFamilyDropdown: @extendBSDropdown @$ '[data-js=font-family-dropdown]'
        fontFamilyButton: @$ '[data-js=font-family-dropdown] [data-js=primary-button]'
        alignDropdown: @$ '#alignment-dropdown'
        alignLeftButton: @$ '#aloha-justifyleft'
        alignCenterButton: @$ '#aloha-justifycenter'
        alignRightButton: @$ '#aloha-justifyright'
        colorPreviewArea: @$ '[data-js=color-preview-area]'
        fontColorPreviewArea: @$ '[data-js=font-color-preview-area]'
        testLinkButton: @$ '[data-js=test-link-button]'
        doneButton: @$ '[data-js=done-button]'
        fontList: @$ '#fontfamily-dropdown-group .dropdown-menu'
        trashcanButton: @$ '[data-js=delete-button]'
        linkButton: @$ '[data-js=link-button]'

      colorPickerService.setupColorPicker
        $clickTarget: @ui.colorDropdown
        $colorTarget: @ui.colorPreviewArea
        onColorPicked: (values) =>
          @buttonModel.setLocalBackgroundColor values.color
          @trackUsage 'color',
          color: values.color, source: values.originatedFrom

      colorPickerService.setupColorPicker
        $clickTarget: @ui.textColorDropdown
        $colorTarget: @ui.fontColorPreviewArea
        onColorPicked: (values) =>
          @buttonModel.fontColor values.color
          @trackUsage 'fontcolor',
          color: values.color, source: values.originatedFrom

      @$('[data-xtoggle=dropdown]').dropdown?()

      @update @buttonModel.toJSON()


    testLink: ->
      return false if @buttonModel.link() is null or
        @buttonModel.link() is '' or not @buttonModel.isValid()
      @model.linkWasTested true
      @trackUsage 'testlink'
      window.open @buttonModel.link(), '_blank'

    trackUsage: (action, detail) ->
      actionsToEvents =
        'justifyleft': 'g_block_action>edit>alignment'
        'justifycenter': 'g_block_action>edit>alignment'
        'justifyright': 'g_block_action>edit>alignment'
        'testlink': 'g_block_action>edit>test button'
        'fontcolor': 'g_block_action>edit>fontcolor'
        'fontfamily-dropdown': 'g_block_action>edit>fontface'
        'fontsize-dropdown': 'g_block_action>edit>fontsz'
        'done': 'g_block_action>edit>done'
        'color': 'g_block_action>edit>bckgrnd color'
        'triggerRemoveBlock': 'g_block_action>content>delete'

      justifyDetail =
        'justifyright': 'g_right'
        'justifycenter': 'g_center'
        'justifyleft': 'g_left'

      if action.indexOf('justify') isnt -1
        detail = justifyDetail[action]

      if action is 'fontcolor' or action is 'color'
        detail = "#{detail.source}:#{detail.color}"

      context =
        actionIdentifier: actionsToEvents[action]
        blockTitle: 'g_Button'
      context.blockDetail = detail if detail?
      event = actionsToEvents[action]
      usageTracking.track 'editor_action', context

    # Public: Extend a twitter bootstrap dropdown widget so that it can be
    #         used somewhat like an HTML select element. It's only a method
    #         rather than a stand-alone function to make it easy to test but at
    #         some point it should be stand-alone.
    #
    # $o - a jQuery object
    #
    # Returns the argued jQuery object
    extendBSDropdown: ($o) ->
      activeItem = $o.find('.active')
      newActiveItem = null
      oldVal = null
      $button = $o.find('[data-js=primary-button]')
      $o.val = (val, triggerChange = false) ->
        if val?
          $button.text val
          $o.data('val', val)
          if oldVal isnt val and triggerChange
            # this will update the model, due to event bindings
            # so we've added a flag to prevent recursion if we're
            # just setting the dropdown's value from the model
            $o.trigger 'change'
          activeItem?.removeClass 'active'
          activeItem = newActiveItem or $o.find("[data-val='#{val}']")
          activeItem.addClass 'active'
          oldVal = val
        else
          $button.text()
      $o.find('li a').click (e) ->
        newActiveItem = $(e.target)
        val = newActiveItem.data('val')
        $o.val val, true
      $o

    placeholderShim: ($o) ->
      if not Modernizr.input.placeholder
        originalMethod = _.bind $o.val, $o

        $o.on 'focusin', ->
          if originalMethod() is $o.attr 'placeholder'
            originalMethod ''

        $o.on 'focusout', ->
          if originalMethod() is ''
            originalMethod $o.attr 'placeholder'

        $o.val = (value) ->
          if value?
            if value is ''
              originalMethod $o.attr 'placeholder'
            else
              originalMethod value
          else
            value = originalMethod()
            if value isnt $o.attr 'placeholder'
              value
            else
              ''
        originalMethod $o.attr 'placeholder'
      $o

    setupDeleteAtomicContent: (dac, galileoEvents, layoutEditor, editorName) ->
      @dac = dac
      @galileoEvents = galileoEvents
      @layoutEditor = layoutEditor
      @editorName = editorName

    triggerRemoveBlock: ->
      @trackUsage('triggerRemoveBlock')
      @dac.default.triggerRemoveBlock(@layoutEditor, @galileoEvents, @editorName)
      activationService.deactivateLayout()
      @model.doneWasClicked true

    _highlightBlock: (evt) ->
      toggle = evt.type is 'mouseenter'
      @editor.events.trigger 'highlight-block', toggle

    showLinkModal: (event) ->
      event.preventDefault()

      modal = new ModalView
        disableClose: true
        childView: new LinkModalView
          text: @buttonView.findTextContainer().text()
          textLabel: i18n.link_text_label
          link: @buttonModel.get('link')
          type: @buttonModel.get('linkType') or 'web'
          addCallback: (link, body, type, style) => @addOrUpdateLink link, body, type, style
          removeCallback: @removeLink

      modal.show()


    addOrUpdateLink: (link, text, type, style) =>
      @buttonModel.set 'link', link
      @buttonModel.set 'text', text
      @buttonModel.set 'linkType', type
      @buttonView.render()

    removeLink: =>
      @buttonModel.set 'link', null
      @buttonModel.set 'linkType', null

    # To show or not to show the toolbar trashcan icon.
    #
    # Some layout editors support the deletion of atomic
    # images and others do not. This value will be passed
    # to the template.
    #
    # returns either *visible* or *hidden*
    #
    _trashcanVisibility: ->
      if @atomicDelete
        'visible'
      else
        'hidden'
