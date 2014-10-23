define(["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return " <table class=\"jpui table\">\n   <thead>\n     <tr>\n       <th scope=\"col\">Date</th>\n       <th scope=\"col\">Type</th>\n       <th scope=\"col\">Description</th>\n       <th scope=\"col\">Debit</th>\n       <th scope=\"col\">Credit</th>\n       <th scope=\"col\">Balance</th>\n     </tr>\n   </thead>\n   <tbody>\n     <tr>\n       <td scope=\"row\">02/20/2014</td>\n       <td>Deposit</td>\n       <td>DEPOSTI ID NUMBER 11111</td>\n       <td>&nbsp;</td>\n     <td>$2.00</td>\n       <td>$22.39</td>\n     </tr>\n     <tr>\n       <td scope=\"row\">02/02/2014</td>\n       <td>Check</td>\n       <td>CHECK #100</td>\n       <td>$89,950.00</td>\n       <td>&nbsp;</td>\n       <td>$744.00</td>\n     </tr>\n     <tr>\n       <td scope=\"row\">02/20/2014</td>\n       <td>Deposit</td>\n       <td>DEPOSTI ID NUMBER 23322</td>\n       <td>&nbsp;</td>\n       <td>$9.00</td>\n       <td>$18,700.02</td>\n     </tr>\n  </tbody>\n</table>\n";
  }); });