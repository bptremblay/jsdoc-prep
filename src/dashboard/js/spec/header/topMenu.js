define([], function() {
    return {
        name: 'TOPMENU',
        data: {
            navigation: {}
        },
        actions: {
            'everyday_living_click': true,
            'investments_click': true,
            'goals_click': true,
            'top_menu_navigation': true
        },
        states: {
            'enable_everyday_living': true,
            'enable_investments': true,
            'enable_goals': true
        }
    };
});