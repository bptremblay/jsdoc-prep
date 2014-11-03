define(function(require) {
	return function PaymentsActivityDataTransform() {
		this.getActivityViewModel = function(data, selectedPayeeId, modelRef) {
			transactions = data.paymentActivities;
			cardPayees = data.cardPayees;

			var transactionRows = [];
			if (transactions != undefined) {
				for(var i = 0; i < transactions.length; i++) {
					transactionRows.push(new TransactionRow(transactions[i], modelRef));
				}
			}

			//Set selected payeeId to "selected"
			if (cardPayees != undefined) {
				//Set selectedPayeeId to Default payeeId
				if(selectedPayeeId == 0) {
					selectedPayeeId = data.defaultPayeeId;
				}

				for (var i = 0; i < cardPayees.length; i++) {
					cardPayees[i].selected = (cardPayees[i].payeeId == selectedPayeeId) ? "selected" : "";
				}
			}

			headers = buildHeaders(modelRef)['headers'];

			var paymentActivityModel = {
				"transactions": {
					"headers": headers,
					"rows": transactionRows
				},
				"account_display_name": cardPayees
			}

			return paymentActivityModel;
		};


		function TransactionRow(transaction, modelRef) {
			this.date = transaction['dueDate'];
			this.status = activityStatusMapper(transaction['activityStatus']);
			this.links = buildLinks(transaction['activityStatus'], modelRef)['links'];
			this.amount = "$" + parseFloat(Math.round(transaction['amount']*100)/100).toFixed(2);
			this.inputs = buildInputs(transaction, modelRef);
		}

		function buildInputs(transaction, modelRef) {
			return [{
			        "inline":[{
			            "data": [{
			                "id": "",
			                "classId": "transactionDateLabel",
			                "value": (transaction['activityStatus'] == 'PAID') ? modelRef.lens('transaction_date_label').get() : modelRef.lens('transaction_scheduled_date_label').get()
			            },
			            {
			                "id": "",
			                "value": transaction['dueDate']
			            }]
			        },
			        {
			            "data": [{
			                "id": "",
			                "classId": "transactionStatusLabel",
			                "value": modelRef.lens('transaction_status_label').get()
			            },
			            {
			                "id": "",
			                "value": activityStatusMapper(transaction['activityStatus'])
			            }]
			        },
			         {
			            "data": [{
			                "id": "",
			                "classId": "transactionAmountLabel",
			                "value": modelRef.lens('transaction_amount_label').get()
			            },
			            {
			                "id": "",
			                "value": "$" + parseFloat(Math.round(transaction['amount']*100)/100).toFixed(2)
			            }]
			        },
			         {
			            "data": [{
			                "id": "",
			                "classId": "transactionDetailsLabel",
			                "value": modelRef.lens('transaction_details_label').get()
			            },
			            {
			                "id": "",
			                "value": transaction['description']
			            }]
			        },
			         {
			            "data": [{
			                "id": "",
			                "classId": "accountDisplayName",
			                "value": modelRef.lens('account_display_name_label').get()
			            },
			            {
			                "id": "",
			                "value": transaction['fundingAccountName']
			            }]
			        },
			     	{
			            "data": [{
			                "id": "",
			                "classId": "transactionNumberLabel",
			                "value": modelRef.lens('transaction_number_label').get()
			            },
			            {
			                "id": "",
			                "value": transaction['confirmationNumber']
			            }]
			        }]
		        }];
		}


		function buildLinks(status, modelRef) {

			if(status == 'PENDING' || status == 'SCHEDULED') {
				return {
						"links":[
							{
			    		 		"href":"#",
			    		 		"link_class":"show-link",
			       		 		"label": modelRef.lens('request_transaction_details_label').get() //"See details"
			        		},
			        		{
			        			"href":"#",
			        			"link_class":"cancel-link",
			            		"label": modelRef.lens('cancel_transaction_label').get() //"Cancel"
			   				}
			   			 ]
			   			};
			} else {
				return {
						"links":[
							{
			    		 		"href":"#",
			    		 		"link_class":"show-link",
			       		 		"label": modelRef.lens('request_transaction_details_label').get() //"See details"
			        		}
			        	]
			        };
			}
		};


		function buildHeaders(modelRef) {
			return {
				"headers":[
					{
		        		"label": modelRef.lens('transaction_date_label').get(),
		           		"icon":false
		        	},
		        	{
		           		"label": modelRef.lens('transaction_status_label').get(),
		           		"icon":false
		       		},
		       		{
		           		"":"",
		            	"icon":false
		       		},
		       		{
		            	"label": modelRef.lens('transaction_amount_label').get(),
		            	"icon":false
		       		}
		       	]
		    };
		};

		function activityStatusMapper(activityStatus) {
			var displayActivityStatus = "";

			switch(activityStatus) {
				case "SCHEDULED":
					displayActivityStatus = "Pending";
					break;
				case "PENDING":
					displayActivityStatus = "Pending";
					break;
				case "INPROCESS":
					displayActivityStatus = "In process";
					break;
				case "FAILED":
					displayActivityStatus = "Funding failed";
					break;
				case "PAID":
					displayActivityStatus = "Paid";
					break;
				case "RETURNED":
					displayActivityStatus = "Returned";
					break;
				case "REJECTED":
					displayActivityStatus = "Rejected";
					break;
				case "CANCELLED":
					displayActivityStatus = "Cancelled";
					break;
				case "COMPLETED":
					displayActivityStatus = "Completed";
					break;
				default:
					displayActivityStatus = "N/A";  // Should there be a default?
			}

			return displayActivityStatus;
		}

		return this;
	}
});
