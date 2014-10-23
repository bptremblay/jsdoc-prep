/*
 * Model lens that mirrors values into a blue store/enumerable
 */
define(function( require ) {
	var observable = require('blue/observable');
	return {
		/**
		 * Creates a lens for values in a blue store.
		 *
		 * @param a blue enumerable. i.e. cookie, local, session
		 * @param name of value in store
		 * @returns lens for value with given name in store
		 */
		lens: function(store, name) {
			var intialValue,
				methods = {
					store: store,
					name: name,
					get: function() {
						try {
							return store.get(name) || 0;
						} catch (error) {
							return null;
						}
					},
					set: function(context, value) {
						if (value !== undefined) {
							store.set(name, value);
						} else {
							store.remove(name);
						}
					}
				};

			try {
				intialValue = store.get(name);
			} catch (error) {
				// store.get throws an exception when store.set(name, undefined) is called.
				store.remove(name);
			}

			return observable.Model(intialValue).lens(methods);
		}
	};
});
