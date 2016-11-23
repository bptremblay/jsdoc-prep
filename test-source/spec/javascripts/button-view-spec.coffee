define [
  'underscore'
  'spec/support/debounce-helper'
  'backbone'
  'button-editor-path/button-view'
  'button-editor-path/button-model'
  'i18n!button-editor-path/nls/button-editor'
  'spec/support/sandbox'
], (_, helper, Backbone, View, Model, i18n, sandbox) ->

  magicNumber = 1000

  describe 'The button view', ->
    view = null
    model = null
    editor = null

    beforeEach ->

      sandbox().for('button').html '''
        <style></style>
        <p>
          The Button View:
          <table border="0" cellpadding="0" cellspacing="0" style="width:auto !important;
            background-color: gray;-moz-border-radius: 10px;border-radius: 10px;-webkit-border-radius: 10px;">
            <tr>
              <td align="center" valign="top" style="padding: 9px 20px 10px 20px ;"
              class="MainTextFullWidthTD">
                <div style="font-family: Arial Black; font-size: 13px; font-weight: bold;
                line-height: 1.1; color: #ffffff;">
                  <div>
                    <div class="MainTextFullWidth"><a href="javascript: void 0;" target="_blank"
                    style="text-decoration: none;">Button Text</a></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </p>
      '''
      model = new Model()
      editor = jasmine.createSpy()
      editor.events = _.extend Backbone.Events

      view = new View
        model: model
        el: $('#button-wrapper table')
        editor: editor
      view.render()

    beforeEach ->
      jasmine.clock().install()
      jasmine.clock().mockDate()
    afterEach ->
      jasmine.clock().uninstall()

    describe 'when it re-renders', ->

      it 'should not when model attributes `text` changes', ->
        wasRendered = false
        view.render = ->
          wasRendered = true
        model.text 'rock lobster!'
        expect(wasRendered).toBe false

      it 'should when model attributes link changes', ->
        wasRendered = false
        view.render = ->
          wasRendered = true
        model.link 'www.therocklobster.me'
        expect(wasRendered).toBe true

      it 'should when any model attribute besides text or link changes', ->
        wasRendered = false
        view.render = ->
          wasRendered = true
        model.setLocalBackgroundColor '#944'
        expect(wasRendered).toBe true

    it 'should update the model when the content is edited', ->
      view.editableContent 'rock lobster!'
      view.findTextContainer().trigger event for event in ['input', 'keydown']
      jasmine.clock().tick magicNumber
      expect(model.text()).toEqual 'rock lobster!'

    it 'should remove formatting from pasted text', ->
      view.editableContent 'This is <b>really</b> important!'
      view.findTextContainer().trigger 'paste'
      jasmine.clock().tick magicNumber
      expect(view.editableContent()).toBe 'This is really important!'

    it 'will use the default text if the editable content is empty', ->
      view.editableContent ''
      $(view.el).trigger 'focusout'
      jasmine.clock().tick magicNumber
      expect(view.editableContent()).toBe i18n.placeholder_text

    it 'should change the element to a div for editing', ->
      expect(view.el).not.toContain('a')
