define(function() {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
            $(document).ajaxStop(function() {
                $('.overlay, #pre-loader').hide();
            });

            $('#style1').attr('href', context.settings.get('smartAdminStyle1'));
            $('#style2').attr('href', context.settings.get('smartAdminStyle2'));
            $('body').css('height', '100%');
        }
    };
});