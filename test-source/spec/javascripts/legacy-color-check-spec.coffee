define [
  'button-editor-path/legacy-color-check'
], (legacyColorCheck) ->

  describe 'LegacyColorCheck', ->

    describe 'usesLegacyGlobalColors', ->

      it 'should return true if element passed has legacy style attributes', ->
        $element = $ '''
          <td data-style-background-color="foo">
            <table>
              <tr>
              <td><div>Foo</div></td>
              </tr>
            </table>
          </td>
          '''
        expect(legacyColorCheck.usesLegacyGlobalColors $element).toBe true

      it 'should return true if any child elements have legacy style attributes', ->
        $element = $ '''
          <table>
            <td data-style-background-color="foo">
              <table>
                <tr>
                <td><div>Foo</div></td>
                </tr>
              </table>
            </td>
          </table>
          '''
        expect(legacyColorCheck.usesLegacyGlobalColors $element).toBe true

      it 'should return false if the element passed or its child elements are missing the legacy style attributes', ->
        $element = $ '''
          <table>
            <td>
              <table>
                <tr>
                <td><div>Foo</div></td>
                </tr>
              </table>
            </td>
          </table>
          '''
        expect(legacyColorCheck.usesLegacyGlobalColors $element).toBe false
