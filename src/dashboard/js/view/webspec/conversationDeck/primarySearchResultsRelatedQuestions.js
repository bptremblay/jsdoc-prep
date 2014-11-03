define({
    name: 'PRIMARY_SEARCH_RESULTS_RELATED_QUESTIONS',
    bindings: {
     searchRelatedQuestions:{
     		field: 'searchRelatedQuestions',
      	direction: 'DOWNSTREAM'
  	  }
    },
    triggers: {
    		select_search_related_question: {
    			action: 'selectSearchRelatedQuestion',
          preventDefault: true
    		}
    }
});
