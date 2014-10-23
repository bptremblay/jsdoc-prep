define('blue-ui/main',{
	target  : 'body',
	appName : 'blue-ui',
	settings: {
		module: 'blue/settings',
		init: {
			set: [{
					module: 'blue-ui/settings'
				},
				'APP'
			]
		}
	},
	controllers: {
		create: 'blue/registry/controller',
		properties: {
			index: {
				create: {
					module: 'blue/controller',
					args: {
						module: 'blue-ui/controller/index'
					}
				},
				properties: {
					elementObserver: {
                        $ref: 'elementObserver'
                    }
				}
			}
		}
	},
	viewResolver: {
		create: 'blue/resolver/module',
		properties: {
			prefix: 'blue-ui/view/'
		}
	},
	logger: {
		create: {
			module: 'blue/log',
			args: '[blue-ui]'
		}
	},
	controllerNameMapping: {
		create: 'blue/mvc/handler/mapping/controllerName'
	},
	simpleSelectorMapping: {
		create: {
			module: 'blue/mvc/mapper/mapping/simplePattern',
			args: {
				'index.index' : 'body'
			}
		}
	},
	shellInterceptor: {
		module: 'blue/mvc/handler/interceptor/shell'
	},
	elementObserver: {
        create: {
            module: 'blue-ui/lib/elementObserver',
            args: [{}]
        }
    },
	handler: {
		create: {
			module: 'blue/mvc/handler',
			args: [{
                //JDW: Shell interceptor used for app change, only one app currently in blueUI so it is not needed.
				// interceptors: [{
				// 	$ref: 'shellInterceptor'
				// }]
			}]
		},
		properties: {
			mappings: [{
				$ref: 'controllerNameMapping'
			}]
		}
	},
	targeter: {
		create: 'blue/mvc/targeter',
		properties: {
			mappings: [{
				$ref: 'simpleSelectorMapping'
			}]
		}
	},
	$plugins: [{
		module: 'blue/wire/log',
		trace: false
	}]
})
;
define('blue-ui/settings',[],function () {
	return {
		'settingsType': 'settings.Type.APP'
	};
});

