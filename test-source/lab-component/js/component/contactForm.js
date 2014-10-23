define(function() {

    return {
        init: function() {
            console.log("Contact Form Component Init");
        },
//        entry: function(data) {
//            this.chkBox = data.chkBox;
//            this.dropDown = data.dropDown;
//            this.txtBox = data.txtBox;
//
//                
//            console.log('Contact Form Component entry()');
//            console.log('Check Box:', this.chkBox);
//            console.log('Car:', this.dropDown);
//            console.log('Text:', this.txtBox);
//
//
//            this.output.emit('state', {
//                target: this,
//                value: 'index'
//            });
//        },
        submit: function(data) {
            console.log('Contact Form Component submit()');
            console.log('Check Box:', this.chkBox);
            console.log('Car:', this.dropDown);
            console.log('Text:', this.txtBox);
        },
    };
});
