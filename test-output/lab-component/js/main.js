define({
  target: 'body',
  appName: 'lab-component',
  appTemplate: {
    module: 'lab-component/template/app'
  },
  //Defining controller for app
  controllers: {
    create: 'blue/registry/controller',
    properties: {
      index: {
        create: {
          module: 'blue/controller',
          args: {
            module: 'lab-component/controller/index'
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
  //Defining view resolver for framework
  viewResolver: {
    create: 'blue/resolver/module',
    properties: {
      prefix: 'lab-component/view/'
    }
  },
  //Defining urlmapping for multiple controller load
  simpleUrlMapping: {
    create: {
      module: 'blue/mvc/mapper/mapping/simplePattern',
      args: {}
    }
  },
  //Defining view mapping for framework
  simpleSelectorMapping: {
    create: {
      module: 'blue/mvc/mapper/mapping/simplePattern',
      args: {
        'index.index': '#logon-content'
      }
    }
  },
  //Defining settings module for app
  settings: {
    module: 'blue/settings',
    init: {
      set: [{
        module: 'lab-component/settings'
      }, 'APP']
    }
  },
  //Defining logger message module for app
  logger: {
    create: {
      module: 'blue/log',
      args: '[lab-component]'
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
      args: [{}]
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