define(function() {
    var flag = false,
        context = null,
        nextPageFlag = true;

    // NOTE: bind to "this" while calling
    function updateActivity(activityType, data, sortStyle){
    	var sortedData;
    	if (data.length){
    		// sortedData = this.context.parent.util.array.sort(data, sortComparator);
    		sortedData = this.context.parent.util.array.sort(data, function(a, b){
    			if (sortStyle === 'ASC'){
    				return a.date - b.date;
    			}else{
    				return b.date - a.date;
    			}
			});

			this[activityType] = (sortStyle === 'ASC'?
			sortedData.concat(this[activityType]):
	    	this[activityType].concat(sortedData));
    	}

    }

    return {
        init: function() {
            context = this.settings.context;
        },
        list: function(inputData) {
            var svcType, activityData = {
                    name: inputData.accountName ? inputData.accountName : this.model.get().accountName,
                    mask: inputData.accountMask ? inputData.accountMask : this.model.get().accountMask
                },
                groupData, unSupportedAccountTypes = ['INVESTMENT'],
                accountId = inputData.accountId ? inputData.accountId : this.model.get().accountId,
                accountType = inputData.accountType ? inputData.accountType : this.model.get().accountType,
                accountTypeMapper = context.statusCodeMapper.getAccountsMessage('ACCOUNT_TYPE_MAPPER'),
                initialLoad = inputData.accountId ? true : false;

            if (inputData.accountId) {
                this.model.lens('accountName').set(inputData.accountName);
                this.model.lens('accountMask').set(inputData.accountMask);
                this.model.lens('accountId').set(inputData.accountId);
                this.model.lens('accountType').set(inputData.accountType);
            }

            if (unSupportedAccountTypes.indexOf(accountType) === -1 && nextPageFlag) {
                context.dataTransform.showOverlay();
                svcType = accountTypeMapper[accountType] || accountTypeMapper.DEFAULT;
                context.activityServices.activity[svcType.activitySvc]({
                    'accountId': accountId,
                    'pageId': this.nextPageId ? this.nextPageId : ''
                }).then(function(data) {
                        groupData = context.dataTransform.activityGroupList(data.result, accountType, initialLoad);
                        activityData.error = (groupData.pendingData.list !== null || groupData.postedData.list !== null) ? null : 'error';
                        updateActivity.call(this, "pendingActivity", groupData.pendingData.list, this.model.get()["pendingActivitySortStyle"]);
                        updateActivity.call(this, "postedActivity", groupData.postedData.list, this.model.get()["postedActivitySortStyle"]);
                        this.nextPageId = data.nextPageId ? data.nextPageId : false;
                        nextPageFlag = this.nextPageId;
                    }.bind(this),
                    function(jqXHR) {
                        if (jqXHR.statusText === 'timeout' || jqXHR.status === 500) {
                            activityData.noInfo = true;
                        }
                    }.bind(this));

            } else {
                activityData.noInfo = true;
            }
        },
        reverseOrder: function(data) {
        	// Assuming we are only sorting on Date currently,
        	// the DOM contains data that is already sorted before
        	// appending, we do not require to re-sort a sorted array,
        	// only reverse should be sufficient.
        	this[data.dataPath].reverse();
        	this.model.get()[data.dataPath + "SortStyle"] === 'DES' ?
            this.model.lens(data.dataPath + "SortStyle").set("ASC"):
            this.model.lens(data.dataPath + "SortStyle").set("DES");
        },
        // sortDate: function(data) {
        //     flag = !flag;
        //     this.postedActivity = this.context.parent.util.array.sort(this.postedActivity, function(a, b) {
        //         return flag ? a.date - b.date : b.date - a.date;
        //     });
        // },
        selectTransactionDetails: function() {

        }
    };
});
