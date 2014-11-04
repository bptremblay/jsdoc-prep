define(
  /**
   * @exports js/view/menu
   */
  function(require) {
    /**
     * Creates a new instance of class MenuView.
     * @constructor
     */
    return function MenuView() {
      var self = this,
        Bridge = this.createBridgePrototype(require('logon/view/webspec/topMenu'));
      //TODO: Remove emit support settings as soon as possible
      self.instanceName = 'menuview';
      self.type = 'view';
      self.bridge = new Bridge({
        targets: {
          select_menu_item: '#switchLocale'
        }
      });
      this.template = require('logon/template/menu');
      /**
       * Init.
       */
      this.init = function() {};
      /**
       * On data change.
       */
      this.onDataChange = function onDataChange() {
        this.rerender();
      };
    };
  });