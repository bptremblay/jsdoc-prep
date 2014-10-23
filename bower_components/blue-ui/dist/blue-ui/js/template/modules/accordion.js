define(["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"jpui expandable panels\">\r\n   <div class=\"active\">\r\n     <a href=\"#panel1\">Group Item #1</a>\r\n   </div>\r\n   <div id=\"panel1\" class=\"jpui panel body\">\r\n     Item #1 content\r\n   </div>\r\n   <div>\r\n     <a href=\"#panel2\">Group Item #2</a>\r\n   </div>\r\n   <div id=\"panel2\" class=\"jpui panel body\">\r\n     Item #2 content\r\n   </div>\r\n   <div>\r\n     <a href=\"#panel3\">Group Item #3</a>\r\n   </div>\r\n   <div id=\"panel3\" class=\"jpui panel body\">\r\n     Item #3 content\r\n   </div>\r\n</div>\r\n";
  }); });