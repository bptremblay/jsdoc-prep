define(function() {
  let migration100_110 = {
    fromVersion() {
      return {major: 1, minor: 0, patch: 0};
    },
    toVersion() {
      return {major: 1, minor: 1, patch: 0};
    },
    migrate(state) {
      state.backgroundColor = {
        global: state.color,
        local: 'transparent'
      };
      delete state.color;
      return state;
    }
  };

  let migration110_120 = {
    fromVersion() {
      return {major: 1, minor: 1, patch: 0};
    },
    toVersion() {
      return {major: 1, minor: 2, patch: 0};
    },
    migrate(state) {
      let $old_editor_markup = $(state.markup);
      let content_type = $old_editor_markup.data('editor-type');
      let content_name = $old_editor_markup.data('editor-name');
      $old_editor_markup.removeAttr('data-editor-type data-editor-name');

      let $new_editor_markup = $('<table><tr></tr></table>');
      $new_editor_markup
        .attr('data-editor-type', content_type)
        .attr('data-editor-name', content_name);

      $new_editor_markup.find('tr').append($old_editor_markup);
      $new_editor_markup.attr('width', '100%');

      state.markup = $new_editor_markup.get(0).outerHTML;

      return state;
    }
  };

  return [migration100_110, migration110_120];});
