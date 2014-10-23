define(["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<select>\n    <optgroup label=\"Account Summary\">\n        <option  selected=\"selected\">Personal Account Summary</option>\n        <option>Business Account Summary</option>\n    </optgroup>\n    <optgroup label=\"Personal Account Summary\">\n        <option>Saving Account</option>\n        <option>Checking Account</option>\n        <option>Personal loan Account</option>\n    </optgroup>\n    <optgroup label=\"Business Account Summary\">\n        <option>Business Acoount</option>\n        <option>Investment Account </option>\n    <optgroup>\n</select>";
  }); });