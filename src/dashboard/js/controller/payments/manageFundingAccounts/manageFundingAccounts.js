define(function(require) {

	return function controller() {

		var observable = require('blue/observable'),
			controllerChannel = require('blue/event/channel/controller'),
			componentChannel = require('blue/event/channel/component'),

			headerSpec = require('bluespec/manage_funding_accounts_header');
			//headerSpec = require('dashboard/spec/payments/manageFundingAccounts/manage_funding_accounts_header'),
			headerMethods = require('dashboard/component/payments/manageFundingAccounts/manageFundingAccountsHeader'),

			//manageFundingAccountsMenuSpec = require('dashboard/spec/payments/manageFundingAccounts/manage_funding_accounts_menu'),
			manageFundingAccountsMenuSpec = require('bluespec/manage_funding_accounts_menu'),
			//manageFundingAccountsMenuSpec = require('dashboard/spec/payments/manageFundingAccounts/manage_funding_accounts_menu'),
			manageFundingAccountsMenuMethods = require('dashboard/component/payments/manageFundingAccounts/manageFundingAccountsMenu'),

			manageFundingAccountsMenuViewPath = 'payments/manageFundingAccounts/manageFundingAccountsMenu',
			headerViewPath = 'payments/manageFundingAccounts/manageFundingAccountsHeader',

			//manageSpec = require('dashboard/spec/payments/manageFundingAccounts/update_funding_accounts'),
			manageSpec = require('bluespec/update_funding_accounts'),
			manageMethods = require('dashboard/component/payments/manageFundingAccounts/updateFundingAccounts'),
			manageViewPath = 'payments/manageFundingAccounts/manageFundingAccounts',

			/************************************
			* ADD PAYMENTS
			*************************************/
			addFundingAccountViewPath = 'payments/manageFundingAccounts/addFundingAccount',
			addFundingAccountSpec = require('dashboard/spec/payments/manageFundingAccounts/addFundingAccount'),
			addFundingAccountMethods = require('dashboard/component/payments/manageFundingAccounts/addFundingAccount'),
			addFundingAccountStreamModel = require('dashboard/component/payments/manageFundingAccounts/addFundingAccountStream'),

			//Delete Funding Account Confirmation Component
			deleteFundingAccountConfirmationSpec = require('dashboard/spec/payments/manageFundingAccounts/deleteFundingAccountConfirmation'),
			deleteFundingAccountConfirmationMethods = require('dashboard/component/payments/manageFundingAccounts/deleteFundingAccountConfirmation'),
			deleteFundingAccountConfirmationView = 'payments/manageFundingAccounts/deleteFundingAccountConfirmation';

			//Delete Funding Account Notification Component
			deleteFundingAccountNotificationSpec = require('dashboard/spec/payments/manageFundingAccounts/deleteFundingAccountNotification'),
			deleteFundingAccountNotificationMethods = require('dashboard/component/payments/manageFundingAccounts/deleteFundingAccountNotification'),
			deleteFundingAccountNotificationView = 'payments/manageFundingAccounts/deleteFundingAccountNotification';


		this.init = function() {

			this.model = observable.Model.combine({

				'addFundingAccount':addFundingAccountStreamModel,

				'deleteFundingAccountConfirmationComponent': {
					'ePayAccountRefId': '',
					'payeeId': '',
					'personId': ''
				},

				'deleteFundingAccountNotificationComponent': {},

                'manageFundingAccountsHeaderComponent': {
            		accountDisplayName: null
            	},

            	'manageFundingAccountsComponent': {
            		fundingAccounts: {}
            	},
            	'defaultBehavior':true
            });


            //set up channel listener
            controllerChannel.on({

                'trigger/addFundingAccount': function() {
                	this.addFundingAccount();
                }.bind(this),

                'trigger/editFundingAccount': function(data) {
                	this.editFundingAccount(data);
                }.bind(this),

                'trigger/updateFundingAccount': function(data) {
                	this.updateFundingAccount(data);
                }.bind(this),

                'trigger/showFundingAccounts': function(data) {
                	this.showFundingAccounts(data);
                }.bind(this),

                'trigger/showDeleteFundingAccountConfirmation': function(data) {
                	if( data.statusCode === undefined ) {
                		this.showDeleteFundingAccountConfirmation(data);
                	} else {
                		//Unable to Delete Funding Account
                		this.showDeleteFundingAccountNotification();
                	}

                }.bind(this),

                'trigger/confirmFundingAccountDeletion': function(data) {
                	this.components.manageFundingAccountsComponent.confirmFundingAccountDeletion(data);
                }.bind(this)

            });

            this.register.components(this, [{
                name: 'manageFundingAccountsMenu',
                model: this.model,
                spec: manageFundingAccountsMenuSpec,
                methods: manageFundingAccountsMenuMethods
            }]);


			this.register.components(this, [{
				        name: 'manageFundingAccountsComponent',
				        model: this.model.lens('manageFundingAccountsComponent'),
				        spec: manageSpec,
				        methods: manageMethods
				    }]);

		};

		this.showDeleteFundingAccountConfirmation = function(data) {

			delete this.components.deleteFundingAccountConfirmationComponent;

			var model = this.model.lens('deleteFundingAccountConfirmationComponent');
			this.register.components(this, [{
				name: 'deleteFundingAccountConfirmationComponent',
				model: model,
				spec: deleteFundingAccountConfirmationSpec,
				methods: deleteFundingAccountConfirmationMethods
			}]);

           	this.components.deleteFundingAccountConfirmationComponent.showDeleteFundingAccountConfirmation(data);

     		this.executeCAV(
                [this.components.deleteFundingAccountConfirmationComponent, deleteFundingAccountConfirmationView, {
	            	append: false,
	            	'target': '#delete_funding_account_confirmation',
	            	react: true
	            }]
        	);

		}

		this.showDeleteFundingAccountNotification = function() {

			delete this.components.deleteFundingAccountNotificationComponent;

			var model = this.model.lens('deleteFundingAccountNotificationComponent');
			this.register.components(this, [{
				name: 'deleteFundingAccountNotificationComponent',
				model: model,
				spec: deleteFundingAccountNotificationSpec,
				methods: deleteFundingAccountNotificationMethods
			}]);

           	this.components.deleteFundingAccountNotificationComponent.showDeleteFundingAccountNotification();
     		this.executeCAV(
                [this.components.deleteFundingAccountNotificationComponent, deleteFundingAccountNotificationView, {
	            	append: false,
	            	'target': '#delete_funding_account_notification',
	            	react: true
	            }]
        	);

		}

		this.index = function() {

     		this.executeCAV(
                [this.components.manageFundingAccountsMenu, manageFundingAccountsMenuViewPath, {
	            	append: false,
	            	'target': '#content'
	            }]
        	);

        	this.components.manageFundingAccountsComponent.getFundingAccounts(0);

		};

		this.showFundingAccounts = function(data) {

			delete this.components.manageFundingAccountsComponent;

			if (this.components.fundingAccountsHeaderComponent == undefined)
			{

				this.register.components(this, [{
					name: 'fundingAccountsHeaderComponent',
					model: this.model.lens('manageFundingAccountsHeaderComponent'),
					spec: headerSpec,
					methods: headerMethods
				}]);

				this.components.fundingAccountsHeaderComponent.model.lens('manageFundingAccountsHeaderComponent').set(data.headerData);
				this.components.fundingAccountsHeaderComponent.model.get().currentPayeeId = data.payeeId;

				this.components.fundingAccountsHeaderComponent.model.lens('currentPayeeId').set( data.payeeId );

				this.selectFundingAccountOption( data.payeeId );

            	this.executeCAV([
    				[this.components.fundingAccountsHeaderComponent, headerViewPath, {
                   		append: false,
                    	'target': '#funding_accounts_header'
                	}]]);
			}


			this.register.components(this, [{
				name: 'manageFundingAccountsComponent',
				model: this.model.lens('manageFundingAccountsComponent'),
				spec: manageSpec,
				methods: manageMethods
			}]);


			this.components.manageFundingAccountsComponent.model.lens('manageFundingAccountsComponent.fundingAccounts').set(data.fundingData);
			this.components.manageFundingAccountsComponent.model.get().currentPayeeId = data.payeeId;

			this.components.fundingAccountsHeaderComponent.model.lens('currentPayeeId').set(data.payeeId);

			this.executeCAV([
                [this.components.manageFundingAccountsComponent, manageViewPath, {
                    append: false,
                    'target': '#funding_accounts'
                }]
            ]);

           	controllerChannel.emit('trigger', {
                itemId: 'edit_payment_account',
                value: 'selectMenuItem'
            });

		};

		this.updateFundingAccount = function(data) {

			/*****************************************
			* default behaviour: edit mode when
			* changing credit cards in menu,
			* show funding accounts for that account
			******************************************/

			if( data.defaultBehavior ){
				this.model.lens('defaultBehavior').set( true );
			}

			if( !this.model.lens('defaultBehavior').get() ){
				return;
			}

			var payeeId = 0;

			if (data.payeeId != undefined){
				payeeId = data.payeeId;
			}

			/*
			if ( payeeId == 0 ){
				delete this.components.fundingAccountsHeaderComponent;
			}
			*/

			this.selectFundingAccountOption( payeeId );

            controllerChannel.emit('trigger', {
                itemId: 'edit_payment_account',
                value: 'selectMenuItem'
            });


			this.components.manageFundingAccountsComponent.getFundingAccounts(payeeId);

        };

		this.addFundingAccount = function(){

			this.model.lens('defaultBehavior').set( false );

			delete this.components.addFundingAccountComponent;

			this.model.lens('addFundingAccount').set( addFundingAccountStreamModel );

			this.register.components(this, [{
		        name: 'addFundingAccountComponent',
		        model: this.model.lens('addFundingAccount'),
		        spec: addFundingAccountSpec,
		        methods: addFundingAccountMethods
		    }]);

			//add locale
			var localeModel = this.components.addFundingAccountComponent.model.get();
			var model = this.model.lens('addFundingAccount');

			//labels
			model.lens('routingNumber.label').set(localeModel.routing_number_label);
			model.lens('accountNumber.label').set(localeModel.account_number_label);
			model.lens('confirmedAccountNumber.label').set(localeModel.confirmed_account_number_label);
			model.lens('accountNickname.label').set(localeModel.account_nickname_label);

			//Cancel button
			model.lens('actions.0.label').set(localeModel.cancel_add_funding_account_label);

			//Add button
			model.lens('actions.1.label').set(localeModel.add_funding_account_label);

			//messages
			model.lens('accountNicknameAdvisory').set(localeModel.account_nickname_advisory);
			model.lens('routingNumberHelpMessage').set(localeModel.routing_number_help_message);
			model.lens('addFundingAccountMessage').set(localeModel.add_funding_account_message);

    		this.executeCAV([
    							[this.components.addFundingAccountComponent, addFundingAccountViewPath, {
                        			append: false,
                        			'target': '#funding_accounts'
                    			}]

                    ]);

    		//hack till we move to ractive
    		//hbs template is showing [object Object] in input text fields
    		//10/29/14 - tjd
    		this.components.addFundingAccountComponent.output.emit('state', {
	                value: 'removeHbsObject'
	        });

			controllerChannel.emit('trigger', {
                itemId: 'add_payment_account',
                value: 'selectMenuItem'
            });

		};

		this.editFundingAccount = function(data) {

			var nickname = data.nickname;
			var nicknameUpdateAllowed = data.nicknameUpdateAllowed;

			console.log('manageFundingAccounts Controller: editFundingAccount() -> HERE!')
			console.log('--> nickname = ' + data.nickname);
			console.log('--> nicknameUpdateAllowed = ' + data.nicknameUpdateAllowed);
		};

		this.selectFundingAccountOption = function(payeeId){

			var selectOptions = this.model.lens('manageFundingAccountsHeaderComponent.manageFundingAccountsHeaderComponent.select.0.options').get();

			selectOptions.forEach( function( option ){
						option.selected = false;
					if( option.value == payeeId ){
						option.selected = true;
					}
			});

			this.model.lens('manageFundingAccountsHeaderComponent.manageFundingAccountsHeaderComponent.select.0.options').set( selectOptions );

		};

	};


});
