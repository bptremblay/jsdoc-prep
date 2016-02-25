define(function(require) {
    String.prototype.lcFirst = function () {
        return this.replace(this.charAt(0), this.charAt(0).toLowerCase());
    };
    String.prototype.ucFirst = function () {
        return this.replace(this.charAt(0), this.charAt(0).toUpperCase());
    };
    String.prototype.toCamelCase = function (delim) {
        return this.toSnakeCase(delim).lcFirst();
    };
    String.prototype.toSnakeCase = function (delim) {
        var str = '';
        this.split(delim).forEach(function(piece) {
            str += piece.toLowerCase().ucFirst();
        });
        return str;
    };
    return require('blue/declare')({
        constructor: function ModalApi(contr) {
            var cancelData = {isDirty: {flag: false, id: null}, tgtData: null};
            var controller = contr;
            var dynamicContentUtil = null;
            var getModel = function(compName) {
                var model = controller.model.lens(compName).get() || {};
                if (model.hasOwnProperty('showModal')) {
                    return controller.model.lens(compName);
                }
                model[compName] = {showModal: false};
                return require('blue/observable').Model.combine(model).lens(compName);
            };
            var getIsDirty = function() {
                return cancelData.isDirty;
            };
            var setIsDirty = function(data) {
                cancelData.isDirty = data;
                controller.controllerChannel.emit('trigger', {
                    data: data,
                    value: 'setIsDirty'
                });
            };
            var createListener = function() {
                log({logName: '[modalApi::createListener]', message: 'create listener...'});
                var getListenerComponent = function() {
                    return {
                        init: function() {
                            this.startCancelListener = function(data) {
                                log({logName: '[modalApi::listenerComponent]', message: ['start listeners', data]});
                                this.output.emit('state', {data: data, value: 'startCancelListener'}, 'startCancelListener');
                            };
                            this.stopCancelListener = function() {
                                this.output.emit('state', {value: 'stopCancelListener'});
                            };
                        }
                    };
                };
                var getListenerView = function() {
                    return function view() {
                        this.template = {v:1,t:[]};
                        this.bridge = this.createBridge({
                            name: 'LISTENER', bindings: {}, triggers: {}
                        });
                        this.handlers = {};
                        this.init = function(){
                            log({logName: '[modalApi::listenerView::init]', message: this.bridge});
                            var self = this;
                            self.bridge.on('state/startCancelListener', function( data ) {
                                data = data.data || {};
                                log({logName: '[modalApi::listenerView]', message: ['start listeners', data]});
                                if (Object.prototype.hasOwnProperty.call(data, 'handlers')) { self.handlers = data.handlers; }
                                for (var evtType in self.handlers) {
                                    if (self.handlers.hasOwnProperty(evtType)) {
                                        log({logName: '[modalApi::listenerView::startCancelListener]', message: 'setting global ' + evtType + ' event...'});
                                        $('#dashboard-content').unbind(evtType).bind(evtType, self.handlers[evtType]);
                                    }
                                }
                            });
                            self.bridge.on('state/stopCancelListener', function() {
                                for (var evtType in self.handlers) {
                                    if (self.handlers.hasOwnProperty(evtType)) {
                                        log({logName: '[modalApi::listenerView::stopCancelListener]', message: 'unsetting global ' + evtType + ' event...'});
                                        $('#dashboard-content').unbind(evtType);
                                    }
                                }
                            });

                        };
                    };
                };
                controller.register.components(controller, [{
                    name: 'listenerComponent',
                    model: require('blue/observable').Model.combine({listenerComponent: {}}).lens('listenerComponent'),
                    spec: {name: 'LISTENER', data: {}, actions: {}, settings: {}},
                    methods: getListenerComponent()
                }]);
                controller.executeCAV(
                    [controller.components.listenerComponent, getListenerView(), {
                        append: true,
                        target: $('.overlay'),
                        react: false
                    }]
                );
            };
            var log = function(data) {
                if (data.hasOwnProperty('logName')) {
                    controller.context.logger.name = data.logName;
                }
                controller.context.logger[data.type || 'info'](data.message);
            };

            var template; //, model, component, spec, view, webSpec;
            var cancelConfirmationMethods = function(name) {
                var component = {
                    init: function() {
                        this.actionFunctions = {cancelFunction: function() {}, doNotCancelFunction: function() {}};
                        this.setModalState = function(state, data) {
                            this.output.emit('state', {
                                target: this,
                                restartListener: data,
                                value: state + 'CancelConfirmation'
                            });
                        }.bind(this);
                        log({logName: '[modalApi::Component::init]', message: this});
                    },
                    showCancelConfirmation: function(actions) {
                        log({logName: '[modalApi::Component::showCancelConfirmation]', message: [this.model.lens('showModal').get(), actions]});
                        this.actionFunctions = actions;
                        this.setModalState('show', null);

                    }
                };
                var shortName = name.replace('_confirmation', '');
                component['confirm' + shortName.toSnakeCase('_')] = function() {
                    log({logName: '[modalApi::Component::cancel]', message: this.actionFunctions});
                    this.setModalState('hide', false);
                    this.actionFunctions.cancelFunction();
                };
                component['doNot' + shortName.toSnakeCase('_')] = function() {
                    log({logName: '[modalApi::Component::doNotCancel]', message: this.actionFunctions});
                    this.setModalState('hide', true);
                    this.actionFunctions.doNotCancelFunction();
                };
                log({logName: '[modalApi::component]', message: component});
                return component;
            };
            var cancelConfirmationSpec = function(name) {
                var spec = {
                    'name': name.toUpperCase(),
                    'data': {
                        'show_modal': {
                            type: 'OnOff'
                        }
                    },
                    'actions': {},
                    'settings': {}
                };
                name = name.toLowerCase().replace('_confirmation', '');
                spec.actions['confirm_' + name] =  true;
                spec.actions['do_not_' + name] = true;
                spec.settings['confirm_' + name + '_label'] = true;
                spec.settings['do_not_' + name + '_label'] = true;
                spec.settings[name + '_confirmation_header'] = true;
                spec.settings[name + '_confirmation_advisory'] = true;
                log({logName: '[modalApi::spec]', message: spec});
                return spec;
            };
            var cancelConfirmationWebspec = function(name) {
                var webSpec = {
                    name: name.toUpperCase(),
                    bindings: {
                        'showModal': {
                            type: 'OnOff',
                            direction: 'BOTH'
                        }
                    },
                    triggers: {}
                };
                name = name.toLowerCase().replace('_confirmation', '').toSnakeCase('_');
                webSpec.triggers['confirm' + name] = {
                    action: 'confirm' + name
                };
                webSpec.triggers['doNot' + name] = {
                    action: 'doNot' + name
                };
                log({logName: '[modalApi::webSpec]', message: webSpec});
                return webSpec;
            };
            return {
                getIsDirty: function() {
                    return getIsDirty().flag;
                },
                getDirtyId: function() {
                    return getIsDirty().id;
                },
                getTgtData: function() {
                    return cancelData.tgtData;
                },
                removeListener: function() {
                    if (controller.components.hasOwnProperty('listenerComponent')) {
                        controller.components.listenerComponent.destroy();
                        delete controller.components.listenerComponent;
                    }
                },
                resetCancelData: function() {
                    cancelData.tgtData = null;
                    setIsDirty({flag: false, id: ''});
                },
                setIsDirty: setIsDirty,
                startListener: function(data) {
                    if (!controller.components.hasOwnProperty('listenerComponent')) {
                        createListener();
                    }
                    controller.components.listenerComponent.startCancelListener(data);
                },
                stopListener: function() {
                    if (controller.components.hasOwnProperty('listenerComponent')) {
                        controller.components.listenerComponent.stopCancelListener();
                    }
                },
                setTgtData: function(data) {
                    cancelData.tgtData = data;
                },
                showCancelConfirmation: function(name, path, actions, target, extras) {
                    extras = extras || {};
                    var objs = extras.objs || {};
                    var tmpl = 'dashboard/template/' + path + name.toCamelCase('_');
                    target = target || '#cancel_confirmation';
                    var compName = name.toCamelCase('_') + 'Component';
                    var createModal = function(tmplObj) {
                        template = tmplObj;
                        if (!template.t[0].f[0].hasOwnProperty('o')) {
                            template.t[0].f[0].o = 'restrictTabbing';
                        }
                        controller.register.components(controller, [{
                            name: compName,
                            model: getModel(compName),
                            spec: objs.spec || cancelConfirmationSpec(name),
                            methods: objs.component || cancelConfirmationMethods(name)
                        }]);

                        if (extras.hasOwnProperty('dynamicContent')) {
                            /**
                            * Sets the value of the modal's placeholders
                            * i.e. extras.dynamicContent = {headerLabel: {placeholder: value}, advisoryLabel: {placeholder: value}}
                            **/
                            dynamicContentUtil = dynamicContentUtil || require('common/utility/dynamicContentUtil');
                            Object.keys(extras.dynamicContent).forEach(function(key){
                                dynamicContentUtil.dynamicContent.set(controller.components[compName], key, extras.dynamicContent[key]);
                            });
                        }

                        log({logName: '[modalApi::createModal]', message: ['after register...', controller]});
                        controller.executeCAV(
                            [controller.components[compName], objs.view || cancelConfirmationView(name, target), {
                                append: false,
                                target: target,
                                react: true
                            }]
                        );
                        log({logName: '[modalApi::createModal]', message: 'execCAV complete'});
                        controller.components[compName].showCancelConfirmation(actions);
                    };
                    var cancelConfirmationView = function(name, target) {
                        target = target || '#cancel_confirmation_message';
                        return function cancelConfirmView() {
                            var self = this;
                            this.viewName = name.toCamelCase('_');
                            this.template = template;
                            this.views = {
                                'buttonElement' : require('dashboard/view/common/buttonElement')
                            };
                            this.decorators = {
                                'restrictTabbing': require('dashboard/lib/common/modal/restrictTabbing')(this)
                            };
                            this.init = function(){
                                self.hiddenElements = [];
                                self.bridge = self.createBridge(objs.webSpec || cancelConfirmationWebspec(name));
                                self.bridge.on('state/showCancelConfirmation', function() {
                                    log({logName: '[modalApi::View]::state/showConfirmation]', message: [target, self]});
                                    self.hiddenElements = [];
                                    self.model.showModal = true;
                                    if (self.controller.components.hasOwnProperty('listenerComponent')) {
                                        self.controller.components.listenerComponent.stopCancelListener();
                                    }
                                    //ADA Compliance
                                    //$(target + ' .modal-body').css('outline', 'none');
                                    $('#dashboard-content *').filter('a, button, :input, [tabindex]').not('[tabIndex=-1]').each(function(idx, item) {
                                        self.hiddenElements.push({e: $(item), d: $(item).css('display')});
                                        $(item).css({display: 'none'});
                                    });
                                    $('#dashboard-content *').attr('aria-hidden', true);
                                    $(target + ' *').filter('a, button, :input, [tabindex]').not('[tabIndex=-1]').css({display: 'inline-block'});
                                    $(target + ' *').attr('aria-hidden', false);
                                    $(target + ' .modal-body h1').attr('tabindex', -1).focus();
                                }.bind(self));
                                self.bridge.on('state/hideCancelConfirmation', function(d) {
                                    log({logName: '[modalApi::View]::state/showConfirmation]', message: d});
                                    self.model.showModal = false;
                                    if (d.restartListener) {
                                        if (self.controller.components.hasOwnProperty('listenerComponent')) {
                                            self.controller.components.listenerComponent.startCancelListener();
                                        }
                                    }
                                    //ADA Compliance
                                    $('#dashboard-content *').attr('aria-hidden', false);
                                    for (var i in self.hiddenElements) {
                                        if (!isNaN(parseFloat(i)) && isFinite(i)) {
                                            self.hiddenElements[i].e.css({display: self.hiddenElements[i].d});
                                        }
                                    }
                                    $(target + ' *').filter('a, button, :input, [tabindex]').not('[tabIndex=-1]').css({display: 'none'});
                                    $(target + ' *').attr('aria-hidden', true);
                                }.bind(self));
                                log({logName: '[modalApi::view]', message: this});
                            };
                        };
                    };
                    try {
                        if (objs.hasOwnProperty('template')) {
                            createModal(objs.template);
                        } else {
                            require([tmpl], function(tmplObj){
                                createModal(tmplObj);
                            });
                        }
                    } catch(ex) { log({logName: '[modalApi::showCancelConfirmation]', message: ['caught', ex]}); }
                }
            };
        }
    });
});
