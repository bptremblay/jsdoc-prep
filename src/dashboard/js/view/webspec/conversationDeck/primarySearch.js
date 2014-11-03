/*Primary Search - type ahead web spec*/
define({
	name: 'PRIMARY_SEARCH_QUERY',
	bindings: {
		searchFor: {
			field: 'searchFor',
			direction: 'BOTH',
			event: 'keyup'
		},
		defaultSearchOptions: {
			field: 'defaultSearchOptions',
			direction: 'DOWNSTREAM'
		},
		searchOptionsCount: {
			field: 'searchOptionsCount',
			direction: 'DOWNSTREAM'
		},
		searchOptionsResponse: {
			field: 'searchOptionsResponse',
			direction: 'DOWNSTREAM'
		}
	},
	triggers: {
		request_default_search_options: {
			action: 'requestDefaultSearchOptions',
			preventDefault: true
		},
		request_type_ahead_search_options: {
			action: 'requestTypeAheadSearchOptions',
			preventDefault: true
		},
		clear_search_for: {
			action: 'clearSearchFor',
			preventDefault: true
		},
		hide_search_options: {
			action: 'hideSearchOptions'
		},
		request_search_results: {
			action: 'requestSearchResults',
			preventDefault: true
		},
		request_default_search_options_result: {
			action: 'requestDefaultSearchOptionsResult',
			preventDefault: true
		},
		'document:click': {
			action: 'hideDefaultSearchOptionsIfOpen'
		}
	}
});
