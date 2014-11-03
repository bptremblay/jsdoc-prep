define(function(require) {
    return function updatePaymentDueDateInitiateView() {

        this.template = require('dashboard/template/myAccounts/updatePaymentDueDateInitiate');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/updatePaymentDueDateInitiate'));

        this.init = function() {

            this.bridge.on('state/setDate', function() {
                $("td").hover(
                    function() {
                        $(this).addClass("hover");
                    },
                    function() {
                        $(this).removeClass("hover");
                    }
                );
                $("#nextLabel").prop("disabled",true);

                $("td").click(function(event) {
                    $("td").removeClass("active");
                    $(event.currentTarget).addClass("active");

                    if ($(event.currentTarget).is('.select')) {
                        this.settings.eventTarget.nextPaymentDueDate = $(event.currentTarget).text();
                        $("#nextLabel").addClass("info");
                        $("#nextLabel").prop("disabled",false);
                    }
                }.bind(this));

            });

            this.bridge.on('state/dueDateList', function(data) {
                var dateClass = '.num-' + data.dateList;
                $(dateClass).addClass("select");
            });

            this.bridge.on('state/checkDateList', function(data) {
                var checkDateClass = '.num-' + data.requestedDueDate;
                $("td").removeClass("active");
                $(checkDateClass).addClass("active");
                $("#nextLabel").addClass("info");
                $("#nextLabel").prop("disabled", false);
            });

            this.bridge.on('state/setCurrentDate', function(data) {
                var dueDateClass = '.num-' + parseFloat(data.currentDueDate);
                $(dueDateClass).removeClass("select");
                $(dueDateClass).addClass("current");
            });
        };
    };
});
