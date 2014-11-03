define(function(require) {

    return function HeaderView() {
        var settings = require('dashboard/settings');
        this.template = require('dashboard/template/header/header');

        this.init = function() {

            this.bridge = this.createBridge(require('dashboard/view/webspec/header/topMenu'));
            this.bridge.on('state/showMegaMenu', this.showMegaMenu.bind(this));
            this.preLoader();
            this.changeStyle();

        };

        this.preLoader = function() {
            $(document).ajaxStop(function() {
                $('.overlay, #pre-loader').hide();
                // $(document).scrollTop(0);
            });
        };
        //Function to show Mega Menu
        this.showMegaMenu = function(){
            $('body').toggleClass('hidden-menu');
        };

        this.changeStyle = function() {
            $('#style1').attr('href', settings.smartAdminStyle1);
            $('#style2').attr('href', settings.smartAdminStyle2);
            $('body').css('height', '100%');
        };
    };
});
