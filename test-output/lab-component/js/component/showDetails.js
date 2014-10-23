define(function() {
  return {
    /**
     * Init.
     */
    init: function() {
      console.log("Show Details Component Init");
    },
    /**
     * Show details.
     * @param data
     */
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