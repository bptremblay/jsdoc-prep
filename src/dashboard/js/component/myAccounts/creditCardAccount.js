define(function(require) {

    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        requestAccountSummary: function(updatedInfo) {
            this.accountCurrentBalance = updatedInfo.accountBalance;
            this.accountClosedInd = updatedInfo.accountClosedInd;
        },
        requestAccountInformation: function(accountId) {
            var data = context.dataTransform.accountModelData(this.model.get());

            if(data.accountClosedInd === true){
            	context.appChannel.emit('closedAccountMsg', {
                	accountType: data.accountType
            	});
            }else{
	            context.appChannel.emit('getDetails', data);
            }
            context.appChannel.emit('setAccountActivity', data);

            //Add Active class
            this.output.emit('state', {
                target: this,
                value: 'makeAsActive',
                accountId: data.accountId
            });
        }
    };
});
