
//creating a GET form service to be returned in the absence of the REST API
define(function () {
    return function FormServiceCreator() {
        this.serviceCalls = {
            getFormDetails: {
                settings: {
                	type: 'GET'
                }
            }
        };
    };
});
