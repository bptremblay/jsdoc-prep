define({
    target: 'body',
    appName: 'dashboard',
    appTemplate: {
        module: 'dashboard/template/app'
    },
    settingsUtil: {
        module: 'blue/settings/util'
    },
    templateEngine: {
        module: 'blue/template/helper'
    },

    //Defining controller for app
    controllers: {
        create: 'blue/registry/controller',
        properties: {
            index: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myAccounts/index',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    }
                }
            },
            manageFundingAccounts: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/manageFundingAccounts/manageFundingAccounts',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    cardFundingServices: {
                    	$ref: 'cardFundingServices'
                    },
                    cardPaymentListDataTransform: {
                       $ref: 'cardPaymentListDataTransform'
                    },
                    addValidateServices: {
                    	$ref: 'addValidateServices'

                    },
                }
            },
            siteMessage: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/conversationDeck/siteMessage'
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'dataTransform'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    }
                }
            },
            paymentsMenu: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/header/paymentsMenu',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    sharedPrivilegesServices: {
                        $ref: 'sharedPrivilegesServices'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    }
                }
            },
            scenario: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/scenario',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    }
                }
            },
            profile: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myProfile/base',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    elementObserver: {
                        $ref: 'elementObserver'
                    }
                }
            },
            profileBasics: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myProfile/theBasics',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    }
                }
            },
            profileEmail: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myProfile/email',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    myProfileServices: {
                        $ref: 'myProfileServices'
                    },
                    commonComponentsUtil: {
                        $ref: 'commonComponentsUtil'
                    },
                    elementObserver: {
                        $ref: 'elementObserver'
                    }
                }
            },
            profileMailingAddress: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myProfile/mailingAddress',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    myProfileServices: {
                        $ref: 'myProfileServices'
                    },
                    dataTransform: {
                        $ref: 'profileDataTransform'
                    },
                    commonComponentsUtil: {
                        $ref: 'commonComponentsUtil'
                    },
                    elementObserver: {
                        $ref: 'elementObserver'
                    }
                }
            },
            header: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/header/header',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'dataTransform'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    elementObserver: {
                        $ref: 'elementObserver'
                    }
                }
            },
            customerGreetings: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/conversationDeck/customerGreetings',
                    }
                },
                properties: {
                    greetingServices: {
                        $ref: 'greetingServices'
                    }
                }
            },
            conversationDeckMessages: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/conversationDeck/messages',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    messagesServices: {
                        $ref: 'messagesServices'
                    },
                    adsServices: {
                        $ref: 'adsServices'
                    }
                }
            },
            conversationDeckPrimarySearch: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/conversationDeck/primarySearch',
                    }
                },
                properties: {
                    primarySearchServices: {
                        $ref: 'primarySearchServices'
                    },
                    settings: {
                        $ref: 'settings'
                    }
                }
            },
            paymentsActivity: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/paymentsActivity/index',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    services: {
                        $ref: 'services'
                    },

                    //Referencing the FormService that is defined for dashboard paymentActivity
                    FormService: {
                        $ref: 'FormService'
                    },

                    paymentsActivityServices: {
                        $ref: 'paymentsActivityServices'
                    },
                    dataTransformPaymentsActivity: {
                        $ref: 'dataTransformPaymentsActivity'
                    },
                }
            },
            megaMenu: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/sideMenu/megaMenu',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'dataTransform'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    }
                }
            },
            payments: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/common/index',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    }
                }
            },
            payee: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/merchantBillPay/payee',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransformMbp: {
                        $ref: 'dataTransformMbp'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    logger: {
                        $ref: 'logger'
                    },
                    payeeServices: {
                        $ref: 'payeeServices'
                    },
                    myProfileServices:{
                        $ref:'myProfileServices'
                    }
                }
            },
            payeeManual: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/merchantBillPay/payeeManual',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransformMbp: {
                        $ref: 'dataTransformMbp'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    logger: {
                        $ref: 'logger'
                    },
                    payeeServices: {
                        $ref: 'payeeServices'
                    },
                    myProfileServices: {
                        $ref: 'myProfileServices'
                    }
                }
            },
            payBill: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/shared/payBill',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    logger: {
                        $ref: 'logger'
                    },
                    singlePaymentServices: {
                        $ref: 'singlePaymentServices'
                    }
                }
            },
            singlePayment: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/merchantBillPay/singlePayment',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransformSinglePayment: {
                        $ref: 'dataTransformSinglePayment'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    logger: {
                        $ref: 'logger'
                    },
                    singlePaymentServices: {
                        $ref: 'singlePaymentServices'
                    }
                }
            },
            paymentDate: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myAccounts/paymentDate',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransformPaymentDate: {
                        $ref: 'dataTransformPaymentDate'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    paymentDateServices: {
                        $ref: 'paymentDateServices'
                    }
                }
            },
            payeeActivity: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/payeeActivity/payeeActivity',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    logger: {
                        $ref: 'logger'
                    },
                    payeeActivityServices: {
                        $ref: 'payeeActivityServices'
                    },
                    elementObserver: {
                    	$ref: 'elementObserver'
                    }
                }
            },
            accounts: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myAccounts/accounts',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'dataTransform'
                    },
                    summaryServices: {
                        $ref: 'summaryServices'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    }
                }
            },
            activity: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myAccounts/activity',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'dataTransform'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    serviceNameMapper: {
                        $ref: 'serviceNameMapper'
                    },
                    activityServices: {
                        $ref: 'activityServices'
                    },
                    commonComponentsUtil: {
                        $ref: 'commonComponentsUtil'
                    }
                }
            },
            details: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myAccounts/details',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'dataTransform'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    serviceNameMapper: {
                        $ref: 'serviceNameMapper'
                    },
                    detailsServices: {
                        $ref: 'detailsServices'
                    },
                    expandedServices: {
                        $ref: 'expandedServices'
                    }
                }
            },

            expanded: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/myAccounts/expanded'
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'dataTransform'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    serviceNameMapper: {
                        $ref: 'serviceNameMapper'
                    },
                    expandedServices: {
                        $ref: 'expandedServices'
                    }
                }
            },
            footer: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/footer/footer',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'dataTransform'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    }
                }
            },
            qpSend: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/quickPay/qpSend',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'qpDataTransformSend'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    qpServices: {
                        $ref: 'qpServices'
                    },
                    logger: {
                        $ref: 'logger'
                    }
                }
            },
            qpTodo: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/quickPay/qpTodo',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'qpDataTransformActivities'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    qpServices: {
                        $ref: 'qpServices'
                    },
                    logger: {
                        $ref: 'logger'
                    }
                }
            },
            qpRequest: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/quickPay/qpRequest',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'qpDataTransformRequest'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    qpServices: {
                        $ref: 'qpServices'
                    },
                    logger: {
                        $ref: 'logger'
                    }
                }
            },
            qpSentActivity: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/quickPay/qpSentActivity',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'qpDataTransformActivities'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    qpServices: {
                        $ref: 'qpServices'
                    },
                    logger: {
                        $ref: 'logger'
                    }
                }
            },
            qpReceivedActivity: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/quickPay/qpReceivedActivity',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'qpDataTransformActivities'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    qpServices: {
                        $ref: 'qpServices'
                    },
                    logger: {
                        $ref: 'logger'
                    }
                }
            },
            quickpay: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/quickPay/qp',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'qpDataTransformSend'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    qpServices: {
                        $ref: 'qpServices'
                    },
                    logger: {
                        $ref: 'logger'
                    }
                },
            },
            qpEnroll: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/payments/quickPay/qpEnroll',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'qpDataTransformEnroll'
                    },
                    qpServices: {
                        $ref: 'qpServices'
                    },
                    logger: {
                        $ref: 'logger'
                    }
                }
            },

            /* Classic Controllers */

            // The basic classic controller
            classic: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/classic/classic'
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    logger: {
                        $ref: 'classicLogger'
                    }
                }
            },

            // The classic integration pattern standard header (minimized for most cases)
            standardHeader: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/classic/standardHeader'
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    logger: {
                        $ref: 'classicLogger'
                    }
                }
            },

            // This is the investments classic controller - currently the SAME as the basic one (for now)
            classicInvestments: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/classic/classic'
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    logger: {
                        $ref: 'classicLogger'
                    }
                }
            },

            // This is the investments header - currently the SAME as the default one for dashboard
            investmentsHeader: {
                create: {
                    module: 'blue/controller',
                    args: {
                        module: 'dashboard/controller/header/header',
                    }
                },
                properties: {
                    settings: {
                        $ref: 'settings'
                    },
                    dataTransform: {
                        $ref: 'dataTransform'
                    },
                    languageMapper: {
                        $ref: 'languageMapper'
                    },
                    statusCodeMapper: {
                        $ref: 'statusCodeMapper'
                    },
                    elementObserver: {
                        $ref: 'elementObserver'
                    }
                }
            }
        }
    },
    FormService: {
        paymentsActivity: {
            create: {
                module: 'blue/service',
                args: {
                    module: 'dashboard/service/payments/paymentsActivity/paymentsActivity'
                }
            }
        }
    },
    languageMapper: {
        module: 'dashboard/service/languageMapper'
    },
    summaryServices: {
        summary: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/myAccounts/summary'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    activityServices: {
        activity: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/myAccounts/activity'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    qpServices: {
        qpApi: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/payments/quickPay/qpApi'
                }, {
                    interceptors: [{
                        $ref: 'serverValidationStatusInterceptor'
                    }]
                }]
            }
        }
    },
    payeeServices: {
        payee: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/payments/merchantBillPay/payee'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        },
        payeeManual: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/payments/merchantBillPay/payeeManual'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    singlePaymentServices: {
        singlePayment: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/payments/merchantBillPay/singlePayment'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    paymentDateServices: {
        paymentDate: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/myAccounts/paymentDate'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    sharedPrivilegesServices: {
        paymentMenu: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/payments/paymentMenu/paymentMenu'
                }, {
                    interceptors: [{
                        $ref: 'paymentsInterceptor'
                    }]
                }]
			}
		}
	},

	addValidateServices: {
		callService:{
			create: {
				module: 'blue/service',
				args: [{
					module: 'dashboard/service/payments/manageFundingAccounts/addValidateServices'
				}]
			}
		}
	},
	cardFundingServices: {
		cardFundingServices: {
			create: {
				module: 'blue/service',
				args: [{
					module: 'dashboard/service/payments/manageFundingAccounts/cardFundingServices'
				}]
			}
		}
	},

    services: {
        form: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/form'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    paymentsActivityServices: {
        paymentsActivity: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/payments/paymentsActivity/paymentsActivity'
                }]
            }
        }
    },
    payeeActivityServices: {
        payeeActivity: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/payments/payeeActivity/payeeActivity'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    detailsServices: {
        details: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/myAccounts/details'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    expandedServices: {
        expanded: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/myAccounts/expanded'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    greetingServices: {
        greeting: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/conversationDeck/greeting'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    messagesServices: {
        messages: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/conversationDeck/messages'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }]
                }]
            }
        }
    },
    adsServices: {
        create: {
            module: 'blue/service',
            args: [{
                module: 'dashboard/service/conversationDeck/ads'
            }, {
                interceptors: [{
                    $ref: 'requestInterceptor'
                }]
            }]
        }
    },
    primarySearchServices: {
        primarySearch: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/conversationDeck/primarySearch'
                }]
            }
        }
    },
    myProfileServices: {
        mailingAddress: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/myProfile/mailingAddress'
                }, {
                    interceptors: [{
                        $ref: 'profileInterceptor'
                    }]
                }]
            }
        },
        email: {
            create: {
                module: 'blue/service',
                args: [{
                    module: 'dashboard/service/myProfile/email'
                }, {
                    interceptors: [{
                        $ref: 'requestInterceptor'
                    }, {
                        $ref: 'statusInterceptor'
                    }]
                }]
            }
        }
    },
    elementObserver: {
        create: {
            module: 'dashboard/lib/myProfile/elementObserver',
            args: [{}]
        }
    },
    commonComponentsUtil: {
        create: {
            module: 'dashboard/lib/myProfile/commonComponentsUtil',
            args: [{}]
        }
    },
    paymentsInterceptor: {
        module: 'dashboard/service/interceptor/payments/request'
    },
    requestInterceptor: {
        create: {
            module: 'dashboard/service/interceptor/myAccounts/request',
            args: [{
                $ref: 'locationAPI'
            }, {
                $ref: 'statusCodeMapper'
            }, {
                $ref: 'settings'
            }]
        }
    },
    profileInterceptor: {
        module: 'dashboard/service/interceptor/myProfile/request'
    },
    serverValidationStatusInterceptor: {
        create: {
            module: 'dashboard/controller/interceptor/serverValidationStatusInterceptor',
            args: [{}]
        }
    },
    statusInterceptor: {
        create: {
            module: 'blue/service/interceptor/status'
        }
    },
    dataTransform: {
        module: 'dashboard/service/myAccounts/dataTransform',
        properties: {
            settings: {
                $ref: 'settings'
            },
            languageMapper: {
                $ref: 'languageMapper'
            },
            statusCodeMapper: {
                $ref: 'statusCodeMapper'
            }
        }
    },
    dataTransformPaymentDate: {
        module: 'dashboard/service/myAccounts/dataTransformPaymentDate',
        properties: {
            settings: {
                $ref: 'settings'
            },
            languageMapper: {
                $ref: 'languageMapper'
            },
            statusCodeMapper: {
                $ref: 'statusCodeMapper'
            }
        }
    },
    profileDataTransform: {
        create: {
            module: 'dashboard/service/myProfile/dataTransform',
            args: [{
                $ref: 'settings'
            }]
        }
    },
    qpDataTransformSend: {
        create: {
            module: 'dashboard/component/payments/quickPay/qpDataTransformSend',
        },
        properties: {
            settings: {
                $ref: 'settings'
            }
        }
    },
    qpDataTransformRequest: {
        create: {
            module: 'dashboard/component/payments/quickPay/qpDataTransformRequest',
        },
        properties: {
            settings: {
                $ref: 'settings'
            }
        }
    },
    qpDataTransformActivities: {
        create: {
            module: 'dashboard/component/payments/quickPay/qpDataTransformActivities',
        },
        properties: {
            settings: {
                $ref: 'settings'
            }
        }
    },
    qpDataTransformEnroll: {
        create: {
            module: 'dashboard/component/payments/quickPay/qpDataTransformEnroll',
        },
        properties: {
            settings: {
                $ref: 'settings'
            }
        }
    },
    dataTransformMbp: {
        create: {
            module: 'dashboard/service/payments/merchantBillPay/dataTransform',
            languageMapper: {
                $ref: 'languageMapper'
            },
            statusCodeMapper: {
                $ref: 'statusCodeMapper'
            },
            args: [{
                $ref: 'settings'
            }]
        }
    },
    dataTransformSinglePayment: {
        create: {
            module: 'dashboard/service/payments/merchantBillPay/dataTransformSinglePayment',
            languageMapper: {
                $ref: 'languageMapper'
            },
            statusCodeMapper: {
                $ref: 'statusCodeMapper'
            },
            args: [{
                $ref: 'settings'
            }]
        }
    },
    dataTransformPaymentsActivity: {
        create: {
            module: 'dashboard/service/payments/paymentsActivity/dataTransformPaymentsActivity',
            languageMapper: {
                $ref: 'languageMapper'
            },
            statusCodeMapper: {
                $ref: 'statusCodeMapper'
            },
            args: [{
                $ref: 'settings'
            }]
        }
    },
    cardPaymentListDataTransform: {
        create: {
            module: 'dashboard/service/payments/manageFundingAccounts/CardPaymentListDataTransform',
            languageMapper: {
                $ref: 'languageMapper'
            },
            statusCodeMapper: {
                $ref: 'statusCodeMapper'
            },
            args: [{
                $ref: 'settings'
            }]
        }
    },
    locationAPI: {
        module: 'blue/with/locationAPI'
    },
    statusCodeMapper: {
        create: {
            module: 'dashboard/service/statusCodeMapper',
            args: [{
                $ref: 'settings'
            }]
        }
    },
    serviceNameMapper: {
        module: 'dashboard/service/myAccounts/serviceNameMapper'
    },
    //Defining logger message module for app
    logger: {
        create: {
            module: 'blue/log',
            args: '[dashboard]'
        }
    },
    classicLogger: {
        create: {
            module: 'blue/log',
            args: '[classic]'
        }
    },

    //Defining settings module for app
    settings: {
        module: 'blue/settings',
        init: {
            //set: [ { module: 'sample-mvc/settings'}, settings.Type.APP ]  CANNOT USE TYPE WITHIN WIRE
            set: [{
                module: 'dashboard/settings'
            }, 'APP']
        }
    },
    //Defining urlmapping for multiple controller load
    simpleUrlMapping: {
        create: {
            module: 'blue/mvc/mapper/mapping/simplePattern',
            args: {
                'index': 'header.index,paymentsMenu.index,megaMenu.index,index.index,footer.index',
                'accounts': 'header.index,paymentsMenu.index,megaMenu.index,index.index,footer.index',
                'scenario': 'scenario.index',
                'paymentsActivity': 'header.index,paymentsMenu.index,megaMenu.index,paymentsActivity.index,footer.index',
                'profile': 'header.index,megaMenu.index,profile.index,footer.index,paymentsMenu.ignore',
                'payments': 'header.index,paymentsMenu.index,megaMenu.index,payments.index,footer.index',
                'classicInvestments': 'investmentsHeader.index,megaMenu.index,classicInvestments.index,paymentsMenu.ignore',
                'manageFundingAccounts': 'header.index,megaMenu.index,footer.index,paymentsMenu.index,manageFundingAccounts.index',
                'classic': 'standardHeader.index,classic.index,paymentsMenu.ignore',
                'qp': 'header.index,paymentsMenu.index,megaMenu.index,quickpay.index,footer.index',
                'payeeManual': 'header.index,paymentsMenu.index,payeeManual.index,footer.index',
                'payee': 'header.index,paymentsMenu.index,payee.index,footer.index',
                'payBill': 'header.index,paymentsMenu.index,payBill.index,footer.index',
                'expanded': 'header.index,expanded.index,footer.index',
                'paymentDate': 'header.index,paymentDate.index,footer.index'
            }
        }
    },

    //Defining view mapping for framework
    simpleSelectorMapping: {
        create: {
            module: 'blue/mvc/mapper/mapping/simplePattern',
            args: {
                'paymentsActivity.index': '#content',
                'megaMenu.index': '#mega-menu',
                'header.index': '#header',
                'paymentsMenu.index': '#pnt-tabs',
                'paymentsMenu.ignore': '#pnt-tabs',
                'manageFundingAccounts.index': '#content',
				'payments.index': '#content',
                'index.index': '#content',
                'payBill.index': '#content',
                'payeeActivity.index': '#payee-activity-content',
                // 'footer.index': '#footer-content',
                'profile.index': '#content',
                'classic.index': '#content',
                'classicInvestments.index': '#content',
                'standardHeader.index': '#top-header-content',
                'quickpay.index': '#content',
                'expanded.getExpanded': '#content',
                'paymentDate.index': '#content',
                'payeeManual.index': '#content'
            }
        }
    },


    //Defining controller mapping with shell interceptor for framework
    controllerNameMapping: {
        create: 'blue/mvc/handler/mapping/controllerName'
    },

    handler: {
        create: {
            module: 'blue/mvc/handler'
        },
        properties: {
            mappings: [{
                $ref: 'simpleUrlMapping'
            }, {
                $ref: 'controllerNameMapping'
            }]
        }
    },
    //Defining view resolver for framework
    viewResolver: {
        create: 'blue/resolver/module',
        properties: {
            prefix: 'dashboard/view/'
        }
    },

    //Defining view mapping for framework
    viewNameMapping: {
        create: 'blue/mvc/targeter/mapping/viewName'
    },
    targeter: {
        create: 'blue/mvc/targeter',
        properties: {
            mappings: [{
                $ref: 'simpleSelectorMapping'
            }, {
                $ref: 'viewNameMapping'
            }]
        }
    },

    //Defining wire log module for app
    $plugins: [{
        module: 'blue/wire/log',
        trace: false
    }]
});
