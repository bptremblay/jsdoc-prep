define(function() {
	var logger;

    return {
        init: function() {
        	logger = this.context.logger;
        },

     	identifyCustomerDateOfBirthOption: function() {
     		logger.debug('===== identifyCustomerDateOfBirthOption/logonPasswordReset =====');

     	},
     	identifyCustomerSocialSecurityNumberOption: function() {
     		logger.debug('===== identifyCustomerSocialSecurityNumberOption/logonPasswordReset =====');

     	},
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
     	exitResetPassword: function() {
     		logger.debug('===== exitResetPassword/logonPasswordReset =====');
     		this.context.controller.state(this.settings.context.settings.get('logonUrl'));

     	},
     	requestLogonIdentificationCode: function() {
     		logger.debug('===== requestLogonIdentificationCode/logonPasswordReset =====');
     		var model = this.model.get();
     		logger.debug('===== model.logon_options_id =====' + model.logon_options_id);
     		logger.debug('===== model.user_id =====' + model.user_id);

     		/*if (model.user_id && model.logon_options_id === 'create_password') {
     			//TODO go to password page, next sprint
     		}
     		else */if (model.user_id && model.logon_options_id === 'know_password'){
     			this.requestLogonPage();
     		}
     		else {
     			//TODO error message?
     			logger.debug('nothing is selected');
     		}
     	},
     	requestLogonPage: function() {
     		logger.debug('===== requestLogonPage/logonPasswordReset =====');
     		this.context.controller.state(this.settings.context.settings.get('logonUrl'));

     	},
     	passwordResetIdentifyOptionAction: function() {
     		logger.debug('===== passwordResetIdentifyOptionAction/logonPasswordReset =====');

     	},
     	 /**
         * Splits array of users into arrays by userId
         * @param {userId} contactArray
         * @returns object with array of userId(s)
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
