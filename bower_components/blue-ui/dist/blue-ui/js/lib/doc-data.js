define({

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
