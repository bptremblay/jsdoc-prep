define(function(require) {

	var bridge = require('blue/bridge').create(
					require('dashboard/view/webspec/payments/manageFundingAccounts/addFundingAccount'),
					{}
				 ),

	componentChannel = require('blue/event/channel/component'),

	localeSettings = require('blue/settings'),
	modalPadding = 24,

	template = require('blue/template');

	template.registerPartial('field', require('dashboard/template/payments/manageFundingAccounts/common/field'));
	template.registerPartial('button', require('dashboard/template/payments/manageFundingAccounts/common/button'));

	return function view() {

		this.template = require('dashboard/template/payments/manageFundingAccounts/addFundingAccount');

		//this.template = require('dashboard/template/payments/manageFundingAccounts/addFundingAccountNoPartials');

		this.bridge = new bridge({
			targets: {
				/*****************************************
				* 1) WEB SPEC: TRIGGER OBJ NAME
				* 2) HTML TARGET: CSS CLASS OR ID IN HBS FILE
				******************************************/

           	 	'cancel_add_funding_account':'#cancel_add_funding_account,#close_add_funding_account',
           	 	'add_funding_account':'#add_funding_account',
           	 	'request_routing_number_help_message':'#routing_number_advisory_icon',
           	 	'exit_routing_number_help_message':'#advisory_tooltip .close',

           	 	'validateFormFields':'#routing_number,#account_number,#confirmed_account_number,#account_nickname',

           	 	'validateRoutingNumberFocus':'#routing_number',
           	 	'validateRoutingNumberFocusOut':'#routing_number',

           	 	'validateAccountNumberFocus':'#account_number',
           	 	'validateAccountNumberFocusOut':'#account_number',

           	 	'validateConfirmedAccountNumberFocus':'#confirmed_account_number',
           	 	'validateConfirmedAccountNumberFocusOut':'#confirmed_account_number',

           	 	'validateAccountNicknameFocus':'#account_nickname',
           	 	'validateAccountNicknameFocusOut':'#account_nickname',

           	 	//data fields in hbs & spec
           	 	'routing_number': '#routing_number',
           	 	'account_number': '#account_number',
           	 	'confirmed_account_number': '#confirmed_account_number',
           	 	'account_nickname': '#account_nickname'
			}
		});

		this.init = function(){

			this.locale = localeSettings.get('LOCALIZED_CONTENT', localeSettings.Type.PERM);

			var scope = this;

            this.bridge.on('state/validateFormFields', function(data) {
				scope.validateFormFields();
            });

            this.bridge.on('state/updateAccountNicknameInput', function(data) {
				scope.updateAccountNicknameInput();
            });

            this.bridge.on('state/exitRoutingNumberHelpMessage', function(data) {
				scope.exitRoutingNumberHelpMessage();
            });

            this.bridge.on('state/requestRoutingNumberHelpMessage', function(data) {
				scope.requestRoutingNumberHelpMessage();
            });

            this.bridge.on('state/cancelAddFundingAccount', function(data) {
				scope.cancelAddFundingAccount();
            });

            this.bridge.on('state/addErrorHighlight', function( data ) {
				scope.addErrorHighlight( data );
            });

            this.bridge.on('state/removeErrorHighlight', function( data ) {
				scope.removeErrorHighlight( data );
            });

            this.bridge.on('state/showErrorMessageTooltip', function( data ) {
				scope.showErrorMessageTooltip( data );
            });

            //hack until we switch to ractive
            // 10/29/14 - tjd
            this.bridge.on('state/removeHbsObject', function( data ) {
				scope.removeHbsObject( data );
            });

		};

		this.hideErrorTooltip = function(){
			var errorTooltip = this.$element.find('#error_tooltip');
			errorTooltip.addClass('hide');
		}

		this.addErrorHighlight = function( data ){

			var elementInput = this.$element.find( '#' + data.elementId ),
			elementLabel = elementInput.closest('.field').find('dt');

			this.hideErrorTooltip();
			elementInput.addClass('not-valid');
			elementLabel.addClass('not-valid');
		};

		this.removeErrorHighlight = function( data ){

			var elementInput = this.$element.find( '#' + data.elementId ),
			elementLabel = elementInput.closest('.field').find('dt');

			this.hideErrorTooltip();
			elementInput.removeClass('not-valid');
			elementLabel.removeClass('not-valid');
		};

		this.showErrorMessageTooltip = function( data ){

			var elementInput = this.$element.find( '#' + data.elementId ),
			position = elementInput.position(),
			errorTooltip = this.$element.find('#error_tooltip'),
			padding = 8,
			message = this.component.model.lens( data.errorMessageName ).get();

			console.log( 'data.errorMessageName: ', data.errorMessageName );
			console.log( 'showErrorMessageTooltip: ', this.component.model.get() );

			errorTooltip.find('.message').html( message );

			if( data.elementId !== 'routing_number' ){
				padding = modalPadding;
			}

			var top = position.top - ( errorTooltip.height() + padding );
			errorTooltip.css({top:top}).removeClass('hide');

		};

		this.updateAccountNicknameInput = function(){

			var accountNicknameInput = this.$element.find('#account_nickname'),
			accountNickname = this.component.model.lens('accountNickname').get();

			accountNicknameInput.val( accountNickname );

		};

		this.validateFormFields = function(){

			var valid = true,
			routingNumberInput = this.$element.find('#routing_number'),
			accountNumberInput = this.$element.find('#account_number'),
			confirmedAccountNumberInput = this.$element.find('#confirmed_account_number'),
			accountNicknameInput = this.$element.find('#account_nickname');

			if( !routingNumberInput.val().length ){
				valid = false;
			}else if( !accountNumberInput.val().length ){
				valid = false;
			}else if( !confirmedAccountNumberInput.val().length ){
				valid = false;
			}else if( !accountNicknameInput.val().length ){
				valid = false;
			}

			if( valid ){
				this.enableAddFundingAccountButton();
			}else{
				this.disableAddFundingAccountButton();
			}

		};

		this.enableAddFundingAccountButton = function(){
			this.validateAddFundingAccountBeforeRequest();
			this.$element.find('#add_funding_account').prop('disabled', false).addClass('info');
		};

		this.disableAddFundingAccountButton = function(){
			this.$element.find('#add_funding_account').prop('disabled', true).removeClass('info');
		};

		this.exitRoutingNumberHelpMessage = function(){

			var advisoryTooltip = this.$element.find('#advisory_tooltip');
			advisoryTooltip.addClass('hide');

		};

		this.requestRoutingNumberHelpMessage = function(){

			var routingNumberAdvisoryIcon = this.$element.find('#routing_number_advisory_icon'),
			advisoryTooltip = this.$element.find('#advisory_tooltip'),
			position = routingNumberAdvisoryIcon.position(),
			message = this.component.model.lens('routing_number_message').get();

			advisoryTooltip.find('.message').html( message );

			var top = position.top + 33;

			advisoryTooltip.css({top:top}).removeClass('hide');

		};

		this.validateAddFundingAccountBeforeRequest = function(){

			/**************************************************
			* UPDATES DATE ADDFUNDINGACCOUNT MODEL
			**************************************************/

			var routingNumberInput = this.$element.find('#routing_number'),
			accountNumberInput = this.$element.find('#account_number'),
			confirmedAccountNumberInput = this.$element.find('#confirmed_account_number'),
			accountNicknameInput = this.$element.find('#account_nickname'),
			errors = [],
			valid = {valid:true, errors:[]};

			if( routingNumberInput.hasClass('not-valid') ){
				errors.push( this.component.model.lens('routing_number_label').get() );
			}

			if( accountNumberInput.hasClass('not-valid') ){
				errors.push( this.component.model.lens('account_number_label').get() );
			}

			if( confirmedAccountNumberInput.hasClass('not-valid') ){
				errors.push( this.component.model.lens('confirmed_account_number_label').get() );
			}

			if( accountNicknameInput.hasClass('not-valid') ){
				errors.push( this.component.model.lens('account_nickname_label').get() );
			}

			if( errors.length ){
				valid.errors = errors;
				valid.valid = false;
			}

			//set the model
			this.component.model.lens( 'valid' ).set( valid );

			console.log( 'valid: ', valid );

		};

		this.cancelAddFundingAccount = function(){

			var element = this.$element.parent();
			element.empty();
		};

		/******************************
		* HACKS!!!
		********************************/
		this.removeHbsObject = function(){

			var routingNumberInput = this.$element.find('#routing_number'),
			accountNumberInput = this.$element.find('#account_number'),
			confirmedAccountNumberInput = this.$element.find('#confirmed_account_number'),
			accountNicknameInput = this.$element.find('#account_nickname');

			routingNumberInput.val('');
			accountNumberInput.val('');
			confirmedAccountNumberInput.val('');
			accountNicknameInput.val('');

		};

	};
});
