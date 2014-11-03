/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module dashboard/lib/myProfile/commonComponentsUtil
 **/
define(function(require) {
	var settings = require('blue/settings'),
		localeContent = settings.get('LOCALIZED_CONTENT', settings.Type.PERM);
	return {
		/**
		 * @function
		 * @param {string} type Collection type for which list to be returned
		 * @param {string} keyName Name of key used in object to be returned
		 * @param {string} valueName Name of value used in object to be returned
		 * Returns list of key value pair for a given collection type from localized content.
		 * localized content file shoud be defined as <type>.<key>=<value>
		 */
		getList: function(type, keyName, valueName){
			var reg = new RegExp('^' + type + '.'),
				keyName = keyName || 'code',
				valueName = valueName || 'description',
				list = [];
			for (var key in localeContent) {
				if(reg.test(key)){
					var item = {};
					item[keyName] = key.replace(reg,'');
					item[valueName] = localeContent[key];
					list.push(item);
				}
			}
			return list;
		},
		/**
		 * @function
		 * @param {string} type Collection type in which looking for key
		 * @param {string} key Name of key
		 * Returns value of key for given collection type.
		 */
		getValue: function(type, key){
			return localeContent[type + '.' + key];
		}
	};
});