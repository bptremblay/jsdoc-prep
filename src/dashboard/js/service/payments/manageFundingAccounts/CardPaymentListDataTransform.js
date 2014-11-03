define(function(require) {
	return function cardPaymentListDataTransform() {

		var settings = require('blue/settings'),
			locale = settings.get('LOCALIZED_CONTENT', settings.Type.PERM)

		this.init = function() {

		};
		this.getTransformedPayeeData = function(data,selectedPayee) {
			var payees = this.getPayees(data,selectedPayee);
			return payees;
		};
		this.getTransformedAccountsData = function(data,specName, payeeId)
		{
			var theData = {"rows": this.getFundingAccounts(data, payeeId),
							"headers": this.getHeaders(specName)
							};
			return theData;
		};

		this.getPayees = function(data,fa,selectedPayee) {
			var theData =
				{"select":
					[{
				 		"id": "payeeSelectBox",
						"name": "payeeSelectBox",
						"options": this.getPayeesOptions(data,selectedPayee),
						"multiplePayees": this.getMultiplePayees(data),
						"hasFundingAccounts": this.getHasFundingAccounts(fa)
					}],
				  "transformedData": true
				};
			return theData;
		};
		this.getMultiplePayees = function(payees) {
			if (payees.length > 1)
			{
				return true;
			}
			else
			{
				return false;
			}
		},
		this.getHasFundingAccounts = function(data) {
			if (data.length > 0)
				return true;
			else
				return false;
		},
		this.getPayeesOptions = function(payees, selectedPayee) {


			var out = new Array();

			for (var i in payees)
			{
				var curOut = {};

				var selected = false;

				if ((selectedPayee != 0 && selectedPayee == payees[i].payeeId) || (selectedPayee == 0 && i == 0) )
				{
					selected = true
				}

				curOut.value = payees[i].payeeId;
				curOut.label = payees[i].label;
				curOut.selected = selected;

				out.push(curOut);

			}


			return out;
		};
		this.formLinks = function(deleteAllowed,updateAllowed,defaultAllowed,iid)
		{
			var linksArr = [];
			//if (fundingAccounts[i].deleteAllowed || fundingAccounts[i].updateAllowed)
			if (deleteAllowed || updateAllowed)
			{

				var href = iid
				/*
				var label = 'Set as primary';
				var id = 'sap' + iid
				var className = 'setAsPrimary';

				if (defaultAllowed)
				{
					linksArr.push(this.formLinksObj(href,id,className,label));
				}
				*/


				var label = 'Edit';
				var id = 'edit' + iid
				var className = 'edit_funding_account';


				if (updateAllowed)
				{
					linksArr.push(this.formLinksObj(href,id,className,label));
				}


				if (deleteAllowed)
				{
					label = 'Delete';
					id = 'delete' + iid
					className = 'delete_funding_account';

					linksArr.push(this.formLinksObj(href,id,className,label));
				}
			}
			return linksArr;
		};

		this.getFundingAccounts = function(fundingAccounts, payeeId) {

			var out = new Array();
			for (var i in fundingAccounts)
			{
				var curOut = {};
				curOut.Checked = false; //fundingAccounts[i].defaultFlag;
				curOut.primaryAccount = fundingAccounts[i].defaultFlag;
				curOut.id = fundingAccounts[i].ePayAccountRefId;

				var itmsArr = new Array();
				var itmsObj = {};
				itmsObj.label = fundingAccounts[i].label;


				itmsObj.links = this.formLinks(fundingAccounts[i].deleteAllowed, fundingAccounts[i].updateAllowed,
						fundingAccounts[i].defaultAllowed,fundingAccounts[i].ePayAccountRefId);

				/**************************************
				* form data for the Edit fields
				**************************************/

				// sample JSON data --> placeholder for future sprints
				var cardFundingUpdateListJSON = {
				//	"code": "SUCCESS",
				//	"routingNumber": "274976067",
				//	"account": "1230987654",
					"nickname": fundingAccounts[i].label,
				//	"routingNumberUpdateAllowed": false,
				//	"nicknameUpdateAllowed": true,
					"accountUpdateAllowed": fundingAccounts[i].updateAllowed
				};
				itmsObj.manageFundingAccount = this.formCardFundingUpdateFields(cardFundingUpdateListJSON, fundingAccounts[i].ePayAccountRefId, payeeId);


				itmsArr.push(itmsObj);
				curOut.items = itmsArr;

				if (fundingAccounts[i].inProfile)

					out.unshift(curOut)
				else
					out.push(curOut);



			}

			return out;
		};
		this.formLinksObj = function(href, id, className, label) {
			var link = {
				href: href,
				id: id,
				class: className,
				label: label
			};

			return link;
		};
		this.getHeaders = function(specName) {
			var headers = [{
				    "label": locale[specName + '.primary_designation_label'],
				    "classes":"",
				    "colspan":"0",
				    "rowspan":"0",
				    "icon":true
				    },
				    {
				    "label": locale[specName + '.funding_account_display_name_label'],
				    "classes":"",
				    "colspan":"0",
				    "rowspan":"0",
				    "icon":false
				    }];

			return headers;
		};

		// Transform data for the 'Funding Update' section
		this.formCardFundingUpdateFields = function(cardFundingUpdateListJSON, ePayAccountRefId, payeeId) {
			var inputLabel = 'Edit nickname',
				inputName = 'Account Nickname',
				inputClasses = '',
				inputMaxLength = 32,
				actionsArray = [];

			var updateFundingDivTagId = 'edit_funding_account_' + ePayAccountRefId,
				cancelUpdateButtonId = 'cancel_update_button_' + ePayAccountRefId,
				saveUpdateButtonId = 'save_update_button_' + ePayAccountRefId,
				nicknameInputBoxId = 'nickname_input_' + ePayAccountRefId;

			// Temporary... (until Ractive implemenation to pass in multiple parameters)
			var saveInputBoxVal = payeeId + '|' + ePayAccountRefId;  // add ->  payeeId | ePayAccountRefId

			// Add 2 buttons: 'Cancel' & 'Save'
			actionsArray.push(this.buildActionObj(cancelUpdateButtonId, 'cancel-update', 'button', 'Cancel', ePayAccountRefId, true, ''));
			actionsArray.push(this.buildActionObj(saveUpdateButtonId, 'save-update primary', 'button', 'Save', saveInputBoxVal, true, ''));


			return {
				"id": updateFundingDivTagId,
				"editNickname": this.buildInputBoxObj(nicknameInputBoxId, inputLabel, inputName, cardFundingUpdateListJSON.nickname, inputClasses, inputMaxLength),
				"actions": actionsArray
			};
		};

		this.buildInputBoxObj = function(inputId, inputLabel, inputName, inputValue, inputClasses, inputMaxLength) {
			var inputsArray = [{
				"text": {
					"id": inputId,
					"classes": inputClasses,
					"name": inputName,
					"value": inputValue,
					"placeholder": "",
					"maxlength": inputMaxLength
				}
			}];

			var inputBoxObj = {
				"label": inputLabel,
				"prompt": "",
				"inputs": inputsArray
			};

			return inputBoxObj;
		};

		this.buildActionObj = function (id, classes, type, label, ePayAccountRefId, isDisabled, adatext) {
			return {
				"id": id,
				"classes": classes,
				"type": type,
				"label": label,
				"value": ePayAccountRefId,
				"isDisabled": isDisabled,
				"adatext": adatext
			};
		};

		return this;
	}
});
