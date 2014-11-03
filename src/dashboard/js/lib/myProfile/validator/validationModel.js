define(function(require) {

	var util = require('dashboard/lib/myProfile/validator/utilities'),
		observable = require('blue/observable'),
		contentUtil = require('dashboard/lib/myProfile/contentUtil');

	var ValidationModel = function(ractive, view) {

		// Object containing properties we're validating.
		this.properties = {};

		this.clientErrorMessages = observable.Model({});
		this.serverErrorMessages = observable.Model({});

		// We don't always want to immediately update the header in the view
		// when the error messages change. Instead, we save the changed header
		// properties in this object, and only update the Ractive view on
		// ValidationModel.prototype.renderErrorHeader();
		this.validatorErrorHeader = {};

		this.bridge = view.bridge;
		this.view = view;
		this.ractive = ractive;

		this.bridge.on('data', function(data) {
			var property = data.value;
			this.properties[property] = transform(data);
			// console.log(this.properties);
		}.bind(this));

		// Set up listening on statusCode for server side validations
		this.bridge.on('trigger/serverValidation', function(data) {
			this.renderServerErrorHeader(data);
		}.bind(this));

		this.bridge.on('trigger/resetValidation', function(data){
			$('form .clientSideError').removeClass('clientSideError');
			$('form .serverSideError').removeClass('serverSideError');
			this.removeAllErrors();
			this.renderErrorHeader();
		}.bind(this));

		this.clientErrorMessages.onValue(function(data) {
			this.updateErrorHeader(data);
		}.bind(this));

		this.serverErrorMessages.onValue(function(data) {
			this.updateErrorHeader(data);
		}.bind(this));

	};

	function getLabelFromProperty(model, property) {
		var property = util.convertToSnakeCase(property);
		property += '_label';
		return model[property];
	}

	ValidationModel.prototype.removeAllErrors = function() {
		this.clientErrorMessages.lens('').set({});
		this.serverErrorMessages.lens('').set({});
	};

	// Updates the text to be shown in the validation error header
	// on the Ractive object, which will push changes out to the DOM.
	ValidationModel.prototype.renderErrorHeader = function() {
		var deepCopy = {};
		$.extend(true, deepCopy, this.validatorErrorHeader);
		this.ractive.set('validatorErrorHeader', deepCopy);
	};

	// Changes the text to be shown in the validation error header.
	// Does not actually update the Ractive model, so changes will not
	// be reflected in the DOM.
	ValidationModel.prototype.updateErrorHeader = function(data) {
		var errorLabels = [];
		var propertiesWithErrors = [];

		for (var property in data) {
			var message = data[property];
			message && propertiesWithErrors.push(property);
		}

		propertiesWithErrors.forEach(function(property) {
			var label = getLabelFromProperty(this.view.model, property);
			label && errorLabels.push(label);
		}.bind(this));

		// Server side errors
		if (data.validatorErrorHeaderMessage) {

			this.validatorErrorHeader.message = data.validatorErrorHeaderMessage;

			// Client side errors
		} else {

			if (errorLabels.length === 1) {
				var statusCodeMessage = contentUtil.getValue('MY_PROFILE_ADDRESS_ERROR_MESSAGE', 'form_level_header_with_placeholder');
				statusCodeMessage = statusCodeMessage.replace('field_name', errorLabels[0]);
				this.validatorErrorHeader.message = statusCodeMessage;
			} else if (errorLabels.length > 1) {
				this.validatorErrorHeader.message = contentUtil.getValue('MY_PROFILE_ADDRESS_ERROR_MESSAGE', 'form_level_header');
			} else {
				this.validatorErrorHeader.message = '';
			}

		}

		if (errorLabels.length === 1) {
			this.validatorErrorHeader.list = [];
		} else {
			this.validatorErrorHeader.list = errorLabels;
		}

	};

	ValidationModel.prototype.getErrorMessage = function(property) {
		if (property && this.clientErrorMessages.lens(property)) {
			var message = this.clientErrorMessages.lens(property).get();
			if (typeof message === 'string') {
				return message;
			} else {
				return null;
			}
		}
	};

	ValidationModel.prototype.hasErrors = function() {

		var hasErrors = false;

		var clientErrors = this.clientErrorMessages.lens('').get();
		var serverErrors = this.serverErrorMessages.lens('').get();

		for (var key in clientErrors) {
			var message = clientErrors[key];
			if (message) {
				hasErrors = true;
			}
		}

		for (var key in serverErrors) {
			var message = serverErrors[key];
			if (message) {
				hasErrors = true;
			}
		}
		return hasErrors;
	};

	ValidationModel.prototype.customValidation = function(array) {

		for (var i = 0; i < array.length; i++) {

			if (this.hasErrors()) {

				return false;

			} else {
				var validationFunction = array[i];
				var validationData = validationFunction(this.ractive.get());

				if (!validationData.isValid) {
					validationData.properties && validationData.properties.forEach(function(property) {
						this.clientErrorMessages.lens(property).set(validationData.fieldMessage || true);
					}.bind(this));
					this.clientErrorMessages.lens('validatorErrorHeaderMessage').set(validationData.formMessage);
					return false;
				}

			}
		}

		return true;

	};

	ValidationModel.prototype.fieldIsValid = function(property, formSubmit) {
		// First make sure we're getting a property at all
		if (property) {

			// Grab the validation data which has been cached
			var validationData = this.properties[property];

			// Check to see if the formatting is valid
			var formatValid = this.checkFormat(property);

			var propertySettings = util.convertToSnakeCase(property);

			// If the formatting isn't valid, we can add an error message to the
			// error messages object.
			if (!formatValid) {
				this.clientErrorMessages.lens(property).set(contentUtil.getValue('MY_PROFILE_ADDRESS_ERROR_MESSAGE', propertySettings+'_error_format'));
			}

			// Now we check to see if the required property is being satisfied. Begin
			// by initializing a requiredValid variable which is initially true.
			var requiredValid = true;

			// This required property (passed through params) tells us whether we
			// should be validating for required. At the field level we're not checking
			// for required fields, whereas at the form level we are.
			if (formSubmit) {

				// Check to see if the field is satisfying the required property
				requiredValid = this.checkRequired(property);

				if (!requiredValid) {
					// We can add the field required error message if the required
					// property is not being satisfied. Overwrite the format invalid
					// property if that somehow got set.
					this.clientErrorMessages.lens(property).set(contentUtil.getValue('MY_PROFILE_ADDRESS_ERROR_MESSAGE', propertySettings+'_error_required'));
				}
			}

			// If the format is valid and the required property is being satisfied,
			// we can remove any error messages which are currently in the clientErrorMessages
			// object.
			if (formatValid && requiredValid) {
				this.clientErrorMessages.lens(property).set(null);
			}

			// Finally we can return true or false for whether the item passes validation.
			// If we're looking for required properties, both format and required have to be
			// passed. If we're not looking for the required value, only check format.
			if (formSubmit) {
				return (!!(formatValid && requiredValid));
			} else {
				return (!!formatValid);
			}
		}
	};

	function transform(data) {
		var required = util.fieldRequired(data.value);
		data.required = required;

		// Framework isn't currently passing hasData correctly.
		// Check to see if field has a value in it and update that property
		if (data.current.trim() === '') {
			data.hasData = false;
		} else {
			data.hasData = true;
		}

		return data;
	};

	ValidationModel.prototype.checkRequired = function(property) {
		var validationData = this.properties[property];
		if (validationData && util.fieldRequired(property)) {
			var required = validationData.required;
			var hasData = validationData.hasData;
			return (required && hasData) || !required;
		} else if (!util.fieldRequired(property)) {
			return true;
		}
	};

	ValidationModel.prototype.checkFormat = function(property) {
		var validationData = this.properties[property];
		if (validationData) {
			var required = validationData.required;
			var hasData = validationData.hasData;
			var isValid = validationData.isValid;
			return isValid || (!isValid && !hasData);
		} else {
			return true;
		}
	};

	/**
	 * @function get status code mapper to map the status code with field and messages
	 * @param statusCode {string} status code from service response
	 */
	ValidationModel.prototype.statusCodeMapper = function(statusCode) {
		var statusCodeMap = util.mailingAddressStatusCodeMapper(statusCode);
			statusCodeMessage = contentUtil.getValue('MY_PROFILE_ADDRESS_ERROR_MESSAGE', statusCode);

		this.validatorErrorHeader.fields =[];

		// no message mapped for status code
		if (!statusCodeMessage || statusCodeMessage === '') {
			this.validatorErrorHeader.message = contentUtil.getValue('MY_PROFILE_ADDRESS_ERROR_MESSAGE', 'SYSTEM_ERROR');
		} else {

			// no field
			if (statusCodeMap.fields.length === 0) {
				this.validatorErrorHeader.message = statusCodeMessage;
			}

			// only one field
			else if (statusCodeMap.fields.length===1){
				var headerMessage = contentUtil.getValue('MY_PROFILE_ADDRESS_ERROR_MESSAGE', 'form_level_header_with_placeholder');
				label = getLabelFromProperty(this.view.model, statusCodeMap.fields[0]),
					property = util.convertToSnakeCase(statusCodeMap.fields[0]);

				headerMessage = headerMessage.replace('field_name', label);
				this.validatorErrorHeader.message = headerMessage;

				//TODO: remove this test code
				this.validatorErrorHeader.message += statusCodeMessage;
				//TODO: end of remove

				this.validatorErrorHeader.fields[statusCodeMap.fields[0]] = statusCodeMessage;
				this.clientErrorMessages.lens(statusCodeMap.fields[0]).set(statusCodeMessage);

			}

			// more than 1 field
			else {
				this.validatorErrorHeader.message = contentUtil.getValue('MY_PROFILE_ADDRESS_ERROR_MESSAGE', 'form_level_header');
				for(x in statusCodeMap.fields){
					var label = getLabelFromProperty(this.view.model, statusCodeMap.fields[x]),
					property = util.convertToSnakeCase(statusCodeMap.fields[x]);
					this.validatorErrorHeader.list.push(label);
					this.validatorErrorHeader.fields[statusCodeMap.fields[x]] = statusCodeMessage;
				}
			}
		}

		return statusCodeMap;
	};

	/**
	 * @function to render erverside error messages
	 * @param data {object} contains status code from service response
	 */
	ValidationModel.prototype.renderServerErrorHeader = function(data) {
		this.statusCodeMapper(data.statusCode);
		this.renderErrorHeader();
	}

	return ValidationModel;

});
