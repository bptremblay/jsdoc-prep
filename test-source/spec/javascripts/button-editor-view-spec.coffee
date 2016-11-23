define [
  'underscore'
  'backbone'
  'button-editor-path/button-editor-view'
  'button-editor-path/editor-model'
  'button-editor-path/button-model'
  'spec/support/sandbox'
], (_, Backbone, View, Model, ButtonModel, sandbox) ->

  describe 'The button editor view', ->
    editor = null
    view = null
    model = null
    buttonModel = null
    galileoAppended = false

    beforeEach ->
      sandbox().for('button-editor-view').html """
        <p>
          The Button Editor View:
          <div id='button-editor-view'></div>
        </p>
      """
      editor = jasmine.createSpy()
      editor.events = _.extend Backbone.Events
      model = new Model()
      buttonModel = new ButtonModel()
      view = new View
        model: model
        buttonModel: buttonModel
        el: '#button-editor-view'
        editor: editor
        hasEditableURL: true
      view.render()

    describe 'The trashcan icon', ->
      it 'should be hidden if atomicDelete is false', ->
        view = new View
          model: model
          buttonModel: buttonModel
          el: '#button-editor-view'
          hasEditableURL: false
          atomicDelete: false
        view.render()

        expect(view.ui.trashcanButton.css 'visibility').toBe 'hidden'

      it 'should be visible if atomicDelete is true', ->
        view = new View
          model: model
          buttonModel: buttonModel
          el: '#button-editor-view'
          hasEditableURL: false
          atomicDelete: true
        view.render()

        expect(view.ui.trashcanButton.css 'visibility').toBe 'visible'

    describe '_highlightBlock', ->

      beforeEach ->
        view.setEditor editor
        spyOn editor.events, 'trigger'

      it 'produces highlight-block event on mouse enter', ->
        view.ui.trashcanButton.mouseenter()
        expect(editor.events.trigger).toHaveBeenCalledWith 'highlight-block', true

      it 'produces highlight-block event on mouse leave', ->
        view.ui.trashcanButton.mouseleave()
        expect(editor.events.trigger).toHaveBeenCalledWith 'highlight-block', false

    describe 'The italic button', ->

      it 'should set the font style to "italic" when toggled on', ->
        view.ui.italicButton.click()
        expect(buttonModel.get 'fontStyle').toBe 'italic'

      it 'should set the font style to "normal" when toggled off', ->
        view.ui.italicButton.click()
        view.ui.italicButton.click()
        expect(buttonModel.get 'fontStyle').toBe 'normal'

    describe 'The bold button', ->

      it 'should set the font weight to "bold" when toggled on', ->
        view.ui.boldButton.click()
        expect(buttonModel.get 'fontWeight').toBe 'bold'

      it 'should set the font weight to "normal" when toggled off', ->
        view.ui.boldButton.click()
        view.ui.boldButton.click()
        expect(buttonModel.get 'fontWeight').toBe 'normal'

    describe 'The font-family dropdown', ->

      it 'should set the font-family in the model', ->
        items = view.ui.fontFamilyDropdown.find('li a')
        last_item = $ items[items.length - 1]
        expectedFont = last_item.css('font-family').split(' ').join('')
        last_item.click()
        expect(buttonModel.get 'fontFamily').toBe expectedFont

    describe 'The font size dropdown', ->

      it 'should set the font size in the model', ->
        view.$('a[data-val=20]').click()
        expect(buttonModel.fontSize()).toBe 20

    describe 'The justify buttons', ->
      selectedClass = null

      describe 'justify right', ->
        selectedClass = 'e-btn-selected'

        it 'should add the e-btn-selected class to the button', ->
          view.ui.alignRightButton.click()
          expect(view.ui.alignRightButton).toHaveClass selectedClass

        it 'should update the model with the new alignment', ->
          view.ui.alignRightButton.click()
          expect(buttonModel.alignment()).toBe 'right'

      describe 'justify left', ->

        it 'should add the e-btn-selected class to the button', ->
          view.ui.alignLeftButton.click()
          expect(view.ui.alignLeftButton).toHaveClass selectedClass

        it 'should update the model with the new alignment', ->
          view.ui.alignLeftButton.click()
          expect(buttonModel.alignment()).toBe 'left'

      describe 'justify center', ->

        it 'should add the e-btn-selected class to the button', ->
          view.ui.alignCenterButton.click()
          expect(view.ui.alignCenterButton).toHaveClass selectedClass

        it 'should update the model with the new alignment', ->
          view.ui.alignCenterButton.click()
          expect(buttonModel.alignment()).toBe 'center'

    describe 'The done button', ->
      $done = null
      beforeEach ->
        $done = $('[data-js=done-button]')
      describe 'when clicked', ->

        it 'should toggle doneWasClicked', ->
          $done.click()
          expect(model.doneWasClicked()).toBe true

    describe "it's bootstrap dropdown extension", ->
      $dropdown = null

      beforeEach ->
        $dropdown = view.extendBSDropdown $ """
          <div>
            <button data-js='primary-button' data-toggle='dropdown' type='button'>Choose one</button>
          </div>
          <ul class='dropdown-menu'>
            <li>
              <a data-val='one'>one</a>
            </li>
            <li>
              <a data-val='two'>two</a>
            </li>
            <li>
              <a data-val='three'>three</a>
            </li>
            <li>
              <a data-val='four'>four</a>
            </li>
          </ul>
        """

      it 'should trigger a change event when an item is clicked', ->
        wasTriggered = false
        $dropdown.change ->
          wasTriggered = true
        $dropdown.find('[data-val=two]').click()
        expect(wasTriggered).toBe true

      it 'should update the button text when an item is clicked', ->
        $dropdown.find('[data-val=two]').click()
        expect($dropdown.find('[data-js=primary-button]').text()).toBe 'two'

      it 'should set the selected value as a data property on the root element when an item is clicked', ->
        $dropdown.find('[data-val=two]').click()
        expect($dropdown.data('val')).toBe 'two'