define('blue-ui/lib/doc-data',{

    'elements/alert.data' : {
      'alerts': [
        {
            'type'           : 'info',
            'message'        : 'You have a payment due soon.'
        },
        {
            'type'           : 'success',
            'message'        : 'You have successfully submited a payment.'
        },
        {
            'type'           : 'warning',
            'message'        : 'You have a payment due tomorrow.'
        },
        {
            'type'           : 'error',
            'message'        : 'You\'r payment is past due! '
        }
      ]
    },

	'elements/buttons.data' : [
		{
			'label': 'Primary'
		},
		{
			'classes': 'success',
			'label': 'Success'
		},
		{
			'classes': 'info',
			'label': 'Info'
		},
		{
			'classes': 'warning',
			'label': 'Warning'
		},
		{
			'classes': 'error',
			'label': 'Error'
		},
		{
			'classes': 'inverted',
			'label': 'Inverted'
		},
		{
			'classes': 'inverted success',
			'label': 'Inverted Success'
		},
		{
			'classes': 'inverted info',
			'label': 'Inverted Info'
		},
		{
			'classes': 'inverted warning',
			'label': 'Inverted Warning'
		},
		{
			'classes': 'inverted error',
			'label': 'Inverted Error'
		},
		{
			'classes': 'small',
			'label': 'Small Primary'
		},
		{
			'classes': 'success',
			'label': 'Medium Success'
		},
		{
			'classes': 'large inverted info',
			'label': 'Large Info'
		},
		{
			'classes': 'xlarge warning',
			'label': 'Extra Large warning'
		},
		{
            'id': 'UUID',
			'classes': 'large inverted',
			'type': 'button',
			'label': 'Disabled action',
			'disabled': true,
			'adatext': 'with ADA compliant description'
		}
	],
	'elements/labels.notes' : 'Labels give descriptions to other elements on a page<br/>Design: v0.1<br/>Ecat: Pending Review',
	'elements/labels.data' : {
		'labels': [
			{
				'content': 'Default Label'
			},
			{
				'type': 'pointing',
				'content': 'Default Pointing Label'
			},
			{
				'type': 'pointing below',
				'content': 'Pointing Below'
			},
			{
				'type': 'pointing left',
				'content': 'Pointing Left'
			},
			{
				'type': 'pointing right',
				'content': 'Pointing Right'
			},
			{
				'type': 'error pointing below',
				'content': 'Error Pointing Below'
			},
			{
				'type': 'inverted error pointing below',
				'content': 'Inverted Error Pointing Below'
			},
			{
				'type': 'small inverted error pointing below',
				'content': 'Small Inverted Error Pointing Below'
			},
			{
				'type': 'large inverted error pointing below',
				'content': 'Large Inverted Error Pointing Below'
			},
			{
				'type': 'x-large inverted error pointing below',
				'content': 'X-Large Inverted Error Pointing Below'
			}
		]
	},

	'elements/form.data' : {
		'form-id': 'loginForm',
	  'type': 'vertical',
	  'inputs': [
		{
			'label'        : 'User Id',
			'id'           : 'userId',
			'type'         : 'text',
			'name'         : 'user',
			'value'        : 'dpuser14',
			'placeholder'  : 'User Id'
		},
		{
			'label'        : 'Password',
			'id'           : 'password',
			'type'         : 'password',
			'name'         : 'password',
			'placeholder'  : 'password'
		},
		{
			'id'           : 'rememberMe',
			'type'         : 'checkbox'
		}
	  ],
	  'formbtns': [
		{
			'label':'Submit',
			'tag':'button',
			'type':'success',
			'action': 'submit'
		}
	  ]
	},
    'elements/headings.data' : {
        'headings': [
            {
                'level': '1',
                'text': 'This is a level 1 heading'
            },
            {
                'level': '2',
                'text': 'This is a level 2 heading'
            },
            {
                'level': '3',
                'text': 'This is a level 3 heading'
            },
            {
                'level': '4',
                'text': 'This is a level 4 heading'
            },
            {
                'level': '5',
                'text': 'This is a level 5 heading'
            },
            {
                'level': '6',
                'text': 'This is a level 6 heading'
            },
            {
                'level': '2',
                'color': 'blue',
                'inverted': 'true',
                'text': 'This is an inverted level 2 blue heading'
            }
        ]
    },

    'elements/input.notes' : 'Input candidates for text, date, and currency.<br/>Pending review<br />',
    'elements/input.data' : [
        {
            'id'            : 'input',
            'name'          : 'name_of_input',
            'type'          : 'text',
            'classes'       : '',
            'value'         : '',
            'placeholder'   : 'placeholder_text'
        },
        {
            'id'            : 'date_input',
            'name'          : 'name_of_date_input',
            'type'          : 'date',
            'classes'       : 'date',
            'value'         : '',
            'hasIcon'       : 'right',
            'rightIcon'     : 'calendar large'
        },
        {
            'id'            : 'currency_input',
            'name'          : 'name_of_currency_input',
            'type'          : 'number',
            'hasIcon'       : 'left',
            'currency'      : '$',
            'classes'       : 'currency',
            'value'         : '',
            'placeholder'   : '0.00'
        }
    ],

    'elements/textarea.notes' : 'Input candidate for textarea.<br/>Pending review<br />',
    'elements/textarea.data' : [
        {
            'id'            : 'textarea_input',
            'name'          : 'name_of_input',
            'classes'       : '',
            'value'         : '',
            'placeholder': 'placeholder_text'
        },
    ],

    'elements/icon.data' : {
      'icons': [
        {
            'type':         'envelope'
        },
        {
            'type':         'remove'
        },
        {
            'type':         'listarrow'
        },
        {
            'type':         'listview'
        },
        {
            'type':         'sortup'
        },
        {
            'type':         'sortdown'
        },
        {
            'type':         'unsorted'
        },
        {
            'type':         'alert'
        },
        {
            'type':         'alert circle'
        },
        {
            'type':         'checkmark'
        },
        {
            'type':         'checkmark circle'
        },
        {
            'type':         'checkmark rounded'
        },
        {
            'type':         'close'
        },
        {
            'type':         'download'
        },
        {
            'type':         'sortarrow'
        },
        {
            'type':         'linkedin'
        },
        {
            'type':         'upload'
        },
        {
            'type':         'menu'
        },
        {
            'type':         'expandup'
        },
        {
            'type':         'expanddown'
        },
        {
            'type':         'expandleft'
        },
        {
            'type':         'expandright'
        },
        {
            'type':         'lock'
        },
        {
            'type':         'calendar'
        },
        {
            'type':         'search'
        },
        {
            'type':         'list'
        },
        {
            'type':         'play'
        },
        {
            'type':         'grid'
        },
        {
            'type':         'printer'
        },
        {
            'type':         'facebook'
        },
        {
            'type':         'notification'
        },
        {
            'type':         'settings'
        },
        {
            'type':         'share'
        },
        {
            'type':         'email'
        },
        {
            'type':         'twitter'
        },
        {
            'type':         'large error envelope',
            'adatext':      'Mail Icon',
            'link':         'http://gmail.com'
        }
      ]
    },

    'elements/list.data' : {
      'items': [
        {
            'text'           : 'fNameField'
        },
        {
            'text'           : 'lNameField'
        },
        {
            'text'           : 'password'
        }
      ]
    },

    'elements/menu.data' : {
      'type': 'vertical',
      'firstlevel': [
        {
            'text':'DOCUMENTS',
            'url': '#',
            'state': 'active',
            'secondlevel':[
            {
                'text'  : 'Document center',
                'url'   : '#',
                'state': 'active',
                'thirdlevel':[
                {
                    'text'  : 'Document center',
                    'url'   : '#'
                },
                {
                    'text'  : 'Forms center',
                    'url'   : '#',
                    'state': 'active',
                    'fourthlevel':[
                    {
                        'text'  : 'Document center',
                        'url'   : '#',
                        'state': 'active'
                    },
                    {
                        'text'  : 'Forms center',
                        'url'   : '#'
                    }
                    ]
                }
                ]
            },
            {
                'text'  : 'Forms center',
                'url'   : '#'
            }
            ]
        },
        {
            'text':'CONTACT DETAILS',
            'url': '#'
        },
        {
            'text':'DEMOS',
            'url': '#'
        },
        {
            'text':'LEGAL DETAILS',
            'url': '#'
        },
        {
            'text':'LOG OFF',
            'url': '#'
        }
      ]
    },

    'elements/pagination.data' : {
      'type': 'vertical',
      'firstlevel': [
        {
            'text':'DOCUMENTS',
            'url': '#',
            'secondlevel':[
            {
                'text'  : 'Document center',
                'url'   : '#'
            },
            {
                'text'  : 'Forms center',
                'url'   : '#'
            }
            ]
        },
        {
            'text':'CONTACT DETAILS',
            'url': '#'
        },
        {
            'text':'DEMOS',
            'url': '#'
        },
        {
            'text':'LEGAL DETAILS',
            'url': '#'
        },
        {
            'text':'LOG OFF',
            'url': '#'
        }
      ]
    },

    'elements/panel.data' : {
      'type': 'vertical',
      'firstlevel': [
        {
            'text':'DOCUMENTS',
            'url': '#',
            'secondlevel':[
            {
                'text'  : 'Document center',
                'url'   : '#'
            },
            {
                'text'  : 'Forms center',
                'url'   : '#'
            }
            ]
        },
        {
            'text':'CONTACT DETAILS',
            'url': '#'
        },
        {
            'text':'DEMOS',
            'url': '#'
        },
        {
            'text':'LEGAL DETAILS',
            'url': '#'
        },
        {
            'text':'LOG OFF',
            'url': '#'
        }
      ]
    },

    'elements/paragraph.data' : {
      'type': 'vertical',
      'inputs': [
        {
            'id'           : 'fNameField',
            'label'        : 'First Name',
            'placeholder'  : 'Brian',
            'type'         : 'input',
            'columns'      : 'sm-4 md-6'
        },
        {
            'id'           : 'lNameField',
            'label'        : 'Last Name',
            'placeholder'  : 'McCune',
            'type'         : 'input',
            'columns'      : 'sm-4'
        },
        {
            'id'           : 'password',
            'label'        : 'Password',
            'placeholder'  : '',
            'type'         : 'password',
            'columns'      : 'sm-4'
        }
      ],
      'buttons': [
        {
            'label':'Submit',
            'tag':'button',
            'type':'success',
            'action': 'submit'
        }
      ]
    },

    'elements/table.data' : {
        'items': [
            {
                'date':'March 25, 2014',
                'transactions':[
                {
                    'name':    'Card Payment',
                    'message': 'Card Payment - Chase Joint Checking > Chase SAPPHIRE',
                    'type':    'negative',
                    'amount':  2435.51
                }
                ]
            },
            {
                'date':'March 24, 2014',
                'transactions':[
                {
                    'name':    'Bartell Drugs',
                    'message': 'Bill Payment - Chase Joint Checking',
                    'type':    'negative',
                    'amount':  520.18
                }
                ]
            },
            {
                'date':'March 23, 2014',
                'transactions':[
                {
                    'name':    'Trader Joes',
                    'message': 'Bill Payment - Chase Joint Checking',
                    'type':    'negative',
                    'amount':  50.23
                },
                {
                    'name':    'The Home Depot',
                    'message': 'Bill Payment - Chase Joint Checking',
                    'type':    'negative',
                    'amount':  100.28

                }
                ]
            },
            {
                'date':'March 22, 2014',
                'transactions':[
                {
                    'name':    'Turned off paper statements',
                    'message': 'Settings - Chase Premier Checking',
                    'type':    'activity'

                }
                ]
            },
            {
                'date':'March 21, 2014',
                'transactions':[
                {
                    'name':    'Allied Waste Service',
                    'message': 'Bill Payment - Chase Premier Checking',
                    'type':    'negative',
                    'amount':  104.05
                },
                {
                    'name':    'Puget Sound Energy',
                    'message': 'Bill Payment - Chase Premier Checking',
                    'type':    'negative',
                    'amount':  70.82

                }
                ]
            },
            {
                'date':'March 20, 2014',
                'transactions':[
                {
                    'name':    'State Farm Insurance',
                    'message': 'Bill Payment - Chase Premier Checking',
                    'type':    'negative',
                    'amount':  271.05

                }
                ]
            },
            {
                'date':'March 19, 2014',
                'transactions':[
                {
                    'name':    'Transfer',
                    'message': 'Bill Payment - Chase Premier Checking',
                    'type':    'positive',
                    'amount':  271.05
                },
                {
                    'name':    'Reported lost/stolen credit card',
                    'message': 'Account Services - Chase Premier Checking',
                    'type':    'activity'

                }
                ]
            },
            {
                'date':'March 18, 2014',
                'transactions':[
                {
                    'name':  'QuickPay Payment to Junghwa Kim',
                    'type':  'QuickPay - Chase Premier Checking',
                    'amount':100.05
                },
                {
                    'name':  'Starbucks',
                    'type':  'Charge - Chase SAPPHIRE',
                    'amount':7.05

                }
                ]
            },
            {
                'date':'March 17, 2014',
                'transactions':[
                {
                    'name':  'Starbucks',
                    'type':  'Charge - Chase SAPPHIRE',
                    'amount':7.05

                }
                ]
            },
            {
                'date':'March 16, 2014',
                'transactions':[
                {
                    'name':  'QuickPay Payment to Junghwa Kim',
                    'type':  'QuickPay - Chase Premier Checking',
                    'amount':100.05
                },
                {
                    'name':  'Starbucks',
                    'type':  'Charge - Chase SAPPHIRE',
                    'amount':7.05

                }
                ]
            },
            {
                'date':'March 15, 2014',
                'transactions':[
                {
                    'name':  'QuickPay Payment to Junghwa Kim',
                    'type':  'QuickPay - Chase Premier Checking',
                    'amount':100.05
                },
                {
                    'name':  'Starbucks',
                    'type':  'Charge - Chase SAPPHIRE',
                    'amount':7.05

                },
                {
                    'name':  'Starbucks',
                    'type':  'Charge - Chase SAPPHIRE',
                    'amount':7.05
                }
                ]
            }
        ]
    },

    'elements/tile.data' : {
        'accounts': [
            {
                'name': 'Chase Premier Checking',
                'number': '5678',
                'message': 'Present Balance',
                'type': 'active',
                'amount': '2,061.23'
            },
            {
                'name': 'Chase Savings',
                'number': '1234',
                'message': 'Present Balance',
                'type': '',
                'amount': '27,061.23'
            }
        ]
    },
	'modules/accordion.data' : {
	  'type': 'vertical',
	  'inputs': [
		{
			'id'           : 'fNameField',
			'label'        : 'First Name',
			'placeholder'  : 'Brian',
			'type'         : 'input',
			'columns'      : 'sm-4 md-6'
		},
		{
			'id'           : 'lNameField',
			'label'        : 'Last Name',
			'placeholder'  : 'McCune',
			'type'         : 'input',
			'columns'      : 'sm-4'
		},
		{
			'id'           : 'password',
			'label'        : 'Password',
			'placeholder'  : '',
			'type'         : 'password',
			'columns'      : 'sm-4'
		}
	  ],
	  'buttons': [
		{
			'label':'Submit',
			'tag':'button',
			'type':'success',
			'action': 'submit'
		}
	  ]
	},
    'modules/styledselect.notes': 'Styled select element',
    'modules/styledselect.data': {
        'selectId': 'select1',
        'styledSelectId': 'styledSelect1',
        'options': [
            {
                'name': 'Alpha',
                'value': '1',
                'selected': true
            },
            {
                'name': 'App',
                'value': '2'
            },
            {
                'name': 'Apple',
                'value': '3'
            },
            {
                'name': 'Delta',
                'value': '4'
            }
        ]
    },
    'modules/datepicker.notes': 'Calendar Template is optional.  Pass in a compiled template to override the default calendar template',
    'modules/datepicker.data' : {
        'datepickerId': 'datepicker1',
        'inputId': 'datepickerinput',
        'calendarTemplate': 'require(blue-ui/template/modules/calendar)'
    },
    'collections/transaction-table.notes' : 'Test <div class="bob">me</div> notes',
    'collections/transaction-table.data' : {
        'items': [
            {
                'date':'March 25, 2014',
                'name':    'Card Payment',
                'message': 'Card Payment - Chase Joint Checking > Chase SAPPHIRE',
                'type':    'negative',
                'amount':  2435.51,
                'balance': 53212.12
            },
            {
                'date':'Feb 14, 2014',
                'name':    'Interest Payment',
                'message': 'Misc_Credit',
                'amount':  0.08,
                'balance': 53212.12
            }
        ]
    },
    'collections/account-description.notes' : 'Test <div class="bob">me</div> notes',
    'collections/account-description.data' : {
        'items': [
            {
                'date':'March 25, 2014'
            },
            {
                'date':'Feb 14, 2014'
            }
        ]
    },
    'collections/navigation-bar.data' : {
        'right' : [
            {
                'type': 'vertical',
                'firstlevel': [
                    {
                        'text':'DOCUMENTS',
                        'url': '#',
                        'state': 'active'
                    }
                ]
            }
        ]
    },
    'utilities/alignment.data' : {
      'type': 'vertical'
    },
    'utilities/bold.data' : {
      'type': 'vertical'
    },
    'utilities/floats.data' : {
      'type': 'vertical'
    },
    'utilities/italics.data' : {
      'type': 'vertical'
    },
    'utilities/text-transform.data' : {
      'type': 'vertical'
    }
});

