define [
  'button-editor-path/button-editor'
  'underscore'
], (Editor, _) ->

  editor = null
  stateUpdatedWasCalled = false

  editorConfig =
    featureSupport:
      contentDeletion: true
    eventHandlers:
      stateUpdated: ->
        stateUpdatedWasCalled = true

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

  describe 'Applying colors to the editor', ->

    deferred = null
    edit_stuff = null
    publish_stuff = null

    beforeEach ->
      deferred = Editor.import(markup)
      editor = new Editor {}, editorConfig
      _.extend editor,
        createState: -> {}
        _getName: jasmine.createSpy()
      deferred.done (state) ->
        editor.setState state
      editor.init()
      edit_stuff = editor.renderForEdit()
      publish_stuff = editor.renderForPublish()

    describe 'using local colors', ->

      it 'will not allow themes to be applied', ->
        editor.applyColors 'primary': 'blue', false
        editor.buttonModel.backgroundColor().local = 'red'

        returnValue = editor.applyColors 'primary': 'green', false

        expect(editor.buttonModel.backgroundColor().global).toBe 'blue'
        expect(returnValue).toBe true

      it 'will not allow previews of global color changes', ->
        editor.applyColors 'primary': 'blue', false
        editor.buttonModel.backgroundColor().local = 'red'

        returnValue = editor.applyColors 'primary': 'green', true

        expect(editor.buttonModel.backgroundColor().global).toBe 'blue'
        expect(returnValue).toBe true

    describe 'using the global colors', ->

      it 'will allow themes to be applied', ->
        returnValue = editor.applyColors 'primary': 'blue', false

        expect(editor.buttonModel.backgroundColor().global).toBe 'blue'
        expect(returnValue).toBe false

      it 'will allow previews of global color changes', ->
        editor.applyColors 'primary': 'blue', false

        returnValue = editor.applyColors 'primary': 'green', true

        expect(editor.buttonModel.backgroundColor().global).toBe 'blue'
        expect(returnValue).toBe false
