/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module EmailDataTransform
 **/
define(function(require) {

	return function EmailDataTransform(settings) {

		return {
			transformEmailListService: function(dataIn){
				var dataOut = {
					emailHeaderComponent: {
						addAllowed: dataIn.addAllowed
					},
					emailComponent:{
						emailAddresses: [],
						groupId: dataIn.groupId
					}
				};
				dataOut.emailComponent.emailAddresses.push(this.transformEmail(dataIn.primaryEmail, 'PRIMARY'));

				dataIn.secondaryEmails.forEach(function(email){
					dataOut.emailComponent.emailAddresses.push(this.transformEmail(email, 'SECONDARY'));	
				}.bind(this));

				return dataOut;
			},
			transformEmail: function(dataIn, emailCategory){
				return {
					id: dataIn.id,
					emailAddress: dataIn.emailAddress,
		    		updateAllowed: dataIn.updateAllowed,
		    		deleteAllowed : dataIn.deleteAllowed,
		    		associatedAccounts: this.transformAssociatedAccounts(dataIn.associatedAccounts),
					emailAddressCategory: emailCategory				
				};
			},
			transformAssociatedAccounts: function(dataIn){
				var dataOut = [];
				dataIn && dataIn.forEach(function(account){
					dataOut.push({
						id: account.Id,
						mask: account.id === -1 ? account.mask.replace(/,/g, '<br>') : account.mask
					});
				});
				return dataOut;
			}
		};
	};
});