define(["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				<li>\n					<a href=\"javascript:undefined\" data-href=\"#"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.link)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"f-menu__heading\">"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n					<ul>\n						";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</ul>\n				</li>\n			";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n							<li><a href=\"javascript:undefined\" data-href=\"#";
  if (helper = helpers.link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a></li>\n						";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n\n\n				<div class=\"f-menu-bar\">\n					<span class=\"f-menu-toggle f-icon-menu\"></span>\n				</div>\n\n				<h1 data-toggle=\"details\" id=\"";
  if (helper = helpers.link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">"
    + escapeExpression(((stack1 = (data == null || data === false ? data : data.key)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n\n				";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n			";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n\n					<div class=\"f-item-group\" id=\"";
  if (helper = helpers.link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n\n						<div class=\"f-item-heading-group\" data-toggle=\"details\">\n							<span class=\"f-item-heading\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n							<div class=\"f-item-toggles\">\n								<span class=\"f-toggle f-icon-code\" data-toggle-control=\"code\" title=\"toggle code\"></span>\n							</div>\n						</div>\n\n						<div class=\"f-item-notes\">\n							";
  if (helper = helpers.notes) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.notes); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n						</div>\n\n						<div class=\"f-item-preview\">\n							";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.renderStatic), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n							";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.renderStatic), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n						</div>\n\n						<div class=\"f-item-code f-item-hidden\" data-toggle=\"code\">\n							<pre><code class=\"language-markup\">";
  if (helper = helpers.html) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.html); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</code></pre>\n							<pre><code class=\"language-javascript\">"
    + escapeExpression(((stack1 = (depth0 && depth0.json)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</code></pre>\n						</div>\n\n					</div>\n\n				";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n								";
  if (helper = helpers.html) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.html); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n							";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n								<div id=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "Component\"></div>\n							";
  return buffer;
  }

  buffer += "<div id=\"blue-ui-documentation\">\n	<nav class=\"f-menu\" role=\"navigation\">\n		<svg style=\"margin:30px;\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" id=\"Layer_1\" x=\"0px\" y=\"0px\" width=\"30px\" height=\"30px\" viewBox=\"0 0 268 268\" xml:space=\"preserve\" xmlns:xml=\"http://www.w3.org/XML/1998/namespace\">\n			<path style=\"fill:#FFFFFF;\" d=\"M100.749,8.655c-4.88,0-8.86,3.968-8.86,8.844v62.095h164.04L181.227,8.69L100.749,8.655\"></path>\n			<path style=\"fill:#FFFFFF;\" d=\"M261.945,98.372c0-4.884-3.947-8.82-8.875-8.82h-62.052V253.6l70.896-74.726L261.945,98.372\"></path>\n			<path style=\"fill:#FFFFFF;\" d=\"M172.177,259.538c4.864,0,8.86-3.965,8.86-8.845v-62.099H16.989l74.678,70.943H172.177\"></path>\n			<path style=\"fill:#FFFFFF;\" d=\"M10.996,169.848c0,4.896,3.933,8.829,8.832,8.829h62.111V14.629L10.996,89.362V169.848\"></path>\n		</svg>\n		<div class=\"f-controls\">\n			<div class=\"f-icon-details f-active\" data-toggle-control=\"details\" title=\"toggle details\"></div>\n			<div class=\"f-icon-code\" data-toggle-control=\"code\" title=\"toggle code\"></div>\n		</div>\n\n		<ul>\n			<li>\n				<a href=\"javascript:undefined\" data-href=\"#overview\" class=\"f-menu__heading f-active\">Overview</a>\n				<ul>\n					<li><a href=\"javascript:undefined\" data-href=\"#definitions\">Definitions</a></li>\n					<li><a href=\"javascript:undefined\" data-href=\"#grid-system\">Grid System</a></li>\n\n				</ul>\n			</li>\n			";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</ul>\n	</nav>\n\n\n	<div class=\"f-container\">\n		<div class=\"f-main\">\n\n			<div id=\"overview\">\n				<div class=\"f-menu-bar\">\n\n				</div>\n\n				<h1 class=\"f-header\">Blue UI<span class=\"f-menu-toggle f-icon-menu\"></span></h1>\n\n				<p class=\"push-down\">A powerful library to empower designers and devlopers to utilize the same language using a shared library.</p>\n				<a href=\"https://stash-digital.jpmchase.net/projects/JF/repos/blue-ui/browse\" target=\"_blank\">\n					<button class=\"jpui info button\">View on stash</button>\n				</a>\n				<a href=\"mailto:brian.j.mccune@chase.com?subject=Blue%20UI%20Stash%20Access&body=SID:\" target=\"_blank\">\n					<button class=\"jpui button\">Request Stash Access</button>\n				</a>\n				<h2>Colors</h2>\n\n				<div class=\"f-color-chip f-color-chip--primary\">\n					<div class=\"f-color-chip__name\">Dark</div>\n					<div class=\"f-color-chip__color\">#3d3734</div>\n				</div>\n\n				<div class=\"f-color-chip f-color-chip--primary\">\n					<div class=\"f-color-chip__name\">Darker</div>\n					<div class=\"f-color-chip__color\">#26201C</div>\n				</div>\n\n				<div class=\"f-color-chip f-color-chip--primary margin-bottom\">\n					<div class=\"f-color-chip__name\">Light</div>\n					<div class=\"f-color-chip__color\">#f4f1ea</div>\n				</div>\n\n				<br>\n\n				<div class=\"f-color-chip\">\n					<div class=\"f-color-chip__name\">default</div>\n					<div class=\"f-color-chip__color\">#eeeeee</div>\n				</div>\n\n				<div class=\"f-color-chip\">\n					<div class=\"f-color-chip__name\">primary</div>\n					<div class=\"f-color-chip__color\">#0B6EFD</div>\n				</div>\n\n				<div class=\"f-color-chip\">\n					<div class=\"f-color-chip__name\">success</div>\n					<div class=\"f-color-chip__color\">#128842</div>\n				</div>\n\n				<div class=\"f-color-chip\">\n					<div class=\"f-color-chip__name\">info</div>\n					<div class=\"f-color-chip__color\">#126BC5</div>\n				</div>\n\n				<div class=\"f-color-chip\">\n					<div class=\"f-color-chip__name\">warning</div>\n					<div class=\"f-color-chip__color\">#AF4317</div>\n				</div>\n\n				<div class=\"f-color-chip\">\n					<div class=\"f-color-chip__name\">error</div>\n					<div class=\"f-color-chip__color\">#BF2155</div>\n				</div>\n				<div class=\"f-item-group\" id=\"definitions\">\n					<div class=\"f-item-heading-group\" data-toggle=\"details\">\n						<span class=\"f-item-heading\">Definitions</span>\n					</div>\n				<p>Blue UI has 3 UI Definitions. These are useful patterns for describing re-usable parts of a website</p>\n				<h3>Definition Types</h3>\n				<ul>\n					<li>Elements\n						<p>A basic building block of a website, exists alone or in small groups.</p>\n					</li>\n					<li>Modules\n						<p>An element where it's behavior defines it.</p>\n					</li>\n					<li>Collections\n						<p>A group of several elements that work together to solve a problem</p>\n					</li>\n				</ul>\n			</div>\n			<div class=\"f-item-group\" id=\"grid-system\">\n				<div class=\"f-item-heading-group\" data-toggle=\"details\">\n					<span class=\"f-item-heading\">Grid System</span>\n				</div>\n				<p>Using a single set of <code>.col-md-*</code> grid classes, you can create a basic grid system that starts out stacked on mobile devices and tablet devices (the extra small to small range) before becoming horizontal on desktop (medium) devices. Place grid columns in any <code>.row</code>.\n			<div class=\"container show grid\">\n				<div class=\"row\">\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n					<div class=\"col-md-1\"><span>1 Column</span></div>\n				</div>\n				<div class=\"row\">\n					<div class=\"col-md-2\"><span>2 Column</span></div>\n					<div class=\"col-md-2\"><span>2 Column</span></div>\n					<div class=\"col-md-2\"><span>2 Column</span></div>\n					<div class=\"col-md-2\"><span>2 Column</span></div>\n					<div class=\"col-md-2\"><span>2 Column</span></div>\n					<div class=\"col-md-2\"><span>2 Column</span></div>\n				</div>\n				<div class=\"row\">\n					<div class=\"col-md-3\"><span>3 Column</span></div>\n					<div class=\"col-md-3\"><span>3 Column</span></div>\n					<div class=\"col-md-3\"><span>3 Column</span></div>\n					<div class=\"col-md-3\"><span>3 Column</span></div>\n				</div>\n				<div class=\"row\">\n					<div class=\"col-md-4\"><span>4 Column</span></div>\n					<div class=\"col-md-4\"><span>4 Column</span></div>\n					<div class=\"col-md-4\"><span>4 Column</span></div>\n				</div>\n				<div class=\"row\">\n					<div class=\"col-md-6\"><span>6 Column</span></div>\n					<div class=\"col-md-6\"><span>6 Column</span></div>\n				</div>\n				<div class=\"row\">\n					<div class=\"col-md-4\"><span>4 Column</span></div>\n					<div class=\"col-md-8\"><span>8 Column</span></div>\n				</div>\n			</div>\n\n			<h2>Responsive Grid</h2>\n				<div class=\"container show grid\">\n					<div class=\"row\">\n						<div class=\"col-xs-6\"><span>6 Column</span></div>\n						<div class=\"col-xs-6\"><span>6 Column</span></div>\n					</div>\n					<div class=\"row\">\n						<div class=\"col-xs-12 col-sm-2 col-md-3 col-lg-4\"><span>4 Column</span></div>\n						<div class=\"col-xs-12 col-sm-10 col-md-9 col-lg-8\"><span>8 Column</span></div>\n					</div>\n				</div>\n			</div>\n		</div>\n			<hr/>\n\n			";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n		</div>\n	</div>\n</div>\n";
  return buffer;
  }); });