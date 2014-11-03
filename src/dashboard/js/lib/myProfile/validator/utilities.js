define(function(require) {

	var exports = {};

	var util = require('blue/util');

	exports.addEventHandlers = function(node, handlers) {
		for (eventName in handlers) {
			if (handlers.hasOwnProperty(eventName)) {
				node.addEventListener(eventName, handlers[eventName], true);
			}
		}
	};

	exports.removeEventHandlers = function(node, handlers) {
		for (eventName in handlers) {
			if (handlers.hasOwnProperty(eventName)) {
				node.removeEventListener(eventName, handlers[eventName], true);
			}
		}
	};

	exports.convertToSnakeCase = function(camelCaseString) {
		return util.string.unCamelCase(camelCaseString, '_');
	};

	var eventFilter = function(attribute, value) {
		return function(domEvent) {
			return domEvent[attribute] === value ? true : false;
		};
	};

	exports.tabKeyPressed = eventFilter('keyCode', 9);
	exports.enterKeyPressed = eventFilter('keyCode', 13);
	exports.isBlurEvent = eventFilter('blur', 'blur');
	exports.isFocusEvent = eventFilter('focus', 'focus');
	exports.altKeyPressed = eventFilter('altKey', 'true');

	exports.getAllValidatedProperties = function() {
		var nodeList = document.querySelectorAll('[validate]');
		var results = [];

		for (var i = 0; i < nodeList.length; i++) {
			var node = nodeList[i];
			results.push(exports.getPropertyFromNode(node));
		};

		return results;
	};

	exports.getNodeFromProperty = function(property) {
		return document.querySelector(['[validate="', property, '"]'].join(''));
	};

	exports.getPropertyFromNode = function(node) {
		return node.getAttribute('validate');
	};

	exports.getPropertyFromEvent = function(domEvent) {
		return exports.getPropertyFromNode(domEvent.target);
	};

	exports.fieldRequired = function(property) {
		var node = exports.getNodeFromProperty(property);
		if(node) return node.required;
	};

	exports.mailingAddressStatusCodeMapper = function(statusCode){

		var dataOut = {'statusCode':statusCode,'fields':[]},
			fields = {
				'line1':'mailingAddressLine1',
				'line2':'mailingAddressLine2',
				'line3':'mailingAddressLine3',
				'city':'city',
				'state':'state',
				'country':'country',
				'zipCode':'zipCode',
				'poType':'postOfficeType',
				'fromDate':'mailingAddressEffectiveDate',
				'toDate':'mailingAddressEndDate'
			}

		// switch on statusCode
		switch(statusCode){

			// case: You have not changed your information.
			case 'NO_CHANGE':
			break;

			// case: Please enter an address that is not a P.O. Box.
			case 'PO_BOX_ADDRESS':
			break;

			// case: You already have a temporary address scheduled for this time period. Please enter a new date.
			case 'TIME_PERIOD_EXISTS':
				//dataOut.fields.push(fields.fromDate);
				//dataOut.fields.push(fields.toDate);
			break;

			// case: Classic UI is NOT Handling this error code
			case 'TRILLIUM_CODE_CAA00005':
			break;

			// case: The street address cannot be verified. Please try again.
			case 'TRILLIUM_CODE_26':
				dataOut.fields.push(fields.line1);
			break;

			// case: The street address is too long. Please try again.
			case 'TRILLIUM_CODE_034':
				dataOut.fields.push(fields.line1);
			break;

			// case: The street address cannot be verified. Please try again.
			case 'TRILLIUM_CODE_036':
				dataOut.fields.push(fields.line1);
			break;

			// case: The house number is too long. Please try again.
			case 'TRILLIUM_CODE_038':
				dataOut.fields.push(fields.line1);
			break;

			// case: Address Line 2 is too long. Please try again.
			case 'TRILLIUM_CODE_040':
				dataOut.fields.push(fields.line1);
			break;

			// case: You have entered too many dwellings. Please try again.
			case 'TRILLIUM_CODE_042':
				dataOut.fields.push(fields.line1);
			break;

			// case: The street address is too long. Please try again.
			case 'TRILLIUM_CODE_051':
				dataOut.fields.push(fields.line1);
			break;

			// case: The street address cannot be verified. Please try again.
			case 'TRILLIUM_CODE_57':
				dataOut.fields.push(fields.line1);
			break;

			// case: The city cannot be verified with the state. Please try again.
			case 'TRILLIUM_CODE_61':
				dataOut.fields.push(fields.city);
			break;

			// case: zipcode / postal code cannot be verified
			case 'TRILLIUM_CODE_79':
				dataOut.fields.push(fields.zipCode);
			break;

			// case: The street address cannot be verified. Please try again.
			case 'TRILLIUM_CODE_80':
				dataOut.fields.push(fields.line1);
			break;

			// case: You may use any characters in the Address Line 1 and Address Line 2 fields except: *, /, \, <, > and ~. Please try again.
			case 'TRILLIUM_CODE_84':
				dataOut.fields.push(fields.line1);
			break;

			// case: City is a required field. Please enter a city and try again.
			case 'TRILLIUM_CODE_92':
				dataOut.fields.push(fields.city);
			break;

			// case: didnt recognize street name / address
			case 'TRILLIUM_CODE_094':
				dataOut.fields.push(fields.line1);
			break;

			// case: State / Province is required field.
			case 'TRILLIUM_CODE_32':
				dataOut.fields.push(fields.state);
			break;

			// case: zipcode / postal code is required field.
			case 'TRILLIUM_CODE_36':
				dataOut.fields.push(fields.zipCode);
			break;

			// case: Classic UI is NOT Handling this error code
			case 'TRILLIUM_CODE_38':
			break;

			// case: Classic UI is NOT Handling this error code
			case 'TRILLIUM_CODE_40':
			break;

			// case: Address is a required field. Please enter a valid address and try again.
			case 'TRILLIUM_CODE_42':
				dataOut.fields.push(fields.line1);
			break;

			// case: The city you entered cannot be found. Please try again.
			case 'TRILLIUM_CODE_G01':
				dataOut.fields.push(fields.city);
			break;

			// case: The street name you entered cannot be found. Please try again.
			case 'TRILLIUM_CODE_G02':
				dataOut.fields.push(fields.line1);
			break;

			// case: The house or building number you entered cannot be found. Please try again.
			case 'TRILLIUM_CODE_G03':
				dataOut.fields.push(fields.line1);
			break;

			// case: The address you entered in Address Line 2 is incomplete. Please try again.
			case 'TRILLIUM_CODE_G04':
				dataOut.fields.push(fields.line1);
			break;

			// case: The address you entered is incomplete. Please try again.
			case 'TRILLIUM_CODE_G05':
				dataOut.fields.push(fields.line1);
			break;

			// case: The rural foreign address you entered is incomplete. Please try again.
			case 'TRILLIUM_CODE_G06':
				dataOut.fields.push(fields.line1);
			break;

			// case: zipcode / postal code is required field.
			case 'TRILLIUM_CODE_MV008':
				dataOut.fields.push(fields.zipCode);
			break;

			// case: Classic UI is NOT Handling this error code
			case 'TRILLIUM_CODE_CAA00004':
			break;

			// case: This address appears to be incorrect. Please update your information.
			case 'TRILLIUM_CODE_VLS05211':
				dataOut.fields.push(fields.line1);
			break;

			// case: Classic UI is NOT Handling this error code
			case 'TRILLIUM_CODE_3074':
			break;

			// case: Classic UI is NOT Handling this error code
			case 'TRILLIUM_CODE_3040':
			break;

			default:
			break;
		}

		return dataOut;
	}

	return exports;

});
