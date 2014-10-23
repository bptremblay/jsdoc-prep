define(function (require) {
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
