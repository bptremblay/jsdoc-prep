/**
 * @overview Builds a tree-like JSON string from the doclet data.
 * @version 0.0.3
 * @example ./jsdoc scratch/jsdoc_test.js -t templates/haruki -d console -q
 *          format=xml
 */

var root = {}, docs;

// TODO: include line number
// <a href="yes-module.js.html">yes-module.js</a>
// ,
// <a href="yes-module.js.html#line138">line 138</a>

function graft(parentNode, childNodes, parentLongname, parentName) {
    childNodes
            .filter(function(element) {
                return (element.memberof === parentLongname);
            })
            .forEach(
                    function(element, index) {
                        var i, len;

                        if (element.kind === 'namespace') {
                            if (!parentNode.namespaces) {
                                parentNode.namespaces = [];
                            }

                            var thisNamespace = {
                                'name' : element.name,
                                'description' : element.description || '',
                                'access' : element.access || '',
                                'virtual' : !!element.virtual,
                                'line' : element.meta.lineno,
                                'file' : element.meta.filename,
                                'range' : element.meta.range,
                                'scope' : element.scope
                            };

                            parentNode.namespaces.push(thisNamespace);

                            graft(thisNamespace, childNodes, element.longname,
                                    element.name);
                        } else if (element.kind === 'module') {
                            // console.warn(element);

                            if (!parentNode.modules) {
                                parentNode.modules = [];
                            }

                            var thisModule = {
                                'name' : element.name,
                                'description' : element.description || '',
                                'requires' : element.requires || [],
                                'author' : element.author || '',
                                'copyright' : element.copyright || '',
                                'exports' : element.exports || '',
                                'line' : element.meta.lineno,
                                'file' : element.meta.filename,
                                'range' : element.meta.range,
                                'scope' : element.scope
                            // 'access': element.access || '',
                            // 'virtual': !!element.virtual
                            };

                            parentNode.modules.push(thisModule);

                            graft(thisModule, childNodes, element.longname,
                                    element.name);
                        } else if (element.kind === 'mixin') {
                            if (!parentNode.mixins) {
                                parentNode.mixins = [];
                            }

                            var thisMixin = {
                                'name' : element.name,
                                'description' : element.description || '',
                                'access' : element.access || '',
                                'virtual' : !!element.virtual,
                                'line' : element.meta.lineno,
                                'file' : element.meta.filename,
                                'range' : element.meta.range,
                                'scope' : element.scope
                            };

                            parentNode.mixins.push(thisMixin);

                            graft(thisMixin, childNodes, element.longname,
                                    element.name);
                        } else if (element.kind === 'function') {
                            if (parentNode === root) {
                                return;
                            }

                            if (!parentNode.functions) {
                                parentNode.functions = [];
                            }
                            if (element.memberOf) {
                                console
                                        .warn('>>>>>>> WARNING: Harkuki found element.memberOf: '
                                                + element.memberOf);
                            }
                            var thisFunction = {
                                'name' : element.name,
                                'access' : element.access || '',
                                // 'memberOf' : element.memberOf || '',
                                'memberof' : element.memberof || '',
                                'virtual' : !!element.virtual,
                                'description' : element.description || '',
                                'parameters' : [],
                                'examples' : [],
                                'line' : element.meta.lineno,
                                'file' : element.meta.filename,
                                'range' : element.meta.range,
                                'scope' : element.scope
                            };

                            // { comment: '/**\n * @tofdo Add some jsDoc
                            // comments here!\n */',
                            // meta:
                            // { range: [ 1438, 1679 ],
                            // filename:
                            // 'mailingAddressAdditionVerification.js',
                            // lineno: 44,
                            // path:
                            // '/Users/f558910/Documents/Projects/jsdoc-prep/test-output/component/myProfile',
                            // code:
                            // { id: 'astnode100009291',
                            // name: 'addAddressSuccessCallback',
                            // type: 'FunctionExpression',
                            // value: 'function' } },
                            // todo: [ 'Add some jsDoc comments here!' ],
                            // name: 'addAddressSuccessCallback',
                            // longname:
                            // 'module:component/myProfile/mailingAddressAdditionVerification.addAddressSuccessCallback',
                            // kind: 'function',
                            // memberof:
                            // 'module:component/myProfile/mailingAddressAdditionVerification',
                            // scope: 'static',
                            // ___id: 'T000002R001185',
                            // ___s: true }

                            // console.warn(element);
                            // console.warn(thisFunction);

                            parentNode.functions.push(thisFunction);

                            if (element.returns) {
                                thisFunction.returns = {
                                    'type' : element.returns[0].type ? (element.returns[0].type.names.length === 1 ? element.returns[0].type.names[0]
                                            : element.returns[0].type.names)
                                            : '',
                                    'description' : element.returns[0].description
                                            || ''
                                };
                            }

                            if (element.examples) {
                                for (i = 0, len = element.examples.length; i < len; i++) {
                                    thisFunction.examples
                                            .push(element.examples[i]);
                                }
                            }

                            if (element.params) {
                                for (i = 0, len = element.params.length; i < len; i++) {
                                    thisFunction.parameters
                                            .push({
                                                'name' : element.params[i].name,
                                                'type' : element.params[i].type ? (element.params[i].type.names.length === 1 ? element.params[i].type.names[0]
                                                        : element.params[i].type.names)
                                                        : '',
                                                'description' : element.params[i].description
                                                        || '',
                                                'default' : element.params[i].defaultvalue
                                                        || '',
                                                'optional' : typeof element.params[i].optional === 'boolean' ? element.params[i].optional
                                                        : '',
                                                'nullable' : typeof element.params[i].nullable === 'boolean' ? element.params[i].nullable
                                                        : ''
                                            });
                                }
                            }
                        } else if (element.kind === 'member') {
                            if (parentNode === root) {
                                return;
                            }

                            if (!parentNode.properties) {
                                parentNode.properties = [];
                            }
                            parentNode.properties
                                    .push({
                                        'name' : element.name,
                                        'access' : element.access || '',
                                        'virtual' : !!element.virtual,
                                        'description' : element.description
                                                || '',
                                        'type' : element.type ? (element.type.length === 1 ? element.type[0]
                                                : element.type)
                                                : '',
                                        'line' : element.meta.lineno,
                                        'file' : element.meta.filename,
                                        'range' : element.meta.range,
                                        'scope' : element.scope
                                    });
                        } else if (element.kind === 'event') {
                            if (!parentNode.events) {
                                parentNode.events = [];
                            }

                            var thisEvent = {
                                'name' : element.name,
                                'access' : element.access || '',
                                'virtual' : !!element.virtual,
                                'description' : element.description || '',
                                'parameters' : [],
                                'examples' : [],
                                'line' : element.meta.lineno,
                                'file' : element.meta.filename,
                                'range' : element.meta.range,
                                'scope' : element.scope
                            };

                            parentNode.events.push(thisEvent);

                            if (element.returns) {
                                thisEvent.returns = {
                                    'type' : element.returns.type ? (element.returns.type.names.length === 1 ? element.returns.type.names[0]
                                            : element.returns.type.names)
                                            : '',
                                    'description' : element.returns.description
                                            || ''
                                };
                            }

                            if (element.examples) {
                                for (i = 0, len = element.examples.length; i < len; i++) {
                                    thisEvent.examples
                                            .push(element.examples[i]);
                                }
                            }

                            if (element.params) {
                                for (i = 0, len = element.params.length; i < len; i++) {
                                    thisEvent.parameters
                                            .push({
                                                'name' : element.params[i].name,
                                                'type' : element.params[i].type ? (element.params[i].type.names.length === 1 ? element.params[i].type.names[0]
                                                        : element.params[i].type.names)
                                                        : '',
                                                'description' : element.params[i].description
                                                        || '',
                                                'default' : element.params[i].defaultvalue
                                                        || '',
                                                'optional' : typeof element.params[i].optional === 'boolean' ? element.params[i].optional
                                                        : '',
                                                'nullable' : typeof element.params[i].nullable === 'boolean' ? element.params[i].nullable
                                                        : ''
                                            });
                                }
                            }
                        } else if (element.kind === 'class') {
                            if (parentNode === root) {
                                return;
                            }

                            if (!parentNode.classes) {
                                parentNode.classes = [];
                            }

                            var thisClass = {
                                'name' : element.name,
                                'alias' : element.alias || '',
                                'description' : element.classdesc || '',
                                'extends' : element.augments || element.extends
                                        || [],
                                'access' : element.access || '',
                                'virtual' : !!element.virtual,
                                'fires' : element.fires || '',
                                'constructor' : {
                                    'name' : element.name,
                                    'description' : element.description || '',
                                    'parameters' : [],
                                    'examples' : []
                                },
                                'line' : element.meta.lineno,
                                'file' : element.meta.filename,
                                'range' : element.meta.range,
                                'scope' : element.scope
                            };

                            parentNode.classes.push(thisClass);

                            if (element.examples) {
                                for (i = 0, len = element.examples.length; i < len; i++) {
                                    thisClass.constructor.examples
                                            .push(element.examples[i]);
                                }
                            }

                            if (element.params) {
                                for (i = 0, len = element.params.length; i < len; i++) {
                                    thisClass.constructor.parameters
                                            .push({
                                                'name' : element.params[i].name,
                                                'type' : element.params[i].type ? (element.params[i].type.names.length === 1 ? element.params[i].type.names[0]
                                                        : element.params[i].type.names)
                                                        : '',
                                                'description' : element.params[i].description
                                                        || '',
                                                'default' : element.params[i].defaultvalue
                                                        || '',
                                                'optional' : typeof element.params[i].optional === 'boolean' ? element.params[i].optional
                                                        : '',
                                                'nullable' : typeof element.params[i].nullable === 'boolean' ? element.params[i].nullable
                                                        : ''
                                            });
                                }
                            }

                            graft(thisClass, childNodes, element.longname,
                                    element.name);
                        }
                    });
}

/**
 @param {TAFFY} data
 @param {object} opts
 */
exports.publish = function(data, opts) {

    data({
        undocumented : true
    }).remove();

    docs = data().get(); // <-- an array of Doclet objects

    graft(root, docs);

    //dump(root);
    var fs = require('jsdoc/fs');
    //var path = require('jsdoc/path');
    fs.writeFileSync(opts.destination, JSON.stringify(root, null, 2), 'utf8');

};