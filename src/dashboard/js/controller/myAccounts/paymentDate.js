define(function(require) {

    return function paymentDateController() {
        var controllerChannel = require('blue/event/channel/controller'),
            dynamicContentUtil = require('common/utility/dynamicContentUtil'),
            observable = require('blue/observable');

        this.init = function() {

            //page layout container
            this.layoutContainerSpec = require('blue-spec/dist/spec/layout');
            this.layoutContainerComponent = require('dashboard/component/myAccounts/mortgageExpanded');
            this.layoutContainerView = 'myAccounts/expandedContainer';
            //Change Payment Due Date Component Container
            this.paymentDateSpec = require('bluespec/update_payment_due_date');
            this.paymentDateComponent = require('dashboard/component/myAccounts/updatePaymentDueDate');
            //Cancel Payment Due Date Component Container
            this.cancelDateChangeSpec = require('bluespec/exit_update_payment_due_date_confirmation');
            this.cancelDateChangeComponent = require('dashboard/component/myAccounts/exitUpdatePaymentDueDateConfirmation');

            this.appChannel.on({
                'getUpdatePaymentDueDateBegin': function(inputData) {
                    this.getUpdatePaymentDueDateBegin(inputData);
                }.bind(this)
            });

            this.appChannel.on({
                'getUpdatePaymentDueDateInitiate': function(inputData) {
                    this.getUpdatePaymentDueDateInitiate(inputData);
                }.bind(this)
            });

            this.appChannel.on({
                'getUpdatePaymentDueDateVerify': function(inputData) {
                    this.getUpdatePaymentDueDateVerify(inputData);
                }.bind(this)
            });

            this.appChannel.on({
                'getUpdatePaymentDueDateConfirm': function(inputData) {
                    this.getUpdatePaymentDueDateConfirm(inputData);
                }.bind(this)
            });

            this.appChannel.on({
                'getUpdatePaymentDueDateCancel': function(inputData) {
                    this.getUpdatePaymentDueDateCancel(inputData);
                }.bind(this)
            });
        };

        this.index = function() {};

        //Trigger action -> getUpdatePaymentDueDateBegin
        this.getUpdatePaymentDueDateBegin = function(inputData) {
            var componentCollection = [];

            this.paymentDateServices.paymentDate['paymentDateServiceList']({
                'accountId': inputData.accountId
            }).then(function(data) {

                var layoutContainerModel = observable.Model({});

                this.register.components(this, [{
                    name: 'layoutContainer',
                    model: layoutContainerModel,
                    spec: this.layoutContainerSpec,
                    methods: this.layoutContainerComponent
                }]);

                componentCollection.push([this.components.layoutContainer, this.layoutContainerView, {
                    'target': '#content',
                    'react': true
                }]);

                //Begin Page
                var paymentDateBeginDataModel = observable.Model({
                    requestedDueDateFlag: data.statusCode,
                    accountId: inputData.accountId
                });

                this.register.components(this, [{
                    name: 'updatePaymentDueDateBegin',
                    model: paymentDateBeginDataModel,
                    spec: this.paymentDateSpec,
                    methods: this.paymentDateComponent
                }]);

                componentCollection.push([this.components.updatePaymentDueDateBegin, 'myAccounts/updatePaymentDueDateBegin', {
                    'append': false,
                    'react': true,
                    'target': '#containerContent'
                }]);
                this.executeCAV(componentCollection);
            }.bind(this));
        };

        //function for Due Date Initiation Page.
        this.getUpdatePaymentDueDateInitiate = function(inputData) {
            var componentCollection = [];

            this.paymentDateServices.paymentDate['paymentDateServiceList']({
                'accountId': inputData.accountId
            }).then(function(data) {

                var layoutContainerModel = observable.Model({}),
                    paymentData = {};

                this.register.components(this, [{
                    name: 'layoutContainer',
                    model: layoutContainerModel,
                    spec: this.layoutContainerSpec,
                    methods: this.layoutContainerComponent
                }]);

                componentCollection.push([this.components.layoutContainer, this.layoutContainerView, {
                    'target': '#content',
                    'react': true
                }]);

                //get data from service in local object
                paymentData = this.dataTransformPaymentDate.getPDInitiate(data);

                //Initiate Page
                var paymentDateInitiateDataModel = observable.Model({
                    accountId: inputData.accountId,
                    requestedDueDate: paymentData.requestedDueDate,
                    dueDateOptions: paymentData.dueDateOptions
                });

                this.register.components(this, [{
                    name: 'updatePaymentDueDateInitiate',
                    model: paymentDateInitiateDataModel,
                    spec: this.paymentDateSpec,
                    methods: this.paymentDateComponent
                }]);

                this.components.updatePaymentDueDateInitiate.paymentDueDate = paymentData.currentDueDate;
                this.components.updatePaymentDueDateInitiate.accountName = paymentData.nickname;
                this.components.updatePaymentDueDateInitiate.accountMaskNumber = paymentData.mask;

                //Setting the current due date in view
                this.components.updatePaymentDueDateInitiate.output.emit('state', {
                    target: this,
                    value: 'setCurrentDate',
                    currentDueDate: paymentData.currentDueDate
                });
                //Setting the available options for next due date in viee
                if (paymentData.dueDateOptions) {
                    //Select Date from the list
                    this.components.updatePaymentDueDateInitiate.output.emit('state', {
                        target: this,
                        value: 'setDate'
                    });

                    for (var key in paymentData.dueDateOptions){
                    	this.components.updatePaymentDueDateInitiate.output.emit('state', {
                            target: this,
                            value: 'dueDateList',
                            dateList: key
                        });
                    }
                }
                //setting the previously selected date on back button
                if (inputData.nextPaymentDueDate) {
                    this.components.updatePaymentDueDateInitiate.output.emit('state', {
                        target: this,
                        value: 'checkDateList',
                        requestedDueDate: parseFloat(inputData.nextPaymentDueDate)
                    });
                }

                dynamicContentUtil.dynamicContent.set(this.components.updatePaymentDueDateInitiate, 'payment_due_date_message', {
                    accountName: paymentData.nickname,
                    accountMaskNumber: paymentData.mask
                });

                componentCollection.push([this.components.updatePaymentDueDateInitiate, 'myAccounts/updatePaymentDueDateInitiate', {
                    'append': false,
                    'react': true,
                    'target': '#containerContent'
                }]);
                this.executeCAV(componentCollection);
            }.bind(this));
        };

        //function for Due Date Verify Page.
        this.getUpdatePaymentDueDateVerify = function(inputData) {
            var componentCollection = [];

            this.paymentDateServices.paymentDate['paymentDateServiceVerify']({
                'accountId': inputData.accountId,
                'requestedDueDate': inputData.dueDateOptions[inputData.nextPaymentDueDate]
            }).then(function(data) {

                var layoutContainerModel = observable.Model({});

                this.register.components(this, [{
                    name: 'layoutContainer',
                    model: layoutContainerModel,
                    spec: this.layoutContainerSpec,
                    methods: this.layoutContainerComponent
                }]);

                componentCollection.push([this.components.layoutContainer, this.layoutContainerView, {
                    'target': '#content',
                    'react': true
                }]);

                //Initiate Page
                var paymentDateVerifyDataModel = observable.Model({
                    accountId: inputData.accountId,
                    formId: data.formId
                });

                //get data from service in local object
                paymentData = this.dataTransformPaymentDate.getPDVerifyConfirm(data);

                this.register.components(this, [{
                    name: 'updatePaymentDueDateVerify',
                    model: paymentDateVerifyDataModel,
                    spec: this.paymentDateSpec,
                    methods: this.paymentDateComponent
                }]);

                this.components.updatePaymentDueDateVerify.accountName = paymentData.nickname;
                this.components.updatePaymentDueDateVerify.accountMaskNumber = paymentData.mask;
                this.components.updatePaymentDueDateVerify.paymentDueDate = paymentData.currentDueDate;
                this.components.updatePaymentDueDateVerify.nextPaymentDueDate = paymentData.requestedDueDate;
                this.components.updatePaymentDueDateVerify.primaryBorrowerName = paymentData.primaryFullName;

                componentCollection.push([this.components.updatePaymentDueDateVerify, 'myAccounts/updatePaymentDueDateVerify', {
                    'append': false,
                    'react': true,
                    'target': '#containerContent'
                }]);
                this.executeCAV(componentCollection);
            }.bind(this));
        };

        //Function for due date verification page
        this.getUpdatePaymentDueDateConfirm = function(inputData) {
            var componentCollection = [];

            this.paymentDateServices.paymentDate['paymentDateServiceConfirm']({
                'accountId': inputData.accountId,
                'formId': inputData.formId
            }).then(function(data) {

                var layoutContainerModel = observable.Model({});

                this.register.components(this, [{
                    name: 'layoutContainer',
                    model: layoutContainerModel,
                    spec: this.layoutContainerSpec,
                    methods: this.layoutContainerComponent
                }]);

                componentCollection.push([this.components.layoutContainer, this.layoutContainerView, {
                    'target': '#content',
                    'react': true
                }]);

                //Initiate Page
                var paymentDateConfirmDataModel = observable.Model({
                    accountId: inputData.accountId
                });

                //get data from service in local object
                paymentData = this.dataTransformPaymentDate.getPDVerifyConfirm(data);

                this.register.components(this, [{
                    name: 'updatePaymentDueDateConfirm',
                    model: paymentDateConfirmDataModel,
                    spec: this.paymentDateSpec,
                    methods: this.paymentDateComponent
                }]);

                this.components.updatePaymentDueDateConfirm.accountName = paymentData.nickname;
                this.components.updatePaymentDueDateConfirm.accountMaskNumber = paymentData.mask;
                this.components.updatePaymentDueDateConfirm.paymentDueDate = paymentData.currentDueDate;
                this.components.updatePaymentDueDateConfirm.nextPaymentDueDate = paymentData.requestedDueDate;
                this.components.updatePaymentDueDateConfirm.primaryBorrowerName = paymentData.primaryFullName;

                componentCollection.push([this.components.updatePaymentDueDateConfirm, 'myAccounts/updatePaymentDueDateConfirm', {
                    //'append': true,
                    'append': false,
                    'react': true,
                    'target': '#containerContent'
                }]);
                this.executeCAV(componentCollection);
            }.bind(this));

        };

        //Trigger action -> getUpdatePaymentDueDateCancel
        this.getUpdatePaymentDueDateCancel = function(inputData) {
            var componentCollection = [];

            var layoutContainerModel = observable.Model({});

            this.register.components(this, [{
                name: 'layoutContainer',
                model: layoutContainerModel,
                spec: this.layoutContainerSpec,
                methods: this.layoutContainerComponent
            }]);

            componentCollection.push([this.components.layoutContainer, this.layoutContainerView, {
                'target': '#content',
                'react': true
            }]);

            //Cancel Page
            var paymentDateCancelDataModel = observable.Model({
                accountId: inputData.accountId
            });

            this.register.components(this, [{
                name: 'updatePaymentDueDateCancel',
                model: paymentDateCancelDataModel,
                spec: this.cancelDateChangeSpec,
                methods: this.cancelDateChangeComponent
            }]);

            componentCollection.push([this.components.updatePaymentDueDateCancel, 'myAccounts/exitUpdatePaymentDueDateConfirmation', {
                'append': false,
                'react': true,
                'target': '#containerContent'
            }]);
            this.executeCAV(componentCollection);
        };

    };
});
