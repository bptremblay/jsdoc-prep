define [
  'underscore'
  'button-editor-path/button-model'
], (_, ButtonModel) ->

  describe 'ButtonModel', ->
    model = null
    beforeEach ->
      model = new ButtonModel()
      model.set 'markup', '<table><td data-style-background-color="Primary"></td></table>'

    describe 'validations', ->
      it 'should limit font size to the max value', ->
        triggered = false
        model.on 'limit:fontSize', ->
          triggered = true

        model.fontSize 1000
        expect(model.fontSize()).toBe ButtonModel::FONT_SIZE_MAX_VALUE
        expect(triggered).toBe true

      it 'should not allow a font size to be anything other than a number', ->
        model.fontSize 'abc'
        expect(model.fontSize()).toBeUndefined()

      it 'should not allow a negative font size', ->
        model.fontSize -2
        expect(model.fontSize()).toBe 0

      it 'should accept a font size within the limit', ->
        model.fontSize ButtonModel::FONT_SIZE_MAX_VALUE - 1
        expect(model.fontSize()).toBe ButtonModel::FONT_SIZE_MAX_VALUE - 1

    describe '#_makeGetOrSet', ->
      it 'will create methods for setting and getting', ->
        _.keys(ButtonModel::defaults).forEach (prop) ->
          expect(typeof model[prop]).toBe 'function'

    describe '#setGlobalBackgroundColor', ->
      it 'will set the global background color', ->
        model.setGlobalBackgroundColor '#123'
        expect(model.backgroundColor().global).toBe '#123'

    describe '#setLocalBackgroundColor', ->
      it 'will set the local background color', ->
        model.setLocalBackgroundColor '#123'
        expect(model.backgroundColor().local).toBe '#123'

    describe '#getBackgroundColor', ->
      it 'will return the local background color when it is not transparent', ->
        model.setLocalBackgroundColor '#123'
        expect(model.getBackgroundColor()).toBe '#123'

      it 'will return the global background color when the local is transparent', ->
        model.setGlobalBackgroundColor '#321'
        model.setLocalBackgroundColor 'transparent'
        model.set 'shouldUseLegacyGlobalColors', true
        expect(model.getBackgroundColor()).toBe '#321'

    describe '#usingLocalColors', ->
      it 'will return true if a local color is set', ->
        model.setLocalBackgroundColor '#123'
        expect(model.usingLocalColors()).toBe true

      it 'will return false if there is no local color', ->
        model.setLocalBackgroundColor 'transparent'
        expect(model.usingLocalColors()).toBe false

    describe '#setLink', ->

      it 'should set the link attribute to null if no value is given', ->
        model.setLink ''
        expect(model.link()).toBe null

      it 'should set the link without the protocol if the option is provided', ->
        url = '${some_url}'
        model.setLink url, noProtocol: true
        expect(model.link()).toBe url

      it 'should apply the correct protocol for a link', ->
        url = 'www.google.com'
        model.setLink url
        expect(model.link()).toBe "http://#{url}",

      it 'should apply the correct protocol for a mailto link', ->
        url = 'user@test.com'
        model.setLink url
        expect(model.link()).toBe "mailto:#{url}",

      it 'should trim leading and trailing spaces from link', ->
        url = '   www.google.com   '
        model.setLink url
        expect(model.link()).toBe 'http://www.google.com'

      it 'should remove spaces inside URL', ->
        url = 'www.google.com/     test'
        model.setLink url
        expect(model.link()).toBe 'http://www.google.com/%20%20%20%20%20test'

      it 'should remove spaces between protocol and domain', ->
        url = 'http://   google.com'
        model.setLink url
        expect(model.link()).toBe 'http://google.com'

    describe '#validate', ->

      it 'should return an error if a url is invalid', ->
        model.setLink 'http://12.12.12.12'
        expect(model.isValid()).toBe false

      it 'should return true if the URL is valid', ->
        model.setLink 'http://www.dailypuppy.com'
        expect(model.isValid()).toBe true
