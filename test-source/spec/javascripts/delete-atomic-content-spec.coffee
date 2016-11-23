define [
  'button-editor-path/delete-atomic-content'
], (deleteAtomicContent) ->

  describe 'Delete Atomic Content', ->

    describe '#triggerRemoveBlock ', ->

      layoutEditor = null
      galileoEvents = null
      name = 'name'

      beforeEach ->
        layoutEditor =
          _getInstanceId: ->
            'layout_instance_id'
        galileoEvents =
          trigger: (evt, id, name) ->
            'trigger_return'

        spyOn(layoutEditor, '_getInstanceId').and.callThrough()
        spyOn(galileoEvents, 'trigger')

      it 'should publish a remove block event to the layout editor', ->
        deleteAtomicContent.default.triggerRemoveBlock(layoutEditor, galileoEvents, name)
        expect(layoutEditor._getInstanceId).toHaveBeenCalled()
        expect(galileoEvents.trigger).toHaveBeenCalledWith('remove-block', 'layout_instance_id', 'name')
