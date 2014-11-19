define(function() {

    var context = null;
    return {
        init: function() {
            context = this.settings.context;
        },
        showSearchOptions: function() {},
        search: function() {
            var modelData = {
                searchText: '',
                showOptions: true,
                thingsToDo: 'Here are some things you can do:',
                executableActions: {
                    sendMoney: {
                        key: '/dashboard/payments/index/sendMoney',
                        value: 'Send money'
                    },
                    requestMoney: {
                        key: '',
                        value: 'Request money'
                    },
                    transferMoney: {
                        key: '/dashboard/payments/index/transferMoney',
                        value: 'Transfer money'
                    },
                    payBills: {
                        key: '/dashboard/payments/index/payBills',
                        value: 'Pay bills'
                    },
                    transaction: {
                        key: '',
                        value: 'Find a transaction'
                    },
                    findATM: {
                        key: '',
                        value: 'Find the nearest ATM'
                    }
                },
                allActions: {
                    sendMoney: 'Send money',
                    requestMoney: 'Request money',
                    transferMoney: 'Transfer money',
                    paybills: 'Pay bills',
                    transaction: 'Find a transaction',
                    findATM: 'Find the nearest ATM'
                },
                typeText: 'Or, type something like this:',
                payGordon: 'Pay Gordon $20 from my checking account',
                groceries: 'How much did I spend on groceries last month?'
            };
            this.searchData = modelData;
        },
        hideSearchOptions: function() {
            this.searchData = {
                showOptions: false,
                searchText: 'This is more than just an ordinary search bar.'
            };
        },
        triggerSuggestedAction: function() {
            context.model.lens('searchData').set({});
        }
    };
});