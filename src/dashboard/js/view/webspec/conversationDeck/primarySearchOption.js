/*Primary Search - type ahead web spec*/
define({
	name: 'PRIMARY_SEARCH_OPTIONS',
	bindings: {
		searchOptions: {
			field: 'searchOptions',
			direction: 'DOWNSTREAM'
		}
	},
	triggers: {
		select_search_option: {
			action: 'selectSearchOption',
			preventDefault: true
		},
		hide_search_options: {
			action: 'hideSearchOptions'
		},
		search_error: {
			action: 'searchError'
		}
	}
});