define('blue-spec/dist/spec/layout',[], function() { return {
  "name": "LAYOUT",
  "data": null,
  "actions": null,
  "settings": null,
  "states": null
}; });
define('blue-ui/component/utils',['require'],function (require) {
	return {
		isLeapYear: function(year) {
			return (year % 4 === 0) && (year % 100 !== 0) || (year % 400 === 0);
		},
		getFirstDayOfMonth: function(month, year) {
			return new Date(year, month, 1, 0, 0, 0, 0);
		},
		getNumberOfDaysInMonth: function(month, year) {
			return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		isTabbable: function($el) {
		    if ($el.is(":hidden") || $el.is(":disabled")) {
		        return false;
		    }

		    var tabIndex = $el.attr("tabindex");
		    tabIndex = isNaN(tabIndex) ? -1 : tabIndex;
		    return $el.is(":input, a[href], area[href], iframe") || tabIndex > -1;
		}
	}
});

define('blue-ui/template/modules/calendar',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1, helper;
  buffer += "\n		<table class=\"jpui calendar\">\n			<caption>\n				<h6 tabindex=\"-1\" class=\"hidden-header u-accessible-text\">Hidden Header</h6>\n				";
  stack1 = helpers['if'].call(depth0, (data == null || data === false ? data : data.first), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				<span class=\"jpui month\">";
  if (helper = helpers.monthName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.monthName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>&nbsp;<span class=\"jpui year\" style=\"display: none\">";
  if (helper = helpers.year) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.year); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n				";
  stack1 = helpers['if'].call(depth0, (data == null || data === false ? data : data.last), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</caption>\n			<thead>\n				<tr>\n					";
  stack1 = helpers.each.call(depth0, (depth1 && depth1.daysOfWeek), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				</tr>\n			</thead>\n			<tbody>\n				";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.weeks), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</tbody>\n		</table>\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n					<a tabindex=\"0\" id=\"prev\" title=\"Go to ";
  if (helper = helpers.previousMonthName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.previousMonthName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.year) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.year); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"class=\"jpui jpjs nav-button prev\" data-monthsToMove=\"-1\">\n						&lt;\n					</a>\n				";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n					<a tabindex=\"0\" id=\"next\" title=\"Go to ";
  if (helper = helpers.nextMonthName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nextMonthName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  if (helper = helpers.year) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.year); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"jpui jpjs nav-button next\" data-monthsToMove=\"1\">\n						&gt;\n					</a>\n				";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n						<th><span>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></th>\n					";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<tr>\n						";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.days), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					</tr>\n				";
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n							<td class=\"jpjs ";
  if (helper = helpers.className) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.className); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"";
  if (helper = helpers.tabIndex) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tabIndex); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"\n								data-date=\"";
  if (helper = helpers.dataAttr) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dataAttr); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-index=";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">";
  if (helper = helpers.day) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.day); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n						";
  return buffer;
  }

  buffer += "<div class=\"jpui calendars\">\n	";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.calendars), {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  }); });
define('blue-ui/component/datepicker',['require','blue/event/channel/component','blue-ui/component/utils','blue-ui/template/modules/calendar'],function (require) { // TODO: component needs to haave support for il8n
	var componentChannel = require('blue/event/channel/component'),
		Utils = require('blue-ui/component/utils'),
		context = null,
		self = null,
		getDaysOfWeek = function(length) {
			var nameLength;
			if(length) {
				nameLength = length <= 3 ? length : 2;
			} else {
				length = 2;
			}

			return [{name: "Sunday".substr(0, nameLength)},
					{name:"Monday".substr(0, nameLength)},
					{name:"Tuesday".substr(0, nameLength)},
					{name:"Wednesday".substr(0, nameLength)},
					{name:"Thursday".substr(0, nameLength)},
					{name:"Friday".substr(0, nameLength)},
					{name:"Saturday".substr(0, nameLength)}];
		},
		createCalendar = function(options, currentDate, selectedDate) {
			var date = currentDate,
					currentMonth = date.getMonth(),
					currentYear  = date.getFullYear(),
					i,
					month,
					year,
					calendarArray = [],
					monthName = ["January", "February", "March", "April",
								"May", "June", "July", "August",
								"September", "October", "November", "December"],
					nextMonthIndex,
					previousMonthIndex,
					titleYear;

			for(i = currentMonth - options.numberOfCalendars + 1; i <= currentMonth; ++i) {
				date.setMonth(i);
				month = date.getMonth();

				// Passing a negative number to setMonth moves
				// the month backwards, possibly changing the year.
				// so use the year that the calendar is on, not the current year
				if(i < 0) {
					!year && (year = date.getFullYear());
				} else {
					date.setFullYear(currentYear);
					year = currentYear;
				}

				nextMonthIndex = month + 1;
				previousMonthIndex = month - 1;
				if(month === 12) {
					nextMonthIndex = 0;
				} else if(month === 0) {
					previousMonthIndex = 11;
				}
				calendarArray.push({monthName: monthName[month],
									nextMonthName: monthName[nextMonthIndex],
									previousMonthName: monthName[previousMonthIndex],
									month: month,
									year: year,
									titleYear: titleYear,
									weeks: addDaysToCalendar(month, year, options, selectedDate)});

			}
			return calendarArray;
		},
		addDaysToCalendar = function(month, year, options, selectedDate) {
			var prevMonth = month === 0 ? 11 : month - 1,
				//date = new Date(month + "/01/" + year),
				dateString,
				days = [],
				weeks = [],
				day,
				i,
				d = Utils.getFirstDayOfMonth(month, year),
				nextMonthDayCount = 1,
				numberOfDaysInMonth = Utils.getNumberOfDaysInMonth(month, year),
				numberOfDaysInPrevMonth = Utils.getNumberOfDaysInMonth(prevMonth, year),
				dateClassNames = '',
				date,
				isDateSelected = false,
				tabIndex = -1;

			// Get days from previous month to fill in days
			// for first row of calendar
			for(i = 0; i < 7; ++i) {
				// fill in whole first row with days from previous month
				// if first day of month is on a Sunday
				if(d.getDay() === 0) {
					days.push({className: "other-month",
								dataAttr: "",
								day: numberOfDaysInPrevMonth - 6 + i
							});
				} else {
					// add days from previous month up to first day of current month
					(i < d.getDay()) && (days.push({
											className: "other-month",
											dataAttr: "",
											day: numberOfDaysInPrevMonth - d.getDay() + 1 + i
										}));
				}
			}

			// add complete 7 days to weeks array
			if(days.length === 7) {
				weeks.push({days: days});
				days = [];
			}

			for(i = 1; i <= numberOfDaysInMonth; ++i) {
				day = d.getDay();

				// Add leading zero to digits
				dateString = (month < 9 ? "0" : "") + ((month + 1)) + "/" +
							(i < 10 ? "0" : "") + i + "/" +
							year;

				date = new Date(year, month, i);
				isDateSelected = selectedDate.toDateString() === date.toDateString();
				dateClassNames = options.calendarDateClassName +  (isDateSelected ? ' selected' : '');
				tabIndex = isDateSelected ? 0 : -1;

				days.push({
					className: dateClassNames,
					dataAttr: dateString,
					day: i,
					tabIndex: tabIndex,
					index: i - 1
				});

				// Add days to week every seven days
				if(((day + 1) % 7) === 0) {
					weeks.push({days: days});
					days = [];
				}
				d.setDate(i+1);
			}


			// fill in days from next month
			// when current month ends before or
			// on Saturday, the last day in a calendar row
			for(i = day; i < 6; ++i) {
				days.push({
					className: "other-month",
					dataAttr: "",
					day: nextMonthDayCount++
				});
			}

			// Add days to array of weeks if there were days to add
			(days.length) && (weeks.push({days: days}));
			days = [];
			i = 0;

			// fill days from next month -
			// when there are less than 6 weeks in calendar
			while(i < 7 && weeks.length < 6) {
				days.push({
					className: "other-month",
					dataAttr: "",
					day: nextMonthDayCount++
				});
				++i;
			}
			weeks.push({days: days});
			return weeks;
		},
		createCalendarModel = function(options, currentDate, selectedDate) {
			var model = {},
				calendars = createCalendar(options, currentDate, selectedDate);
			model.calendars = calendars;
			model.daysOfWeek = getDaysOfWeek(options.dayFormat);
			model.lastCalendar = calendars[calendars.length - 1];
			return model;
		}

	return {
		init: function() {
			var model = this.model.get(),
				options = model.options,
				defaultOptions = {
					numberOfCalendars: 1,
					allowFutureDates: true,
					dayFormat: 2,
					calendarContainerSelector: ".calendars-container",
					calendarSelector: "table.jpui.calendar",
					calendarDateClassName: "calendarcell",
					datePickerSelector: "div.jpui.datepicker",
					datePickerNextSelector: ".jpjs.next",
					datePickerPrevSelector: ".jpjs.prev",
					datePickerYearSelector: ".jpui.year"
				};
			model.options = $.extend({}, defaultOptions, options);
			model.selectedDate = new Date();
			model.currentDate = new Date();
            !model.calendarTemplate && (model.calendarTemplate = require('blue-ui/template/modules/calendar'));
			this.model.set(model);
			context = this.settings.context;
		},
		show: function() {
			var model = this.model.get(),
				$container = $('#' + model.datepickerId),
				options = model.options,
				templateData = createCalendarModel(options, model.selectedDate, model.selectedDate);
				today = new Date();

			model.lastCalendar = templateData.lastCalendar;
			this.model.set(model);
			$container.addClass('show')
					  .find(options.calendarContainerSelector)
					  .html(model.calendarTemplate(templateData))
					  .show();
			$container.find('.hidden-header').focus();
		},
		hide: function() {
			var model = this.model.get(),
				options = model.options;
			$('#' + model.datepickerId).removeClass('show').find(options.calendarContainerSelector).hide();
		},
		toggle: function() {
			$('#' + this.model.get().datepickerId).toggleClass('show');
		},
		changeMonth: function($target, numberOfMonths) {
			if($target) {
				var numberOfMonths = $target.data('monthstomove')
			}
			var model = this.model.get(),
				options = model.options,
				date = model.currentDate,
				$container = $('#' + model.datepickerId),
				today = new Date(),
				last = model.lastCalendar,
				allowFutureDates = options.allowFutureDates,
				isFuture = last.month === today.getMonth() && last.year === today.getFullYear(),
				isForward = numberOfMonths > 0,
				templateData;


			date.setMonth(date.getMonth() + numberOfMonths);

			if($target) {
				date.setDate(1);
				if($target.hasClass('prev')) {
					targetSelector = 'a.prev';
				} else {
					targetSelector = 'a.next';
				}

			}

			model.currentDate = date;

			if(allowFutureDates || !isFuture || !isForward) {
				templateData = createCalendarModel(options, model.currentDate, date);
				model.lastCalendar = templateData.lastCalendar;
				$container.find(options.calendarContainerSelector)
					  	  .html(model.calendarTemplate(templateData));
				this.model.set(model);

				$target && $container.find(targetSelector).focus();
			}

		},
		selectDate: function($target) {
			var model = this.model.get();
			model.selectedDate = new Date($target.data("date"));
			$('#' + this.model.get().inputId).val($target.data("date")).focus();
			this.model.set(model);
			this.hide();
		},
		dateKeydownHandler: function($target, event) {
			var keycode = event.keyCode,
    			delta   = 0,
    			model = this.model.get(),
    			options = model.options,
    			$container = $('#' + model.datepickerId),
    			$selectedDate = $container.find('td.selected'),
    			selectedIndex = $selectedDate.data('index'),
    			$calendar = $selectedDate.parents('table'),
    			$tableCells = $calendar.find('.' + model.options.calendarDateClassName),
    			newSelectedIndex,
    			templateData,
    			$prevButton,
    			$nextButton,
    			isPrevTabbable,
    			isNextTabbable;

    		if(keycode >= 37 && keycode <= 40) {
    			event.preventDefault();
    			switch(keycode) {
    				case 37:
    					delta = -1;
    					break;
    				case 38:
    					delta = -7;
    					break;
    				case 39:
    					delta = 1;
    					break;
    				case 40:
    					delta = 7;
    					break;
    				default:
    					delta = 0;
    					break;
    			}

    			newSelectedIndex = selectedIndex + delta;

				if(newSelectedIndex >= 0 && newSelectedIndex < $tableCells.length) {
					$selectedDate.removeClass('selected').attr('tabindex', -1);
					$($tableCells.get(newSelectedIndex)).addClass('selected').focus().attr('tabindex', 0);
				} else if(newSelectedIndex < 0) {
					this.changeMonth(null, -1);
					// set selected here
					$calendar = $container.find(options.calendarSelector);
					$calendar.find('td.selected').removeClass('selected').attr('tabindex', -1);
					$tableCells = $calendar.find('.' + model.options.calendarDateClassName);
					$($tableCells[$tableCells.length - 1 + delta]).addClass('selected').focus().attr('tabindex', 0);
				} else if(newSelectedIndex >= $tableCells.length) {
					this.changeMonth(null, 1);
					// set selected here
					$calendar = $container.find(options.calendarSelector);
					$calendar.find('td.selected').removeClass('selected').attr('tabindex', -1);
					$tableCells = $calendar.find('.' + model.options.calendarDateClassName);
					$($tableCells[delta]).addClass('selected').focus().attr('tabindex', 0);
				}
	    	} else if(keycode === 13) { // enter
	    		event.preventDefault();
				this.selectDate($target);
			} else if(keycode === 27) { // escape
				event.preventDefault();
				this.hide();
			} else if(event.keyCode === 9) {
				// if you tab out of calendar - hide calendar and focus on icon  same with shift tab

				if(event.shiftKey) {
					$prevButton = $container.find('.prev');
					$nextButton = $container.find('.next');
					isPrevTabbable = Utils.isTabbable($prevButton);
					isNextTabbable = Utils.isTabbable($nextButton);

					if(!isNextTabbable && !isPrevTabbable) {
						this.hide();
					}
				} else {
					this.hide();
				}
			}
		},
		triggerKeydownHandler: function($target, event) {
			event.keyCode === 13 && this.show();
		},
		nextButtonKeydownHandler: function($target, event) {
			var model = this.model.get();
				$prevButton = $('#' + model.datepickerId).find('.prev');
			if(event.keyCode === 9) {
				if(event.shiftKey) {
					!Utils.isTabbable($prevButton) && this.hide();
				}
			}
		},
		prevButtonKeydownHandler: function($target, event) {
			if(event.keyCode === 9) {
				if(event.shiftKey) {
					this.hide();
				}
			}
		}
	}
});

