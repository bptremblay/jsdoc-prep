define(function(require) {

    var context = null,
        controllerChannel = require('blue/event/channel/controller');

    return {
        init: function() {
            context = this.settings.context;
        },
        selectMore: function() {
            console.log('select_more called', arguments);
        },
        refreshBalance: function(accountId) {
            var inputData = {
                    'accountId': accountId
                },
                account = context.dataTransform.objectClone(this.model.get());
            context.summaryServices.summary['accounts.dashboard.summary.refresh.svc'](inputData).then(function(latestAccountData) {
                account = context.dataTransform.replaceLatestData(account, latestAccountData);
                if (account) {
                    this.accountBalance = account.accountBalance;
                    this.lastUpdatedAt = account.lastUpdatedAt;

                    if (context.firstValidAccountId === null) {
                        context.firstValidAccountId = accountId;
                        this.showDetails();
                    }
                }
            }.bind(this));
        },
        showDetails: function() {
            var inputData = this.model.get();

            if (context.firstValidAccountId !== inputData.accountNumber) {
                context.state(context.settings.get('dashboardUrl') + '/accounts/index/' + inputData.accountNumber);
            }

            controllerChannel.emit('getDetails', {
                accountId: inputData.accountNumber,
                accountType: inputData.accountType,
                accountName: inputData.name,
                accountMask: inputData.mask
            });

            //Todo: Call activity controller using event channel
            controllerChannel.emit('setAccountActivity', {
                accountId: inputData.accountNumber,
                accountType: inputData.accountType,
                accountName: inputData.name,
                accountMask: inputData.mask
            });

            //Add Active class
            this.output.emit('state', {
                target: this,
                value: 'makeAsActive',
                accountId: inputData.accountNumber
            });
        }
    };
});