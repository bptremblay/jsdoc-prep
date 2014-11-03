//Datatransform for updatePaymentDueDate

define(function(require) {
    var http = require('blue/http'),
        defaultNull = 'Not available',
        currency = '$';

    return {

        // Populate Entry data model
        getPDInitiate: function(paymentData) {

            paymentData.nickname = paymentData.nickname ? paymentData.nickname.toUpperCase() : defaultNull;
            paymentData.mask = paymentData.mask ? ' (' + paymentData.mask.toUpperCase().replace('X', '...') + ')' : defaultNull;
            paymentData.currentDueDate = paymentData.currentDueDate ? this.getNumberSuffix(this.getDayOnly(paymentData.currentDueDate)) : defaultNull;

            return paymentData;
        },
        getPDVerifyConfirm: function(paymentData) {

            paymentData.currentDueDate = paymentData.currentDueDate ? this.getNumberSuffix(this.getDayOnly(paymentData.currentDueDate)) : defaultNull;
            paymentData.requestedDueDate = paymentData.requestedDueDate ? this.getNumberSuffix(this.getDayOnly(paymentData.requestedDueDate)) : defaultNull;
            paymentData.nickname = paymentData.nickname ? paymentData.nickname.toUpperCase() : defaultNull;
            paymentData.mask = paymentData.mask ? ' (' + paymentData.mask.toUpperCase().replace('X', '...') + ')' : defaultNull;
            paymentData.primaryFullName = paymentData.primaryFullName ? this.getTitleCase(paymentData.primaryFullName) : defaultNull;

            return paymentData;
        },
        /**
         * Function to get string in Title Case
         * @function getTitleCase
         * @memberOf module:dataTransformPaymentDate
         **/
        getTitleCase: function(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },

        /**
         * Function to get the day from YYYYMMDD
         * @function getDayOnly
         * @param {String} [k] date
         * @memberOf module:dataTransformPaymentDate
         **/
        getDayOnly: function(k) {
            return Number(k.substr(6, 2));
        },

        /**
         * Function to get number suffix
         * @function getNumberSuffix
         * @memberOf module:dataTransformPaymentDate
         **/
        getNumberSuffix: function(number) {
            var j = number % 10,
                k = number % 100;
            if (j == 1 && k != 11) {
                return number + "st";
            }
            if (j == 2 && k != 12) {
                return number + "nd";
            }
            if (j == 3 && k != 13) {
                return number + "rd";
            }
            return number + "th";
        }
    };
});
