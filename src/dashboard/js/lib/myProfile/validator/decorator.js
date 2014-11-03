define(function(require) {

	var exports = {};

	// Custom utilities used across validation modules.
	var util = require('dashboard/lib/myProfile/validator/utilities');

	var ValidationModel = require('dashboard/lib/myProfile/validator/validationModel');
	var elementObserver = require('dashboard/lib/myProfile/elementObserver')();
	
	var errorBubble;
	var validationModel;
	var validationArray = [];

	return function(view, validationFunctions) {

		var ValidationDecorator = function() {

			var validationDecorator = function(node) {

				addNoValidate(node);
				interceptSubmitButtons(node);

				validationModel = new ValidationModel(this, view);
				validationArray = validationFunctions || validationArray;

				var dirtyField = false;

				var handlers = {
					blur: function(domEvent) {
						console.log('blur');
						var property = util.getPropertyFromEvent(domEvent);

						if (dirtyField) {
							updateFieldHighlighting(property);
						}

						removeErrorBubble();
					},
					keydown: function(domEvent) {
						if (util.tabKeyPressed(domEvent)) {
							console.log('tab');
						} else if (util.enterKeyPressed(domEvent)) {
							// Intercept form submit on enter key
							validateForm();
						} else if (!util.altKeyPressed(domEvent) && !util.tabKeyPressed(domEvent)) {
							dirtyField = true;
						}
					},
					focus: function(domEvent) {
						console.log('focus');
						var property = util.getPropertyFromEvent(domEvent);
						console.log(validationModel.getErrorMessage(property));
						showErrorBubble(property);
						dirtyField = false;
					},
					submit: function(domEvent) {
						domEvent.preventDefault();
					}
				};

				util.addEventHandlers(node, handlers);

				return {
					teardown: function() {
						util.removeEventHandlers(node, handlers);
					}
				};
			};

			return validationDecorator;
		}

		return ValidationDecorator;

	};

	function validateForm() {
		validationModel.removeAllErrors();
		var formIsValid = updateFormHighlighting();
		if (!formIsValid) {
			validationModel.renderErrorHeader();

			// focus on header message
			elementObserver.isInserted('#form-error-heading', function(){
				document.getElementById('form-error-heading').focus();
			});

			return false;
		} else {
			validationModel.renderErrorHeader();
			removeErrorBubble();
		}
	};

	function interceptSubmitButtons(formElement) {
		var nodeList = formElement.querySelectorAll('[type="submit"]');
		console.log(nodeList);
		for (var i = 0; i < nodeList.length; i++) {

			var node = nodeList[i];

			$(node).click(function(event) {
				return validateForm();
			});

		}
	}

	function addNoValidate(formElement) {
		formElement.setAttribute('novalidate', '');
	}

	function blurFromBubbleEvent(domEvent) {
		if (domEvent.target.id === 'validator-error-bubble') {
			return true;
		} else {
			return false;
		}
	}

	function updateFieldHighlighting(property, required) {
		var isValid = validationModel.fieldIsValid(property, required);
		var node = util.getNodeFromProperty(property);
		if (node) {
			if (isValid === true) {
				removeErrorHighlighting(node);
				return true;
			} else if (isValid === false) {
				showErrorHighlighting(node);
				return false;
			}
		}
	}

	function updateFormHighlighting() {
		var properties = util.getAllValidatedProperties();
		var formIsValid = true, customValidationPassed = true;
		var fieldIsValid = null;

		properties.forEach(function(property) {

			fieldIsValid = updateFieldHighlighting(property, true);

			if (!fieldIsValid) {
				formIsValid = false;
			}

		}.bind(this));

		if(validationArray.length){
			var customValidationPassed = validationModel.customValidation(validationArray);
		}

		return formIsValid && customValidationPassed;
	}

	// Change to classes rather than direct setting of styles.
	function removeErrorHighlighting(node) {
		var currentClass = node.className,
			newClass = currentClass.replace(/(?:^|\s)clientSideError(?!\S)/g, '');
		node.className = newClass;
		//node.setAttribute('style', 'border-color:lightgreen;border-width:2px');
	}

	function showErrorHighlighting(node) {
		var currentClass = node.className,
			newClass = currentClass + ' clientSideError';
		!currentClass.match(/(?:^|\s)clientSideError(?!\S)/) && (node.className = newClass);
		//node.setAttribute('style', 'border-color:pink;border-width:2px;');
	}

	function showErrorBubble(property) {
		var node = util.getNodeFromProperty(property),
			hasClass = node && node.className.match(/(?:^|\s)clientSideError|serverSideError(?!\S)/),
			message = fetchErrorMessage(property);
		if (hasClass && message) {
			console.log('show bubble');
			var errorBubble = document.createElement("div"),
				oldErrorBubble = document.getElementById('client-side-error'),
				messageNode = document.createTextNode(message);

			errorBubble.appendChild(messageNode);

			oldErrorBubble && oldErrorBubble.parentNode.removeChild(oldErrorBubble);
			errorBubble.className = 'jpui error pointing below label attached';
			errorBubble.id = ('client-side-error');
			node.parentNode.insertBefore(errorBubble, node.nextSibling);
		}
	}

	function fetchErrorMessage(property) {
		var message = validationModel.getErrorMessage(property);
		if (message) {
			return message;
		} else {
			return null;
		}
	}

	function removeErrorBubble() {
		console.log('remove bubble');
		var errorBubble = document.getElementById('client-side-error');
		errorBubble && errorBubble.parentNode.removeChild(errorBubble);
	}

});
