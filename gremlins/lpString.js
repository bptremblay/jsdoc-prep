/**
 * @author Julio Stanley
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module blue/template/helper/lpString
 * @requires handlebars
 * @example
 * {{#each tasks}}
 *    <div class="{{lpString complete 'complete:incomplete'}}" {{lpString complete 'data-complete="true"'}}>
 *        <div class="status {{lpString status 'WARN?yellow' 'ERROR?red' 'SUCCESS?green'}}"></div>
 *    </div>
 * {{/each}} - template.hbs  (template before pre-compilation)
 *
 * require( [ 'template', 'mycompiled/template'], function( Template, TemplateView ){
 *
 *	var context = { tasks: [
 *	  {desc: "First", complete: true, status:"WARN"},
 *	  {desc: "Second", complete: false, status:"ERROR"},
 *	  {desc: "Third", complete: true, status:"SUCCESS"}
 *	]
 * };
 * var html    = TemplateView(context);
 *
 * $('body').append(html);
 *
 * });
 */
define( [ 'blue/template' ], function lpStringModule( template ){

	template.registerHelper('lpString', function lpStringHelper() {

		// Get an array instance of the arguments
		var args = Array.prototype.slice.call( arguments );

		// Obtain the handlebars options object and the context if any
		var options    = args.pop(),
			context    = (args.length ? args.shift() : this), // for handlebars template this is the current context for the template being rendered
			contextStr = String( context ).toString(), // @note: Casting into String in case we are dealing with a primitive number value, this way we ensure access to toString
			ret        = '',
			pair;

		// If we only have one more argument then define an action, that could be true or false or the call of a filter at the view
		if( args.length === 1 && (args[0].match(/:/) || !args[0].match(/:|\?/)) )
		{
			pair = args[0].split(':');
			return new template.SafeString(context ? (pair[0]||'') : (pair[1]||''));
		}
		// If we got here then this is a multi-value context

		// For each of the args analyze the current context and possible value
		args.forEach(function( value ){

			// Get the pair definition ("true:complete")
			pair = value.split('?');

			// If the context's string represetation matches the first pair then the the string will be utilized
			ret += (contextStr === pair[0] ?
						pair[1]
						: '' ) + (options.hash.join || ''); // @review: Evaluate the need for a join...
		});

		// Return the output
		return new template.SafeString( ret );
	});
} );
