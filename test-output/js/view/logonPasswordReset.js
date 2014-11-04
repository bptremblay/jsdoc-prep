define(
  /**
   * @exports js/view/logonPasswordReset
   * @requires jquery
   */
  function(require) {
    /**
     * Creates a new instance of class LogonPasswordResetView.
     * @constructor
     */
    return function LogonPasswordResetView() {
      var self = this,
        LogonPasswordResetBridge = this.createBridgePrototype(require('logon/view/webspec/logonPasswordReset'));
      self.bridge = new LogonPasswordResetBridge({
        targets: {
          password_reset_identify_option_id: 'input[name="password_reset_identify_option_id"]',
          exit_reset_password: '#exit_reset_password',
          proceed_to_locate_user_id: '#proceed_to_locate_user_id',
          identify_customer_date_of_birth_option: '#identify_customer_date_of_birth_option',
          identify_customer_social_security_number_option: '#identify_customer_social_security_number_option',
          social_security_number: '#social_security_number',
          tax_identification_number: '#tax_identification_number',
          date_of_birth: '#date_of_birth',
          email_address: '#email_address',
          security_code: '#security_code',
          applicant_id_number: '#applicant_id_number',
          account_number: 'input[name="account_number"]',
          accounttypeoption: 'input[name="accounttypeoption"]'
        }
      });
      self.instanceName = 'logonpasswordreset';
      self.type = 'view';
      // Set up essential view settings
      this.template = require('logon/template/logonPasswordReset');
      /**
       * Init.
       */
      this.init = function() {
        this.accountType = 'ssn_card_account_number';
      };
      this.eventManager = {
        change: {
          'input[name="password_reset_identify_option_id"]': function(event) {
            if (event.context.checked) {
              var options = event.closest('.options'),
                group = event.closest('.group'),
                defaultOption = group.find('.default_option').first();
              options.find('.group').removeClass('active');
              group.addClass('active');
              if (defaultOption !== null && defaultOption !== undefined) {
                defaultOption.click();
              }
            }
          },
          'input[name="account_type"]': function(event) {
            if (event.context.checked) {
              this.accountType = event.context.value;
              $('.account-input').addClass('hidden').attr('name', 'account_number_unused');
              $('#' + this.accountType).removeClass('hidden').attr('name', 'account_number');
            }
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