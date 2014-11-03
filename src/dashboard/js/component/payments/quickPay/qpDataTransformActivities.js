define(function(require){

	var UIElements = require('dashboard/lib/quickPay/qpInputElements'),
		formatUtility = require('dashboard/lib/quickPay/qpFormatUtility'),
		dynamicContentUtil = require('common/utility/dynamicContentUtil');

	this.context = null;

	var setContext = function(context){
		this.context = context;
	};

	var getContext = function(){
		return this.context;
	};
	var getSettings = function(){
		var result = {};
		if(getContext().settings){
			result = getContext().settings.quickPay;
			if(!result){
				result = getContext().settings.get('quickPay');
			}
		}
		return (result) ? result : {};
	};
	var getLinksPerStatus = function(componentName, id, statusId){
		var links = [];

		var seeDetailsLabel = getContext().model.lens(componentName + '.request_transaction_details_label').get();
		var editLabel = getContext().model.lens(componentName + '.edit_label').get();
		var cancelLabel = getContext().model.lens(componentName + '.cancel_label').get();
		var researchLabel = getContext().model.lens(componentName + '.request_transaction_inquiry_label').get();

		var seeDetailsLink = {'href': id,'text': seeDetailsLabel,'name': 'see_details', 'classes':'see_details_link'};
		var editLink = {'href': id,'text': editLabel,'name': 'edit', 'classes':'edit_link'};
		var cancelLink = {'href': id,'text': cancelLabel,'name': 'cancel', 'classes':'cancel_link'};
		var researchLink = {'href': id,'text': researchLabel,'name': 'research', 'classes':'send_inquiry_link'};

		links.push(seeDetailsLink);

		if( statusId === getSettings().SERVICE_STATUS_ENUM.Pending){
		        links.push(editLink);
		        links.push(cancelLink);
		}
		if( statusId === getSettings().SERVICE_STATUS_ENUM.Pending_Acceptance){
		        links.push(cancelLink);
		        links.push(researchLink);
		}
		if( statusId === getSettings().SERVICE_STATUS_ENUM.Declined ||
			statusId === getSettings().SERVICE_STATUS_ENUM.Accepted ||
			statusId === getSettings().SERVICE_STATUS_ENUM.In_Process_2 ||
			statusId === getSettings().SERVICE_STATUS_ENUM.In_Process_3
		  ){
		        links.push(researchLink);
		}
		return links;
	};
	var getTodoListHeaders = function(){
		return [
			      {'id': 'uid','label': getContext().model.lens('todoComponent.transaction_notification_date_label').get()},
			      {'id': 'uid','label': getContext().model.lens('todoComponent.transaction_requestor_label').get()},
			      {'id': 'uid','label': ''},
			      {'id': 'uid','label': getContext().model.lens('todoComponent.transaction_amount_label').get()},
			      {'id': 'uid','label': ''},
			    ];
	};
	var getSentActivityListHeaders = function(){
		return [
			      {'id': 'uid','label': getContext().model.lens('sentActivityComponent.transaction_notification_date_label').get()},
			      {'id': 'uid','label': getContext().model.lens('sentActivityComponent.transaction_status_label').get()},
			      {'id': 'uid','label': getContext().model.lens('sentActivityComponent.payee_name_label').get()},
			      {'id': 'uid', 'label': ''},
			      {'id': 'uid','label': getContext().model.lens('sentActivityComponent.transaction_amount_label').get()}
			    ];
	};
	var getReceivedActivityListHeaders = function(){
		return [
			      {'id': 'uid','label': getContext().model.lens('receivedActivityComponent.transaction_notification_date_label').get()},
			      {'id': 'uid','label': getContext().model.lens('receivedActivityComponent.transaction_status_label').get()},
			      {'id': 'uid','label': getContext().model.lens('receivedActivityComponent.payor_name_label').get()},
			      {'id': 'uid','label': ''},
			      {'id': 'uid','label': getContext().model.lens('receivedActivityComponent.transaction_amount_header').get()}
			    ];
	};

	var contactsToString = function(contacts) {

		var strContacts = '';
		if(typeof(contacts)!=='undefined'&&contacts) {
			for(var i=0;i<contacts.length;i++) {
				strContacts = strContacts + contacts[i];

				if(i<contacts.length-1) {
					strContacts = strContacts + ', ';
				}
			}
		}
		return strContacts;
	};

	var getToDoInputForm = function(selectedShowValue) {

		var selectedShowVal = typeof(selectedShowValue)!=='undefined'&&selectedShowValue!==null ? selectedShowValue : '';

		var showOptions = [];

		var todoComponent = getContext().components.todoComponent;
		var labelAll = dynamicContentUtil.dynamicContent.get(todoComponent, 'filter_by_notification_direction_label_ALL', '');
		var labelPayments = dynamicContentUtil.dynamicContent.get(todoComponent, 'filter_by_notification_direction_label_PAYMENTS', '');
		var labelRequests = dynamicContentUtil.dynamicContent.get(todoComponent, 'filter_by_notification_direction_label_REQUESTS', '');


		//'ALL', 'INVOICES', 'PAYMENTS', 'REQUESTS'
		showOptions[showOptions.length] =
			UIElements.enumInputElementUtility.createEnumValue('ALL', labelAll);
		showOptions[showOptions.length] =
			UIElements.enumInputElementUtility.createEnumValue('PAYMENTS', labelPayments);
		showOptions[showOptions.length] =
			UIElements.enumInputElementUtility.createEnumValue('REQUESTS', labelRequests);

		var showDD = new UIElements.DropDown('showDropdown', 'Show:', '', selectedShowVal, showOptions);

        var showUICInputElement = showDD.getUICInputElement();

        return { showDropdown: showUICInputElement };

	};

	return {
		init: function(context){
			setContext(context);
		},

		getSentActivityListModel: function(qpSentActivityListServiceResult, appendToList){

			var testIndex = 0;
			var viewModel = {
				tabledata: {},
				nextPageId : qpSentActivityListServiceResult.nextPageId
			};
			var memoWrap = getSettings().ACTIVITIES_MEMO_WRAP;
			var nameWrap = getSettings().ACTIVITIES_NAME_WRAP;

			viewModel.tabledata = [{}];
			viewModel.tabledata[0].headers = getSentActivityListHeaders();
			viewModel.tabledata[0].rows = [];

			if(qpSentActivityListServiceResult === undefined || qpSentActivityListServiceResult.listItems == null || qpSentActivityListServiceResult.listItems.length === 0){
				viewModel.tabledata[0].noResult = getContext().model.lens('sentActivityComponent.no_activity_message').get();
				return viewModel;
			}

			if(!appendToList){
				appendToList = [];
			}
			viewModel.tabledata[0].rows = appendToList;

			testIndex = appendToList.length;
			var sentActivityComponent = getContext().components.sentActivityComponent;

			for (var i = 0; i < qpSentActivityListServiceResult.listItems.length; i++) {
				var activityItem = qpSentActivityListServiceResult.listItems[i];
				if(activityItem){

				    var id = activityItem.id;
					var sendOnDate = activityItem.sendOnDate;

					var notificationSender = formatUtility.formatStringUtility.formatWrapText(activityItem.recipientName, nameWrap, '<br/>', true, false);
					var paymentAmount = formatUtility.formatCurrencyUtility.formatCurrency(activityItem.amount, 2, ',', '(', '$', '0.0'); //(activityItem.amount);

					var statusId = activityItem.status.toString();
					var quickpayStatus = dynamicContentUtil.dynamicContent.get(sentActivityComponent, 'transaction_status_label_' + statusId, '');

					var quickpayMemo = formatUtility.formatStringUtility.formatWrapText(activityItem.memo, memoWrap, '<br/>', true, true);

					var links = getLinksPerStatus('sentActivityComponent', id, statusId);

					var row = [];
					row[0] = {'value': sendOnDate,'name': 'date' };
					row[1] = {'value': quickpayStatus,'name': 'status'};
					row[1].memoDetails = quickpayMemo;
					row[2] = {'value': notificationSender,'name': 'sender'};
					row[3] = {
						          'classes': 'qp_activity_link disabled',
						          'name': 'actions',
						          'links': []
						     };
					row[3].links = links;

					row[4] = {'value': paymentAmount,'name': 'amount'};

					viewModel.tabledata[0].rows.push(row);
				}
			}

			if(qpSentActivityListServiceResult.nextPageId){
					// viewModel.actions = [UIElements.readOnlyValueUtility.getUICActionElement('see_more',getContext().model.lens('sentActivityComponent.see_more_label').get(), true)];
				viewModel.actions = [UIElements.readOnlyValueUtility.getUICActionElement('see_more','See more', true)];
			}
			return viewModel;
		},
		getReceivedActivityListModel: function(qpReceivedActivityListServiceResult, appendToList){

			var testIndex = 0;
			var viewModel = {
				tabledata: {},
				nextPageId : qpReceivedActivityListServiceResult.nextPageId
			};

			var memoWrap = getSettings().ACTIVITIES_MEMO_WRAP;
			var nameWrap = getSettings().ACTIVITIES_NAME_WRAP;

			viewModel.tabledata = [{}];
			viewModel.tabledata[0].headers = getReceivedActivityListHeaders();
			viewModel.tabledata[0].rows = [];

			if(qpReceivedActivityListServiceResult === undefined || qpReceivedActivityListServiceResult.quickPayReceiptItems == null || qpReceivedActivityListServiceResult.quickPayReceiptItems.length === 0){
				viewModel.tabledata[0].noResult = getContext().model.lens('receivedActivityComponent.no_activity_message').get();
				return viewModel;
			}

			if(!appendToList){
				appendToList = [];
			}
			viewModel.tabledata[0].rows = appendToList;

			testIndex = appendToList.length;
			var receivedActivityComponent = getContext().components.receivedActivityComponent;




			for (var i = 0; i < qpReceivedActivityListServiceResult.quickPayReceiptItems.length; i++) {
				var activityItem = qpReceivedActivityListServiceResult.quickPayReceiptItems[i];
				if(activityItem){

				    var id = activityItem.id;
					// var sendOnDate = formatUtility.formatDateUtility.formatServiceDate(activityItem.receivedOnDate);
					var sendOnDate = activityItem.receivedOnDate;
					var notificationSender = formatUtility.formatStringUtility.formatWrapText(activityItem.senderName, nameWrap, '<br/>', true, false);
					var paymentAmount = formatUtility.formatCurrencyUtility.formatCurrency(activityItem.amount, 2, ',', '(', '$', '0.0'); //(activityItem.amount);

					var statusId = activityItem.status.toString();
					var quickpayStatus = dynamicContentUtil.dynamicContent.get(receivedActivityComponent, 'transaction_status_label_' + statusId, '');
					var quickpayMemo = formatUtility.formatStringUtility.formatWrapText(activityItem.memo, memoWrap, '<br/>', true, true);

					var links = getLinksPerStatus('receivedActivityComponent', id,null);

					var row = [];
					row[0] = {'value': sendOnDate,'name': 'date' };
					row[1] = {'value': quickpayStatus,'name': 'status'};
					row[1].memoDetails = quickpayMemo;
					row[2] = {'value': notificationSender,'name': 'sender'};
					row[3] = {
						          'classes': 'qp_activity_link disabled',
						          'name': 'actions',
						          'links': []
						     };
					row[3].links = links;

					row[4] = {'value': paymentAmount,'name': 'amount'};

					viewModel.tabledata[0].rows.push(row);
				}
			}


			if(qpReceivedActivityListServiceResult.nextPageId){
				// viewModel.actions = [UIElements.readOnlyValueUtility.getUICActionElement('see_more',getContext().model.lens('receivedActivityComponent.see_more_label').get(), true)];
				viewModel.actions = [UIElements.readOnlyValueUtility.getUICActionElement('see_more','See more', true)];
			}
			return viewModel;
		},
		getToDoListViewModel: function(todoResults, selectedShowValue, currentTableDataRows){

			var viewModel = {
				tabledata: {},
				contacts:  todoResults&&typeof(todoResults.contacts)!=='undefined' ? contactsToString(todoResults.contacts) : null,
				toDoInputForm: getToDoInputForm(selectedShowValue)
			};
			var memoWrap = getSettings().ACTIVITIES_MEMO_WRAP;
			var nameWrap = getSettings().ACTIVITIES_NAME_WRAP;

			viewModel.tabledata = [{}];
			viewModel.tabledata[0].headers = getTodoListHeaders();

			if(!currentTableDataRows){
				currentTableDataRows= [];
			}
			viewModel.tabledata[0].rows = currentTableDataRows;

			var label_see_details = getContext().model.lens('todoComponent.request_transaction_details_label').get();
			var label_decline = getContext().model.lens('todoComponent.decline_transaction_label').get();
			var accept_money_label = getContext().model.lens('todoComponent.accept_money_label').get();
			var send_money_label = getContext().model.lens('todoComponent.send_money_label').get();
			var label_no_results = getContext().model.lens('todoComponent.no_requests_or_offers_message').get();
			var row_message = 'Decline message';//'<h2><i class=\'fa fa-exclamation-circle\''></i>You\'ve declined a $60.00 payment request from Kaylea Thoran.</h2>';
			var row_index_current = (currentTableDataRows && currentTableDataRows.length > 0)?currentTableDataRows.length:0;

			if(todoResults&&todoResults.actionItems&&todoResults.actionItems.length&&todoResults.actionItems.length>0) {

				for (var i = 0; i < todoResults.actionItems.length; i++) {
					var actionItem = todoResults.actionItems[i];
					if(actionItem){

						var receivedOnDate = actionItem.receivedOnDate;
						// var sender = actionItem.senderName;
						var sender = formatUtility.formatStringUtility.formatWrapText(actionItem.senderName, nameWrap, '<br/>', true, false);
						var paymentAmount = formatUtility.formatCurrencyUtility.formatAmount(actionItem.amount);
						var row_index = row_index_current + i;

						var btn_value =  '{"paymentId":' + actionItem.id +  ',"token": ' + actionItem.token + ',"row_index": ' + row_index.toString() + '}' ;


						var links = [];

						var seeDetailsLink = {'href': btn_value,'text': label_see_details,'name': 'see_details', 'classes':'see_details_link'};
						var declineLink = {'href': btn_value,'text': label_decline,'name': 'decline', 'classes':'decline_link' + ((actionItem.type)? '_' + actionItem.type.toLowerCase():'')};

						links.push(seeDetailsLink);
						links.push(declineLink);


						var row = [];
						row.paymentId = actionItem.id;
						row.lineRow = (!actionItem.memo)?'lineRow':'',
						row[row.length] = {'value': receivedOnDate,'name': 'date' };
						row[row.length] = {'value': sender + '<div>' +
						(actionItem.type === 'PAYMENT' ? 'Payment' : 'Request') + '</div>'
												,'name': 'sender',
												'rowMessage': row_message,
												'memoHideClass' : 'row_' + row_index.toString(),
												'memoDetails':
												formatUtility.formatStringUtility.formatWrapText(actionItem.memo, memoWrap, '<BR/>', true, true)};

						row[row.length] = {
				                			'classes':'todo_links',
				               				'name': 'actions',
				                			'links': links
				               			  };

						row[row.length] = {'value': formatUtility.formatCurrencyUtility.formatCurrency(paymentAmount,2,',','-','$','--'),'name': 'amount'};

						var acceptMoneyAction = {
													'label': accept_money_label,
							            			'id':'acceptMoneyAction'+actionItem.id+ '_' + actionItem.token,
							            			'classes':'primary Accept',
							            			'value': btn_value
							            		};

						var sendMoneyAction = {
					            					'label': send_money_label,
					            					'id':'sendMoneyAction'+actionItem.id+ '_' + actionItem.token,
					            					'classes':'SendMoney',
					            					'value': btn_value
					            				};

					    //type can be PAYMENT or REQUEST
						var button = actionItem.type === 'PAYMENT' ? acceptMoneyAction : sendMoneyAction;

						row[row.length] = {

				                			'actions': [
							            				button
											          ]
				               				};

						viewModel.tabledata[0].rows.push(row);

					}
				}
				if(todoResults.nextPageId){
					viewModel.seeMoreActions = [UIElements.readOnlyValueUtility.getUICActionElement('see_more','See more', true)];
				}
			}
			else {
				viewModel.tabledata[0].noResult =  label_no_results;
				//'You haven\'t received money or requests for money.';
			}

			return viewModel;
		},

		getSuccessMessage: function(data){
			var message = [];
			var messageFinal = [];
			var viewAmount = formatUtility.formatCurrencyUtility.formatCurrency(data.amount,2,',','-','$','--');
			var viewAccountName = this.parseCompany({account:data.creditAccountName,partition:''});
			var viewSenderName = data.senderName || 'NAME';
			var viewCode = data.statusCode || 'DEFAULT';
			var todoComponent = getContext().components.todoComponent;
			var tmpMessage = '';
			var messageLink = '';

			message[getSettings().SERVICE_STATUS_ACCEPT_MONEY.DEFAULT] = '';
			message[getSettings().SERVICE_STATUS_ACCEPT_MONEY.CANCELD] = dynamicContentUtil.dynamicContent.get(todoComponent, 'transaction_acceptance_confirmation_message_message5', '');
			message[getSettings().SERVICE_STATUS_ACCEPT_MONEY.IN_PROCESS_CHASE_FROM_NON_CHASE] = dynamicContentUtil.dynamicContent.get(todoComponent, 'transaction_acceptance_confirmation_message_message4', '');
			//message[getSettings().IN_PROCESS_NON_CHASE] = dynamicContentUtil.dynamicContent.get(todoComponent, 'transaction_acceptance_confirmation_message_message3', '');
			message[getSettings().SERVICE_STATUS_ACCEPT_MONEY.IN_PROCESS_CHASE] = dynamicContentUtil.dynamicContent.get(todoComponent, 'transaction_acceptance_confirmation_message_message2', '');
		//	message[getSettings().IN_PROCESS_CXE] = dynamicContentUtil.dynamicContent.get(todoComponent, 'transaction_acceptance_confirmation_message_message1', '');

			messageLink = getContext().model.lens('todoComponent.see_more_label').get();

			tmpMessage = (message[viewCode]).replace('@accountName',viewAccountName);
			tmpMessage = (tmpMessage).replace('@amount',viewAmount);
			tmpMessage = (tmpMessage).replace('@name',viewSenderName);
			messageFinal = tmpMessage.split('||');
			messageFinal.push(messageLink);
			return messageFinal;
		},
		getSettings:getSettings,
		// identifies first occurense of account number in the string and replaces it with the last 4 characters.
		parseCompany: function(args) {
	    	var account = args.account || 'ENTER STRING';
	    	var partition = args.partition || '';
	    	var myValue = ("" + (/\d+/.exec(account)));
	    	var size = myValue.length;
	    	var short = (size > 3) ? myValue.substr(size-4, size) : myValue;
	    	return (account.replace(myValue, partition + short));
		},
		getEnrollSetupViewModel: function(){
			var viewModel = {};

			viewModel.actions = UIElements.readOnlyValueUtility.getUICActionElementsPair('cancel_button', 'Cancel', 'setup_button', 'Set up');

			return viewModel;
		}
	};
});