define('blue-ui/component/styledselect',['require'],function (require) {
	var context = null,
		self = null,
		isAlphabetical = function(keyCode) {
			return keyCode >= 65 && keyCode < 91;
		},
		searchAndSelect = function(searchString, $list) {
			var i = 0, match = -1;
			while(i < $list.length && match === -1) {
				(beginsWith($list[i].innerHTML.toLowerCase(), searchString)) && (match = i);
				++i;
			}
			return match;
		},
		beginsWith = function(searchString, matchString) {
			if(searchString === "" || matchString === "") {
				return false;
			} else {
				return searchString.indexOf(matchString) === 0;
			}
		},
		findNextThatBeginsWithSameLetter = function(character, $list, $selectedItem) {
			var i = 0, matchIndex = -1;

			// Find position of selected item in list
			while(i < $list.length && matchIndex === -1) {
				if ($list[i] === $selectedItem[0]) {
					matchIndex = i;
				} else {
					++i;
				}
			}
			i = (matchIndex + 1) > $list.length - 1 ? matchIndex : matchIndex + 1;
			matchIndex = -1;
			if(i !== -1) {
				// Start from the selected item and search for next item that begins with the same letter
				while(i < $list.length && matchIndex === -1) {
					if($list[i].innerHTML.toLowerCase().charAt(0) === character) {
						matchIndex = i;
					} else {
						++i;
					}
				}

				// Reached the last item that begins with letter, so start from the beginnning and find first
				if(matchIndex === -1) {
					i = 0;
					while(i < $list.length && matchIndex === -1) {
						if($list[i].innerHTML.toLowerCase().charAt(0) === character) {
							matchIndex = i;
						} else {
							++i;
						}
					}
				}

				return matchIndex;
			}
		},
		searchReset = function(thisObj) {
			setTimeout(function() {
				var model = thisObj.model.get();
				model.searchString = "";
				thisObj.model.set(model);
			}, 1000);
		},
		isMenuOpen = function($menu) {
			return $menu.hasClass('show');
		};
	return {
		init: function() {
			context = this.settings.context;
			var model = this.model.get();

			model.searchString = "";
			this.model.set(model);
		},
		setSelected: function($target) {
			var targetIsSelect = $target.is('select'),
				model = this.model.get(),
				$select = model.selectId ? $('#' + model.selectId) : null,
				$styledSelect = $('#' + model.styledSelectId),
				$selectedItem = $styledSelect.find('.selected');

			targetIsSelect && ($target = $menuSelect.find("li").eq($target[0].selectedIndex));
			if($target.length) {
				$target.siblings().removeClass("selected").end().addClass("selected");
				$styledSelect.find('.field').text($target.text());
				if(!targetIsSelect && $select) {
					$select.val($target.attr('rel')).trigger('change');
				}
				$selectedItem.blur();
				$target.focus();
			}
		},
		show: function() {
			var model = this.model.get();
			$('#' + model.styledSelectId).addClass('show').find('.selected').focus();
		},
		hide: function() {
			var model = this.model.get();
			$('#' + model.styledSelectId).removeClass('show').find('.field').focus();
		},
		toggle: function() {
			var model = this.model.get(),
				$styledSelect = $('#' + model.styledSelectId);

			$styledSelect.toggleClass("show");
			if($styledSelect.attr("class").indexOf("show") >= 0) {
				$styledSelect.find("li.selected").focus();
			} else {
				$styledSelect.focus();
			}
		},
		selectOption: function($target) {
			var model = this.model.get();
			this.setSelected($target);
			$target.addClass('is-pressed');
			setTimeout(function() {
				$('#' + model.styledSelectId).removeClass('show').find('.field').trigger("focus")
				$target.removeClass('is-pressed');
			}, 100)
		},
		removeOptionFocus: function($target) {
			$target.siblings().removeClass("selected").blur();
		},
		fieldKeydown: function($target, event) {
			if(event.keyCode === 13) {
				this.toggle();
			}
		},
		optionKeydown: function($target, event) {
			var keyCode = event.keyCode,
				model = this.model.get(),
				searchString = model.searchString,
				$styledSelect = $('#' + model.styledSelectId),
				$selectedItem = $styledSelect.find('.selected'),
				$optionsList = $styledSelect.find('.option'),
				match = -1;

			event.preventDefault();
			clearTimeout(searchReset);

			if(keyCode === 40) {
				this.setSelected($selectedItem.next(".option"));
			} else if(keyCode === 38) {
				this.setSelected($selectedItem.prev(".option"));
			} else if(keyCode === 9 || keyCode === 27) { // escape or tab closes menu
				$styledSelect.removeClass("show");
			} else if(keyCode === 34) { // page down selects last item
				this.setSelected($optionsArray[$optionsArray.length - 1]);
			} else if(keyCode === 33) { // page up selects first item
				this.setSelected($optionsArray[0]);
			} else if(isAlphabetical(keyCode)) { // letters
				var characterEntered = String.fromCharCode(keyCode).toLowerCase();
				if(characterEntered === searchString.charAt(searchString.length - 1) || searchString.length === 0) {
					// same character entered more than once in a row or only one character has been entered
					searchString += characterEntered;
					match = findNextThatBeginsWithSameLetter(characterEntered, $optionsList, $selectedItem);
					this.setSelected($($optionsList[match]));
					searchReset(this);
				} else {
					searchString += characterEntered;
					match = searchAndSelect(searchString, $optionsList);
					this.setSelected($($optionsList[match]));
					searchReset(this);
				}
				model.searchString = searchString;
				this.model.set(model);
			} else if(keyCode === 13) {
				this.selectOption($target);
			}
			else {
				return false;
			}
		}
	}
});

