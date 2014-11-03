define(function(require) {

	return {

				addFundingAccountMessage: '',
				checkImageFront:'',
				//routing_number_label locale data passed into partial field
				routingNumberHelpMessage:'',
				routingNumberError:'',
				//account_number_label locale data passed into partial field
				accountNumberError:'',
				//confirmed_account_number_label local data passed into partial field
				confirmedAccountNumberError:'',
				//account_nickname_label local data passed into partial field
				accountNicknameAdvisory:'',
				accountNicknameError:'',
				//cancel_add_funding_account_label local data passed into partial button
				//add_funding_account_label local data passed into partial button

				//helpers
				validRoutingNumberServerSide: true,
				payeeId:'', //get set from funding account header component select dropdown
				valid:{
						valid:false,
						errors:[]
				},

				routingNumber:
				{
					label: '',
					info:true,
					inputs: [{
						text: {
							id: 'routing_number',
							classes: '',
							name: '',
							value: '',
							maxlength: 9,
							placeholder: ''
							}
						}]
				},

				accountNumber:
				{
					label: '',
					inputs: [{
						text: {
							id: 'account_number',
							classes: '',
							name: '',
							value: '',
							maxlength: 17,
							placeholder: ''
							}
						}]
				},
				confirmedAccountNumber:
				{
					label: '',
					inputs: [{
						text: {
							id: 'confirmed_account_number',
							classes: '',
							name: '',
							value: '',
							maxlength: 17,
							placeholder: ''
							}
						}]
				},
				accountNickname:
				{
					label: 'Create account nickname',
					//prompt: '',
					inputs: [{
						text: [{
							id: 'account_nickname',
							classes: 'no-bottom',
							name: '',
							value: '',
							maxlength: 32,
							placeholder: ''
							}]
						}]
				},


				actions:[
				{
					id: 'cancel_add_funding_account',
					classes: '',
					type: 'button',
					label: '',
					disabled: false,
					adatext: '<string>'
				},
				{
					id: 'add_funding_account',
					classes: '',
					type: 'button',
					label: '',
					disabled: true,
					adatext: '<string>'
				}
				]

		};

})
