define(function(require) {

    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },

        requestAmortizationEstimator: function() {
            console.log('foo');
        },
        requestInterestRateDetails: function() {
            console.log('foo');
        }
    };
});
