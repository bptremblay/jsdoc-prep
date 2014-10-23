define(["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"jpui transparent fluid navigation bar\">\n    <div class=\"row\">\n      <div class=\"col-xs-5\">\n        <div class=\"offcanvas left menu trigger\">\n          <i class=\"fa fa-bars\"></i>\n        </div>\n        <div class=\"jpui separated left menu hide-xs show-md\">\n          <ul>\n            <li><a href=\"#\">test</a></li>\n          </ul>\n        </div>\n      </div>\n      <div class=\"col-xs-2\">\n\n      </div>\n      <div class=\"col-xs-5\">\n        <div class=\"right search trigger\">\n          <i class=\"fa fa-search\"></i>\n        </div>\n        <div class=\"jpui right menu hide-xs show-md\">\n          <ul>\n            <li>test</li>\n          </ul>\n        </div>\n      </div>\n  </div>\n</div>\n";
  }); });