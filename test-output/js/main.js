/**
 * @module js/main
 */
define({
  target: 'body',
  appName: 'logon',
  appTemplate: {
    module: 'logon/template/app'
  },
  settingsUtil: {
    module: 'blue/settings/util'
  },
  //Defining controller for app
  controllers: {
    create: 'blue/registry/controller',
    properties: {
      logon: {
        create: {
          module: 'blue/controller',
          args: {
            module: 'logon/controller/logon'
          }
        },
        properties: {
          services: {
            $ref: 'services'
          },
          settings: {
            $ref: 'settings'
          },
          sessionStore: {
            $ref: 'sessionStore'
          },
          dynamicContentUtil: {
            $ref: 'dynamicContentUtil'
          }
        }
      },
      menu: {
        create: {
          module: 'blue/controller',
          args: {
            module: 'logon/controller/menu'
          }
        },
        properties: {
          settings: {
            $ref: 'settings'
          }
        }
      },
      mfa: {
        create: {
          module: 'blue/controller',
          args: {
            module: 'logon/controller/mfa'
          }
        },
        ready: 'ready',
        properties: {
          services: {
            $ref: 'services'
          },
          settings: {
            $ref: 'settings'
          },
          sessionStore: {
            $ref: 'sessionStore'
          },
          dynamicContentUtil: {
            $ref: 'dynamicContentUtil'
          }
        }
      },
      passwordreset: {
        create: {
          module: 'blue/controller',
          args: {
            module: 'logon/controller/passwordReset'
          }
        },
        ready: 'ready',
        properties: {
          services: {
            $ref: 'services'
          },
          settings: {
            $ref: 'settings'
          },
          logger: {
            $ref: 'logger'
          },
          sessionStore: {
            $ref: 'sessionStore'
          }
        }
      },
      scenario: {
        create: {
          module: 'blue/controller',
          args: {
            module: 'logon/controller/scenario'
          }
        },
        properties: {
          settings: {
            $ref: 'settings'
          }
        }
      }
    }
  },
  services: {
    otp: {
      create: {
        module: 'blue/service',
        args: [{
          module: 'logon/service/otp'
        }, {
          interceptors: [{
            $ref: 'requestInterceptor'
          }]
        }]
      }
    },
    auth: {
      create: {
        module: 'blue/service',
        args: [{
          module: 'logon/service/auth'
        }, {
          interceptors: [{
            $ref: 'requestInterceptor'
          }]
        }]
      }
    }
  },
  requestInterceptor: {
    create: {
      module: 'logon/service/interceptor/request',
      args: [{
        $ref: 'settings'
      }]
    }
  },
  //Defining view resolver for framework
  viewResolver: {
    create: 'blue/resolver/module',
    properties: {
      prefix: 'logon/view/'
    }
  },
  //Defining urlmapping for multiple controller load
  simpleUrlMapping: {
    create: {
      module: 'blue/mvc/mapper/mapping/simplePattern',
      args: {
        index: 'logon.index,menu.index,scenario.index',
        success: 'logon.success,menu.index',
        secauth: 'mfa.index,menu.index',
        'forgot-password': 'passwordreset.index,menu.index',
        deliveryoptions: 'menu.index,mfa.options',
        validatecode: 'menu.index,mfa.submit'
      }
    }
  },
  //Defining view mapping for framework
  simpleSelectorMapping: {
    create: {
      module: 'blue/mvc/mapper/mapping/simplePattern',
      args: {
        'logon.index': '#logon-content',
        'menu.index': '#login-nav',
        'scenario.index': '#scenario',
        'mfa.index': '#logon-content',
        'mfa.options': '#logon-content',
        'mfa.submit': '#logon-content',
        'passwordreset.index': '#logon-content',
        'passwordreset.found': '#logon-content',
        'logon.success': '#logon-content' /* temporary */
      }
    }
  },
  //Defining settings module for app
  settings: {
    module: 'blue/settings',
    init: {
      set: [{
        module: 'logon/settings'
      }, 'APP']
    }
  },
  //Defining logger message module for app
  logger: {
    create: {
      module: 'blue/log',
      args: '[logon]'
    }
  },
  sessionStore: {
    create: {
      module: 'blue/store/enumerable/session',
      args: ['logonSession']
    }
  },
  dynamicContentUtil: {
    create: {
      module: 'common/utility/dynamicContentUtil'
    }
  },
  //////////////////////BOILERPLATE///////////////////////////////////
  //Defining controller mapping with shell interceptor for framework
  controllerNameMapping: {
    create: 'blue/mvc/handler/mapping/controllerName'
  },
  handler: {
    create: {
      module: 'blue/mvc/handler',
      args: []
    },
    properties: {
      mappings: [{
        $ref: 'simpleUrlMapping'
      }, {
        $ref: 'controllerNameMapping'
      }]
    }
  },
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