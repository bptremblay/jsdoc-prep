/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module DataTransform
 */
//Todo: Functions that may pull in to framework later.
define(function() {
	return function PayeeDataTransform() {
		//Set entered results on click of Previous on Verify page to display on Entry page
		this.getEnterDataModel = function(model, responseData) {
			if(responseData){
				model.payeeName = responseData.payeeName;
				model.zipCode = responseData.zipCode;
				model.zipCodeExtension = responseData.zipExt;
				model.payeeAccountNumber = responseData.accountNumber;
			}
			return model;
		};
		//Set service response to display on Verify page on click of Next on Entry page
		this.getVerifyDataModel = function(model, responseData) {
			//for payee exact match
			model.payeeId = responseData.payeeOptions[0].payeeOptionId ? String(responseData.payeeOptions[0].payeeOptionId) : '';
			model.payeeName = responseData.payeeOptions[0].payeeName ? responseData.payeeOptions[0].payeeName : '';
			model.postalAddress = responseData.payeeOptions[0].address.addressLine1 ? responseData.payeeOptions[0].address.addressLine1 : '';
			model.postalAddressLine2 = responseData.payeeOptions[0].address.addressLine2 ? responseData.payeeOptions[0].address.addressLine2 : '';
			model.postalAddressLine3 = 	(responseData.payeeOptions[0].address.city ? responseData.payeeOptions[0].address.city : '') +
			(responseData.payeeOptions[0].address.state ? ', ' + responseData.payeeOptions[0].address.state : '') +
			(responseData.payeeOptions[0].address.zipCode ? ' ' + responseData.payeeOptions[0].address.zipCode : '') +
			(responseData.payeeOptions[0].address.zipExt ? '-' + responseData.payeeOptions[0].address.zipExt : '');
			model.phoneNumber = responseData.payeeOptions[0].phone ? responseData.payeeOptions[0].phone : '';
			model.payeeNickname = responseData.payeeOptions[0].payeeNickname ? responseData.payeeOptions[0].payeeNickname : '';
			//for multple payee search results
			var payeeOptionsList = [], i;
			if(responseData.payeeOptions){
				for(i=0; i<responseData.payeeOptions.length; i++ )
				{
					payeeOptionsList.push(
						{'payeeId': responseData.payeeOptions[i].payeeOptionId,
						'payeeName':responseData.payeeOptions[i].payeeName,
						'postalAddress':responseData.payeeOptions[i].address.addressLine1 ? responseData.payeeOptions[i].address.addressLine1 : '',
						'postalAddressLine2':responseData.payeeOptions[i].address.addressLine2 ? responseData.payeeOptions[i].address.addressLine2 : '',
						'city': responseData.payeeOptions[i].address.city ? responseData.payeeOptions[i].address.city : '',
						'state': responseData.payeeOptions[i].address.state ? responseData.payeeOptions[i].address.state : '',
						'zipCode': (responseData.payeeOptions[i].address.zipCode ? responseData.payeeOptions[i].address.zipCode : '') +
						(responseData.payeeOptions[i].address.zipExt ? '-' + responseData.payeeOptions[i].address.zipExt : ''),
						'phoneNumber':responseData.payeeOptions[i].phone ? responseData.payeeOptions[i].phone : ''
					});
				}
			}
			model.payeeOptionsList = payeeOptionsList;
			model.payeeAccountNumber = responseData.payeeAccountNumber ? responseData.payeeAccountNumber : '';

			var fundingAcntsList = [], payeeGroupsList = [], fundingAccountId = '', payeeCategoryId = '';
			if(responseData.fundingAccounts){
				for(i=0; i<responseData.fundingAccounts.length; i++ )
				{
					fundingAcntsList.push({'value':responseData.fundingAccounts[i].id,'label':responseData.fundingAccounts[i].name,'selected':responseData.fundingAccounts[i].defaultAccount});
					fundingAccountId = responseData.fundingAccounts[i].defaultAccount ? responseData.fundingAccounts[i].id : fundingAccountId;
				}
           	}
           	model.fundingAcntsList = fundingAcntsList;
           	model.fundingAccountId = fundingAccountId;

			if(responseData.payeeGroups){
				for(i=0; i<responseData.payeeGroups.length; i++ )
				{
					payeeGroupsList.push({'value':responseData.payeeGroups[i].id,'label':responseData.payeeGroups[i].name,'selected':responseData.payeeGroups[i].defaultGroup});
					payeeCategoryId = responseData.payeeGroups[i].defaultGroup ? responseData.payeeGroups[i].id : payeeCategoryId;
				}
           	}
           	model.payeeGroupsList = payeeGroupsList;
           	model.payeeCategoryId = payeeCategoryId;

			return model;
		};
		//Set service response to display on Confirm page on click of Add on Verify page
		this.getConfirmDataModel = function(model, responseData) {
			model.payeeName = responseData.payeeName ? responseData.payeeName : '';
			model.payeeNickname = responseData.payeeNickname ? responseData.payeeNickname : '';
			model.postalAddress = responseData.address.addressLine1 ? responseData.address.addressLine1 : '';
			model.postalAddressLine2 = responseData.address.addressLine2 ? responseData.address.addressLine2 : '';
			model.postalAddressLine3 = 	(responseData.address.city ? responseData.address.city : '') +
			(responseData.address.state ? ', ' + responseData.address.state : '') +
			(responseData.address.zipCode ? ' ' + responseData.address.zipCode : '') +
			(responseData.address.zipExt ? '-' + responseData.address.zipExt : '');
			model.payeeAccountNumber = responseData.payeeAccountNumber;
			model.fundingAccountDisplayNameWithBalance = responseData.defaultFundingAccountName;
			model.payeeGroup = responseData.groupName ? responseData.groupName : '';
			model.phoneNumber = responseData.phone ? responseData.phone : '';
			model.payeeId = responseData.payeeId ? responseData.payeeId : '';
			return model;
		};

		//Set entered results on click of Previous on Verify page to display on Manual Entry page
		this.getManualEnterDataModel = function(model, responseData) {
			if(responseData){
				model.payeeName = responseData.payeeName;
				model.payeeNickname = responseData.payeeNickname;
				model.mailingAddressLine1 = responseData.payeeAddressLine1;
				model.mailingAddressLine2 = responseData.payeeAddressLine2;
				model.city = responseData.payeeCity;
				model.state = responseData.payeeState;
				model.zipCode = responseData.payeeZIPCode;
				model.zipCodeExtension = responseData.payeeZIPExtension;
				model.phoneNumber = responseData.payeePhone;
				model.accountNumber = responseData.payeeAccountNumber;
				model.noteForPayee = responseData.messageToPayee;
				//set checkbox value based on message to payee
				model.accountNumberAvailable = responseData.messageToPayee ? true : false;
			}
			return model;
		};
		//Set service response to display on Manual Verify page on click of next on Entry page
		this.getManualVerifyDataModel = function(model, responseData) {
			model.payeeName = responseData.payeeName ? responseData.payeeName : '';
			model.payeeNickname = responseData.payeeNickname ? responseData.payeeNickname : '';
			model.mailingAddressLine1 = responseData.address.addressLine1 ? responseData.address.addressLine1 : '';
			model.mailingAddressLine2 = responseData.address.addressLine2 ? responseData.address.addressLine2 : '';
			model.city = responseData.address.city ? responseData.address.city : '';
			model.state = responseData.address.state ? responseData.address.state : '';
			model.zipCode = responseData.address.zipCode ? responseData.address.zipCode : '';
			model.zipCodeExtension = responseData.address.zipExt ? responseData.address.zipExt : '';
			model.mailingAddressLine3 = (responseData.address.city ? responseData.address.city : '') +
				(responseData.address.state ? ', ' + responseData.address.state : '') +
				(responseData.address.zipCode ? ' ' + responseData.address.zipCode : '') +
				(responseData.address.zipExt ? '-' + responseData.address.zipExt : '');

			model.phoneNumber = responseData.payeePhone ? responseData.payeePhone : '';
			model.accountNumber = responseData.payeeAccountNumber ? responseData.payeeAccountNumber : '';
			model.noteForPayee = responseData.messageToPayee ? responseData.messageToPayee : '';
			model.leadTime = (responseData.leadTime !== undefined && responseData.leadTime !== null) ? responseData.leadTime : '';
			model.formId = responseData.formId;

			var fundingAcntsList = [], payeeGroupsList = [], fundingAccountId = '', payeeCategoryId = '', i;
			if(responseData.fundingAccounts){
				for(i=0; i<responseData.fundingAccounts.length; i++ )
				{
					fundingAcntsList.push({'value':responseData.fundingAccounts[i].id,'label':responseData.fundingAccounts[i].name,'selected':responseData.fundingAccounts[i].defaultAccount});
					fundingAccountId = responseData.fundingAccounts[i].defaultAccount ? responseData.fundingAccounts[i].id : fundingAccountId;
				}
           	}
           	model.fundingAcntsList = fundingAcntsList;
           	model.fundingAccountId = fundingAccountId;

			if(responseData.payeeGroups){
				for(i=0; i<responseData.payeeGroups.length; i++ )
				{
					payeeGroupsList.push({'value':responseData.payeeGroups[i].id,'label':responseData.payeeGroups[i].name,'selected':responseData.payeeGroups[i].defaultGroup});
					payeeCategoryId = responseData.payeeGroups[i].defaultGroup ? responseData.payeeGroups[i].id : payeeCategoryId;
				}
           	}
           	model.payeeGroupsList = payeeGroupsList;
           	model.payeeCategoryId = payeeCategoryId;

			return model;
		};

		//Set service response to display on Manual Confirm page on click of Add on Verify page
		this.getManualConfirmDataModel = function(model, responseData) {
			model.payeeName = responseData.payeeName ? responseData.payeeName : '';
			model.payeeId = responseData.payeeId ? responseData.payeeId : '';
			model.payeeNickname = responseData.payeeNickname ? responseData.payeeNickname : '';
			model.mailingAddressLine1 = responseData.address.addressLine1 ? responseData.address.addressLine1 : '';
			model.mailingAddressLine2 = responseData.address.addressLine2 ? responseData.address.addressLine2 : '';
			model.city = responseData.address.city ? responseData.address.city : '';
			model.state = responseData.address.state ? responseData.address.state : '';
			model.zipCode = responseData.address.zipCode ? responseData.address.zipCode : '';
			model.zipCodeExtension = responseData.address.zipExt ? responseData.address.zipExt : '';
			model.mailingAddressLine3 = (responseData.address.city ? responseData.address.city : '') +
				(responseData.address.state ? ', ' + responseData.address.state : '') +
				(responseData.address.zipCode ? ' ' + responseData.address.zipCode : '') +
				(responseData.address.zipExt ? '-' + responseData.address.zipExt : '');
			model.phoneNumber = responseData.payeePhone ? responseData.payeePhone : '';
			model.accountNumber = responseData.payeeAccountNumber ? responseData.payeeAccountNumber : '';
			model.noteForPayee = responseData.messageToPayee ? responseData.messageToPayee : '';
			model.leadTime = (responseData.leadTime !== undefined && responseData.leadTime !== null) ? responseData.leadTime : '';
           	model.payeeCategoryId = responseData.payeeGroupLabel ? responseData.payeeGroupLabel : '';
           	model.fundingAccountDisplayNameWithBalance = responseData.fundingAccountLabel ? responseData.fundingAccountLabel : '';
			return model;
		};

		//Populate Entry view model with blue-ui component integration
		this.getEnterViewModel = function(modelRef) {
			var model = {
				'searchModeInstruction': modelRef.lens('enter_flowstep_message').get(),
				'manualModeContent': modelRef.lens('manual_mode_content').get(),
				'addYourPayeeManuallyLabel': modelRef.lens('add_your_payee_manually_label').get(),
				'sendMoneyContent': modelRef.lens('send_money_content').get(),
				'menu':{
					'id': '',
					'classes': '',
					'type': 'modeselector',
					'items':[{
						'classes': 'active',
						'id': '',
						'label': modelRef.lens('search_mode_label').get(),
						'url': '#/dashboard/payee'
					},
					{
						'classes': '',
						'id': '',
						'label': modelRef.lens('manual_mode_label').get(),
						'url': '#/dashboard/payeeManual'
					}]
				},
				'payeeHeader': modelRef.lens('add_payee_header').get(),
				'payeeName': {
					'label': modelRef.lens('payee_name_label').get(),
					'for': 'payeeName',
							'prompt': modelRef.lens('payee_name_advisory').get(),// string or html to appear below input
							'inputs': {
								'text': [{
									'id':'payeeName',
									'name': 'name'
								}]
							}
						},
						'zipCode': {
							'label': modelRef.lens('zip_code_label').get(),
							'for': 'zipCode',
							'prompt': modelRef.lens('zip_code_advisory').get(), // string or html to appear below input
							'inputs': {
								'zipcode': [{			//specific zipcode inputs
									'id':'zipCode',
									'name': 'zip',
									'withExt': true
								},
								{
									'id':'zipCodeExtension',
									'name': 'zipExt'
								}]
							}
						},
						'payeeAccountNumber': {
							'label': modelRef.lens('payee_account_number_label').get(),
							'for': 'payeeAccountNumber',
							'prompt': modelRef.lens('payee_account_number_advisory').get(), // string or html to appear below input
							'inputs': {
								'text': [{			//specific data inputs
									'id':'payeeAccountNumber',
									'name': 'account'
								}]
							}
						},
						'payeeConfirmedAccountNumber': {
							'label': modelRef.lens('payee_confirmed_account_number_label').get(),
							'for': 'payeeConfirmedAccountNumber',
							'inputs': {
								'text': [{			//specific data inputs
									'id':'payeeConfirmedAccountNumber',
									'name': 'confirmAccount'
								}]
							}
						},
						'workFlowStep': {
							'id': 'uuid',
							'class': 'steps',
							'steps': [{
								'active': this.getWorkFlowActive(1, modelRef.lens('flowStep').get()),
								'title': ''
							},
							{
								'active': this.getWorkFlowActive(2, modelRef.lens('flowStep').get()),
								'title': ''
							},
							{
								'active': this.getWorkFlowActive(3, modelRef.lens('flowStep').get()),
								'title': ''
							}]
						},
                    	'actions': [{				// specific data for button template
                    		'label': modelRef.lens('enter_flowstep_exit_label').get(),
                    		'id': 'cancel-button'
                    	},
                    	{
                    		'label': modelRef.lens('advance_flowstep_flow_label').get(),
                    		'classes': 'primary',
                    		'id': 'continue-button'
                    	}]
                    };
                    return model;
                };

        //Populate Verify view model for payee address entry with blue-ui component integration
	    this.getVerifyAddressViewModel = function(modelRef) {
	    	var model = {
	    		'payeeAddress1': {
					'label': modelRef.lens('mailing_address_heading').get(),
					'for': 'payeeAddress1',
					'prompt': modelRef.lens('mailing_address_line1_advisory').get(),// string or html to appear below input
					'inputs': {
						'text': [{
							'id':'payeeAddress1',
							'name': 'Address1'
						}]
					}
				},
				'payeeAddress2': {
					'for': 'payeeAddress2',
					'prompt': modelRef.lens('mailing_address_line2_advisory').get(),// string or html to appear below input
					'promptoptional': modelRef.lens('optional_label').get(),
					'inputs': {
						'text': [{
							'id':'payeeAddress2',
							'name': 'Address2'
						}]
					}
				},
				'city': {
					'for': 'city',
					'label': modelRef.lens('city_heading').get(),
					'inputs': {
						'text': [{
							'id':'city',
							'name': 'City'
						}]
					}
				},
				'state': {
					'label': modelRef.lens('state_heading').get(),
					'for': 'state',
					'inputs': getStateListInputObj(modelRef.lens('stateList').get(), modelRef)
				},
				'zipCode': {
					'label': modelRef.lens('zip_code_label').get(),
					'for': 'zipCode',
					'prompt': modelRef.lens('zip_code_advisory').get(), // string or html to appear below input
					'inputs': {
						'zipcode': [{			//specific zipcode inputs
							'id':'zipCode',
							'name': 'zip',
							'withExt': true
						},
						{
							//'label': modelRef.lens('zip_code_extension_label').get(),
							//'optional': modelRef.lens('optional_label').get(),
							'id':'zipCodeExtension',
							'name': 'zipExt'
						}]
					}
				},
				'phoneNumber': {
					'label': modelRef.lens('payee_phone_number_label').get(),
					'optional': modelRef.lens('optional_label').get(),
					'for': 'phoneNumber',
					'inputs': {
						'text': [{
							'id':'phoneNumber',
							'name': 'phoneNumber'
						}]
					}
				}
            };
            return model;
        };

		//Populate Verify view model for payee mutiple matches with blue-ui component integration
		this.getVerifyListViewModel = function(modelRef) {
			//Generate payeeOptionsList in format required for selectableList control
			var payeeOptionsArrayList = [];
			var payeeOptionsRows = modelRef.lens('payeeOptionsList').get();
			var payeeOptionsTableClass = payeeOptionsRows.length > 4 ? 'scrollable' : '';
			console.log(payeeOptionsTableClass);
			for(var i=0; i<payeeOptionsRows.length; i++ )
			{
				payeeOptionsArrayList.push({'rowid': 'rowid' + payeeOptionsRows[i].payeeId, 'value': payeeOptionsRows[i].payeeId, 'class': 'payeeGroupOptions',
					'cells': [
					{'classes': '','label': payeeOptionsRows[i].postalAddress},
					{'classes': '','label': payeeOptionsRows[i].city},
					{'classes': '','label': payeeOptionsRows[i].state},
					{'classes': '','label': payeeOptionsRows[i].zipCode}]
				});
			}

			var model = {
				'verifyModeInstruction': modelRef.lens('verify_add_payee_message').get(),
				'payeeOptionsList': {
					id: "payeesList", //uid for entire list
					classes: payeeOptionsTableClass, //scrollbar
					"headers": [{'label':modelRef.lens('mailing_address_heading').get()},
					{'label':modelRef.lens('city_heading').get()},
					{'label':modelRef.lens('state_heading').get()},
					{'label':modelRef.lens('zip_code_label').get()}],
					rows: payeeOptionsArrayList
				},
				'payeeName': {
					'classes':'single',
					'inputs': {
						'data': [{
							'id':'payeeName'
						}]
					}
				},
				'payeeAccountNumber': {
					'id': 'payeeAccountNumberField',
					'classes': 'inline',
					'label': modelRef.lens('payee_account_number_label').get(),
					'inputs': {
						'data': [{			//specific data inputs
							'id':'payeeAccountNumber'
						}]
					}
				},
				'payeeHeader': modelRef.lens('add_payee_header').get(),
				'payeeSettingsInstruction': modelRef.lens('additional_payee_settings_header').get(),
				'payeeNickName': {
					'label': modelRef.lens('payee_nickname_label').get(),
					'optional': modelRef.lens('optional_label').get(),
					'for': 'payeeNickName',
					'inputs': {
						'text': [{
							'id':'payeeNickName',
							'name': 'NickName'
						}]
					}
				},
				'fundingAccountNumber': {
					'label': modelRef.lens('funding_account_display_name_with_balance_label').get(),
					'for': 'fundingAccountId',
					'inputs': {
						'select': [{
							'id':'fundingAccountId',
							'name': 'accountSelect',
							'options': modelRef.get().fundingAcntsList
						}]
					}
				},
				'payeeCategory': modelRef.get().payeeGroupsList.length?{
					'label': modelRef.lens('payee_group_label').get(),
					'optional': modelRef.lens('optional_label').get(),
					'for': 'payeeCategoryId',
					'inputs': {
						'select': [{
							'id':'payeeCategoryId',
							'name': 'payeeGroupSelect',
							'options': modelRef.get().payeeGroupsList
						}]
					}
				}:'',
				'payeeAddressLink': {
					'id': 'payeeAddressLink',
					'prompt': modelRef.lens('enter_different_address_prompt_label').get(),
					'link':{
						'expandLabel': modelRef.lens('enter_different_address_label').get(),
						'collapseLabel': modelRef.lens('use_provided_address_label').get()
					}
				},
				'workFlowStep': {
					'id': 'uuid',
					'class': 'steps',
					'steps': [{
						'active': this.getWorkFlowActive(1, modelRef.lens('flowStep').get()),
						'title': ''
					},
					{
						'active': this.getWorkFlowActive(2, modelRef.lens('flowStep').get()),
						'title': ''
					},
					{
						'active': this.getWorkFlowActive(3, modelRef.lens('flowStep').get()),
						'title': ''
					}]
				},
				backButton: {				// specific data for button template
            		'label': modelRef.lens('reverse_flowstep_label').get(),
            		'id': 'prev-button'
            	},
            	'actions': [
                {				// specific data for button template
                	'label': modelRef.lens('verify_flowstep_exit_label').get(),
                	'id':'cancel-button'
                },
                {
                	'label': modelRef.lens('add_payee_label').get(), //'Add payee'
                	'classes': 'primary',
                	'id': 'add-button'
                }]
            };
            return model;
        };
		//Populate Confirm view model with blue-ui component integration
		this.getConfirmViewModel = function(modelRef) {
			//Display None for empty/null Phone number
			modelRef.lens('phoneNumber').set(modelRef.lens('phoneNumber').get() !== '' ? modelRef.lens('phoneNumber').get() : modelRef.lens('none_label').get());
			var modelData = {
				'confirmModeInstruction': modelRef.lens('confirm_flowstep_message').get(),
				'payeeName': {
					'label': modelRef.lens('payee_name_label').get(),
					'for': 'payeeName',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'payeeName'
						}]
					}
				},
				'payeeNickname': {
					'label': modelRef.lens('payee_nickname_label').get(),
					'for': 'payeeNickname',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'payeeNickname'
						}]
					}
				},
				'payeeNicknametitle': modelRef.lens('payeeNickname').get() ? modelRef.lens('payeeNickname').get() : modelRef.lens('payeeName').get(),
				'postalAddress': {
					'label': modelRef.lens('payee_address_label').get(),
					'inputs': {
								'data': [{			//specific data inputs
									'id':'postalAddress'
								}]
							}
						},
						'postalAddressLine2': modelRef.lens('postalAddressLine2').get(),
						'postalAddressLine3': modelRef.lens('postalAddressLine3').get(),
						'phoneNumber': {
							'label': modelRef.lens('payee_phone_number_label').get(),
							'inputs': {
								'data': [{			//specific data inputs
									'id':'phoneNumber'
								}]
							}
						},
						'payeeAccountNumber': {
							'label': modelRef.lens('payee_account_number_label').get(),
							'inputs': {
								'data': [{			//specific data inputs
									'id':'payeeAccountNumber'
								}]
							}
						},
						'deliveryMethod': {
							'label': modelRef.lens('delivery_method_label').get(),
							'inputs': {
								'data': [{			//specific data inputs
									'id':'deliveryMethod'
								}]
							}
						},
						'fundingAccountDisplayNameWithBalance': {
							'label': modelRef.lens('funding_account_display_name_with_balance_label').get(),
							'inputs': {
								'data': [{			//specific data inputs
									'id':'fundingAccountDisplayNameWithBalance'
								}]
							}
						},
						'payeeGroup': {
							'label': modelRef.lens('payee_group_label').get(),
							'inputs': {
								'data': [{			//specific data inputs
									'id':'payeeGroup'
								}]
							}
						},
						'workFlowStep': {
							'id': 'uuid',
							'class': 'steps',
							'steps': [{
								'active': this.getWorkFlowActive(1, modelRef.lens('flowStep').get()),
								'title': ''
							},
							{
								'active': this.getWorkFlowActive(2, modelRef.lens('flowStep').get()),
								'title': ''
							},
							{
								'active': this.getWorkFlowActive(3, modelRef.lens('flowStep').get()),
								'title': ''
							}]
						},
                    	'actions': [{				// specific data for button template
                    		'label': modelRef.lens('confirm_flowstep_exit_label').get(),//'Close',
                    		'id':'close-button'
                    	},
	                    {				// specific data for button template
	                    	'label': 'Pay Bill',
	                    	'classes': 'primary',
	                    	'id':'pay-bill-button'
	                    }]
	                };
	                return modelData;
	            };

	    /*
	    * takes list of states usually returned from service and generates a json object compatible to blue UI component
	    * if stateList is null then the selectbox would be defaulted to textbox
	    */
		this.getStateListInputObj = function(stateList, model) {
			var stateInputObj = {};
			if(stateList && stateList.length){
				var stateOptionlist = [{'value': '', 'label': model.lens('state_placeholder').get(), 'selected': true, 'disabled': true}];
				for (var i = 0; i < stateList.length; i++){

					stateOptionlist.push({
						value: stateList[i].stateCode,
						label:stateList[i].stateCode,
						selected:false
					});
				}

				stateInputObj = {
								'select': [{
									'id': 'state',
									'name': 'State',
									'options': stateOptionlist

									}]
								};

			}
			return stateInputObj;
		};


		//Populate Manual Entry view model with blue-ui component integration
		this.getManualEnterViewModel = function(modelRef) {

			var model = {
				'menu':{
					'id': '',
					'classes': '',
					'type': 'modeselector',
					'items':[{
						'classes': '',
						'id': '',
						'label': modelRef.lens('search_for_payee_label').get(),
						'url': '#/dashboard/payee'
					},
					{
						'classes': 'active',
						'id': '',
						'label': modelRef.lens('provide_payee_information_label').get(),
						'url': '#/dashboard/payeeManual'
					}]
				},
				'payeeName': {
					'label': modelRef.lens('payee_name_label').get(),
					'for': 'payeeName',
					'prompt': modelRef.lens('payee_name_advisory').get(),// string or html to appear below input
					'inputs': {
						'text': [{
							'id':'payeeName',
							'name': 'name'
						}]
					}
				},
				'payeeNickName': {
					'label': modelRef.lens('payee_nickname_label').get(),
					'optional': modelRef.lens('optional_label').get(),
					'for': 'payeeNickName',
					'inputs': {
						'text': [{
							'id':'payeeNickName',
							'name': 'NickName'
						}]
					}
				},
				'payeeAddress1': {
					'label': modelRef.lens('address_label').get(),
					'for': 'payeeAddress1',
					'prompt': modelRef.lens('mailing_address_line1_advisory').get(),// string or html to appear below input
					'inputs': {
						'text': [{
							'id':'payeeAddress1',
							'name': 'Address1'
						}]
					}
				},
				'payeeAddress2': {
					'for': 'payeeAddress2',
					'prompt': modelRef.lens('mailing_address_line2_advisory').get(),// string or html to appear below input
					'promptoptional': modelRef.lens('optional_label').get(),
					'inputs': {
						'text': [{
							'id':'payeeAddress2',
							'name': 'Address2'
						}]
					}
				},
				'city': {
					'for': 'city',
					'label': modelRef.lens('city_label').get(),
					'inputs': {
						'text': [{
							'id':'city',
							'name': 'City'
						}]
					}
				},
				'state': {
					'label': modelRef.lens('state_label').get(),
					'for': 'state',
					'inputs': this.getStateListInputObj(modelRef.lens('stateList').get(), modelRef)
				},
				'zipCode': {
					'label': modelRef.lens('zip_code_label').get(),
					'for': 'zipCode',
					'prompt': modelRef.lens('zip_code_advisory').get(), // string or html to appear below input
					'inputs': {
						'zipcode': [{			//specific zipcode inputs
							'id':'zipCode',
							'name': 'zip',
							'withExt': true
						},
						{
							'id':'zipCodeExtension',
							'name': 'zipExt'
						}]
					}
				},
				'phoneNumber': {
					'label': modelRef.lens('phone_number_label').get(),
					'optional': modelRef.lens('optional_label').get(),
					'for': 'phoneNumber',
					'inputs': {
						'text': [{
							'id':'phoneNumber',
							'name': 'phoneNumber'
						}]
					}
				},
				'payeeAccountNumber': {
					'label': modelRef.lens('account_number_label').get(),
					'for': 'payeeAccountNumber',
					'prompt': modelRef.lens('account_number_advisory').get(), // string or html to appear below input
					'inputs': {
						'text': [{			//specific data inputs
							'id':'payeeAccountNumber',
							'name': 'account',
							'disabled': modelRef.lens('account_number_available').get() ? true: false
						}]
					}
				},
				'payeeConfirmedAccountNumber': {
					'label': modelRef.lens('confirmed_account_number_label').get(),
					'for': 'payeeConfirmedAccountNumber',
					'inputs': {
						'text': [{			//specific data inputs
							'id':'payeeConfirmedAccountNumber',
							'name': 'confirmAccount',
							'disabled': modelRef.lens('account_number_available').get() ? true: false
						}]
					}
				},
				'disableAccountNumber': {
					'checkbox': [{
						'name': 'accountNumberAvailable',
						'options': [{
							'id': 'accountNumberAvailable',
							'label': modelRef.lens('account_number_available_label').get()
						}]
					}]
				},
				'noteForPayee': {
					'id': 'dlNoteForPayee',
					'label': modelRef.lens('note_for_payee_message').get(),
					'classes': modelRef.lens('account_number_available').get() ?  '': 'invisible' ,
					'for': 'noteForPayee',
					'prompt': modelRef.lens('note_for_payee_advisory').get(), // string or html to appear below input
					'inputs': {
						'text': [{			//specific data inputs
							'id':'noteForPayee',
							'name': 'noteForPayee',
							'disabled': modelRef.lens('account_number_available').get() ? false: true
						}]
					}
				},
				'workFlowStep': {
					'id': 'uuid',
					'class': 'steps',
					'steps': [{
						'active': this.getWorkFlowActive(1, modelRef.lens('flowStep').get()),
						'title': ''
					},
					{
						'active': this.getWorkFlowActive(2, modelRef.lens('flowStep').get()),
						'title': ''
					},
					{
						'active': this.getWorkFlowActive(3, modelRef.lens('flowStep').get()),
						'title': ''
					}]
				},
            	'actions': [{				// specific data for button template
            		'label': modelRef.lens('cancel_label').get(),
            		'id': 'cancel-button'
            	},
            	{
            		'label': modelRef.lens('next_label').get(),
            		'classes': 'primary',
            		'id': 'continue-button'
            	}]
            };
            return model;
        };

		//Populate Manual Verify view model with blue-ui component integration
		this.getManualVerifyViewModel = function(modelRef) {
			//Display None for empty/null Phone number
			modelRef.lens('phoneNumber').set(modelRef.lens('phoneNumber').get() !== '' ? modelRef.lens('phoneNumber').get() : modelRef.lens('none_label').get());
			var model = {
				'addPayeeHeader': modelRef.lens('add_payee_header').get(),
				'verifyModeInstruction': modelRef.lens('verify_add_payee_message').get(),
				'payeeSettingsInstruction': modelRef.lens('additional_settings_header').get(),
				'payeeName': {
					'label': modelRef.lens('payee_name_label').get(),
					'for': 'payeeName',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'payeeName'
						}]
					}
				},
				'payeeNickName': {
					'label': modelRef.lens('payee_nickname_label').get(),
					'for': 'payeeNickname',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'payeeNickname'
						}]
					}
				},
				'mailingAddressLine1': {
					'label': modelRef.lens('address_label').get(),
					'for': 'mailingAddressLine1',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'mailingAddressLine1'
						}]
					}
				},
				'mailingAddressLine2': modelRef.lens('mailingAddressLine2').get(),
				'mailingAddressLine3': modelRef.lens('mailingAddressLine3').get(),
				'phoneNumber': {
					'label': modelRef.lens('phone_number_label').get(),
					'for': 'phoneNumber',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'phoneNumber'
						}]
					}
				},
				//display Account Number if provided from Entry page else Message/Note
				'payeeAccountNumber': {
					'label': modelRef.lens('noteForPayee').get() ? modelRef.lens('note_for_payee_label').get() : modelRef.lens('account_number_label').get(),
					'inputs': {
						'data': [{			//specific data inputs
							'id':modelRef.lens('noteForPayee').get() ? 'noteForPayee' : 'payeeAccountNumber'
						}]
					}
				},
				'deliveryMethod': {
					'label': modelRef.lens('delivery_method_label').get(),
					'for': 'transactionProcessingLeadTime',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'transactionProcessingLeadTime'
						}]
					}
				},
				'fundingAccountNumber': {
					'label': modelRef.lens('funding_account_display_name__with_balance_label').get(),
					'for': 'fundingAccountId',
					'inputs': {
						'select': [{
							'id':'fundingAccountId',
							'name': 'accountSelect',
							'options': modelRef.get().fundingAcntsList
						}]
					}
				},
				'payeeCategory': modelRef.get().payeeGroupsList.length?{
					'label': modelRef.lens('payee_category_label').get(),
					'optional': modelRef.lens('optional_label').get(),
					'for': 'payeeCategoryId',
					'inputs': {
						'select': [{
							'id':'payeeCategoryId',
							'name': 'payeeGroupSelect',
							'options': modelRef.get().payeeGroupsList
						}]
					}
				}:'',
				'workFlowStep': {
					'id': 'uuid',
					'class': 'steps',
					'steps': [{
						'active': this.getWorkFlowActive(1, modelRef.lens('flowStep').get()),
						'title': ''
					},
					{
						'active': this.getWorkFlowActive(2, modelRef.lens('flowStep').get()),
						'title': ''
					},
					{
						'active': this.getWorkFlowActive(3, modelRef.lens('flowStep').get()),
						'title': ''
					}]
				},
            	'actions': [{				// specific data for button template
            		'label': modelRef.lens('previous_label').get(),
            		'id': 'back-button'
            	},
                {				// specific data for button template
                	'label': modelRef.lens('cancel_label').get(),
                	'id':'cancel-button'
                },
                {
                	'label': modelRef.lens('confirm_add_payee_label').get(), //'Add payee'
                	'classes': 'primary',
                	'id': 'add-button'
                }]
	        };
            return model;
        };

		//Populate Manual Verify view model with blue-ui component integration
		this.getManualConfirmViewModel = function(modelRef) {
			//Display None for empty/null Phone number
			modelRef.lens('phoneNumber').set(modelRef.lens('phoneNumber').get() !== '' ? modelRef.lens('phoneNumber').get() : modelRef.lens('none_label').get());
			var model = {
				'confirmModeInstruction': modelRef.lens('confirm_add_payee_message').get(),
				'payeeName': {
					'label': modelRef.lens('payee_name_long_label').get(),
					'for': 'payeeName',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'payeeName'
						}]
					}
				},
				'payeeNickname': {
					'label': modelRef.lens('payee_nickname_label').get(),
					'for': 'payeeNickname',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'payeeNickname'
						}]
					}
				},
				'payeeNicknametitle': modelRef.lens('payeeNickname').get() ? modelRef.lens('payeeNickname').get() : modelRef.lens('payeeName').get(),
				'mailingAddressLine1': {
					'label': modelRef.lens('address_label').get(),
					'for': 'mailingAddressLine1',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'mailingAddressLine1'
						}]
					}
				},
				'mailingAddressLine2': modelRef.lens('mailingAddressLine2').get(),
				'mailingAddressLine3': modelRef.lens('mailingAddressLine3').get(),
				'phoneNumber': {
					'label': modelRef.lens('phone_number_label').get(),
					'for': 'phoneNumber',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'phoneNumber'
						}]
					}
				},
				//display Account Number if provided from Entry page else Message/Note
				'payeeAccountNumber': {
					'label': modelRef.lens('noteForPayee').get() ? modelRef.lens('note_for_payee_label').get() : modelRef.lens('account_number_label').get(),
					'inputs': {
						'data': [{			//specific data inputs
							'id':modelRef.lens('noteForPayee').get() ? 'noteForPayee' : 'payeeAccountNumber'
						}]
					}
				},
				'deliveryMethod': {
					'label': modelRef.lens('delivery_method_label').get(),
					'for': 'transactionProcessingLeadTime',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'transactionProcessingLeadTime'
						}]
					}
				},
				'fundingAccountDisplayName': {
					'label': modelRef.lens('funding_account_display_name__with_balance_label').get(),
					'for': 'fundingAccountDisplayName',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'fundingAccountDisplayName'
						}]
					}
				},
				'payeeGroup': {
					'label': modelRef.lens('payee_category_label').get(),
					'for': 'payeeGroup',
					'inputs': {
						'data': [{			//specific data inputs
							'id':'payeeGroup'
						}]
					}
				},
				'workFlowStep': {
					'id': 'uuid',
					'class': 'steps',
					'steps': [{
						'active': this.getWorkFlowActive(1, modelRef.lens('flowStep').get()),
						'title': ''
					},
					{
						'active': this.getWorkFlowActive(2, modelRef.lens('flowStep').get()),
						'title': ''
					},
					{
						'active': this.getWorkFlowActive(3, modelRef.lens('flowStep').get()),
						'title': ''
					}]
				},
            	'actions': [{				// specific data for button template
                	'label': modelRef.lens('set_up_repeating_payment_label').get(),
                	'id':'setup-button'
                },
                {				// specific data for button template
                	'label': modelRef.lens('add_payee_label').get(),
                	'id':'add-button'
                },
                {				// specific data for button template
            		'label': modelRef.lens('make_payment_label').get(),
            		'classes': 'primary',
            		'id':'pay-button'
            	}]
            };
            return model;
        };

		//Get flow steps for progress bar blue-ui component integration
		this.getWorkFlowActive = function(i, workFlow){
			if (i === 1 && workFlow === 'Enter')
			{
				return true;
			}
			if (i === 2 && workFlow === 'Verify')
			{
				return true;
			}
			if (i === 3 && workFlow === 'Confirm')
			{
				return true;
			}
			return false;
		};

		return this;
	};
});