define('blue-ui/controller/index',['require','blue/observable','blue-ui/lib/doc-data','blue/object/extend','blue-spec/dist/spec/layout','blue-ui/component/datepicker','blue-ui/component/styledselect','blue/template'],function (require) {
    return function IndexController() {

        var
            observable = require('blue/observable')
            ,data    = require('blue-ui/lib/doc-data')
            ,extend = require('blue/object/extend')

            ,likeTemplate = new RegExp('^blue-ui\/template\/')
            ,likeInternal = new RegExp('^__|app')
            ,likeCategory = new RegExp('(\/template\/)([^\/]+)')
            ,componentSpec = require('blue-spec/dist/spec/layout')
            ,componentsMapper = {
                'datepicker': {
                    name: 'datePickerComponent',
                    model: observable.Model.combine({
                                datepickerId: data['modules/datepicker.data'].datepickerId,
                                inputId: data['modules/datepicker.data'].inputId
                            }),
                    spec: componentSpec,
                    methods: require('blue-ui/component/datepicker'),
                    target: '#DatepickerComponent',
                    view: 'modules/datepicker'
                },
                'selectbox': {
                    name: 'styledselectComponent',
                    model: observable.Model.combine(data['modules/styledselect.data']),
                    spec: componentSpec,
                    methods: require('blue-ui/component/styledselect'),
                    target: '#StyledselectComponent',
                    view: 'modules/styledselect'
                }
            }
            ,prettyName = function(input) {
                return input.toLowerCase()
                            // Use Spaces and uppercase the first letter of every extra word
                            .replace(/-(.)/g, function(match, letter) {
                                return ' ' + letter.toUpperCase();
                            })
                            // Uppercase the first letter of the first word
                            .replace(/^./, function(letter){
                                return letter.toUpperCase();
                            });
            }
        ;
        this.registerAndInsetComponents = function(componentsMapper) {
            var key, component, componentArray = [];

            // Register components
            for(key in componentsMapper) {
                component = componentsMapper[key];
                componentArray.push({
                    name: component.name,
                    model: component.model,
                    spec: component.spec,
                    methods: component.methods
                });
            }
            this.register.components(this, componentArray);

            // Insert components
            this.elementObserver.isInserted(componentsMapper.datepicker.target, function() {
                this.executeCAV([
                    [
                        this.components[componentsMapper.datepicker.name],
                        componentsMapper.datepicker.view,
                        {target: componentsMapper.datepicker.target}
                    ]
                ]);
            }.bind(this));

            this.elementObserver.isInserted(componentsMapper.selectbox.target, function() {
                 this.executeCAV([
                    [
                        this.components[componentsMapper.selectbox.name],
                        componentsMapper.selectbox.view,
                        {target: componentsMapper.selectbox.target}
                    ]
                ]);
            }.bind(this));
        };

        // Index action
        this.index = function () {

            // Get the templates registered, and loaded
            var
                registry   = extend( true, {}, requirejs.s.contexts._.registry, requirejs.s.contexts._.defined)
                ,templates = {}
            ;

            // Populate our templates object
            Object.keys( registry ).forEach(function(module){
                if( module.match(likeTemplate) ) {

                    // If this is an internal template, do not process it
                    if( module.match(likeCategory)[2].match(likeInternal) ) { return; }

                    // Get the meaningful module and category name
                    var
                        _module    = module.replace(likeTemplate,'')
                        ,_category  = prettyName( module.match( likeCategory )[2])
                        ,_name     = prettyName( module.split('/').pop() )
                        ,_link       = module.split('/').pop()
                        ,_notes      = data[ _module + '.notes' ] || undefined
                        ,_data     = data[ _module + '.data' ] || undefined
                        ,_template = registry[ module ].factory ? registry[ module ].factory( require('blue/template'), require ) : registry[ module ]
                        ,_renderStatic = _category.toLowerCase() !== 'modules' ? true : false
                    ;


                    // TODO: if template is a module, don't display static html, us framework to render component

                    // Ensure the category exists
                    templates[ _category ] = templates[ _category ] || {};

                    // Define the module
                    templates[ _category ][ _module ] = {
                        name  : _name
                        ,link : _link
                        ,notes: _notes
                        ,html : _template( _data )
                        ,renderStatic: _renderStatic
                        ,json : _data ? JSON.stringify( _data, null, ' ' ) : 'Not Configurable'
                    };
                }
            });
            this.registerAndInsetComponents(componentsMapper);
            // Render using the documentation view
            return ['__doc', templates ];
        };
    };
});

