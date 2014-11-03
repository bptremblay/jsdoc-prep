/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PayeeActivityController
 */
 define(function(require) {

 	return function PayeeActivityController() {

 		var controllerChannel = require('blue/event/channel/controller'),
 		observable = require('blue/observable'),
 		componentChannel = require('blue/event/channel/component'),
		//payeeActiviy Component spec and methods
		// payeeActivitySpec = require('dashboard/spec/payments/merchantBillPay/payee_activity'),
		payeeActivitySpec = require('bluespec/payee_activity'),
		payeeActivityMethods = require('dashboard/component/payments/payeeActivity/payeeActivity'),

		// editTransactionSpec = require('dashboard/spec/payments/merchantBillPay/update_merchant_bill_payment'),
		editTransactionSpec = require('bluespec/update_merchant_bill_payment'),
		editTransactionMethods = require('dashboard/component/payments/payeeActivity/editTransaction'),

		cancelBillPaymentSpec = require('bluespec/cancel_merchant_bill_payment'),
		cancelBillPaymentMethods = require('dashboard/component/payments/payeeActivity/cancelMerchantBillPayment'),

		modalSpec = require('blue-spec/dist/spec/layout'),
		modalMethods = require('dashboard/component/myProfile/modal'),

		dynamicContentUtil = require('common/utility/dynamicContentUtil'),
		strftime = require('blue/date/strftime');
		this.init = function() {

			this.controllerChannel = controllerChannel;
			this.componentChannel = componentChannel;
			this.dynamicContentUtil = dynamicContentUtil;

			componentChannel.on({
				'loadPayeeActivity': function(data) {
					this.handleLoadPayeeActivity(data);
				}.bind(this)
			});

			componentChannel.on({
				'initPayeeActivity': function() {
					this.handleInitPayeeActivity();
				}.bind(this)
			});

			componentChannel.on({
				'hideAllEditTransaction': function() {
					this.handleHideAllEditTransaction();
				}.bind(this)
			});

			controllerChannel.on({
				'displayPayeeActivity': function(data) {
					this.handleDisplayPayeeActivity(data);
				}.bind(this)
			});

			controllerChannel.on({
				'showCancelPaymentConfirmation': this.showCancelPaymentConfirmation.bind(this)
			});

			controllerChannel.on({
				'hideCancelPaymentConfirmation': this.hideConfirmationModal.bind(this)
			});

			controllerChannel.on({
				'editPayeeTransaction': function(data) {
					this.handleEditPayeeTransaction(data);
				}.bind(this)
			});

			controllerChannel.on({
				'displayEditPayeeTransaction': function(inputData) {
					this.handleDisplayEditPayeeTransaction(inputData);
				}.bind(this)
			});

			controllerChannel.on({
				'hideAllEditTransaction': function() {
					this.handleHideAllEditTransaction();
				}.bind(this)
			});

			controllerChannel.on({
				'hideEditTransaction': function(transactionRowDetail) {
					this.handleHideEditTransaction(transactionRowDetail);
				}.bind(this)
			});

			controllerChannel.on({
				'updateTransactionWithMessage': function(inputData) {
					this.handleUpdateTransactionWithMessage(inputData);
				}.bind(this)
			});


		};

		/**
		 * Function for handling signal HideAllEditTransaction; This will hide all the edit blocks.
		 * @function handleHideAllEditTransaction
		 * @memberOf module:PayeeActivity
		 */
		this.handleHideAllEditTransaction = function() {
			this.components.payeeActivityComponent.hideAllEditTransaction();
		};

		/**
		 * Function for handling signal hideEditTransaction; This will hide  edit section of the specific ROW only
		 * @function handleHideEditTransaction
		 * @memberOf module:PayeeActivity
		 */
		this.handleHideEditTransaction = function(transactionRowDetail) {
			this.components.payeeActivityComponent.hideEditTransaction(transactionRowDetail);
		};

		/**
		 * Function for handling signal confirmEditTransaction; This will show hide edit section then display message.
		 * @function handleConfirmEditTransaction
		 * @memberOf module:PayeeActivity
		 */
		this.handleUpdateTransactionWithMessage = function(inputData)
		{
			this.components.payeeActivityComponent.showUpdateSuccessConfirmation(inputData);
		};



		/**
		 * Function for handling signal initPayeeActivity; Note : its mandatory to call this signal to make sure the activity loads.
		 * @function handleInitPayeeActivity
		 * @memberOf module:PayeeActivity
		 */
		this.handleInitPayeeActivity = function() {
				//initialize base model with empty this is required else the we have to use the '_' version of the properties in Racitve template
			this.model = observable.Model.combine({
				'payeeActivityComponent': 	{
											 payeeName:'',
											 payeeActivityTransactions : [],
											 additionalTransactionActivity : false
											},
				'payeeActivityDetailComponent': {},
				'editTransactionComponent': {
					fundingAccountDisplayNameWithBalance: '',
					prevFundingAccountDisplayNameWithBalance: '',
					fundingAccountList: [],
					transactionAmount: '',
					transactionNotificationDate: '',
					transactionDueDate: '',
					memo: '',
					prevMemo: '',
					paymentMethodCutoffTime: '',
					formId: '',
					optionId: '',
					updateToken: '',
					paymentId: '',
					payeeName: '',
					showEditTransaction: false,
					showEditTransactionVerify: false,
					disableOverlayInEditList: true
				}
			});

			var observedModel = this.model.lens('payeeActivityComponent');

			//TODO : Try to remove this from init using flag in model
			this.register.components(this, [{
				name: 'payeeActivityComponent',
				model: observedModel,
				spec: payeeActivitySpec,
				methods: payeeActivityMethods
			}]);
		};

		/**
		 * Function for default action NOTE: This may not be called as this is called as a sub page.
		 * @function index
		 * @memberOf module:PayeeActivity
		 */
		this.index = function() {
			// NOTE: This may not be called as this is called as a sub page.
		};

		/**
		 * Function for handling the  load of payeeActivity; This is called whenever tere is need to update the list.
		 * @function handleLoadPayeeActivity
		 * @memberOf module:PayeeActivity
		 */
		this.handleLoadPayeeActivity = function(data) {
			// the below call will update the model  and Ractive will update the DOM
			this.components.payeeActivityComponent.showTransactions(data);
		};

		/**
		 * Function for handling the display of payee activity called only once; check implimented in component
		 * @function handleDisplayPayeeActivity
		 * @memberOf module:PayeeActivity
		 */
		this.handleDisplayPayeeActivity = function() {
		 	this.executeCAV([this.components.payeeActivityComponent, 'payments/payeeActivity/payeeActivity', {'target':'#payee-activity-content', react:true}]);
		 };

		 /**
		 * Function for handling the  load of edit payment
		 * @function handleEditPayeeTransaction
		 * @memberOf module:PayeeActivity
		 */
		this.handleEditPayeeTransaction = function(data) {
			var observedModel = this.model.lens('editTransactionComponent');
			this.register.components(this, [{
				name: 'editTransactionComponent',
				model: observedModel,
				spec: editTransactionSpec,
				methods: editTransactionMethods
			}]);

			this.components.editTransactionComponent.showMerchantBillPayment(data);
		};

		/**
		 * Function for handling the display of edit payment
		 * @function handleDisplayEditPayeeTransaction
		 * @memberOf module:PayeeActivity
		 */
		this.handleDisplayEditPayeeTransaction = function(inputData) {
			var target = '#updateTransArea_transid_' + inputData.paymentId;
		 	this.executeCAV([this.components.editTransactionComponent, 'payments/payeeActivity/editTransaction', {'target': target, react:true}]);
		};

		this.showCancelPaymentConfirmation = function(data){

		 	this.insertConfirmationModal();

		 	this.register.components(this, [{
		 		name: 'cancelMerchantBillPaymentComponent',
		 		model: observable.Model.combine(data.cancelData),
		 		spec: cancelBillPaymentSpec,
		 		methods: cancelBillPaymentMethods
		 	}]);

		 	var trxDate = new Date(data.cancelData.transactionNotificationDate);
		 	if(trxDate) {
		 		// Use Mout Date format utility
		 		trxDate = strftime(trxDate, '%b %d, %Y'); // MMM dd, YYYY
		 	}
		 	dynamicContentUtil.dynamicContent.set(this.components.cancelMerchantBillPaymentComponent, 'cancel_merchant_bill_payment_message', {transaction_amount: data.cancelData.transactionAmount, payee_name: data.cancelData.payeeName, transaction_notification_date: trxDate });

		 	//Set CancellationToken on component for Cancel Service request.
		 	this.components.cancelMerchantBillPaymentComponent.cancellationToken = data.cancelData.cancellationToken;
		 	this.components.cancelMerchantBillPaymentComponent.paymentId = data.cancelData.paymentId;
		 	this.components.cancelMerchantBillPaymentComponent.currentTranscationRowNum = data.cancelData.currentTranscationRowNum;
		 	var executeCAVOptions = {
		 		component: this.components.cancelMerchantBillPaymentComponent,
		 		viewPath: 'payments/payeeActivity/cancelMerchantBillPayment'
		 	};

		 	this.insertContentIntoModal(executeCAVOptions);

		 	this.components.cancelMerchantBillPaymentComponent.setFocus('cancelHeader');
		};

		this.hideConfirmationModal = function(){
			this.components.confirmationModalComponent.hide();
		};

		this.registerConfirmationModal = function(){

		 	var modalOptions = {
		 		modalId: 'confirmation-modal',
				// Using delete-confirmation CSS class for now, should be renamed to something more generic
				cssClass: 'delete-confirmation',
				positionTarget: '#pnt-tabs'
			};

			this.register.components(this, [{
				name: 'confirmationModalComponent',
				model: observable.Model.combine(modalOptions),
				spec: modalSpec,
				methods: modalMethods
			}]);

		};

		this.insertConfirmationModal = function(){

			this.registerConfirmationModal();

			if( !this.components.confirmationModalComponent.inserted ) {
				this.executeCAV( [ this.components.confirmationModalComponent, 'myProfile/modal', { target: '#payee-activity-content', append: true, react: true}] );
				this.components.confirmationModalComponent.inserted = true;
			}
		};

		this.insertContentIntoModal = function(options){

			var modalContentSelector = '#' +  this.components.confirmationModalComponent.model.lens('modalId').get() + ' .content';

			this.elementObserver.isInserted(modalContentSelector, function(){
				this.executeCAV([options.component, options.viewPath, { target: modalContentSelector, react: true }]);
				this.components.confirmationModalComponent.show();
			}.bind(this));
		};
		/* ---- End Modal Helper Methods ---- */
	};

});
