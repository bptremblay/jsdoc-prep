define(function(require) {

	var bridge = require('blue/bridge').create(
					require('dashboard/view/webspec/payments/manageFundingAccounts/manage_funding_accounts_menu'),
					{}
				 );

	return function view() {

		this.template = require('dashboard/template/payments/manageFundingAccounts/manageFundingAccountsMenu');

		this.bridge = new bridge({
			targets: {
				/*****************************************
				* 1) WEB SPEC: TRIGGER OBJ NAME
				* 2) HTML TARGET: CSS CLASS OR ID IN HBS FILE
				******************************************/

           	 	'addPaymentAccount':'#add_payment_account',
           	 	'editPaymentAccount':'#edit_payment_account'
			}
		});

		this.init = function(){
			var scope = this;
            this.bridge.on('state/selectMenuItem', function(data) {
            	var itemId = data.itemId;
				scope.selectMenuItem( itemId );
            });
		};

		this.selectMenuItem = function( itemId ){
			var menuItems = this.$target.find('.manageFundingAccounts').find('.list li');

			menuItems.each( function(){
				if( $(this).attr('id') === itemId ){
					$(this).addClass('selected');
				}else{
					$(this).removeClass('selected');
				}
			});
		};

	};
});
