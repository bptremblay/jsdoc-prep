define ->
  migration100_110 =
    fromVersion: ->
      major: 1, minor: 0, patch: 0
    toVersion: ->
      major: 1, minor: 1, patch: 0
    migrate: (state) ->
      state.backgroundColor =
        global: state.color
        local: 'transparent'
      delete state.color
      state

  migration110_120 =
    fromVersion: ->
      major: 1, minor: 1, patch: 0
    toVersion: ->
      major: 1, minor: 2, patch: 0
    migrate: (state) ->
      $old_editor_markup = $ state.markup
      content_type = $old_editor_markup.data 'editor-type'
      content_name = $old_editor_markup.data 'editor-name'
      $old_editor_markup.removeAttr 'data-editor-type data-editor-name'

      $new_editor_markup = $ '<table><tr></tr></table>'
      $new_editor_markup
        .attr 'data-editor-type', content_type
        .attr 'data-editor-name', content_name

      $new_editor_markup.find('tr').append $old_editor_markup
      $new_editor_markup.attr 'width', '100%'

      state.markup = $new_editor_markup.get(0).outerHTML

      state

  [migration100_110, migration110_120]
