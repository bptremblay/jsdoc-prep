define(
  /**
   * @exports js/view/mfa
   * @requires jquery
   */
  function(require) {
    /**
     * Creates a new instance of class MfaView.
     * @constructor
     */
    return function MfaView() {
      var self = this,
        MfaBridge = this.createBridgePrototype(require('logon/view/webspec/logonIdentification'));
      self.bridge = new MfaBridge({
        targets: {
          request_delivery_devices: '#request_delivery_devices',
          exit_identification: '#exit_identification',
          request_identification_advisory_message: '#request_identification_advisory_message',
          close_identification_advisory: '#close_identification_advisory'
        }
      });
      self.instanceName = 'mfaview';
      self.type = 'view';
      // Set up essential view settings
      this.template = require('logon/template/mfaEntry');
      /**
       * Init.
       */
      this.init = function() {
        self.bridge.on('state/instructions', function(data) {
          self.showInstructionsWorkflowMessage(data);
        });
      };
      /**
       * Show instructions workflow message.
       * @param data
       */
      this.showInstructionsWorkflowMessage = function(data) {
        var $mainpanel = $('#mainpanel'),
          $modalpanel = $('#modalpanel');
        if (data && data.show) {
          $mainpanel.addClass('hidden');
          $modalpanel.removeClass('hidden');
        } else {
          $mainpanel.removeClass('hidden');
          $modalpanel.addClass('hidden');
        }
      };
      /**
       * On data change.
       */
      this.onDataChange = function onDataChange() {
        this.rerender();
      };
    };
  });