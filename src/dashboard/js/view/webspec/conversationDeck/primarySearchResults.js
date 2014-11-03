define({
    name: 'PRIMARY_SEARCH_RESULTS',
    bindings: {
     searchResults:{
      	direction: 'DOWNSTREAM'
  	  },
      searchRelatedQuestions:{
        direction: 'DOWNSTREAM'
      },
      needHelpOnSearch:{
        direction: 'DOWNSTREAM'
      },
      searchResultFeedbackOptions:{
        direction: 'DOWNSTREAM'
      },
      showGoBackLink: {
      	direction: 'DOWNSTREAM'
      }
    },
    triggers: {
  		'request_search_results': {
          action: 'requestSearchResults',
          preventDefault: true
      },
      'request_recent_searches': {
          action: 'requestRecentSearches',
          preventDefault: true
      },
      'close_search_result': {
        action:'closeSearchResult',
        preventDefault: true
      },
      'select_search_result': {
      	action: 'selectSearchResult',
        preventDefault: true
      },
      'request_previous_search_result': {
      	action: 'requestPreviousSearchResult',
        preventDefault: true
      }
    }
});
