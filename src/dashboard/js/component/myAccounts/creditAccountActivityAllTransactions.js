define(function() {

	var context = null;

	return {
		init: function() {
			context = this.settings.context;
		},
		requestAccountActivity: function(inputData) {
			this.transactions = inputData.data.list;
		},
		requestTransactionDetails: function(currentRow) {
    		var cardDetails,
    		rowReference = currentRow.dataPath,
           	accountId = this.model.get().accountId,
           	accountType = this.model.get().accountType,
            transactionId = currentRow.context.transactionId,
            currentLabelText = currentRow.domEvent.currentTarget.innerHTML,
        	svcType = context.serviceNameMapper.getServiceNames('ACCOUNT_TYPE_MAPPER')[accountType],
        	requestParams = {
        		'accountId': accountId,
		        'transactionId': transactionId.replace('_', '#')  //TODO: put the # back in transaction id
        	};

	        if (currentLabelText === 'See details') {
		    		context.activityServices.activity[svcType.activityDetailSvc](requestParams).then(function(details) {

	               	cardDetails = context.dataTransform.cardTransactionDetails(details);
	               	this.model.lens(rowReference + '.transactionRewards').set(cardDetails.transactionRewards);
	               	this.model.lens(rowReference + '.merchantAddress').set(cardDetails.merchantAddress);
	               	this.model.lens(rowReference + '.totalTransactionRewardsEarned').set(cardDetails.totalTransactionRewardsEarned);
	               	this.model.lens(rowReference + '.transactionChannel').set(cardDetails.transactionChannel);
	               	this.model.lens(rowReference + '.transactionNumber').set(cardDetails.transactionNumber);
	               	this.model.lens(rowReference + '.blink').set(cardDetails.blink);
		      	}.bind(this));
      		} else {
      			this.model.lens(rowReference + '.merchantAddress').set('');
      		}

      		//expand the see details section
    		this.output.emit('state', {
                target: this,
                value: 'transactionDetailsHidden',
                transactionId: transactionId
        	});
		}
	};
});
