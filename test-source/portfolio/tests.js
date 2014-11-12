requirejs.config({
    paths: {
        "gallery_dao": "js/gallery_dao",
        "logger": "js/logger",
        "gallery_model": "js/gallery_model",
        "gallery_view": "js/gallery_view",
        "info_panel": "js/info_panel",
        "slide_panel": "js/slide_panel",
        "thumbnail_panel": "js/thumbnail_panel",
        "messages": "js/messages",
        "contextual_carousel": "js/contextual_carousel"
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
