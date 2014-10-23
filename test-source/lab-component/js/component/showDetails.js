define(function() {
    return {
        init: function() {
            console.log("Show Details Component Init");
        },
        showDetails: function(data) {
            console.log('Show Details Component showDetails()');
            this.chkBoxVal = data.chkBoxVal;
            this.dropDownVal = data.dropDownVal;
            this.txtBoxVal = data.txtBoxVal;
            
            console.log('Check Box:', this.chkBoxVal);
            console.log('Car:', this.dropDownVal);
            console.log('Text:', this.txtBoxVal);
            
        }
    };
});
