define(["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"pagination\">\n  <span class=\"disabled\">Prev</span>\n  <span class=\"active\">1</span>\n    <a href=\"#\" rel=\"next\">2</a>\n    <a href=\"#\">3</a>\n    <a href=\"#\">4</a>\n    <span class=\"gap\"> . . . </span>\n    <a href=\"#\">11</a>\n    <a href=\"#\">12</a>\n    <a href=\"#\" rel=\"next\" class=\"jpui-next_page\">Next</a>\n</div>\n";
  }); });