define('blue-ui/lib/prism',[],function(){
	/* **********************************************
	     Begin prism-core.js
	********************************************** */

	/**
	 * Prism: Lightweight, robust, elegant syntax highlighting
	 * MIT license http://www.opensource.org/licenses/mit-license.php/
	 * @author Lea Verou http://lea.verou.me
	 */

	(function(){

	// Private helper vars
	var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

	var _ = self.Prism = {
		util: {
			type: function (o) {
				return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
			},

			// Deep clone a language definition (e.g. to extend it)
			clone: function (o) {
				var type = _.util.type(o);

				switch (type) {
					case 'Object':
						var clone = {};

						for (var key in o) {
							if (o.hasOwnProperty(key)) {
								clone[key] = _.util.clone(o[key]);
							}
						}

						return clone;

					case 'Array':
						return o.slice();
				}

				return o;
			}
		},

		languages: {
			extend: function (id, redef) {
				var lang = _.util.clone(_.languages[id]);

				for (var key in redef) {
					lang[key] = redef[key];
				}

				return lang;
			},

			// Insert a token before another token in a language literal
			insertBefore: function (inside, before, insert, root) {
				root = root || _.languages;
				var grammar = root[inside];
				var ret = {};

				for (var token in grammar) {

					if (grammar.hasOwnProperty(token)) {

						if (token == before) {

							for (var newToken in insert) {

								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}

						ret[token] = grammar[token];
					}
				}

				return root[inside] = ret;
			},

			// Traverse a language definition with Depth First Search
			DFS: function(o, callback) {
				for (var i in o) {
					callback.call(o, i, o[i]);

					if (_.util.type(o) === 'Object') {
						_.languages.DFS(o[i], callback);
					}
				}
			}
		},

		highlightAll: function(async, callback) {
			var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

			for (var i=0, element; element = elements[i++];) {
				_.highlightElement(element, async === true, callback);
			}
		},

		highlightElement: function(element, async, callback) {
			// Find language
			var language, grammar, parent = element;

			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (parent.className.match(lang) || [,''])[1];
				grammar = _.languages[language];
			}

			if (!grammar) {
				return;
			}

			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}

			var code = element.textContent;

			if(!code) {
				return;
			}

			code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');

			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};

			_.hooks.run('before-highlight', env);

			if (async && self.Worker) {
				var worker = new Worker(_.filename);

				worker.onmessage = function(evt) {
					env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

					_.hooks.run('before-insert', env);

					env.element.innerHTML = env.highlightedCode;

					callback && callback.call(env.element);
					_.hooks.run('after-highlight', env);
				};

				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code
				}));
			}
			else {
				env.highlightedCode = _.highlight(env.code, env.grammar, env.language)

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(element);

				_.hooks.run('after-highlight', env);
			}
		},

		highlight: function (text, grammar, language) {
			return Token.stringify(_.tokenize(text, grammar), language);
		},

		tokenize: function(text, grammar, language) {
			var Token = _.Token;

			var strarr = [text];

			var rest = grammar.rest;

			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}

				delete grammar.rest;
			}

			tokenloop: for (var token in grammar) {
				if(!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}

				var pattern = grammar[token],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					lookbehindLength = 0;

				pattern = pattern.pattern || pattern;

				for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str);

					if (match) {
						if(lookbehind) {
							lookbehindLength = match[1].length;
						}

						var from = match.index - 1 + lookbehindLength,
						    match = match[0].slice(lookbehindLength),
						    len = match.length,
						    to = from + len,
							before = str.slice(0, from + 1),
							after = str.slice(to + 1);

						var args = [i, 1];

						if (before) {
							args.push(before);
						}

						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match);

						args.push(wrapped);

						if (after) {
							args.push(after);
						}

						Array.prototype.splice.apply(strarr, args);
					}
				}
			}

			return strarr;
		},

		hooks: {
			all: {},

			add: function (name, callback) {
				var hooks = _.hooks.all;

				hooks[name] = hooks[name] || [];

				hooks[name].push(callback);
			},

			run: function (name, env) {
				var callbacks = _.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i=0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		}
	};

	var Token = _.Token = function(type, content) {
		this.type = type;
		this.content = content;
	};

	Token.stringify = function(o, language, parent) {
		if (typeof o == 'string') {
			return o;
		}

		if (Object.prototype.toString.call(o) == '[object Array]') {
			return o.map(function(element) {
				return Token.stringify(element, language, o);
			}).join('');
		}

		var env = {
			type: o.type,
			content: Token.stringify(o.content, language, parent),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language,
			parent: parent
		};

		if (env.type == 'comment') {
			env.attributes['spellcheck'] = 'true';
		}

		_.hooks.run('wrap', env);

		var attributes = '';

		for (var name in env.attributes) {
			attributes += name + '="' + (env.attributes[name] || '') + '"';
		}

		return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

	};

	if (!self.document) {
		// In worker
		self.addEventListener('message', function(evt) {
			var message = JSON.parse(evt.data),
			    lang = message.language,
			    code = message.code;

			self.postMessage(JSON.stringify(_.tokenize(code, _.languages[lang])));
			self.close();
		}, false);

		return;
	}

	// Get current script and highlight
	var script = document.getElementsByTagName('script');

	script = script[script.length - 1];

	if (script) {
		_.filename = script.src;

		if (document.addEventListener && !script.hasAttribute('data-manual')) {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}

	})();

	/* **********************************************
	     Begin prism-markup.js
	********************************************** */

	Prism.languages.markup = {
		'comment': /&lt;!--[\w\W]*?-->/g,
		'prolog': /&lt;\?.+?\?>/,
		'doctype': /&lt;!DOCTYPE.+?>/,
		'cdata': /&lt;!\[CDATA\[[\w\W]*?]]>/i,
		'tag': {
			pattern: /&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi,
			inside: {
				'tag': {
					pattern: /^&lt;\/?[\w:-]+/i,
					inside: {
						'punctuation': /^&lt;\/?/,
						'namespace': /^[\w-]+?:/
					}
				},
				'attr-value': {
					pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
					inside: {
						'punctuation': /=|>|"/g
					}
				},
				'punctuation': /\/?>/g,
				'attr-name': {
					pattern: /[\w:-]+/g,
					inside: {
						'namespace': /^[\w-]+?:/
					}
				}

			}
		},
		'entity': /&amp;#?[\da-z]{1,8};/gi
	};

	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism.hooks.add('wrap', function(env) {

		if (env.type === 'entity') {
			env.attributes['title'] = env.content.replace(/&amp;/, '&');
		}
	});

	/* **********************************************
	     Begin prism-css.js
	********************************************** */

	Prism.languages.css = {
		'comment': /\/\*[\w\W]*?\*\//g,
		'atrule': {
			pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
			inside: {
				'punctuation': /[;:]/g
			}
		},
		'url': /url\((["']?).*?\1\)/gi,
		'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
		'property': /(\b|\B)[\w-]+(?=\s*:)/ig,
		'string': /("|')(\\?.)*?\1/g,
		'important': /\B!important\b/gi,
		'ignore': /&(lt|gt|amp);/gi,
		'punctuation': /[\{\};:]/g
	};

	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'style': {
				pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig,
				inside: {
					'tag': {
						pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig,
						inside: Prism.languages.markup.tag.inside
					},
					rest: Prism.languages.css
				}
			}
		});
	}

	/* **********************************************
	     Begin prism-clike.js
	********************************************** */

	Prism.languages.clike = {
		'comment': {
			pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,
			lookbehind: true
		},
		'string': /("|')(\\?.)*?\1/g,
		'class-name': {
			pattern: /((?:class|interface|extends|implements|trait|instanceof|new)\s+)[a-z0-9_\.\\]+/ig,
			lookbehind: true,
			inside: {
				punctuation: /(\.|\\)/
			}
		},
		'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|catch|finally|null|break|continue)\b/g,
		'boolean': /\b(true|false)\b/g,
		'function': {
			pattern: /[a-z0-9_]+\(/ig,
			inside: {
				punctuation: /\(/
			}
		},
		'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
		'operator': /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
		'ignore': /&(lt|gt|amp);/gi,
		'punctuation': /[{}[\];(),.:]/g
	};

	/* **********************************************
	     Begin prism-javascript.js
	********************************************** */

	Prism.languages.javascript = Prism.languages.extend('clike', {
		'keyword': /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|catch|finally|null|break|continue)\b/g,
		'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
	});

	Prism.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
			lookbehind: true
		}
	});

	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'script': {
				pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
				inside: {
					'tag': {
						pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
						inside: Prism.languages.markup.tag.inside
					},
					rest: Prism.languages.javascript
				}
			}
		});
	}

	/* **********************************************
	     Begin prism-file-highlight.js
	********************************************** */

	(function(){

	if (!self.Prism || !self.document || !document.querySelector) {
		return;
	}

	var Extensions = {
		'js': 'javascript',
		'html': 'markup',
		'svg': 'markup'
	};

	Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function(pre) {
		var src = pre.getAttribute('data-src');
		var extension = (src.match(/\.(\w+)$/) || [,''])[1];
		var language = Extensions[extension] || extension;

		var code = document.createElement('code');
		code.className = 'language-' + language;

		pre.textContent = '';

		code.textContent = 'Loading…';

		pre.appendChild(code);

		var xhr = new XMLHttpRequest();

		xhr.open('GET', src, true);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {

				if (xhr.status < 400 && xhr.responseText) {
					code.textContent = xhr.responseText;

					Prism.highlightElement(code);
				}
				else if (xhr.status >= 400) {
					code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
				}
				else {
					code.textContent = '✖ Error: File does not exist or is empty';
				}
			}
		};

		xhr.send(null);
	});

	})();
});

define('blue-ui/template/__doc',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
define('blue-ui/view/__doc',['require','blue-ui/lib/prism','../template/__doc'],function(require) {
	return function DocumentationView() {

		// Prism does not work with AMD, let it be al mighty for now...
		require('blue-ui/lib/prism');

		this.template = require('../template/__doc');
		this.init = function(){
			// Quick temporary hack
			setTimeout(function(){

				// Get dom elements
				// ====================================================
				var dom = {
					primaryMenu : document.querySelector('.f-menu')
					,menuItems  : document.querySelectorAll('.f-menu li a')
					,menuToggle : document.querySelector('.f-menu-toggle')
					,prototype  : document.getElementById('prototype')
					,chips      : document.querySelectorAll('.f-color-chip')
					,toggleCode : document.querySelectorAll('.f-toggle')
					,toggleAll  : document.querySelectorAll('.f-controls [data-toggle-control]')
				};

				// Get a forEach
				var forEach = Array.prototype.forEach;

				// Set code toggling
				// ====================================================
				forEach.call( dom.toggleCode, function(toggle){
					toggle.addEventListener('click', function () {
						var group = this.parentNode.parentNode.parentNode;

						group.querySelector('[data-toggle="code"]').classList.toggle('f-item-hidden');
					});
				});

				// Set the chips color
				// ====================================================
				forEach.call( dom.chips, function(chip){
					var color = chip.querySelector('.f-color-chip__color').innerHTML;
					chip.style.borderTopColor = color;
				});
				
				// Menu Control
				// ====================================================
				forEach.call( dom.menuItems, function(menuItem){

					// Listen for click events
					menuItem.addEventListener('click', function () {

						// Get the item clicked
						var itemClicked = this;

						// Find the active item
						forEach.call( dom.menuItems, function( item ){
							if( itemClicked.getAttribute('data-href') === item.getAttribute('data-href') ) {
								item.classList.add('f-active');
								// Depricated, but for now this is the animation.
								$('html, body').animate({
									scrollTop: $(itemClicked.getAttribute('data-href')).offset().top - 60 + 'px'
								}, 'medium');
							}
							// Innefficent, but for now this is how we ensure previous ones get deactivated
							else if( item.classList.contains('f-active') ) {
								item.classList.remove('f-active');
							}
						});
					});
				});


				// Super toggles
				// ====================================================
				forEach.call( dom.toggleAll, function( toggler ){

					// On click event toggle all
					toggler.addEventListener('click', function () {
						// Get the state of the super toggle
						this.classList.toggle('f-active');
						var active = this.classList.contains('f-active');
						var type   = this.getAttribute('data-toggle-control');

						// Toggle the items
						forEach.call( dom.toggleCode, function(toggle){
							var code = toggle.parentNode.parentNode.parentNode.querySelector('[data-toggle="'+type+'"]');
							if( active ) { code.classList.remove('f-item-hidden'); }
							else         { code.classList.add   ('f-item-hidden'); }
						});
					});
				});


				// Syntax Highlighting
				// ====================================================
				window.Prism.highlightAll();


			},400);
		};
	};
});

define('blue-ui/template/elements/alert',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n  <div class=\"jpui ";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " alert\">\n    <span class=\"message\">";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <i class=\"jpui close icon\"></i>\n  </div>\n";
  return buffer;
  }

  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.alerts) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.alerts); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.alerts) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }); });
define('blue-ui/view/elements/alert',['require','../../template/elements/alert'],function (require) {
    return function View() {
        this.template = require('../../template/elements/alert');
    };
});

define('blue-ui/template/elements/buttons',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "<button class=\"jpui button";
  options={hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}
  if (helper = helpers.classes) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.classes); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.classes) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.type), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.disabled), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.adatext), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</button>";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "";
  buffer += " "
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "type=\"";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "disabled=\"";
  if (helper = helpers.disabled) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.disabled); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<span class=\"u-accessible-text\">&nbsp;";
  if (helper = helpers.adatext) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.adatext); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  }

  stack1 = ((stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0)),blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }); });
define('blue-ui/view/elements/buttons',['require','../../template/elements/buttons'],function (require) {
    return function View() {
        this.template = require('../../template/elements/buttons');
    };
});

define('blue-ui/template/elements/input',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasIcon), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<input class=\"jpui input";
  options={hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data}
  if (helper = helpers.classes) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.classes); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.classes) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " value=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.placeholder), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " name=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.disabled), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " />";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hasIcon), {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<span class=\"jpui wrap ";
  if (helper = helpers.hasIcon) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.hasIcon); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.currency), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;
  }
function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<span>";
  if (helper = helpers.currency) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.currency); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "";
  buffer += " "
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "placeholder=\"";
  if (helper = helpers.placeholder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.placeholder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "disabled=\"";
  if (helper = helpers.disabled) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.disabled); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.rightIcon), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</span>";
  return buffer;
  }
function program14(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<span><i class=\"jpui icon ";
  if (helper = helpers.rightIcon) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rightIcon); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></i></span>";
  return buffer;
  }

  buffer += "\n";
  stack1 = ((stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0)),blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }); });
