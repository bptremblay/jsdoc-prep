define(
  /**
   * @exports js/view/mfaSubmit
   * @requires jquery
   */
  function(require) {
    /**
     * Creates a new instance of class MfaSubmitView.
     * @constructor
     */
    return function MfaSubmitView() {
      var self = this,
        MfaSubmitBridge = this.createBridgePrototype(require('logon/view/webspec/mfaSubmit'));
      self.bridge = new MfaSubmitBridge({
        targets: {
          identification_code: '#otpcode',
          password: '#password',
          log_on_to_landing_page: '#log_on_to_landing_page',
          exit_identification: '#exit_identification',
          request_new_identification_code: '#request_new_identification_code'
        }
      });
      //TODO: Remove emit support settings as soon as possible
      //self.instanceName = 'mfaoptionsview';
      //self.type = 'view';
      // Set up essential view settings
      this.template = require('logon/template/mfaSubmit');
      /**
       * Init.
       */
      this.init = function() {
        self.bridge.on('state/deviceTypeMsg', function(data) {
          self.updateDeviceTypeHeader(data);
        });
        self.bridge.on('state/error', function(data) {
          self.setErrorMsg(data);
        });
      };
      /**
       * Update device type header.
       * @param inputData
       */
      this.updateDeviceTypeHeader = function(inputData) {
        $('#deviceTypeHeader').text(inputData.msgData);
      };
      /**
       * Set error msg.
       * @param inputData
       */
      this.setErrorMsg = function(inputData) {
        var $otpCode, password;
        if (inputData.msgData && inputData.msgData !== '') {
          $('#login-error-msg').text(inputData.msgData);
          $otpCode = $('#otpcode');
          password = $('#password');
          if ($otpCode.val() && !password.val()) {
            password.addClass('error inverted')
              .focus();
          } else {
            password.addClass('error inverted')
              .val('');
            $otpCode.addClass('error inverted')
              .val('')
              .focus();
          }
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