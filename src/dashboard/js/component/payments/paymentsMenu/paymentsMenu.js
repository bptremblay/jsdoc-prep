define(function(require) {

    var context = null,
        localeSettings = require('blue/settings'),
        componentChannel = require('blue/event/channel/component'),
        controllerChannel = require('blue/event/channel/controller');

    return {

        init: function() {

        	this.locale = localeSettings.get('LOCALIZED_CONTENT', localeSettings.Type.PERM);
        	componentChannel.on({
                'state/paymentMenuOptionSelected': function(data) {
                	var navigation = this.model.get().navigation;

		            this.model.lens('focused').set(true);
		            for (var i in navigation) {
		                if (data.menuId === i) {
		                    navigation[i].active = true;
		                } else {
		                    navigation[i].active = false;
		                }

		            }
		            this.model.lens('navigation').set(navigation);
                }.bind(this)});
        },
        buildMenu: function() {
  			context = this.settings.context;
  			var scope = this;

        	var	specName = this.spec.name;

        	context.sharedPrivilegesServices.paymentMenu['shared.privilege.list']({
                //context: 'dashboard_payments_menu'
                context: 'dashboard_everyday_menu'
            }).then( function(data) {
                if (data.code == "SUCCESS")
                {


                	this.paymentMenuOptionsNav = this.model.get().paymentMenuOptions;

                	var opts = this.getOptions(data,this.getMenuAssociations(this.model.get().associations));

		        	if (this.paymentMenuOptionsNav != undefined)
		        	{
		        		for (var i in this.paymentMenuOptionsNav)
		        		{
		        			if (opts.indexOf(this.paymentMenuOptionsNav[i].id) > -1)
		        			{
		        				var id = this.paymentMenuOptionsNav[i].id;
		        				this.paymentMenuOptionsNav[i].label = this.getLocaleValue(this.getLabelBase(specName,id),scope.model.get().labelSuffixes);
		      					this.paymentMenuOptionsNav[i].show = true;
		        			}
		        			else if (this.paymentMenuOptionsNav[i].submenu != undefined)
		        			{
	        					for (var j in this.paymentMenuOptionsNav[i].submenu)
	        					{
	        						if (opts.indexOf(this.paymentMenuOptionsNav[i].submenu[j].id) > -1)
	        						{
	        							var id = this.paymentMenuOptionsNav[i].submenu[j].id;
				        				this.paymentMenuOptionsNav[i].submenu[j].label = this.getLocaleValue(this.getLabelBase(specName,id),scope.model.get().labelSuffixes);
				      					this.paymentMenuOptionsNav[i].submenu[j].show = true;
				      					this.paymentMenuOptionsNav[i].show = true;
	        						}
	        					}
		        			}
		        		}
		        	}


                }


               // this.model.lens('paymentMenuOptions').set(this.paymentMenuOptionsNav);
                this.model.lens('payment_menu_options').set(this.paymentMenuOptionsNav);
		            controllerChannel.emit('trigger', {
		                target: this,
		                value: 'showPaymentMenu'
		            });

            }.bind(this));
            return true;
        },
        localeExists: function(label) {


        	if (this.locale[label] != undefined)
        		return true;
        	else
        		return false;
        },
        getMenuAssociations: function(data) {
        	var returnArr = new Array();
        	for (var i in data)
        	{
        		if (data[i].name != undefined && data[i].association != undefined)
        		{
        			returnArr[data[i].name] = data[i].association;
        		}
        	}

        	return returnArr;
        },
        getLocaleValue: function(key,suffixes) {

        	for (var i in suffixes)
        	{
        		if (this.localeExists(key + suffixes[i].suffix))
        		{
        			return this.locale[key + suffixes[i].suffix];
        		}
        	}

        	return '';

        },
        getOptions: function(data,items) {
        	var opts = new Array();
        	if (data.menuItems != undefined)
        	{
        		for (var i in data.menuItems)
        		{
        			if (items[data.menuItems[i].name] != undefined)
        			{
        				opts.push(items[data.menuItems[i].name]);
        			}
        		}
        	}

        	return opts;
        },
        getLabelBase: function(specName, id) {
        	return specName + '.' + id;
        },
        payBills: function() {

        	context.goURL('#' + this.paymentMenuOptionsNav['payBills'].link);

        	return true;
            //context.state(context.settings.get('paymentMenuInstance').navigation['payBills'].link);
        },
        menuClickHandler: function(e) {
        	this[e.context.id](e);

        },
        requestPaymentActivity: function() {
        	context.goURL('#' + this.paymentMenuOptionsNav['paymentsActivity'].link);

            //context.state(context.settings.get('paymentMenuInstance').navigation['paymentActivity'].link);
        },
        addFundingAccounts: function() {
        	return true;
            //context.state(context.settings.get('paymentMenuInstance').navigation['payBills'].link);
        },
        manageFundingAccounts: function() {
        	context.goURL('#dashboard/manageFundingAccounts');
        	return true;
            //context.state(context.settings.get('paymentMenuInstance').navigation['payBills'].link);
        },
        paymentMenuAdditionalOptions: function(e) {

        	this.output.emit('state', {
                target: this,
                value: 'toggleAdditionalMenu',
                event: e



		    });

        },
        requestMorePaymentMenuOptions: function() {

        },
        manageExternalAccounts: function() {
        	return true;
        },
        sendMoney: function() {
            context.goURL('#' + this.paymentMenuOptionsNav['sendMoney'].link);
        },
        /*
        transferMoney: function() {
            context.state(context.settings.get('paymentMenuInstance').navigation['transferMoney'].link);
        },*/

        activePaymentMenuTab: function(data) {

        },
        inactivePaymentMenuTab: function() {
        	/*
            var navigation = this.model.get().navigation;
            this.model.lens('focused').set(false);
            for (var i in navigation) {
                navigation[i].active = false;

                navigation[i].inactive = false;

            }
            this.model.lens('navigation').set(navigation);
            */
        }
    };
});
