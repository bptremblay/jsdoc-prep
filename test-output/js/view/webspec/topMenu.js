/**
 * @module js/view/webspec/topMenu
 */
define({
  name: 'TOP_MENU',
  bindings: {},
  triggers: {
    'select_menu_item': {
      type: 'ANCHOR',
      action: 'select_menu_item',
      event: 'click'
    }
  }
});