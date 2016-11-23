define [
  'button-editor-path/button-editor'
  'toolbar'
  'jquery'
  'button-editor-path/editor-model'
  'i18n!button-editor-path/nls/button-editor'
], (Editor, toolbar, $, ButtonEditorModel, i18n) ->

  describe 'The Button Editor', ->
    editor = null
    stateUpdatedWasCalled = false
    editorConfig =
      eventHandlers:
        stateUpdated: ->
          stateUpdatedWasCalled = true
      featureSupport:
        contentMove: true
    markup = '''
        <td align="left" valign="top" style="padding: 8px 20px 9px 20px;" class="MainTextFullWidthTD"
          data-editor-type="button" data-editor-name="Button" data-style-background-color="primary">
          <table border="0" cellpadding="0" cellspacing="0" style="width:auto !important;
          background-color: gray;-moz-border-radius: 10px;border-radius: 10px;-webkit-border-radius: 10px;">
            <tr>
              <td align="center" valign="top" style="padding: 9px 20px 10px 20px ;" class="MainTextFullWidthTD">
                <div style="font-family: Arial Black; font-size: 13px; font-weight: bold; line-height: 1.1;
                color: white;">
                  <div>
                    <div class="MainTextFullWidth"><a href="javascript: void 0;" target="_blank"
                    style="text-decoration: none;">Button Text</a></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
        '''

    markup2 = '''
        <td align="left" valign="top" style="padding: 8px 20px 9px 20px;" class="MainTextFullWidthTD"
          data-editor-type="button" data-editor-name="Button" data-style-background-color="primary">
          <table border="0" cellpadding="0" cellspacing="0" style="width:auto !important;
          background-color: gray;-moz-border-radius: 10px;border-radius: 10px;-webkit-border-radius: 10px;">
            <tr>
              <td align="center" valign="top" style="padding: 9px 20px 10px 20px ;" class="MainTextFullWidthTD">
                <div style="font-family: Arial Black; font-size: 13px; font-weight: bold;
                line-height: 1.1; color: white;">
                  <div>
                    <div class="MainTextFullWidth"><a href="${some_url}" target="_blank"
                    style="text-decoration: none;">Button Text</a></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
        '''

    it 'should return the correct content descriptor info', ->
      descriptors = Editor.getContentDescriptors()

      expect(descriptors.length).toEqual 1
      expect(descriptors[0].id).toMatch /button-content/
      expect(descriptors[0].type).toEqual 'button'
      expect(descriptors[0].payload.text).toEqual i18n.placeholder_text

    it 'should enable atomic delete when contentDeletion is supported', ->
      editor = new Editor({}, $.extend true,
        featureSupport:
          contentDeletion: true
        , editorConfig)
      expect(editor._atomicDelete()).toBe true

    it 'should disable atomic delete when contentDeletion is not supported', ->
      editor = new Editor({}, $.extend true,
        featureSupport:
          contentDeletion: false
        , editorConfig)
      expect(editor._atomicDelete()).toBe false

    it 'should disable atomic delete when contentDeletion support is not specified', ->
      editor = new Editor({}, $.extend true,
        featureSupport: {}
        , editorConfig)

      expect(editor._atomicDelete()).toBe false

    describe 'How it behaves in document create mode', ->
      deferred = null
      edit_stuff = null
      publish_stuff = null

      beforeEach ->
        deferred = Editor.import(markup)
        editor = new Editor {}, editorConfig
        $.extend true, editor,
          createState: -> {}
          _getName: jasmine.createSpy()
        deferred.done (state) ->
          editor.setState state
        editor.init()
        edit_stuff = editor.renderForEdit()
        publish_stuff = editor.renderForPublish()

      it 'should return a promise object', ->
        expect(typeof deferred.done).toBe 'function'

      it 'should return the correct state when import is called', ->
        importedState = null
        deferred.done (theState) ->
          importedState = theState
        expect(importedState.markup).toBe markup

      it 'should persist the markup in the editor\'s state', ->
        expect(editor.getState().markup).toBe markup

      it 'should set the initial state (via argued markup)', ->
        state = editor.getState()
        expect(state.color).toBe 'gray'
        expect(state.text).toBe 'Button Text'
        expect(state.fontColor).toBe 'white'
        expect(state.fontFamily).toBe 'Arial Black'

    describe 'How it behaves in document edit mode', ->

      beforeEach ->
        editor = new Editor({}, editorConfig)
        # This function is defined at runtime but not in button-editor.js.coffee. Mock it out here.
        editor._getName = -> 'Button-1434996722689'
        $.extend true, editor,
          createState: -> {}
        editor.setState
          markup: markup
        editor.init()
        stateUpdatedWasCalled = false
        editorModel = new ButtonEditorModel {}

      it 'should show the toolbar when the view is clicked', ->
        spyOn(toolbar, 'updateAndShow')
        $(editor.buttonView.el).click()
        expect(toolbar.updateAndShow).toHaveBeenCalled()

      it 'should insert an a tag when published', ->
        publish_stuff = editor.renderForPublish()
        expect(publish_stuff).toContain('a')

      it 'should use the link in the state in the publish HTML if it is defined', ->
        editor.setState link: 'http://me.com', markup: markup
        publish_stuff = editor.renderForPublish()
        expect($(publish_stuff).find('a').attr('href')).toBe 'http://me.com'

      it 'should use "#" as the URL in the publish HTML if the link in the state is not defined', ->
        publish_stuff = editor.renderForPublish()
        expect($(publish_stuff).find('a').attr('href')).toBe '#'

      it 'should use the template specified URL if the URL is not editable', ->
        editor.setState markup: markup2
        editor.init()
        publish_stuff = editor.renderForPublish()
        expect($(publish_stuff).find('a').attr('href')).toBe '${some_url}'

      it 'should not call stateUpdated when the platform sets its state', ->
        editor.setState link: 'http://me.com', markup: markup
        expect(stateUpdatedWasCalled).toBe false

      describe 'Initialization', ->

        it 'should construct the editor', ->
          expect(editor.init).not.toThrow()

        it 'sets hasEditableURL to true if the template does not provide one', ->
          editor.init()
          expect(editor.hasEditableURL).toBe true

        it 'sets hasEditableURL to false if the template provides a URL', ->
          editor.setState markup: markup2
          editor.init()
          expect(editor.hasEditableURL).toBe false

        it 'creates a new toolbar view', ->
          editor.init()
          expect(editor.buttonEditorView).toBeDefined()

        it 'should set the link attribute in the model if the URL is not editable', ->
          editor.setState markup: markup2
          editor.init()
          expect(editor.buttonModel.link()).toBe '${some_url}'

        it 'should not call stateUpdated if the link attribute is set', ->
          editor.init()
          expect(stateUpdatedWasCalled).toBe false

      describe 'its state', ->

        it 'should be able to accept and return state', ->
          expectedState =
            _galileo:
              asset: ''
              version: major: 1, minor: 0, patch: 0
            number: 42
            markup: '<div/>'
          $.extend true, editor,
            createState: -> {}
          editor.setState expectedState
          editor.init()
          state = editor.getState()

          expect(state.number).toBe 42

        it 'should have major, minor and patch version numbers', ->
          version = editor.getStateVersion()
          expect(typeof version.major).toBe 'number'
          expect(typeof version.minor).toBe 'number'
          expect(typeof version.patch).toBe 'number'

        it 'should use the markup in the state in the rendered editor', ->
          edit_stuff = editor.renderForEdit()
          expect($(edit_stuff).is('[data-editor-type="button"]')).toBe true

        it 'should be unique across instances', ->
          editor2 = new Editor({}, editorConfig)
          expect(editor2.state).not.toBe editor.state

      describe 'a second co-existing editor instance', ->
        editor2 = null
        beforeEach ->
          editor2 = new Editor({}, editorConfig)
          # This function is defined at runtime but not in button-editor.js.coffee. Mock it out here.
          editor2._getName = -> 'Button-1434996722689'
          $.extend true, editor2,
            createState: -> {}
          editor2.setState
            markup: markup
          editor2.init()

    describe 'Upon deactivating the button editor', ->

      it 'hides the toolbar', ->
        spyOn toolbar, 'hide'
        editor.deactivate()
        expect(toolbar.hide).toHaveBeenCalled()
