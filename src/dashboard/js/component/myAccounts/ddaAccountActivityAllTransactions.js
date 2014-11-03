define(function(require) {
    var context = null;
    return {
        init: function() {
            context = this.settings.context;
        },
        requestAccountActivity: function(inputData) {
        	this.transactions = inputData.data.list;
        	var filterData = this.model.lens('filterInputData').get();
        	if(filterData) {
    		    var specificTransactionTypeOnly = context.dataTransform.specificTransactionTypeOnlyCriteria(filterData);
				var transactionTypeAndOtherFilters = context.dataTransform.transactionTypeAndOtherCriteria(filterData);
                if (transactionTypeAndOtherFilters) {
                    this.output.emit('state', {
                        target: this,
                        value: 'additionalCriteria'
                    });
                }
                else if (specificTransactionTypeOnly) {
                    this.output.emit('state', {
                        target: this,
                        value: 'noAdditionalCriteria'
                    });
                }
        	}
        },
    	requestImage: function() {
    	},
    	printImage: function() {
    	},
    	enlargeImage: function() {
    	},
    	downloadImage: function() {
    	},
    	createPdfOfImage: function() {
    	},
    	seeTransactionDetails: function() {
    	},
    	sortTransactions: function() {
    	}
    };
});
