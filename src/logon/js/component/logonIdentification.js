define(function(require) {
    var otpClient = require('logon/shared/otpClient'),
        is = require('blue/is'),
        identificationCodeRegEx = /^\d{8}$/,
        logger;

    return {

        // ----- Initialization

        init: function() {
            logger = this.context.logger;
        },

        // ----- Actions

        closeIdentificationAdvisory: function() {
            this.output.emit('state', {
                target: this,
                value: 'instructions',
                show: false
            });
        },

        requestIdentificationAdvisoryMessage: function() {
            this.output.emit('state', {
                target: this,
                value: 'instructions',
                show: true
            });
        },

        requestHelpMessage: function() {
            this.output.emit('state', {
                target: this,
                value: 'helpmessage',
                show: true
            });
        },

        closeHelpMessage: function() {
            this.output.emit('state', {
                target: this,
                value: 'helpmessage',
                show: false
            });
        },

        requestIdentificationCode: function() {

            logger.debug('===== requestIdentificationCode =====');

            var model = this.model.get(),
                deviceId = model.logon_identification_delivery_device,
                sessionStore = this.context.controller.sessionStore,
                data;

            if (deviceId && deviceId.length > 0) {
                if (deviceId === '0') {
                    this.checkForExistingIdentificationCode();
                } else {
                    //TODO validation
                    data = {
                        'contactId': deviceId.substring(1),
                        'spid': model.spid,
                        'method': deviceId.substring(0, 1)
                    };

                    this.context.controller.services.otp.otpsend(data).then(function(otpsendResult) {
                        var result = otpsendResult;
                        logger.debug('===== result: ' + result.prefix);
                        this.model.lens('otpPrefix').set(result.prefix);
                        this.model.lens('otpMethod').set(data.method);

                        sessionStore.set('otpPrefix', result.prefix);
                        sessionStore.set('otpMethod', data.method);

                        this.context.controller.state('/logon/validatecode');

                    }.bind(this), function() {
                        //TODO implement error from service
                        logger.debug('===== error =====');
                    });
                }
            } else {
                this.handleNoValidIdentificationCode();
            }
        },

        requestNewIdentificationCode: function() {

            logger.debug('===== requestNewIdentificationCode =====');

            //Go back to mfaOptions page and select a new method.  Change control
            this.requestDeliveryDevices();
        },

        requestIdentificationCodeByCall: function() {

            logger.debug('===== requestIdentificationCodeByCall =====');

            var model = this.model.get();
            if (model.logon_identification_delivery_device === '0') {
                this.output.emit('state', {
                    target: this,
                    value: 'contactinfo',
                    show: true
                });
            }
        },

        requestDeliveryDevices: function() {

            logger.debug('===== requestDeliveryDevices =====');

            var data = {
                spid: this.model.get().spid
            };

            this.context.controller.services.otp.otplist(data).then(function(otplistResult) {

                var listByType = this.splitContactsByType(otplistResult.contacts),
                    sessionStore = this.context.controller.sessionStore;

                this.model.lens('otpEmailList').set(listByType.email);
                this.model.lens('otpPhoneList').set(listByType.phone);

                sessionStore.set('otpEmailList', listByType.email);
                sessionStore.set('otpPhoneList', listByType.phone);

                this.context.controller.state('/logon/deliveryoptions');
            }.bind(this));
        },

        provideIdentificationCode: function() {

            logger.debug('===== provideIdentificationCode =====');

            this.checkForExistingIdentificationCode();
        },

        exitIdentification: function() {

            logger.debug('===== exitIdentification =====');

            this.context.controller.state(this.settings.context.settings.get('logonUrl'));
        },

        logOnToLandingPage: function() {

            logger.debug('===== logOnToLandingPage =====');

            var model = this.model.get();
            if (!this.validate()) {
                this.setSubmitError('otp_inv');
                return;
            }

            otpClient.lob = this.settings.context.settings.get('authLOB');
            otpClient.siteId = envConfig.config.authSiteId || this.settings.context.settings.get('defaultAuthSiteId');
            otpClient.userId = this.context.controller.sessionStore.get('tempId');
            otpClient.password = this.password;
            otpClient.otp = this.identificationCode;
            otpClient.otpreason = 2; //secondary auth is reason code 2
            otpClient.otpprefix = model.otpPrefix;
            otpClient.submitOtp();
        },

        // ----- Helpers

        /**
         * Validates component.
         * Sends state/valid to output if properties are not valid.
         * @returns true if data is valid
         */
        validate: function() {
            return identificationCodeRegEx.test(this.identificationCode) && this.password !== '';
        },

        /**
         * Splits array of contacts into separate arrays by type
         * @param {type} contactArray
         * @returns object with arrays for each type (lower case)
         */
        splitContactsByType: function(contactArray) {
            var contact, typeName, byType, contactsByType = {};
            if (contactArray !== undefined && contactArray !== null) {
                for (var i = contactArray.length - 1; i >= 0; i--) {
                    contact = contactArray[i];
                    typeName = contact.type.toLowerCase();
                    byType = contactsByType[typeName];
                    if (byType === undefined) {
                        byType = [];
                        contactsByType[typeName] = byType;
                    }
                    byType.push(contact);
                }
            }
            return contactsByType;
        },

        /**
         * Emit data for correct device type header
         * @param deviceMethod: method identified when calling sendOtp
         */
        setDeviceTypeHeader: function(deviceMethod) {

            var model = this.model.get();
            this.output.emit('state', {
                target: this,
                value: 'deviceTypeMsg',
                msgData: model[this.getDeviceTypeComponent(deviceMethod)]
            });
        },

        /**
         * Fetches the component entry name for the device type
         * @param deviceMethod: delivery method selected by user
         * @returns component name string.  defaults to 'other' delivery type if not specified or not valid.
         */
        getDeviceTypeComponent: function(deviceMethod) {
            var deviceTypes = {
                S: '_text_',
                V: '_voice_',
                T: '_email_',
                O: '_other_'
            };

            return 'submit_identification_code_deliveryMethod_header'
                .replace('_deliveryMethod_', deviceTypes[deviceMethod] || deviceTypes.O);
        },

        checkForExistingIdentificationCode: function() {
            var model = this.model.get();
            var data = {
                'spid': model.spid
            };

            this.context.controller.services.otp.otpprefix(data).then(function(otpprefixResult) {
                var prefix = otpprefixResult.prefix;

                this.model.lens('otpPrefix').set(prefix);
                this.context.controller.sessionStore.set('otpPrefix', prefix);

                if (prefix && prefix.length > 0) {
                    this.context.controller.state('/logon/validatecode');
                } else {
                    this.handleNoValidIdentificationCode();
                }
            }.bind(this), function() {
                //TODO what to do if service fails
            });
        },

        handleNoValidIdentificationCode: function() {
            this.output.emit('state', {
                target: this,
                value: 'nocode',
                msgData: this.model.get().identification_code_unavailable_error
            });
        },

        setSubmitError: function(err) {
            this.output.emit('state', {
                target: this,
                value: 'error',
                msgData: this.getErrorMessage(err)
            });
        },

        getErrorMessage: function(err) {
            var msg = null,
                model = this.model.get();

            err = err.toLowerCase().trim();

            if (is.string(err)) {
                msg = err === 'inv' ? model.password_error : model.identification_code_error;
            }
            return msg;
        },

        identificationCode: null
    };
});
