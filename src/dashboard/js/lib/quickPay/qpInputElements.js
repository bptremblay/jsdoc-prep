/**
 * @fileoverview Defines UI Elements API
 * @author Diane Palla (E398585)
 */
define(function() {



	//Using the revealing Prototype pattern - best of both worlds - private, public encapsulation and prototype members to save memory

	/**
	 * BaseReadOnlyValue is the super class to represent any UI element storing a value,
	 * whether it is of value type of enum or text.
	 *
	 * Note: Any this.x properties set in this constructor will be available on the 'newed' object
	 * as well as the prototype functions
	 *
	 * @constructor
	 * @param {string}  id
	 * @param {string}  label
	 * @param {string}  classIds
	 * @param {string}  defaultValue
	 * @param {string}  valueType
	 * @param {string}  enumValues
	 * @param {Boolean} isEnforceEnumValues
	 */
	var BaseReadOnlyValue = function(id, label, classIds, defaultValue, valueType, enumValues, isEnforceEnumValues) {

		this.id = id;

		this.label = label;

		this.classIds = classIds;
		this.defaultValue = defaultValue;

		//Defensive code to protect against invalid enumValues
		if(typeof(isEnforceEnumValues)==='undefined'||isEnforceEnumValues===null||
			(isEnforceEnumValues!==false&&isEnforceEnumValues!==true)) {
			isEnforceEnumValues = false;
		}

		this.isEnforceEnumValues = isEnforceEnumValues;

		if( typeof(valueType)!=='undefined' && valueType === 'enum') {
			if(isEnforceEnumValues === true) {
				if (typeof(enumValues)=== 'undefined' || enumValues === null || enumValues.length <= 0) {
					throw 'Constructor BaseReadonlyValue requires an array of enumValues if valueType is enum. Note id is ' + id;
				}
				else if (typeof(enumValues[0].label)==='undefined' || typeof(enumValues[0].value)==='undefined') {
					throw 'Constructor BaseReadonlyValue requires an array of enumValues with each element having a label and value property. Note id is ' + id;
				}
			}
		}
		else if( typeof(valueType)==='undefined' || valueType === null || valueType === '' || valueType === 'string' ) {
			valueType = 'string';
		}
		else {
			throw 'Constructor BaseReadonlyValue requires a valid valueType -  enum or string. Note id is ' + id;
		}


		this.valueType = valueType;
		this.enumValues = enumValues;
		this.value = this.defaultValue;

	};


	/**
	 * BaseReadOnly prototype functions
	 *
	 * Prototype defines the shared functions for the BaseReadOnlyValue 'class' as well as
	 * a continuation of the constructor to validate its default value input with the validateValue function
	 *
	 */
	BaseReadOnlyValue.prototype = (function() {


		var validateValue = function() {

			if(this.isEnforceEnumValues===false) {
				throw 'BaseReadOnlyValue.validateValue: isEnforceEnumValues is false. Cannot proceed to validate!';
			}

			if(this.valueType==='string') {


			}
			else if (this.valueType === 'enum' ) {
				var label = getLabelByValue.call(this, this.value);
				if(typeof(label)==='undefined' || label === null ) {
					return false;
				}
				else if(label === '') {
					//log or throw
				}
			}

			return true;
		};

		//Continuation of constructor because validateValue function is required to be called.
		var isDefaultValueValid = validateValue.call(this);

		if(!isDefaultValueValid) {
			throw 'Constructor BaseReadonlyValue requires a default value ' +
				'to be valid against the enumValues for enum validType input elements! '+
				'Note: defaultValue given is \'' + this.defaultValue + '\'';
		}

		var getValidValue = function() {

			var isValidValue = validateValue.call(this);

			if(!isValidValue) {
				this.value = this.defaultValue;
			}

			return this.value;
		};

		var isValueKeysMapCreated = false;
		var valueKeysMap = {};

		/**
		 * Create the values key map once for fast retrieval.
		 * It can be created only once because enumValues must not change over life of InputElement object.
		 * enumValues is only passed in constructor.
		 *
		 * @return {object} with property names being the value of the enumValue element
		 */
		var getValueKeysMap = function() {

			if(isValueKeysMapCreated !== true) {
				var ev = null;
				//One loop one time to create lookup map instead of looping each time value is queried on enumValues.
				for (var j = 0; j < this.enumValues.length; j++ ) {
					ev = this.enumValues[j];
					valueKeysMap[ev.value] = ev.label;
				}

				isValueKeysMapCreated = true;
			}
			return valueKeysMap;
		};

		/**
		 * getLabelByValue retrieve the enum label based on the incoming enum value.
		 *
		 * This function leverages the valueKeysMap created by getValueKeysMap function.
		 *
		 * @param  {string} valueToFind
		 * @return {string}
		 */
		var getLabelByValue = function(valueToFind) {

			var theValueKeysMap = getValueKeysMap.call(this);

			var theLabelForTheValue = theValueKeysMap[valueToFind];

			if(typeof(theLabelForTheValue)==='undefined') {
				theLabelForTheValue = null;
			}

			return theLabelForTheValue;


		};

		/**
		 * setValue sets the value blindly without ensuring validity.
		 *
		 * @param {string} userValue
		 */
		var setValue = function(userValue) {
			this.value = userValue;
		};

		/**
		 * setValidValue sets the value and ensures the value is a valid enum choice if the inputelement is of enum type.
		 * @param {string} valueThatShouldBeValid
		 */
		var setValidValue = function(valueThatShouldBeValid) {
			this.value = valueThatShouldBeValid;

			getValidValue.call(this);

		};

		/**
		 * getDisplayElement
		 * @param  {string} id
		 * @param  {string} label
		 * @param  {string} value
		 * @return {string}
		 */
		var getDisplayElement = function(id, label, value, dataHidden){
			var isDataHidden = dataHidden && dataHidden===true;
			var displayElement = {
				'id': id + '_input',
				'label': label,
				'inputs': {
				'data': {
					'id': isDataHidden ? id : id + '_to_target',
					'value': value,
					'datahidden': (isDataHidden ? true : undefined)
					}
				}
			};
			return displayElement;
		};

		/**
		 * getUICDiplayElement returns the UIC JSON Display data required for rendering.
		 * @return {json}
		 */
		var getUICDisplayElement = function(dataHidden) {

			return getDisplayElement(this.id, this.label, this.value, dataHidden);
		};



		var getActionElement = function(id, label, classIds, isDisabled){
			var actionElement = {
				'id': id,
				'label': label,
				'classes': classIds
			};

			if(typeof(isDisabled)!=='undefined'&&isDisabled&&isDisabled===true) {
				actionElement.disabled = true;
			}

			return actionElement;
		};

		/**
		 * getUICActionElement returns the UIC JSON Action data required for rendering.
		 * @return {json}
		 */
		var getUICActionElement = function(isDisabled){
			return getActionElement(this.id, this.label, this.classIds, isDisabled);
		};

		//The returned prototype functions for BaseInputElement
		//The other properties on the BaseInputElement object are the this.x properties set in main
		//BaseInputElement constructor
		return {
			setValidValue: setValidValue,
			setValue: setValue,
			getValidValue: getValidValue,
			getValue: function() { return this.value; },
			getUICDisplayElement: getUICDisplayElement,
			getUICActionElement: getUICActionElement
			//getUICFilter: getBaseUIControlObj
		};


	})();

	//The mapping of BaseInputElement class types to the UIC name in the UIC rendering object.
	var InputElementTypesMap = {
		'CheckBox' : 'checkbox',
		'DropDown' : 'select',
		'RadioButtons' : 'radio',
		'TextBox': 'text',
		'MoneyInput': 'money',
		'DateInput' : 'date'

	};

	/**
	 * BaseInputElement represent any value-based element that can be input by the user
	 *
	 * It is child class of BaseReadOnlyValue, as it has properties and behavior of that.
	 *
	 * Note: Any this.x properties set in this constructor will be available on the 'newed' object
	 * as well as the prototype functions
	 *
	 * @param {string} elementType - string representation of the InputElementType to match InputElementTypesMap
	 * @param {string} id
	 * @param {string} label
	 * @param {string} classIds
	 * @param {string} defaultValue
	 * @param {string} valueType - only enum string choices accepted: 'enum' or 'string'
	 * @param {array} enumValues - array of objects with label and value properties
	 */
	var BaseInputElement = function(elementType, id, label, classIds, defaultValue, valueType, enumValues) {

		BaseReadOnlyValue.call(this, id, label, classIds, defaultValue, valueType, enumValues, true);

		if(typeof(elementType)==='undefined'||elementType===null||!elementType||!elementType.length||elementType.length<=0) {
			throw 'BaseInputElement constructor elementType is required but is ' +
				typeof(elementType)!=='undefined' ? elementType : 'undefined';
		}
		this.elementType = elementType;

		var validElementType = InputElementTypesMap[elementType];
		var isValidElementType = validElementType!==null&&validElementType.length>0;

		if(isValidElementType===false) {
			throw 'BaseInputElement constructor does see a valid element type!';
		}


	};

	BaseInputElement.prototype = new BaseReadOnlyValue();
	BaseInputElement.prototype.constructor = BaseReadOnlyValue;

	/**
	 * getBaseInputElementPrototypeFunctions function to return prototype functions
	 * to add to BaseInputElement's prototype, which is already
	 * filled from parent class BaseReadOnlyValue's prototype
	 * @return {object} with properties as functions
	 */
	var getBaseInputElementPrototypeFunctions = function() {

		var getElementType = function() {
			return InputElementTypesMap[this.elementType];

		};

		var getBaseUIControlFilterItemsArray = function() {

			var filterElObjsArray = null;

			var theEnumValues = this.enumValues;

			if(typeof(theEnumValues)!=='undefined'&&theEnumValues!==null&&theEnumValues&&theEnumValues.length) {

				filterElObjsArray = [];

				for(var i = 0; i<theEnumValues.length; i++) {

					var item = theEnumValues[i];
					var itemValue = item.value;
					var itemLabel = item.label;

					var selectedValue = this.getValidValue.call(this);

					var filterElObj = {
							label: itemLabel,
							value:itemValue,
							bindings:null
						};

					if(selectedValue === itemValue) {
						filterElObj.selected = true;
					}
					filterElObjsArray[filterElObjsArray.length] = filterElObj;

				}
			}

			return filterElObjsArray;
		};

		var getInputElement = function(id, label, elementType, options){


			var inputElement = {
				id: id+ '_input',
				label: label


			};

			var inputs = {}, inputDetails = {};
			inputs[elementType] = inputDetails;

			inputDetails.id = id;
			inputDetails.label = label;

			inputDetails.isSelectDisabled = this.isSelectDisabled;

			if (options != null){
				inputDetails.options = options;
			}
			inputDetails.value = this.value;

			inputElement.inputs = inputs;
			//inputElement.for = id;
			//inputElement.adaText = label;

			return inputElement;
		};

		var getBaseUIControlObj = function() {

			/*
			var filterObj = {
				id: this.id,
				classIds: this.classIds,
				value: this.getValidValue.call(this),
				options: getBaseUIControlFilterItemsArray.call(this)
			};

			return {'filter': filterObj };
			*/
			return getInputElement.call(this,this.id, this.label,getElementType.call(this),
				getBaseUIControlFilterItemsArray.call(this));
		};

		return {
			getUICInputElement: getBaseUIControlObj
		};

	};

	var BIEPrototypeFunctions = getBaseInputElementPrototypeFunctions();

	//Assign the getUICInputElement function to the existing prototype
	BaseInputElement.prototype.getUICInputElement = BIEPrototypeFunctions.getUICInputElement;

	/**
	 * DropDown represents a dropdown input element.
	 * It extends BaseInputElement, is enum valueType and 'DropDown' elementType
	 *
	 * @param {string}  id - element id
	 * @param {string}  label - label for input element
	 * @param {string}  classIds - classes for input element
	 * @param {string}  defaultValue - default value if no value is set
	 * @param {object}  enumValues - array of objects with label and value properties that represent enum choices for enum valueType
	 * @param {Boolean} isSelectDisabled - flag whether select is disabled on initial rendering
	 */
	var DropDown = function(id, label, classIds, defaultValue, enumValues, isSelectDisabled) {
		BaseInputElement.call(this, 'DropDown', id, label, classIds, defaultValue, 'enum', enumValues);
		this.isSelectDisabled = typeof(isSelectDisabled)!=='undefined' ? isSelectDisabled : false;
	};

	DropDown.prototype = new BaseInputElement('DropDown');
	DropDown.prototype.constructor = BaseInputElement;

	/**
	 * RadioButtons represents a group of radio buttons, one of which can be selected at a time.
	 * It extends BaseInputElement, is enum valueType and 'RadioButtons' elementType
	 *
	 * @param {string}  id - element id
	 * @param {string}  label - label for input element
	 * @param {string}  classIds - classes for input element
	 * @param {string}  defaultValue - default value if no value is set
	 * @param {object}  enumValues - array of objects with label and value properties that represent enum choices for enum valueType
	 * @param {Boolean} isSelectDisabled - flag whether select is disabled on initial rendering
	 */
	var RadioButtons = function(id, label, classIds, defaultValue, enumValues) {
		BaseInputElement.call(this, 'RadioButtons', id, label, classIds, defaultValue, 'enum', enumValues);
	};

	RadioButtons.prototype = new BaseInputElement('RadioButtons');
	RadioButtons.prototype.constructor = BaseInputElement;

	var TextBox = function(id, label, classIds, defaultValue) {
		BaseInputElement.call(this, 'TextBox', id, label, classIds, defaultValue, 'string');
	};

	TextBox.prototype = new BaseInputElement('TextBox');
	TextBox.prototype.constructor = BaseInputElement;

	var MoneyInput = function(id, label, classIds, defaultValue) {
		BaseInputElement.call(this, 'MoneyInput', id, label, classIds, defaultValue, 'string');
	};

	MoneyInput.prototype = new BaseInputElement('MoneyInput');
	MoneyInput.prototype.constructor = BaseInputElement;

	var DateInput = function(id, label, classIds, defaultValue) {
		BaseInputElement.call(this, 'DateInput', id, label, classIds, defaultValue, 'string');
	};

	DateInput.prototype = new BaseInputElement('DateInput');
	DateInput.prototype.constructor = BaseInputElement;


	/**
	 * CheckBox represents a single checkbox input element.
	 * It extends BaseInputElement, is enum valueType and 'CheckBox' elementType
	 *
	 * @param {string}  id - element id
	 * @param {string}  label - label for input element
	 * @param {string}  classIds - classes for input element
	 * @param {string}  defaultValue - default value if no value is set
	 * @param {object}  enumValues - array of objects with label and value properties that represent enum choices for enum valueType
	 * @param {Boolean} isSelectDisabled - flag whether select is disabled on initial rendering
	 */
	var CheckBox = function(id, label, classIds, defaultValue, enumValue) {

		if(typeof(enumValue)==='undefined' || enumValue === null ||
			typeof(enumValue.length)==='undefined' || (enumValue.length!==1)) {
			throw 'Checkbox constructor requires enumValue with one array element with an object with label and value properties.';
		}

		BaseInputElement.call(this, 'CheckBox', id, label, classIds, defaultValue, 'enum', enumValue);

		this.isChecked = false;

		this.setIsCheckedValue = function(isChecked) {
			if(typeof(isChecked)==='undefined'||isChecked===null) {
				throw 'Checkbox.setIsCheckedValue:  isChecked parameter is not defined; it must be true or false.';
			}
			else if (isChecked!==true&&isChecked!==false) {
				throw 'Checkbox.setIsCheckedValue:  isChecked parameter is not defined; it must be true or false.';
			}

			this.isChecked = isChecked;
		};

		this.getIsCheckedValue = function() {
			return this.isChecked;
		};

		return this;
	};

	CheckBox.prototype = new BaseInputElement('CheckBox');
	CheckBox.prototype.constructor = BaseInputElement;

	/**
	 * EnumTypesMap holds the mapping from InputElement type to the constructor function references.
	 * This is used for easy lookup for the dataTransform utility class.
	 * @type {Object}
	 */
	var EnumTypesMap = {
		'CheckBox' : CheckBox,
		'DropDown' : DropDown,
		'RadioButtons' : RadioButtons
	};

	/**
	 * staticBaseInputElement is a utility class to data transform service data arrays to InputElement object types and its UIC rendering objects
	 * as well as generate enumValues arrays required by the InputElement classes.
	 * @return {staticBaseInputElementUtility}
	 */
	var staticBaseInputElement = (function(){
		var createEnumValue = function(value, label) {

			return { label: label, value: value};
		};

		var isLabelDashes = function(label) {

			if(typeof(label)!=='undefined'&&label!==null&&label.charAt&&label.length&&label.length>0) {


				for(var i=0;i<label.length; i++) {
					var ch = label.charAt(i);
					if(ch!=='-') {
						return false;
					}
				}
				return true;

			}
			else {
				return false;
			}
			return false;


		};

		var ValueDelim = '@';
		var createValueForEnumValue = function(id, label) {

			var theLabel = label;
			if(typeof(label)!=='undefined'&& isLabelDashes(label)) {
				theLabel = '--';
			}
			return id + ValueDelim + theLabel;
		};

		var extractValueFromIdValue = function(idValue) {

			var val = idValue;
			if(typeof(idValue)!=='undefined'&& idValue) {
				var indexDelim = idValue.indexOf(ValueDelim);
				if(indexDelim>=0) {
					val = idValue.substring(indexDelim+1);
				}
			}
			return val;
		};

		var extractIdFromIdValue = function(idValue) {

			var val = idValue;
			if(typeof(idValue)!=='undefined'&& idValue) {
				var indexDelim = idValue.indexOf(ValueDelim);
				if(indexDelim>=0) {
					val = idValue.substring(0,indexDelim);
				}
			}
			return val;
		};

		var createEnumValueFromIdAndLabel = function(id, label) {
			return createEnumValueFromIdAndLabelAndLabelSuffix(id, label);
		};

		var createEnumValueFromIdAndLabelAndLabelSuffix = function(id, label, labelSuffix) {
			var value = createValueForEnumValue(id, label);
			var labelEnding = '';
			if(typeof(labelSuffix)!=='undefined') {
				labelEnding = ' ' + labelSuffix;
			}
			return createEnumValue(value, label+labelEnding);
		};

		var dataTransformToEnumValuesArray = function(serviceObjectsArrayWithIdAndLabel, selectText, labelSuffixFunc) {

			var dataEnumValuesArray = [ createEnumValueFromIdAndLabel(0, selectText) ];

			for (var i = 0; i < serviceObjectsArrayWithIdAndLabel.length; i++) {

				var svcDataObj = serviceObjectsArrayWithIdAndLabel[i];
				var theId = svcDataObj.id;
				var theLabel = typeof(svcDataObj.label)!=='undefined' ?
					svcDataObj.label :
					svcDataObj.name;

				var theSuffix = undefined;
				if(typeof(labelSuffixFunc)!=='undefined'&&labelSuffixFunc!==null&&labelSuffixFunc.call) {
					theSuffix = labelSuffixFunc(svcDataObj);
				}

				dataEnumValuesArray[dataEnumValuesArray.length] =
					createEnumValueFromIdAndLabelAndLabelSuffix(theId, theLabel, theSuffix);
			}

			return dataEnumValuesArray;
		};

		var dataTransformToEnumInputElementsUICInputElement = function(EnumType, serviceObjectsArrayWithIdAndLabel, selectText,
			inputElementId, inputElementLabel, inputElementClassIds, inputElementDefaultValue, labelSuffixFunc) {

			var EnumTypeConstructorFunc = null;
			if(typeof(EnumType)!=='undefined'&&EnumType!==null) {
				EnumTypeConstructorFunc = EnumTypesMap[EnumType];
			}

			if(EnumTypeConstructorFunc===null) {
				throw 'dataTransformToEnum:  EnumTypeConstructorFunc must be defined from EnumType; EnumType is invalid ' +
					EnumType;
			}

			///SETTING all parameters to empty if not defined
			var theInputElementId = null;
			if(typeof(inputElementId)==='undefined'||inputElementId===null) {
				theInputElementId = '';
			}
			else {
				theInputElementId = inputElementId;
			}


			var theInputElementClassIds = null;
			if(typeof(inputElementClassIds)==='undefined'||inputElementClassIds===null) {
				theInputElementClassIds = '';
			}
			else {
				theInputElementClassIds = inputElementClassIds;
			}

			var theInputElementDefaultValue = null;
			if(typeof(inputElementDefaultValue)==='undefined'||inputElementDefaultValue===null) {
				theInputElementDefaultValue = '';
			}
			else {
				theInputElementDefaultValue = inputElementDefaultValue;
			}

			var theInputElementLabel = null;
			if(typeof(inputElementLabel)==='undefined'||inputElementLabel===null) {
				theInputElementLabel = '';
			}
			else {
				theInputElementLabel = inputElementLabel;
			}

			//END SETTING all parameters to empty if not defined

			var dataEnumValuesArray = dataTransformToEnumValuesArray(serviceObjectsArrayWithIdAndLabel, selectText, labelSuffixFunc);

			var dataEnumInputElement = new EnumTypeConstructorFunc( theInputElementId, theInputElementLabel, theInputElementClassIds,
				theInputElementDefaultValue,
				dataEnumValuesArray );

	        var dataFilter = dataEnumInputElement.getUICInputElement();

	        return dataFilter;
		};

		var dataTransformToDropDownsUICInputElement = function(serviceObjectsArrayWithIdAndLabel, selectText,
			inputElementId, inputElementLabel, inputElementClassIds, inputElementDefaultValue, labelSuffixFunc) {

			return dataTransformToEnumInputElementsUICInputElement('DropDown', serviceObjectsArrayWithIdAndLabel, selectText,
			inputElementId,  inputElementLabel, inputElementClassIds, inputElementDefaultValue, labelSuffixFunc);

		};

		//The API of staticBaseInputElementUtility
		return {
			createEnumValue: createEnumValue,
			createValueForEnumValue: createValueForEnumValue,
			createEnumValueFromIdAndLabel: createEnumValueFromIdAndLabel,
			createEnumValueFromIdAndLabelAndLabelSuffix: createEnumValueFromIdAndLabelAndLabelSuffix,
			dataTransformToEnumValuesArray: dataTransformToEnumValuesArray,
			dataTransformToEnumInputElementsUICInputElement: dataTransformToEnumInputElementsUICInputElement,
			dataTransformToDropDownsUICInputElement: dataTransformToDropDownsUICInputElement,
			extractValueFromIdValue: extractValueFromIdValue,
			extractIdFromIdValue: extractIdFromIdValue
		};
	})();

	/**
	 * readOnlyValueUtility is a utility class to data transform service data arrays
	 * to ReadOnlyValue object types and its UIC rendering objects
	 * as well as generate enumValues arrays required by the InputElement classes.
	 * @return {readOnlyValueUtility}
	 */
	var readOnlyValueUtility = (function(){

		var getUICActionElement = function(id, label, isUsePrimaryClass, isDisabled) {

			var classIds = undefined;
			if(typeof(isUsePrimaryClass)!=='undefined'&&isUsePrimaryClass===true) {
				classIds = 'primary';
			}
			var readOnlyVal = new BaseReadOnlyValue(id, label, classIds);

			return readOnlyVal.getUICActionElement(isDisabled);
		};

		//The API of ReadOnlyValueUtility
		return {
			getUICDisplayElement: function(id, label, value,dataHidden) {
				var readOnlyVal = new BaseReadOnlyValue(id, label);
				readOnlyVal.setValue(value);

				return readOnlyVal.getUICDisplayElement(dataHidden);
			},

			getUICActionElement: getUICActionElement,
			getUICActionElementsPair: function(id1, label1, id2, label2, isUsePrimaryClassOnSecond) {

				if(typeof(isUsePrimaryClassOnSecond)==='undefined'||isUsePrimaryClassOnSecond===null) {
					isUsePrimaryClassOnSecond = true;
				}
				if(isUsePrimaryClassOnSecond!==true&&isUsePrimaryClassOnSecond!==false) {
					isUsePrimaryClassOnSecond = true;
				}

				return [ getUICActionElement(id1, label1), getUICActionElement(id2, label2, isUsePrimaryClassOnSecond)];
			}
		};

	})();

	//The API of UI Elements
	return {

		DropDown:DropDown,
		RadioButtons: RadioButtons,
		TextBox: TextBox,
		CheckBox: CheckBox,
		MoneyInput: MoneyInput,
		enumInputElementUtility: staticBaseInputElement,
		ReadOnlyValue: BaseReadOnlyValue,
		readOnlyValueUtility: readOnlyValueUtility,
		DateInput: DateInput
	};

});
