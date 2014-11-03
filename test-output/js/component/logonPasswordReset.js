define(
  /**
   * @exports js/component/logonPasswordReset
   */
  function() {
    var logger;
    return {
      /**
       * Init.
       */
      init: function() {
        logger = this.context.logger;
      },
      /**
       * Identify customer date of birth option.
       */
      identifyCustomerDateOfBirthOption: function() {
        logger.debug('===== identifyCustomerDateOfBirthOption/logonPasswordReset =====');
      },
      /**
       * Identify customer social security number option.
       */
      identifyCustomerSocialSecurityNumberOption: function() {
        logger.debug('===== identifyCustomerSocialSecurityNumberOption/logonPasswordReset =====');
      },
      /**
       * Proceed to locate user id.
       */
      proceedToLocateUserId: function() {
        logger.debug('===== proceedToLocateUserId/logonPasswordReset =====');
        var model = this.model.get(),
          data;
        data = {
          accountNumber: model.account_number // "4147202111111111",
          // ssn: "123456784"
        };
        switch (model.password_reset_identify_option_id) {
          case 'social_security_number':
            data.ssn = model.social_security_number;
            break;
            // TODO handle date of birth
          case 'tax_identification_number':
            data.tin = model.tax_identification_number;
            break;
          default:
            logger.warn('Unrecognized passwordResetIdentifyOptionId' + model.passwordResetIdentifyOptionId);
            break;
        }
        this.context.controller.services.auth.userenrollmentlocate(data).then(function(locateResult) {
          var result = locateResult;
          logger.debug('===== result ===== ' + result.users);
          //TODO what if no users are returned
          var users = this.userResultToArray(locateResult.users),
            sessionStore = this.context.controller.sessionStore;
          this.model.lens('authUserIds').set(users);
          sessionStore.set('authUserIds', users);
          if (users && users.length > 0) {
            this.model.lens('user_id').set(users[0]);
            sessionStore.set('user_id', users[0]);
          }
          this.context.controller.state('/logon/passwordreset/found');
        }.bind(this), function() {
          //TODO implement error from service
          logger.debug('===== error =====');
        });
      },
      /**
       * Exit reset password.
       */
      exitResetPassword: function() {
        logger.debug('===== exitResetPassword/logonPasswordReset =====');
        this.context.controller.state(this.settings.context.settings.get('logonUrl'));
      },
      /**
       * Request logon identification code.
       */
      requestLogonIdentificationCode: function() {
        logger.debug('===== requestLogonIdentificationCode/logonPasswordReset =====');
        var model = this.model.get();
        logger.debug('===== model.logon_options_id =====' + model.logon_options_id);
        logger.debug('===== model.user_id =====' + model.user_id);
        /*if (model.user_id && model.logon_options_id === 'create_password') {
           //TODO go to password page, next sprint
         }
         else */
        if (model.user_id && model.logon_options_id === 'know_password') {
          this.requestLogonPage();
        } else {
          //TODO error message?
          logger.debug('nothing is selected');
        }
      },
      /**
       * Request logon page.
       */
      requestLogonPage: function() {
        logger.debug('===== requestLogonPage/logonPasswordReset =====');
        this.context.controller.state(this.settings.context.settings.get('logonUrl'));
      },
      /**
       * Password reset identify option action.
       */
      passwordResetIdentifyOptionAction: function() {
        logger.debug('===== passwordResetIdentifyOptionAction/logonPasswordReset =====');
      },
      /**
       * Splits array of users into arrays by userId.
       * @param {UserId} contactArray
       * @return object with array of userId(s)
       */
      userResultToArray: function(locateArray) {
        var userIds = [],
          user;
        if (locateArray !== undefined && locateArray !== null) {
          for (var i = locateArray.length - 1; i >= 0; i--) {
            user = locateArray[i].userId;
            if (user) {
              userIds.push(user);
            }
          }
        }
        return userIds;
      }
    };
  });