define('blue-ui/view/elements/input',['require','../../template/elements/input'],function (require) {
    return function View() {
        this.template = require('../../template/elements/input');
    };
});

define('blue-ui/template/elements/textarea',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "<textarea class=\"jpui input";
  options={hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}
  if (helper = helpers.classes) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.classes); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.classes) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.placeholder), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " name=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.disabled), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.value), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</textarea>";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "";
  buffer += " "
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0));
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "placeholder=\"";
  if (helper = helpers.placeholder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.placeholder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "disabled=\"";
  if (helper = helpers.disabled) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.disabled); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program10(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

  buffer += "\n";
  stack1 = ((stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0)),blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }); });
define('blue-ui/view/elements/textarea',['require','../../template/elements/textarea'],function (require) {
    return function View() {
        this.template = require('../../template/elements/textarea');
    };
});

define('blue-ui/template/elements/headings',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n  <h";
  if (helper = helpers.level) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.level); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " class=\"";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.inverted), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.block), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "header\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h";
  if (helper = helpers.level) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.level); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">\r\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return " inverted ";
  }

function program4(depth0,data) {
  
  
  return "block ";
  }

  buffer += "<span>\r\n<div class=\"steward\">\r\n";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.headings) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.headings); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.headings) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</span>\r\n";
  return buffer;
  }); });
define('blue-ui/view/elements/headings',['require','../../template/elements/headings'],function (require) {
    return function View() {
        this.template = require('../../template/elements/headings');
    };
});
define('blue-ui/template/elements/labels',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n  <div class=\"jpui ";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " label\">\n    ";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n  </div>\n";
  return buffer;
  }

  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.labels) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.labels); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.labels) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  return buffer;
  }); });
define('blue-ui/view/elements/labels',['require','../../template/elements/labels'],function (require) {
    return function View() {
        this.template = require('../../template/elements/labels');
    };
});

define('blue-ui/template/elements/icon',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.link), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <i class=\"jpui";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.type), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " icon\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.adatext), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.adatext), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</i>\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.link), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<a href=\"";
  if (helper = helpers.link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += " ";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1);
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "aria-label=\"";
  if (helper = helpers.adatext) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.adatext); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<span>";
  if (helper = helpers.adatext) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.adatext); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>";
  return buffer;
  }

function program10(depth0,data) {
  
  
  return "</a>";
  }

  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.icons) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.icons); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.icons) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }); });
define('blue-ui/view/elements/icon',['require','../../template/elements/icon'],function (require) {
    return function View() {
        this.template = require('../../template/elements/icon');
    };
});

define('blue-ui/template/elements/list',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n      <li>\n        <a href=\"";
  if (helper = helpers.url) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.url); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n      </li>\n    ";
  return buffer;
  }

  buffer += "<div class=\"jpui panel body list\">\n  <ul>\n    ";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.items) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.items); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.items) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n</div>\n";
  return buffer;
  }); });
define('blue-ui/view/elements/list',['require','../../template/elements/list'],function (require) {
    return function View() {
        this.template = require('../../template/elements/list');
    };
});
define('blue-ui/template/elements/menu',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n      <li ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.state), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n        <a href=\"#\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.secondlevel), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </li>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "class=\"";
  if (helper = helpers.state) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.state); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n          <ul>\n            ";
  options={hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data}
  if (helper = helpers.secondlevel) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.secondlevel); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.secondlevel) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n          </ul>\n        ";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n              <li ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.state), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n                <a href=\"#\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n                ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.thirdlevel), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n              </li>\n            ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                  <ul>\n                    ";
  options={hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data}
  if (helper = helpers.thirdlevel) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.thirdlevel); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.thirdlevel) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                  </ul>\n                ";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                      <li ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.state), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n                        <a href=\"#\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n                        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.fourthlevel), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                      </li>\n                    ";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n                          <ul>\n                            ";
  options={hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data}
  if (helper = helpers.fourthlevel) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.fourthlevel); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.fourthlevel) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                          </ul>\n                        ";
  return buffer;
  }
function program9(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                              <li ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.state), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n                                <a href=\"#\">";
  if (helper = helpers.text) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.text); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n                              </li>\n                            ";
  return buffer;
  }

  buffer += "<nav class=\"jpui ";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " menu\">\n  <ul>\n    ";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.firstlevel) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.firstlevel); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.firstlevel) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </ul>\n</nav>\n";
  return buffer;
  }); });
define('blue-ui/view/elements/menu',['require','../../template/elements/menu'],function (require) {
    return function View() {
        this.template = require('../../template/elements/menu');
    };
});
define('blue-ui/template/elements/pagination',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"pagination\">\n  <span class=\"disabled\">Prev</span>\n  <span class=\"active\">1</span>\n    <a href=\"#\" rel=\"next\">2</a>\n    <a href=\"#\">3</a>\n    <a href=\"#\">4</a>\n    <span class=\"gap\"> . . . </span>\n    <a href=\"#\">11</a>\n    <a href=\"#\">12</a>\n    <a href=\"#\" rel=\"next\" class=\"jpui-next_page\">Next</a>\n</div>\n";
  }); });
define('blue-ui/view/elements/pagination',['require','../../template/elements/pagination'],function (require) {
    return function View() {
        this.template = require('../../template/elements/pagination');
    };
});
define('blue-ui/template/elements/panel',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"jpui primary panel\">\n <header class=\"jpui panel heading\">\n  <h3>CONTENT HEADER</h3>\n </header>\n <div class=\"jpui panel body\">\n   CONTENT BODY\n </div>\n</div>\n";
  }); });
define('blue-ui/view/elements/panel',['require','../../template/elements/panel'],function (require) {
    return function View() {
        this.template = require('../../template/elements/panel');
    };
});
define('blue-ui/template/elements/paragraph',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<p>Paragraph. Pellentesque posuere feugiat risus et faucibus. Pellentesque sollicitudin ornare vulputate. Proin interdum dolor elit, at congue nulla gravida quis. Pellentesque volutpat, nibh eu dignissim consequat, ante est semper odio, at dictum dolor enim sit amet neque. Fusce ligula justo, suscipit ut euismod eget, laoreet in quam. Morbi rutrum diam id neque malesuada, sed dignissim libero congue.</p>\n";
  }); });
define('blue-ui/view/elements/paragraph',['require','../../template/elements/paragraph'],function (require) {
    return function View() {
        this.template = require('../../template/elements/paragraph');
    };
});
define('blue-ui/template/elements/table',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return " <table class=\"jpui table\">\n   <thead>\n     <tr>\n       <th scope=\"col\">Date</th>\n       <th scope=\"col\">Type</th>\n       <th scope=\"col\">Description</th>\n       <th scope=\"col\">Debit</th>\n       <th scope=\"col\">Credit</th>\n       <th scope=\"col\">Balance</th>\n     </tr>\n   </thead>\n   <tbody>\n     <tr>\n       <td scope=\"row\">02/20/2014</td>\n       <td>Deposit</td>\n       <td>DEPOSTI ID NUMBER 11111</td>\n       <td>&nbsp;</td>\n     <td>$2.00</td>\n       <td>$22.39</td>\n     </tr>\n     <tr>\n       <td scope=\"row\">02/02/2014</td>\n       <td>Check</td>\n       <td>CHECK #100</td>\n       <td>$89,950.00</td>\n       <td>&nbsp;</td>\n       <td>$744.00</td>\n     </tr>\n     <tr>\n       <td scope=\"row\">02/20/2014</td>\n       <td>Deposit</td>\n       <td>DEPOSTI ID NUMBER 23322</td>\n       <td>&nbsp;</td>\n       <td>$9.00</td>\n       <td>$18,700.02</td>\n     </tr>\n  </tbody>\n</table>\n";
  }); });
define('blue-ui/view/elements/table',['require','../../template/elements/table'],function (require) {
    return function View() {
        this.template = require('../../template/elements/table');
    };
});
define('blue-ui/template/elements/tile',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<div class=\"small ";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " account segment\" data-account-number=\"";
  if (helper = helpers.number) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.number); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  <h4 class=\"title\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h4>\n  <h5 class=\"subtitle\">";
  if (helper = helpers.number) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.number); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h5>\n  <div class=\"amount\">$";
  if (helper = helpers.amount) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.amount); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n  <div class=\"message\">";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n</div>\n";
  return buffer;
  }

  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.accounts) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.accounts); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.accounts) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }); });
define('blue-ui/view/elements/tile',['require','../../template/elements/tile'],function (require) {
    return function View() {
        this.template = require('../../template/elements/tile');
    };
});
define('blue-ui/template/modules/accordion',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"jpui expandable panels\">\r\n   <div class=\"active\">\r\n     <a href=\"#panel1\">Group Item #1</a>\r\n   </div>\r\n   <div id=\"panel1\" class=\"jpui panel body\">\r\n     Item #1 content\r\n   </div>\r\n   <div>\r\n     <a href=\"#panel2\">Group Item #2</a>\r\n   </div>\r\n   <div id=\"panel2\" class=\"jpui panel body\">\r\n     Item #2 content\r\n   </div>\r\n   <div>\r\n     <a href=\"#panel3\">Group Item #3</a>\r\n   </div>\r\n   <div id=\"panel3\" class=\"jpui panel body\">\r\n     Item #3 content\r\n   </div>\r\n</div>\r\n";
  }); });
define('blue-ui/view/modules/accordion',['require','../../template/modules/accordion'],function (require) {
    return function DocumentationView() {
        this.template = require('../../template/modules/accordion');
    };
});

define('blue-ui/view/webspec/modules/styledselect',{
 "name": "styledselect",
 "triggers": {}
});

