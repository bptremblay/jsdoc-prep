define [
  'galileo-lib/modules/services/usage-tracking'
  'button-editor-path/button-editor-view'
  'button-editor-path/editor-model'
  'button-editor-path/button-model'
  'button-editor-path/delete-atomic-content'
  'galileo-lib/modules/services/activation-service'
  'spec/support/sandbox'
], (usageTracking, EditorView, EditorModel, ButtonModel, deleteAtomicContent, activationService, sandbox) ->

  describe 'SiteCat', ->

    beforeEach ->
      sandbox().for('button-editor-view').html """
        <p>
          The Button Editor View:
          <div id='button-editor-view'></div>
        </p>
      """
      @model = new EditorModel()
      @buttonModel = new ButtonModel()
      @view = new EditorView
        model: @model
        buttonModel: @buttonModel
        el: '#button-editor-view'
        hasEditableURL: true
      spyOn usageTracking, 'track'
      @view.render()

    it 'tracks usage of the done button', ->
      $('[data-js=done-button]').click()

      expect(usageTracking.track).toHaveBeenCalledWith('editor_action'
        actionIdentifier: 'g_block_action>edit>done',
        blockTitle: 'g_Button'
      )

    it 'tracks usage of the right justify button', ->
      $('[data-test-id="justifyright"]').click()

      expect(usageTracking.track).toHaveBeenCalledWith('editor_action'
        actionIdentifier: 'g_block_action>edit>alignment',
        blockDetail: 'g_right',
        blockTitle: 'g_Button'
      )

    it 'tracks usage of the left justify button', ->
      $('[data-test-id="justifyleft"]').click()

      expect(usageTracking.track).toHaveBeenCalledWith('editor_action'
        actionIdentifier: 'g_block_action>edit>alignment',
        blockDetail: 'g_left',
        blockTitle: 'g_Button'
      )

    it 'tracks usage of the center justify button', ->
      $('[data-test-id="justifycenter"]').click()

      expect(usageTracking.track).toHaveBeenCalledWith('editor_action'
        actionIdentifier: 'g_block_action>edit>alignment',
        blockDetail: 'g_center',
        blockTitle: 'g_Button'
      )

    it 'tracks usage of the background color dropdown', ->
      $backgroundColorDropdown = @view.$el.find('[data-js="color-dropdown"]')
      $colorChip = $backgroundColorDropdown.find('.ColorPicker-colorChip:eq(2)')
      $colorChip.click()
      expectedColor = $colorChip.data 'color-code'

      expect(usageTracking.track).toHaveBeenCalledWith('editor_action'
        actionIdentifier: 'g_block_action>edit>bckgrnd color',
        blockTitle: 'g_Button',
        blockDetail: "standard:#{expectedColor}"
      )

    it 'tracks usage of the font color dropdown', ->
      $fontColorDropdown = @view.$el.find('[data-js="text-color-dropdown"]')
      $colorChip = $fontColorDropdown.find('.ColorPicker-colorChip:eq(2)')
      $colorChip.click()
      expectedColor = $colorChip.data 'color-code'

      expect(usageTracking.track).toHaveBeenCalledWith('editor_action'
        actionIdentifier: 'g_block_action>edit>fontcolor',
        blockTitle: 'g_Button',
        blockDetail: "standard:#{expectedColor}"
      )

    it 'tracks usage of the font family dropdown', ->
      items = @view.ui.fontFamilyDropdown.find('li a')
      first_item = $ items[0]
      expectedFont = first_item.data('val')
      first_item.click()

      expect(usageTracking.track).toHaveBeenCalledWith('editor_action'
        actionIdentifier: 'g_block_action>edit>fontface',
        blockDetail: expectedFont,
        blockTitle: 'g_Button'
      )

    it 'tracks usage of the font size spinner', ->
      @buttonModel.fontSize '22'
      expect(usageTracking.track).toHaveBeenCalledWith('editor_action'
        actionIdentifier: 'g_block_action>edit>fontsz',
        blockDetail: 22,
        blockTitle: 'g_Button'
      )

    it 'tracks usage of the delete button', ->
      layoutEditor =
        _getInstanceId: ->
          'g_block_action'
      galileoEvents =
        trigger: (evt, id, name) ->
          'trigger_return'

      spyOn deleteAtomicContent.default, 'triggerRemoveBlock'
      spyOn(activationService, 'deactivateLayout')

      @view.setupDeleteAtomicContent(deleteAtomicContent, galileoEvents, layoutEditor, 'g_Button')
      $('[data-js=delete-button]').click()

      expect(usageTracking.track).toHaveBeenCalledWith('editor_action'
        actionIdentifier: 'g_block_action>content>delete',
        blockTitle: 'g_Button'
      )
