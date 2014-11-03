define(function() {

	//TODO: Look into using Underscore to supply this collection /map lookup functionality
	//Found the underscore in lapis at this folder:
	//     /Users/e398585/GIT/accountactivity_diane/framework/lapis/js/mout/src/string/underscore.js
	//Will test require dependency integration with that folder soon

	//If underscore not possible yet, then refactor the following , abstract out the map look up core functionality as MapUtil or MapCollection class,
	//which takes the given map.
	//-- This is partially done by having created this optionsLookupMap class. This code is abstracted out to this optionsLookUpMap, but I'm still considering a MapCollection
	//class to house the getDataNames and getUIName functions. Then this  optionsLookMap will use the MapCollection and specialize in creating the options list
	//via the remaining function getBaseOptionsFilterObj below.


	//Revealing Prototype pattern - best of both worlds - private, public encapsulation and prototype members to save memory
	var OptionsMapLookup = function(theMapParam, theSelectedDataOptionParam, isAlphabeticalSortOrderParam, theFirstItemToBeNotSortedParam) {

		var reverseMap = function(map) {
			var rMap = {};
			for(var propName in map) {

				if (propName!=null&&propName.length>0) {
					var propValue = map[propName];
					rMap[propValue] = propName;

				}
			}
			return rMap;
		};

		if(typeof(theMapParam)==='undefined'||theMapParam===null) {
			throw 'optionsMapLookup ERROR no map defined!';
		}
		this.theMap = theMapParam;

		this.selectedDataOption = null;

		if(typeof(theSelectedDataOptionParam)!=='undefined'&&theSelectedDataOptionParam!==null) {
			this.selectedDataOption = theSelectedDataOptionParam;
		}

		if(typeof(isAlphabeticalSortOrderParam)!=='undefined' && isAlphabeticalSortOrderParam !== null ) {
			this.isAlphabeticalSortOrder = isAlphabeticalSortOrderParam;
		}
		else {
			this.isAlphabeticalSortOrder = true;
		}


		if(typeof(theFirstItemToBeNotSortedParam)!=='undefined'&&theFirstItemToBeNotSortedParam!==null) {
			this.theFirstItemToBeNotSorted = theFirstItemToBeNotSortedParam;
		}

		this.theReverseMap = reverseMap(theMapParam);

	};

	OptionsMapLookup.prototype = function() {
		var getMap = function() {

			return this.theMap;
		};


		var getDataNames = function() {

			var propNamesArray = [];
			//var theMap = getMap.apply(this);

			var firstItem = null;

			var dataValuesInPrefOrder = getDataValues.apply(this);
			//for(var prop in theMap) {
			for(var j=0; j<dataValuesInPrefOrder.length; j++) {

				var propValue = dataValuesInPrefOrder[j];

				if(propValue !== null && propValue.length > 0) {
					var propName= this.theReverseMap[propValue];

					if (propName!=null&&propName.length>0) {

						if( typeof(this.theFirstItemToBeNotSorted) !== 'undefined' && this.theFirstItemToBeNotSorted !== null &&
							this.theFirstItemToBeNotSorted === propName) {

							//do not add  now, save for later
							firstItem = propName;
						}
						else {
							propNamesArray[propNamesArray.length] = propName;
						}
					}
				}
			}



			if(firstItem!== null) {
				propNamesArray.unshift(firstItem);

			}


			return propNamesArray;
		};

		var getDataValues = function() {

			var propValuesArray = [];
			var theMap = getMap.apply(this);

			for(var propName in theMap) {
				if (propName!=null&&propName.length>0) {
					var propValue = theMap[propName];
					if(propValue!==null&&propValue.length>0) {
						propValuesArray[propValuesArray.length] = propValue;
					}
				}
			}

			if(this.isAlphabeticalSortOrder===true) {
				propValuesArray.sort();
			}

			return propValuesArray;

		};

		var getUIName = function(dataName) {

			var mapReturnValue = '';

			var theMap = getMap.apply(this);

			if(typeof(dataName)!=='undefined'&&dataName&&dataName.length>0) {
				var mapValue = theMap[dataName];
				if(mapValue!==null&&mapValue.length>0) {
					mapReturnValue = mapValue;
				}
			}
			return mapReturnValue;
		};

		var getBaseOptionsFilterObj = function() {

			var optionsFilterObj = [];

			var theMap = getMap.apply(this);

			var dataNames = getDataNames.apply(this);

			for(var i = 0; i<dataNames.length; i++) {

				var prop = dataNames[i];

				if (prop!=null&&prop.length>0) {
					var mapValue = theMap[prop];
					if(mapValue!==null&&mapValue.length>0) {
						var optionObj = { label: mapValue,
							value:prop,
							bindings:null};
						if(this.selectedDataOption!==null&&this.selectedDataOption.length>0&&prop===this.selectedDataOption) {
							optionObj.selected = true;
						}
						optionsFilterObj[optionsFilterObj.length] = optionObj;
					}
				}
			}

			return optionsFilterObj;
		};

		var getDefaultDataValue =  function() {
			return this.selectedDataOption;
		};



		return {
			getDataNames: getDataNames,
			getUIName: getUIName,
			getBaseOptionsFilterObj: getBaseOptionsFilterObj,
			getDefaultDataValue: getDefaultDataValue
		};


	}();

	return OptionsMapLookup;
}
);
