define [
  'button-editor-path/editor-model'
], (Model) ->

  describe 'The Editor Model', ->
    editorModel = null

    beforeEach ->
      editorModel = new Model()

    describe '#doneWasClicked', ->

      it 'should get the value of doneWasClicked if no value', ->
        expect(editorModel.doneWasClicked()).toBe false

      it 'should set doneWasClicked to value if supplied ', ->
        editorModel.doneWasClicked true

        expect(editorModel.doneWasClicked()).toBe true

    describe '#linkWasTested', ->

      it 'should get the value of linkWasTested if no value', ->
        expect(editorModel.linkWasTested()).toBe false

      it 'should set linkWasTested to value if supplied ', ->
        editorModel.linkWasTested true

        expect(editorModel.linkWasTested()).toBe true