define('blue-ui/template/modules/styledselect',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<option value=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.selected), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</option>\n		";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return " selected";
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n				<li rel=\"";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"option";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.selected), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" role=\"option\" tabindex=\"0\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n			";
  return buffer;
  }

  buffer += "<div id=\"";
  if (helper = helpers.styledSelectId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.styledSelectId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"styled-select\">\n	<select id=\"";
  if (helper = helpers.selectId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.selectId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n		";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</select>\n	<div class=\"header field\" tabindex=\"0\" role=\"aria-hidden\"></div>\n	<div class=\"list-container\" role=\"aria-hidden\">\n		<ul class=\"list\">\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</ul>\n	</div>\n</div>";
  return buffer;
  }); });
define('blue-ui/view/modules/styledselect',['require','blue/event/channel/controller','blue/bridge','blue-ui/view/webspec/modules/styledselect','blue-ui/template/modules/styledselect'],function (require) {
	var controllerChannel = require('blue/event/channel/controller');

    return function() {
    	var self = this;


        var SBridge = require('blue/bridge').create(require('blue-ui/view/webspec/modules/styledselect'));
        this.bridge = new SBridge({
            targets: {
            }
        });

        self.instanceName = 'styledselect';
        self.type = 'view';

    	this.eventManager = {
    		'click': {
    			'.field': function($target, event) {
    				self.component.toggle();
    			},
    			'.option': function($target, event) {
    				self.component.selectOption($target);
    			}
    		},
    		'keydown': {
    			'.field': function($target, event) {
    				self.component.fieldKeydown($target, event);
    			},
    			'.option': function($target, event) {
    				self.component.optionKeydown($target, event);
    			}
    		}
    	}
    	this.template = require('blue-ui/template/modules/styledselect');

    }
});

define('blue-ui/view/webspec/modules/datepicker',{
    "name": "datepicker",
    "triggers": {}
});

define('blue-ui/template/modules/datepicker',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"";
  if (helper = helpers.datepickerId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.datepickerId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"jpui datepicker\">\n	<input id=\"";
  if (helper = helpers.inputId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.inputId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text\" />\n	<a class=\"trigger icon\" href=\"#\"><i class=\"icon-calendar\">open</i></a>\n	<div class=\"jpui calendars-container\">\n	</div>\n</div>";
  return buffer;
  }); });
define('blue-ui/view/modules/datepicker',['require','blue/bridge','blue-ui/view/webspec/modules/datepicker','blue-ui/template/modules/datepicker'],function (require) {

    return function() {
    	var self = this;

    	var DatePickerBridge = require('blue/bridge').create(require('blue-ui/view/webspec/modules/datepicker'));
		this.bridge = new DatePickerBridge({
			targets: {
			}
		});

    	self.instanceName = 'datepicker';
    	self.type = 'view';

    	this.eventManager = {
    		click: {
    			'.trigger': function($element, event) {
    				event.preventDefault();
    				self.component.show();
    			},
    			'.calendarcell': function($element, event) {
    				event.preventDefault();
    				self.component.selectDate($element);
    			},
    			'.prev': function($element, event) {
    				event.preventDefault();
    				self.component.changeMonth($element);
    			},
    			'.next': function($element, event) {
    				event.preventDefault();
    				self.component.changeMonth($element);
    			}
    		},
    		keydown: {
    			// '.calendarcell': function($element, event) {
    			// 	//event.preventDefault();
    			// 	//self.component.dateKeydownHandler($element, event);
    			// },
    			'.trigger': function($element, event) {
    				self.component.triggerKeydownHandler($element, event);
    			}
    		},
    		focusout: {
    			// '.trigger': function($element, event) {
    			// 	//event.preventDefault();
    			// 	self.component.hide();
    			// }
    		}
    	}

    	this.init = function() {
    		setTimeout(function() {
    			this.$target.find('.jpui.calendars-container').on('keydown', '.calendarcell', function(event){
    				self.component.dateKeydownHandler($(event.target), event);
    			}).on('keydown', '.prev', function(event) {
    				self.component.prevButtonKeydownHandler($(event.target), event);
    			}).on('keydown', '.next', function(event) {
    				self.component.nextButtonKeydownHandler($(event.target), event);
    			});

    			$(document).on('click', function(event) {
    				self.component.hide();
    			});
    		}.bind(this), 2000)
    	}
    	this.template = require('blue-ui/template/modules/datepicker');
    }
});

define('blue-ui/template/collections/transaction-table',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n      <tr>\n        <td>";
  if (helper = helpers.date) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.date); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</td>\n        <td>\n          ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n          <span class=\"subtitle\">";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n        </td>\n        <td class=\"";
  if (helper = helpers.type) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.type); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " right text\">\n          $";
  if (helper = helpers.amount) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.amount); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n        </td>\n        <td class=\"emphasize right text\">\n          $";
  if (helper = helpers.balance) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.balance); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n        </td>\n      </tr>\n    ";
  return buffer;
  }

  buffer += "<table class=\"jpui grouped table\">\n  <thead>\n    <tr>\n      <th>Date</th>\n      <th>Description</th>\n      <th class=\"right text\">Debits/Credits</th>\n      <th class=\"right text\">Balance</th>\n    </tr>\n  </thead>\n  <tbody>\n    ";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.items) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.items); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.items) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </tbody>\n</table>\n";
  return buffer;
  }); });
define('blue-ui/view/collections/transaction-table',['require','../../template/collections/transaction-table'],function (require) {
    return function View() {
        this.template = require('../../template/collections/transaction-table');
    };
});

define('blue-ui/template/collections/account-description',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"jpui active account details\">\n  <div class=\"row\">\n    <div class=\"col-xs-6\">\n      <h3>Chase Premier Checking</h3>\n      <h5>(...1234)</h5>\n    </div>\n    <div class=\"col-xs-6\">\n      <div class=\"col-xs-offset-4 col-xs-8\">\n        <div class=\"jpui simple inverted dropdown\">\n          Things you can do<i class=\"fa right fa-caret-down\"></i>\n          <div class=\"menu\">\n            <div class=\"item\"><a href=\"/#\">See statements</a></div>\n            <div class=\"item\"><a href=\"/#\">See account details</a></div>\n            <div class=\"item\"><a href=\"/#\">See features and benefits</a></div>\n            <div class=\"item\"><a href=\"/#\"><strong>Update Settings</strong></a></div>\n            <div class=\"item\"><a href=\"/#\"><strong>Account Services</strong></a></div>\n            <div class=\"item\"><a href=\"/#\"><strong>Forms</strong></a></div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-6\">\n      <ul>\n        <li>Present Balance<span>$6,500.00</span></li>\n      </ul>\n    </div>\n    <div class=\"col-xs-6\">\n      <h4>Overdraft Protection</h4>\n      <ul>\n        <li>Account<span>Savings Plus (...1234)</span></li>\n      </ul>\n    </div>\n  </div>\n</div>\n";
  }); });
define('blue-ui/view/collections/account-description',['require','../../template/collections/account-description'],function (require) {
    return function View() {
        this.template = require('../../template/collections/account-description');
    };
});

define('blue-ui/template/collections/navigation-bar',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"jpui transparent fluid navigation bar\">\n    <div class=\"row\">\n      <div class=\"col-xs-5\">\n        <div class=\"offcanvas left menu trigger\">\n          <i class=\"fa fa-bars\"></i>\n        </div>\n        <div class=\"jpui separated left menu hide-xs show-md\">\n          <ul>\n            <li><a href=\"#\">test</a></li>\n          </ul>\n        </div>\n      </div>\n      <div class=\"col-xs-2\">\n\n      </div>\n      <div class=\"col-xs-5\">\n        <div class=\"right search trigger\">\n          <i class=\"fa fa-search\"></i>\n        </div>\n        <div class=\"jpui right menu hide-xs show-md\">\n          <ul>\n            <li>test</li>\n          </ul>\n        </div>\n      </div>\n  </div>\n</div>\n";
  }); });
define('blue-ui/view/collections/navigation-bar',['require','../../template/collections/navigation-bar'],function (require) {
    return function View() {
        this.template = require('../../template/collections/navigation-bar');
    };
});

define('blue-ui/template/utilities/alignment',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<span>\r\n<p class=\"left aligned\">Left aligned text.</p>\r\n<p class=\"center aligned\">Centered aligned text.</p>\r\n<p class=\"right aligned\">Right aligned text.</p>\r\n<p class=\"justified\">Justified text.</p>\r\n</span>\r\n";
  }); });
define('blue-ui/view/utilities/alignment',['require','../../template/utilities/alignment'],function (require) {
    return function View() {
        this.template = require('../../template/utilities/alignment');
    };
});

define('blue-ui/template/utilities/bold',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<span>This text shows <strong>bold copy</strong></span>\n";
  }); });
define('blue-ui/view/utilities/bold',['require','../../template/utilities/bold'],function (require) {
    return function View() {
        this.template = require('../../template/utilities/bold');
    };
});

define('blue-ui/template/utilities/floats',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div>\n<div class=\"float none\">None</div>\n<div class=\"float left\">Left</div>\n<div class=\"float right\">Right</div>\n</div>\n";
  }); });
define('blue-ui/view/utilities/floats',['require','../../template/utilities/floats'],function (require) {
    return function View() {
        this.template = require('../../template/utilities/floats');
    };
});

define('blue-ui/template/utilities/italics',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<span>This text shows <em>italicized copy</em></span>\n";
  }); });
define('blue-ui/view/utilities/italics',['require','../../template/utilities/italics'],function (require) {
    return function View() {
        this.template = require('../../template/utilities/italics');
    };
});

define('blue-ui/template/utilities/text-transform',["handlebars"], function(Handlebars) { return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<span>\n<div class=\"uppercase\">uppercase</div>\n<div class=\"lowercase\">lowercase</div>\n<div class=\"capitalize\">capitialize each word</div>\n</span>\n";
  }); });
define('blue-ui/view/utilities/text-transform',['require','../../template/utilities/text-transform'],function (require) {
    return function View() {
        this.template = require('../../template/utilities/text-transform');
    };
});

