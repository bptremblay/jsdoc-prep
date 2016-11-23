define [
  'button-editor-path/state-migrations'
  'button-editor-path/button-editor'
], (stateMigrations, ButtonEditor) ->
  mockEditorBase = null
  buttonEditor = null

  describe 'State Migrations', ->
    beforeEach ->
      mockEditorBase =
        createState: ->
          _galileo:
            asset: ''
            version: @getStateVersion()

      mockConfig =
        eventHandlers:
          stateUpdated: ->
        featureSupport:
          contentMove: true

      buttonEditor = new ButtonEditor {}, mockConfig
      $.extend buttonEditor, mockEditorBase

    it 'migrates v1.0.0 state to v1.2.0 state by converting the color field and adding <table> markup', ->
      initialState =
        _galileo:
          asset: ''
          version: major: 1, minor: 0, patch: 0
        alignment: 'center'
        color: '#123321'
        fontColor: 'rgb(255, 255, 255)'
        fontFamily: 'Arial, Verdana, Helvetica, sans-serif'
        fontSize: '16'
        fontStyle: 'normal'
        fontWeight: 'normal'
        height: 24
        linkWasTested: false
        markup: '<td content-type="button" content-name="button"></td>'
        padding: 0
        text: 'Button Text'
        link: null
      # coffeelint: disable=max_line_length
      expectedState =
        _galileo:
          asset: ''
          version: major: 1, minor: 2, patch: 0
        alignment: 'center'
        fontColor: 'rgb(255, 255, 255)'
        fontFamily: 'Arial, Verdana, Helvetica, sans-serif'
        fontSize: '16'
        fontStyle: 'normal'
        fontWeight: 'normal'
        height: 24
        linkWasTested: false
        markup: '<table width="100%"><tbody><tr><td content-type="button" content-name="button"></td></tr></tbody></table>'
        padding: 0
        text: 'Button Text'
        link: null
        backgroundColor:
          global: '#123321'
          local: 'transparent'
      # coffeelint: enable=max_line_length
      state = Telescope.mocks.Migrator.migrateToLatestStateVersion buttonEditor,
                                                                   initialState

      expect(state).toEqual expectedState

