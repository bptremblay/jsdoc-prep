define(function (require) {
	var context = null,
		self = null,
		isAlphabetical = function(keyCode) {
			return keyCode >= 65 && keyCode < 91;
		},
		searchAndSelect = function(searchString, $list) {
			var i = 0, match = -1;
			while(i < $list.length && match === -1) {
				(beginsWith($list[i].innerHTML.toLowerCase(), searchString)) && (match = i);
				++i;
			}
			return match;
		},
		beginsWith = function(searchString, matchString) {
			if(searchString === "" || matchString === "") {
				return false;
			} else {
				return searchString.indexOf(matchString) === 0;
			}
		},
		findNextThatBeginsWithSameLetter = function(character, $list, $selectedItem) {
			var i = 0, matchIndex = -1;

			// Find position of selected item in list
			while(i < $list.length && matchIndex === -1) {
				if ($list[i] === $selectedItem[0]) {
					matchIndex = i;
				} else {
					++i;
				}
			}
			i = (matchIndex + 1) > $list.length - 1 ? matchIndex : matchIndex + 1;
			matchIndex = -1;
			if(i !== -1) {
				// Start from the selected item and search for next item that begins with the same letter
				while(i < $list.length && matchIndex === -1) {
					if($list[i].innerHTML.toLowerCase().charAt(0) === character) {
						matchIndex = i;
					} else {
						++i;
					}
				}

				// Reached the last item that begins with letter, so start from the beginnning and find first
				if(matchIndex === -1) {
					i = 0;
					while(i < $list.length && matchIndex === -1) {
						if($list[i].innerHTML.toLowerCase().charAt(0) === character) {
							matchIndex = i;
						} else {
							++i;
						}
					}
				}

				return matchIndex;
			}
		},
		searchReset = function(thisObj) {
			setTimeout(function() {
				var model = thisObj.model.get();
				model.searchString = "";
				thisObj.model.set(model);
			}, 1000);
		},
		isMenuOpen = function($menu) {
			return $menu.hasClass('show');
		};
	return {
		init: function() {
			context = this.settings.context;
			var model = this.model.get();

			model.searchString = "";
			this.model.set(model);
		},
		setSelected: function($target) {
			var targetIsSelect = $target.is('select'),
				model = this.model.get(),
				$select = model.selectId ? $('#' + model.selectId) : null,
				$styledSelect = $('#' + model.styledSelectId),
				$selectedItem = $styledSelect.find('.selected');

			targetIsSelect && ($target = $menuSelect.find("li").eq($target[0].selectedIndex));
			if($target.length) {
				$target.siblings().removeClass("selected").end().addClass("selected");
				$styledSelect.find('.field').text($target.text());
				if(!targetIsSelect && $select) {
					$select.val($target.attr('rel')).trigger('change');
				}
				$selectedItem.blur();
				$target.focus();
			}
		},
		show: function() {
			var model = this.model.get();
			$('#' + model.styledSelectId).addClass('show').find('.selected').focus();
		},
		hide: function() {
			var model = this.model.get();
			$('#' + model.styledSelectId).removeClass('show').find('.field').focus();
		},
		toggle: function() {
			var model = this.model.get(),
				$styledSelect = $('#' + model.styledSelectId);

			$styledSelect.toggleClass("show");
			if($styledSelect.attr("class").indexOf("show") >= 0) {
				$styledSelect.find("li.selected").focus();
			} else {
				$styledSelect.focus();
			}
		},
		selectOption: function($target) {
			var model = this.model.get();
			this.setSelected($target);
			$target.addClass('is-pressed');
			setTimeout(function() {
				$('#' + model.styledSelectId).removeClass('show').find('.field').trigger("focus")
				$target.removeClass('is-pressed');
			}, 100)
		},
		removeOptionFocus: function($target) {
			$target.siblings().removeClass("selected").blur();
		},
		fieldKeydown: function($target, event) {
			if(event.keyCode === 13) {
				this.toggle();
			}
		},
		optionKeydown: function($target, event) {
			var keyCode = event.keyCode,
				model = this.model.get(),
				searchString = model.searchString,
				$styledSelect = $('#' + model.styledSelectId),
				$selectedItem = $styledSelect.find('.selected'),
				$optionsList = $styledSelect.find('.option'),
				match = -1;

			event.preventDefault();
			clearTimeout(searchReset);

			if(keyCode === 40) {
				this.setSelected($selectedItem.next(".option"));
			} else if(keyCode === 38) {
				this.setSelected($selectedItem.prev(".option"));
			} else if(keyCode === 9 || keyCode === 27) { // escape or tab closes menu
				$styledSelect.removeClass("show");
			} else if(keyCode === 34) { // page down selects last item
				this.setSelected($optionsArray[$optionsArray.length - 1]);
			} else if(keyCode === 33) { // page up selects first item
				this.setSelected($optionsArray[0]);
			} else if(isAlphabetical(keyCode)) { // letters
				var characterEntered = String.fromCharCode(keyCode).toLowerCase();
				if(characterEntered === searchString.charAt(searchString.length - 1) || searchString.length === 0) {
					// same character entered more than once in a row or only one character has been entered
					searchString += characterEntered;
					match = findNextThatBeginsWithSameLetter(characterEntered, $optionsList, $selectedItem);
					this.setSelected($($optionsList[match]));
					searchReset(this);
				} else {
					searchString += characterEntered;
					match = searchAndSelect(searchString, $optionsList);
					this.setSelected($($optionsList[match]));
					searchReset(this);
				}
				model.searchString = searchString;
				this.model.set(model);
			} else if(keyCode === 13) {
				this.selectOption($target);
			}
			else {
				return false;
			}
		}
	}
});
