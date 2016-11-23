define [
  'button-editor-path/button-editor'
], (ButtonEditor) ->
  describe 'NLS for the Button Editor', ->
    it 'should not include `/nls/en` files', ->
      $('script[data-requiremodule*="button-editor-path/nls"]').each ->
        expect(this.src).not.toMatch /\/nls\/en\//
