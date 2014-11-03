define(function(require) {
	var context = null,
		localeSettings = require('blue/settings'),
		controllerChannel = require('blue/event/channel/controller');

	return {
		init: function() {
			context = this.settings.context;
			this.locale = localeSettings.get('LOCALIZED_CONTENT', localeSettings.Type.PERM);

		},

		updatePayeeId: function( data ){

			this.model.lens('payeeId').set( data.payeeId );
		},

		isValidRoutingNumber: function( routingNumber ){

			if( routingNumber === '' || routingNumber === null || routingNumber === undefined ){
				return true;
			}

			var reg = new RegExp('^[0-9]+$');

			if( !reg.test( routingNumber ) || routingNumber.length !== 9 ){
				return false;
			}

			return true;
		},

		isValidAccountNumber: function( accountNumber ){

			if( accountNumber === '' || accountNumber === null || accountNumber === undefined ){
				return true;
			}

			var reg = new RegExp('^[a-zA-Z0-9-]+$');

			if( !reg.test( accountNumber ) ){
				return false;
			}

			return true;
		},

		isValidAccountNickname: function( accountNickname ){

			/*
			In the course of adding a pay-from account, user has entered a nickname
			 that includes any invalid characters (note - the only valid characters
			 are Alphabetical (a-z A-Z), Numeric (0-9), Comma (,), Period (.), Slash ( / ),
			 Parentheses ((,)), Ampersand (&), Apostrophe ('), Dash ( - ), Space
			*/

			if( accountNickname === "" || accountNickname === null || accountNickname === undefined ){
				return true;
			}

			var reg = new RegExp('^[a-zA-Z0-9,./()&\'\\s-]+$');

			if( !reg.test( accountNickname ) ){
				return false;
			}

			return true;
		},

		validateRoutingNumberFocusOut: function( routingNumber ){

			if( routingNumber === '' || routingNumber === null || routingNumber === undefined ){

				//set flag to true if no routing number in input
				this.model.lens('validRoutingNumberServerSide').set( true );

				this.output.emit('state', {
					elementId: 'routing_number',
	                value: 'removeErrorHighlight'
	            });

				return;

			}else if( !this.isValidRoutingNumber( routingNumber ) ){

				this.model.lens('validRoutingNumberServerSide').set( true );

				var errorMessage = this.locale['ADD_FUNDING_ACCOUNT.routing_number_error.bad_characters'];
				this.model.lens('routingNumberError').set( errorMessage );

				this.output.emit('state', {
					elementId: 'routing_number',
	                value: 'addErrorHighlight'
	            });

				return;

			}else{

				this.output.emit('state', {
					elementId: 'routing_number',
	                value: 'removeErrorHighlight'
	            });

				/***********************************
				* CHANGE ROUTING NUMBER ERROR MSG
				***********************************/

				/*
	            if( !this.model.lens('valid_routing_number_server_side').get() ){
					var errorMessage = this.locale['ADD_FUNDING_ACCOUNT.routing_number_error_server_side'];
					this.model.lens('routing_number_error').set( errorMessage );

					this.output.emit('state', {
						elementId: 'routing_number',
		                value: 'addErrorHighlight'
		            });
				}
				*/

				/**********************************************************
				**	Call validation service to check routing number
				**********************************************************/

				var params = {routingNumber: routingNumber};

				context.addValidateServices.callService['addValidate']( params )
				.then(function(data){

				/***********************************************
				* TODO: when service is fully implemented, we
				* will add logic if error happens
				***********************************************/

					if(data.code === 'SUCCESS'){
						var nickname = '';

						if( data.name ){
							nickname = data.name;
						}

						//??!! this should work, just update the model -> mapped to BOTH
						//figure out later
						this.model.lens('accountNickname').set( nickname );

						if( nickname === '' ){

							//set flag
							this.model.lens('validRoutingNumberServerSide').set( false );

							var errorMessage = this.locale['ADD_FUNDING_ACCOUNT.routing_number_error.not_recognized'];
							this.model.lens('routingNumberError').set( errorMessage );

							this.output.emit('state', {
								elementId: 'routing_number',
	                			value: 'addErrorHighlight'
	            			});

						}else{
							//set flag
							this.model.lens('validRoutingNumberServerSide').set( true );
						}

						this.output.emit('state', {
	                		value: 'updateAccountNicknameInput'
	            		});

						this.validateAccountNicknameFocusOut();

					}else{
						this.validateAccountNicknameFocusOut();
					}

				}.bind(this));
			}

			this.validateFormFields();

		},

		validateRoutingNumberFocus: function( routingNumber ){

			if( !this.isValidRoutingNumber( routingNumber ) ||
				!this.model.lens('validRoutingNumberServerSide').get() ){

	        	this.output.emit('state', {
					elementId: 'routing_number',
					errorMessageName: 'routingNumberError',
	                value: 'showErrorMessageTooltip'
	            });
			}

		},

		validateAccountNumberFocusOut: function( accountNumber ){

			if( !this.isValidAccountNumber( accountNumber ) ){

				this.output.emit('state', {
					elementId: 'account_number',
	                value: 'addErrorHighlight'
	            });

			}else{

				this.output.emit('state', {
					elementId: 'account_number',
	                value: 'removeErrorHighlight'
	            });

			}

			var confirmedAccountNumber = this.model.lens('confirmedAccountNumber').get();

			if( typeof confirmedAccountNumber === 'object' ){
				confirmedAccountNumber = null;
			}

			this.validateConfirmedAccountNumberFocusOut( confirmedAccountNumber );
			this.validateFormFields();
		},

		validateAccountNumberFocus: function( accountNumber ){

			if( !this.isValidAccountNumber( accountNumber ) ){

	        	this.output.emit('state', {
					elementId: 'account_number',
					errorMessageName: 'account_number_error',
	                value: 'showErrorMessageTooltip'
	            });
			}

		},

		validateConfirmedAccountNumberFocusOut: function( confirmedAccountNumber ){

			console.log('my model: ', this.model.get() );

			var accountNumber = this.model.lens('accountNumber').get();

			if( confirmedAccountNumber === '' || confirmedAccountNumber === null
				|| confirmedAccountNumber === undefined ){

				this.output.emit('state', {
					elementId: 'confirmed_account_number',
	                value: 'removeErrorHighlight'
	            });

				this.validateFormFields();
				return;
			}

			if( accountNumber !== confirmedAccountNumber ){
				this.output.emit('state', {
					elementId: 'confirmed_account_number',
	                value: 'addErrorHighlight'
	            });
			}else{
				this.output.emit('state', {
					elementId: 'confirmed_account_number',
	                value: 'removeErrorHighlight'
	            });
			}

			this.validateFormFields();
		},

		validateConfirmedAccountNumberFocus: function( confirmedAccountNumber ){

			if( confirmedAccountNumber === '' || confirmedAccountNumber === null ||
				confirmedAccountNumber === undefined ){
				return;
			}

			var accountNumber = this.model.lens('accountNumber').get();

			if( accountNumber !== confirmedAccountNumber ){
	        	this.output.emit('state', {
					elementId: 'confirmed_account_number',
					errorMessageName: 'confirmed_account_number_error',
	                value: 'showErrorMessageTooltip'
	            });
			}

		},

		validateAccountNicknameFocusOut: function(){

			var accountNickname = this.model.lens('accountNickname').get();

			if( !this.isValidAccountNickname( accountNickname ) ){
				this.output.emit('state', {
					elementId: 'account_nickname',
	                value: 'addErrorHighlight'
	            });
			}else{
				this.output.emit('state', {
					elementId: 'account_nickname',
	                value: 'removeErrorHighlight'
	            });
			}

			this.validateFormFields();
		},

		validateAccountNicknameFocus: function( accountNickname ){

			if( accountNickname === '' || accountNickname === null || accountNickname === undefined ){
				return;
			}

			if( !this.isValidAccountNickname( accountNickname ) ){
				var errorMessage = this.locale['ADD_FUNDING_ACCOUNT.account_nickname_error.bad_characters'];
				this.model.lens('accountNicknameError').set( errorMessage );
	        	this.output.emit('state', {
					elementId: 'account_nickname',
					errorMessageName: 'accountNicknameError',
	                value: 'showErrorMessageTooltip'
	            });
			}
		},

		requestRoutingNumberHelpMessage: function(){
			this.output.emit('state', {
	            value: 'requestRoutingNumberHelpMessage'
	        });
		},

		exitRoutingNumberHelpMessage: function(){

			this.output.emit('state', {
	            value: 'exitRoutingNumberHelpMessage'
	        });
		},

		addFundingAccount: function(){

			/**************************************************************
			* validObj STATE SET IN MODEL, CLIENT SIDE CHECK OF FORM INPUTS
			* @attrs: valid:bool, errors:array
			**************************************************************/
			var validObj = this.model.lens( 'valid' ).get();

			if( !validObj.valid ){

				var message = this.locale['MANAGE_FUNDING_ACCOUNTS_HEADER.update_funding_account_message.field_level_error'];
				message += '<br>' + validObj.errors.join('<br>');

				//set setting field
				//context.components.fundingAccountsHeaderComponent.model.lens('update_funding_account_message').set( message );

				controllerChannel.emit('trigger', {
					message: message,
					action:'UPDATE',
                	value: 'showFundingAccountMessage'
            	});

            	return;

			}

			var routingNumber = this.model.lens( 'routingNumber' ).get(),
			accountNumber = this.model.lens( 'accountNumber' ).get(),
			confirmAccount = this.model.lens( 'confirmedAccountNumber' ).get(),
			nickname = this.model.lens( 'accountNickname' ).get(),
			payeeId = context.components.fundingAccountsHeaderComponent.model.lens('currentPayeeId').get();

			var params = {
							routingNumber: routingNumber,
						  	account: accountNumber,
						  	confirmAccount: confirmAccount,
						  	nickname: nickname,
						  	payeeId: payeeId
						};


			context.addValidateServices.callService['addFundingAccount']( params )
			.then( function( data ){

				if( data.code === 'SUCCESS' ){

					//delete header component first
					controllerChannel.emit('trigger', {
		                target: this,
		                payeeId: payeeId,
		                defaultBehavior:true,
		                value: 'updateFundingAccount'
		            });

			        controllerChannel.emit('trigger', {
						message: {NICKNAME:data.nickname, ACCT:accountNumber},
						action:'ADD',
			            value: 'showFundingAccountMessage'
	            	});


		        }

			}.bind(this));

		},

		cancelAddFundingAccount: function(){

			context.state('/dashboard');

		},

		validateFormFields: function(){

			this.output.emit('state', {
	            	value: 'validateFormFields'
	        });

		}

	};

});
