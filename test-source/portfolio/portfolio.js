requirejs.config({
    paths: {
        "gallery_dao": "js/gallery_dao",
        "gallery_model": "js/gallery_model",
        "gallery_view": "js/gallery_view",
        "messages": "js/messages"
    },

    shim: {
        //        "backbone" : {
        //            deps : [],
        //            exports : function($, _, text) {
        //                return Backbone;
        //            }
        //        },
    }
});


require(['gallery_dao', 'gallery_model', 'gallery_view'], function(Dao, Model, View) {
    'use strict';

    function log(msg) {
        try {
            if (window.console != null) {
                window.console.log(msg);
            }
        } catch (e) {
            window.alert(e.message);
        }
    }


    log('portfolio main loaded');

    Model.initialize();

});
