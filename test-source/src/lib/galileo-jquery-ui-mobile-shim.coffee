#fixed constructor order in class
define [
  'jquery',
  'underscore'
  'jquery-ui',
], ($, _) ->

  _ ?= window._
  debounce = (delay, fn) ->
    _.debounce (-> fn.apply(this, arguments)), delay

  DEVICE_WIDTH_THRESHOLD_PX = 769

  # Public: Make the shim available as a jQuery plugin. This plugin is 'meta'
  #         in that it modifies another plugin. Currently it only supports
  #         jquery.ui.spinner
  #
  # pluginName - unique identifier of the plugin to be shimmed, e.g. 'spinner'
  # options - the options that would normally be passed directly to the
  #           plugin's init method
  #
  # Returns this
  $.fn.mobileFriendly = (pluginName, options) ->
    createShim(this, pluginName, options)
    this

  # Internal: Do the actual setting up of the shim based on `pluginName`
  #
  # $input - a jquery object
  # pluginName - unique identifier of the plugin to be shimmed, e.g. 'spinner'
  # options - the options that would normally be passed directly to the
  #           plugin's init method
  #
  # Returns $input
  createShim = ($input, pluginName, options = {}) ->
    options.isMobile ?= screen.availWidth <= DEVICE_WIDTH_THRESHOLD_PX
    if options.isMobile
      view =
      switch pluginName
        when 'spinner'
          new SpinnerView($input, options)
      view.render()
      $input
    else
      options.spin = options.valueChanged
      $input[pluginName] options
      callValueChanged = (e) ->
        options.valueChanged e, value: $input.val()
      $input.keyup debounce 1500, callValueChanged
      $input.on 'focusout blur', callValueChanged
      $input.keypress (e) ->
        if (e.keyCode or e.which or e.charCode) is 13
          callValueChanged(e)

  allViewInstances = []
  $(document).on 'tap taphold click vclick', (event) ->
    for instance in allViewInstances
      if $(event.target).parents().filter(instance.$el).size() is 0
        instance.onFocusOut(event)

  # Creates and manages the shim for a jquery.ui.spinner
  class SpinnerView
    constructor: (@$input, @options = {}) ->
      @$el = @$input.parent()
      @options.min ?= parseInt @$input.attr('aria-valuemin')
      @options.max ?= parseInt @$input.attr('aria-valuemax')
      @cssClasses =
        dropDownClass: @options.dropDownClass or 'mobile-dropdown'
        dropDownOptionClass: @options.dropDownOptionClass or 'mobile-option'

      @$input._jqueryVal = @$input.val
      # Public: get or set the current value of the input
      #
      # val - if defined, will become the new value
      #
      # Returns either `this` when setting or a String when getting.
      @$input.val = (val) =>
        if val?
          @val(val)
          @$input._jqueryVal(val)
        else
          @$input._jqueryVal()
      @$input.__view__ = this
      allViewInstances.push this

    # Internal: call the init method of the plugin
























    constructPlugin: (options) ->
      @$input.spinner options

    # Internal: Template for the "dropdown" markup
    #
    # Returns a String of HTML
    dropdownTemplate: ->
      options = (@optionTemplate(i) for i in [@options.min..@options.max])
      """
      <div
        class='#{@cssClasses.dropDownClass} numselect-container'
        style='width: #{@$input.width()}px;'
        >
        #{options.join ''}
      </div>
      """

    # Internal: Template for each option element in the "dropdown" markup
    #
    # Returns a String of HTML
    optionTemplate: (optionValue) ->
      shouldBeSelected = =>
        optionValue is parseInt @$input._jqueryVal()
      """
      <div
        class='#{@cssClasses.dropDownOptionClass} numselect-option #{if shouldBeSelected() then 'selected' else ''}'
        data-value='#{optionValue}'>
          #{optionValue}
      </div>
      """

    # Public: Manifest the shim in the DOM and rig up all necessary event
    #         handlers.
    #
    # Returns this
    render: ->
      @constructPlugin @options

      # The top level element needs to be relatively positioned so that the
      # dropdown and hotspot can be positioned against it.
      @$el.css
        'position': 'relative'

      @$hotspot = $('<div class="mobile-hotspot" style="height: 100%; width: 100%;"></div>')
      @$hotspot
        .append @$dropDown = $(@dropdownTemplate())
      @$el.prepend(@$hotspot)

      @positionDropdown()

      @val @$input._jqueryVal()

      # Event Handlers
      @$hotspot.on 'tap taphold click vclick', (e) =>
        # prevent the click event that mobile browsers
        # send after touch events
        e.preventDefault()
        @val @$input._jqueryVal()
        @showDropdown()

      # Don't listen on 'tap' events because those are fired even when the user
      # attempts to scroll/drag
      @$dropDown.on 'click vclick', '.numselect-option', (e) =>
        e.stopImmediatePropagation()
        value = $(e.target).data 'value'
        if value isnt @$input._jqueryVal()
          @$input.trigger 'change', value: value
        @$input._jqueryVal value
        @hideDropdown()

      @$input.change (event, o) =>
        o ?= value: @$input._jqueryVal()
        @options.valueChanged?(event, o)
        @options.spin?(event, o)
      this

    # Internal: Cause the argued element to be the "selected" option
    #
    # element - a DOMElement
    #
    # Returns this
    selectOptionElement: (element) ->
      @$selectedOption?.removeClass('selected')
      @$selectedOption = $(element)
      @$selectedOption.addClass('selected')
      @scrollToSelectOption()
      this

    # Internal: Get or set which value is displayed as selected in the shim but
    #           do not change the value of the underlying input. If a `val` is
    #           argued the method acts as a setter, otherwise it acts as a
    #           getter.
    #
    # val - a String, if given
    #
    # Returns this or a String
    val: (val) ->
      if val?
        $element = @$dropDown.find("[data-value='#{val}']")
        @selectOptionElement $element if $element.size() > 0
      else
        @$selectedOption.data('value')

    # Internal: set the position of the "dropdown" element relative to the
    #           underlying input element.
    #
    # Returns this
    positionDropdown: ->
      @$dropDown.css {
        top: -(@$dropDown.height() / 2) + (@$input.height() / 2),
        left: 0
      }
      this

    # Internal: Scroll the "dropdown" so that the selected option is at the top
    #           of its visible area
    #
    # Returns this
    scrollToSelectOption: ->
      @$dropDown.scrollTop @$selectedOption.index() * @$selectedOption.outerHeight()
      this

    # Internal: Self-explanatory.
    #
    # Returns this
    showDropdown: (element) ->
      @$dropDown.show()
      @scrollToSelectOption()
      this

    # Internal: Self-explanatory.
    #
    # Returns this
    hideDropdown: ->
      @$dropDown.hide()
      this

    onFocusOut: -> @hideDropdown()

  create: createShim
  SpinnerView: SpinnerView

