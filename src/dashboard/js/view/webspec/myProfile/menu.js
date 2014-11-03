define({
	'name': 'MY_PROFILE_MENU',
	'bindings': {},
	'triggers': {
		'select_my_overview':{
			action: 'selectMyOverview',
			type: 'HTML',
			preventDefault: true
		},
		'select_my_phone_details':{
			action: 'selectMyPhoneDetails',
			type: 'HTML',
			preventDefault: true
		},		
		'select_my_email_details':{
			action: 'selectMyEmailDetails',
			type: 'HTML',
			preventDefault: true
		},
		'select_my_mailing_address_details':{
			action: 'selectMyMailingAddressDetails',
			type: 'HTML',
			preventDefault: true
		},
		'select_my_account_settings':{
			action: 'selectMyAccountSettings',
			type: 'HTML',
			preventDefault: true
		},
		'select_my_paperless_settings':{
			action: 'selectMyPaperlessSettings',
			type: 'HTML',
			preventDefault: true
		},
		'select_my_travel_settings':{
			action: 'selectMyTravelSettings',
			type: 'HTML',
			preventDefault: true
		},
		'manage_my_alerts':{
			action: 'manageMyAlerts',
			type: 'HTML',
			preventDefault: true
		},
		'update_my_alerts_delivery_settings':{
			action: 'updateMyAlertsDeliverySettings',
			type: 'HTML',
			preventDefault: true
		},
		'request_my_alerts_history':{
			action: 'requestMyAlertsHistory',
			type: 'HTML',
			preventDefault: true
		}		
	}
});
