define(function() {
    var context = null;
    return {
        init: function() {
            context = this.settings.context;
        },
        requestAccountActivity: function(inputData) {
            // InputData will contain a context object when method initiated by a DOM event
            if (inputData.context) {
                inputData.accountId = this.model.lens('accountId').get();
            }
            context.makeActivityCall(inputData);
        },
        sortBy: function() {

        },
        exportAccountActivity: function() {

        },
        printAccountActivity: function() {

        },
        toggleAccountActivityDisplay: function() {
            var currentClassName = this.model.lens('activityTableClassName').get(),
                currentToggleName = this.model.lens('toggleAccountActivityDisplay').get(),
                activityTableClassName = (currentClassName === 'jpui table' ? 'jpui table show-detailed' : 'jpui table'),
                activityTableToggleDisplayName = (currentToggleName === 'See Details' ? 'Hide Details' : 'See Details');

            this.model.lens('activityTableClassName').set(activityTableClassName);
            this.model.lens('toggleAccountActivityDisplay').set(activityTableToggleDisplayName);

            context.executeCAV_SharedMortgageAndLoanActivity(this.model.get());
        }
    };
});
