define(
  /**
   * @exports js/component/topMenu
   */
  function() {
    var context = null;
    return {
      /**
       * Init.
       */
      init: function() {
        context = this.settings.context;
      },
      /**
       * Select menu item.
       */
      selectMenuItem: function() {
        //update the active locale to this one
        context.settings.set('language', this.locale, context.settings.Type.PERM);
        //HACK - reload the browser to reflect locale change
        location.reload();
      }
    };
  });