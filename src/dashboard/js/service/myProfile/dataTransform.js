/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module myProfile/DataTransform
 */
define(function(require) {

	var contentUtil = require('dashboard/lib/myProfile/contentUtil');

	return function DataTransform(settings) {

		this.transformAddressesList = function(data, additionalInfo){
			// Add Addtional Info to Header
			data.header = this.transformAddressHeader(data, additionalInfo);
			if(!data.header.noAddress) {
				data.primaryAddress = this.transformPrimaryAddress(data.primaryAddress, data.groupId);
				data.secondaryAddresses = this.transformSecondaryAddressesList(data.secondaryAddresses, data.groupId);
				data.temporaryAddresses = this.transformTemporaryAddressesList(data.temporaryAddresses, data.groupId);
			}
			return data;
		};

		this.transformAddressHeader = function(data, additionalInfo){
			var noAddress = !(data.primaryAddress || data.secondaryAddresses || data.temporaryAddresses),
				isInvalidMortgageAcct = data.statusCodes && ( data.statusCodes.indexOf('INVALID_MORTGAGE_ACCT_1') > -1 ||
										data.statusCodes.indexOf('INVALID_MORTGAGE_ACCT_2') > -1 ||
										data.statusCodes.indexOf('INVALID_MORTGAGE_ACCT_3') > -1),
				isDisabledMortgageAcct = data.statusCodes && data.statusCodes.indexOf('DISABLED_MORTGAGE_ACCT') > -1,
				isExternalStudentLoanAcct = data.statusCodes && data.statusCodes.indexOf('EXTERNAL_STUDENTLOAN_ACCT') > -1,
				hasWarnings = !!(isInvalidMortgageAcct || isDisabledMortgageAcct || isExternalStudentLoanAcct);

			return {
				noAddress: noAddress,
				isInvalidMortgageAcct: isInvalidMortgageAcct,
				isDisabledMortgageAcct: isDisabledMortgageAcct,
				isExternalStudentLoanAcct: isExternalStudentLoanAcct,
				hasWarnings: hasWarnings,
				messageInfo: additionalInfo.messageInfo
			};
		}

		this.transformPrimaryAddress = function(data, groupId){
			data = this.transformAddress(data, groupId);
			data.mailingAddressCategory = 'PRIMARY';
			data.deleteAllowed = false;

			return data;
		};

		this.transformSecondaryAddressesList = function(data, groupId){
			var addressesList = [],
				index = 2,
				address;
			for(i in data){
				address = this.transformAddress(data[i], groupId);
				address.mailingAddressCategory = 'SECONDARY';
				address.counterLabel = index++;
				addressesList.push(address);
			}

			return addressesList;
		};

		this.transformTemporaryAddressesList = function(data, groupId){
			var addressesList = [],
				index = 2,
				address;
			for(i in data){
				address = this.transformAddress(data[i], groupId);
				address.mailingAddressCategory = 'TEMPORARY';
				address.counterLabel = +i ? index++ : '';
				addressesList.push(address);
			}

			return addressesList;
		};

		this.transformAddress = function(dataIn, groupId){
			var dataOut = {},
				addressType = dataIn.countryCode === 'CAN' ? 'CANADA':
								(dataIn.countryCode !== 'USA' ? 'INTERNATIONAL' :
									(dataIn.postOfficeType ? 'MILITARY' : 'USA'));

			// Properties defined in spec
			dataOut.state = dataIn.stateCode;
			dataOut.country = dataIn.countryCode;
			dataOut.mailingAddressType = addressType;
			dataOut.mailingAddressLine1 = dataIn.line1;
			dataOut.mailingAddressLine2 = dataIn.line2;
			dataOut.mailingAddressLine3 = dataIn.line3;
			dataOut.city = dataIn.city;
			dataOut.postalCode = dataIn.zipcode;
			dataOut.postOfficeType = dataIn.postOfficeType;
			dataOut.accountDisplayName = dataIn.mask;
			dataOut.mailingAddressEndDate = this.transformDate(dataIn.toDate);
			dataOut.mailingAddressEffectiveDate = this.transformDate(dataIn.fromDate);
			dataOut.mailingAddressDateRangeFrequency = dataIn.everyYear;
			this.extendAddressZipcode(dataOut, dataIn.zipcode);

			// Properties  not defined in spec, added for handling business requirements.
			dataOut.groupId = groupId;
			dataOut.id = dataIn.id;
			dataOut.updateAllowed = dataIn.updateAllowed;
			dataOut.deleteAllowed = dataIn.deleteAllowed;
			dataOut.associatedAccounts = dataIn.associatedAccounts;
			dataOut.fromDate = this.transformDateForEdit(dataIn.fromDate);
			dataOut.toDate = this.transformDateForEdit(dataIn.toDate);
			if(dataOut.country && dataOut.country !== 'USA'){
				dataOut.countryName = contentUtil.getValue('COUNTRY', dataOut.country);
			}

			return dataOut;
		};


		/**
		 * @function
		 * @param {object} address address object to extend zipcode
 		 * @returns {object} transformed address object
		 * Split zipcode and zipcode extension and add to address.
		 */
		this.extendAddressZipcode = function(address, zipcode){
			zipcode = zipcode || '';
			if(address.mailingAddressType != 'INTERNATIONAL' && zipcode.length === 9 ){
				address.zipCode  =  zipcode.substring(0, 5);
				address.zipCodeExtension = zipcode.substring(5);
			} else{
				address.zipCode = zipcode;
			}
			return address;
		};

		this.transformDate = function(date){
			// TODO: Should read from language settings.
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			if(date && date.length === 8){
				date = months[date.substring(4,6)-1] + ' ' + parseInt(date.substring(6,8)) + ', ' + date.substring(0,4);
			}

			return date;
		}

		/**
		 * @function
		 * @param {string} dateIn date to transform
 		 * @returns {string} transformed date
		 * Transform date to mm/dd/yyyy format
		 */
		this.transformDateForEdit = function(dateIn){
			var dateOut
			if(dateIn && dateIn.length === 8){
				dateOut = dateIn.substring(4,6) + '/' + dateIn.substring(6,8) + '/' + dateIn.substring(0,4);
			}
			return dateOut;
		}

		/**
		 * @function
		 * @param {object} dataIn data to transform
 		 * @param {string} groupId
 		 * @returns {object} tranformed object
		 * Transform Add Address form data
		 */
		this.transformAddAddressData = function(dataIn, groupId){
			var mailingAddressCategory = dataIn.mailingAddressCategory.toUpperCase(),
				addressType = dataIn.mailingAddressType || 'USA';
			return {
				groupId: groupId,
				mailingAddressType: addressType,
				addressType: addressType,
				state: '',
				country: '',
				mailingAddressCategory: mailingAddressCategory,
				isPermanent: mailingAddressCategory === 'SECONDARY'
			};
		}

		/**
		 * @function
		 * @param {object} dataIn add option data to transform
 		 * @returns {object} tranformed add address options object
		 * We have two similar service calls we're handling with this
		 * data transform: add options and edit options.
		 */
		this.transformAddressOptions = function(dataIn){
			// Both add options and edit options have a list of eligible accounts
			// which needs to be unchecked by default. Edit options also has a list
			// of associated accounts which should be checked and read only.

			var eligibleAccounts = [];

			dataIn.eligibleAccounts && dataIn.eligibleAccounts.forEach(function(account){
				eligibleAccounts.push({
					id: account.id,
					mask: account.mask,
					checked: false
				});
			});

			return {
				associatedAccounts: dataIn.associatedAccounts,
				eligibleAccounts: eligibleAccounts,
				isPrimaryAllowed: dataIn.isPrimaryAllowed
			}
		}

		/**
		 * @function
		 * Create message Info when address is deleted.
		 */
		this.transformAddressDeletedMessage = function(dataIn, type, error){
			var dataOut = {};
			dataOut =  {
				messageInfo: {
					type: type,
					isAddressDeleted: type.toUpperCase() === 'SUCCESS',
					associatedAccounts : dataIn.associatedAccounts,
					mailingAddressCategory: dataIn.mailingAddressCategory,
					isTemporary: dataIn.isTemporary,
					address: dataIn.mailingAddressLine1
				}
			};
			error && this.extendErrorToMessage(dataOut, error);
			return dataOut;
		}

		/**
		 * @function
		 * Create message Info when address is added.
		 */
		this.transformAddressAddedMessage = function(dataIn, type, error){
			var dataOut = {};
			dataOut =  {
				messageInfo: {
					type: type,
					isAddressAdded: type.toUpperCase() === 'SUCCESS',
					address: dataIn.line1,
					isEdit: dataIn.isEdit
				}
			};
			error && this.extendErrorToMessage(dataOut, error);
			return dataOut;
		}

		/**
		 * @function Create message Info when address is changed for brokerage account.
		 * @param dataIn {object} data for message info
		 * @param type {text} return code
		 */
		this.transformAddressChangedMessage = function(dataIn, type){
			var dataOut = {};
			dataOut =  {
				messageInfo: {
					type: type,
					isAddressChanged: true,
					mask: dataIn.mask
				}
			};
			return dataOut;
		}

		/**
		 * @function
		 * Extend error info to message info.
		 */
		this.extendErrorToMessage = function(message, error){
			message.messsageInfo.title = error.title;
			message.messsageInfo.details = error.details;
		}

		/**
		 * @function
		 * @param {object} dataIn add address data to transform
 		 * @returns {object} tranformed add address object
		 * Transform address form data for service post
		 */
		this.transformAddressDataForPost = function(dataIn){
			var dataOut =  {
				addressId: dataIn.id,
				groupId: dataIn.groupId,
				addressCategory: dataIn.mailingAddressCategory,
				line1: dataIn.mailingAddressLine1,
				line2: dataIn.mailingAddressLine2 !== '' ? dataIn.mailingAddressLine2 : undefined ,
				line3: dataIn.mailingAddressLine3 !== '' ? dataIn.mailingAddressLine3 : undefined,
				zipcode: dataIn.zipCode ? dataIn.zipCode + (dataIn.zipCodeExtension || '') : dataIn.postalCode,
				everyYear: dataIn.mailingAddressDateRangeFrequency,
				type: dataIn.mailingAddressType,
				isPrimary: dataIn.isPrimary,
			},
			accountIndex =0;

			if(dataOut.type === 'INTERNATIONAL'){
				dataOut.countryCode = dataIn.country;
			} else {
				dataOut.stateCode = dataIn.state;
			}

			if(dataOut.type === 'MILITARY'){
				dataOut.postOfficeType = dataIn.postOfficeType;
			} else {
				dataOut.city = dataIn.city;
			}

			dataIn.addressOptions.eligibleAccounts.forEach(function(account){
				account.checked && (dataOut['associatedAccountIds[' + (accountIndex++) +']'] = account.id);
			});

			dataIn.mailingAddressEffectiveDate && (dataOut.fromDate = formatDate(dataIn.mailingAddressEffectiveDate));
			dataIn.mailingAddressEndDate && (dataOut.toDate =  formatDate(dataIn.mailingAddressEndDate));

			trimAllStringValuesInObject(dataOut);

			return dataOut;
		};

		/**
		 * @function
		 * @param {object} object - POJO with values to trim
		 * Goes through object, for all string values, calls string.trim()
		 */
		function trimAllStringValuesInObject(object){
			for(var key in object){
				if(object.hasOwnProperty(key)){
					var value = object[key];
					if(typeof value === 'string'){
						object[key] = value.trim();
					}
				}
			}
		}

		/**
		 * @function
		 * @param {object} dataIn change address data to transform
		 * @param {number} accountId for change address data to transform
 		 * @returns {object} tranformed change address object
		 * Transform address form data for service post
		 */
		this.transformChangeAddressDataForPost = function(dataIn, accountId){
			var dataOut =  {
				accountId: accountId,
				city: dataIn.city !== '' ? dataIn.city : undefined,
				countryCode: dataIn.country !== '' ? dataIn.country : undefined,
				line1: dataIn.mailingAddressLine1,
				line2: dataIn.mailingAddressLine2 !== '' ? dataIn.mailingAddressLine2 : undefined ,
				line3: dataIn.mailingAddressLine3 !== '' ? dataIn.mailingAddressLine3 : undefined,
				postOfficeType: dataIn.postOfficeType !== '' ? dataIn.postOfficeType : undefined,
				stateCode: dataIn.state !== '' ? dataIn.state : undefined,
				zipcode: dataIn.zipCode ? dataIn.zipCode + (dataIn.zipCodeExtension || '') : dataIn.postalCode,
				type: dataIn.mailingAddressType,
			}

			return dataOut;
		}

		/**
		* @function
		* Convert date to format DPS accepts (YYYYMMDD string)
		* @param {Date} isoString - Standard JS date object
		* @returns {string} returnString
		*/
		this.formatDate = function(isoString){

			var returnString = '';

			returnString += isoString.getFullYear();

			// Append '0' in front of month if only one digit
			var month = isoString.getMonth() + 1;
			month < 10 ? returnString += '0' + month : returnString += month;

			// Append '0' in front of day if only one digit
			var day = isoString.getDate();
			day < 10 ? returnString += '0' + day : returnString += day;

			return returnString;

		};

		// In the .hbs file, userEntered and systemRecommended objects are used to hold the
		// respective data. This just takes the addressOptions array from the JSON response,
		// figures out which is which, and then assigns them to be displayed.
		this.transformAddressVerificationData = function(dataIn, isEdit){
			var dataOut = {
				formId: dataIn.formId,
				isEdit: isEdit
			};
			dataIn.addressOptions.forEach(function(addressOption){
				if(addressOption.originalAddress){
					dataOut.userEntered = addressOption.address;
					dataOut.userEntered.optionId = addressOption.optionId;
					dataOut.userEntered.zipcode= this.transformZipcode(dataOut.userEntered.zipcode);
				} else {
					dataOut.systemRecommended = addressOption.address;
					dataOut.systemRecommended.optionId = addressOption.optionId;
					dataOut.systemRecommended.zipcode= this.transformZipcode(dataOut.systemRecommended.zipcode);
				}
			});
			return dataOut;
		};

		/**
		 * @function
		 * @param {object} data  Address verification data
 		 * Adds radio button options to verificatio data.
		 */
		this.extendAddressVerificationData = function(data){
			data.radioButtons = {
				systemRecommended : {
					groupName: 'optionId',
					inputId: 'system-recommended-radio',
					value: 'systemRecommended'
				},
				userEntered: {
					groupName: 'optionId',
					inputId: 'user-entered-radio',
					value: 'userEntered'
				}
			};
		};

		/**
		 * @function
		 * @param {string} zipcode zipcode value to transform
 		 * @returns {object} tranformed  zipcode
		 * Adds a '-' after 5 digits if zipcode is 9 digits
		 */
		this.transformZipcode = function(zipcode){
			return zipcode.match(/[a-zA-Z0-9]{5}(?=[a-zA-Z0-9]{4})|[a-zA-Z0-9]+/g).join("-");
		}

		/**
		 * @function
		 * @param {object} dataIn Address commit data to transform
 		 * @returns {object} tranformed  address commit data object
		 * Transforms address commit data for service post
		 */
		this.transformAddressCommitPostData = function(dataIn){
			return {
				formId: dataIn.formId,
				optionId: dataIn[dataIn.option].optionId
			}
		}

		return this;
	};
});
