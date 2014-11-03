define({
    name: 'SITE_EXIT_WARNING',
    bindings: {},
    triggers: {
        'do_not_proceed_to_external_site': {
            action: 'doNotProceedToExternalSite',
            preventDefault: true
        },
        'proceed_to_external_site': {
            action: 'proceedToExternalSite',
            preventDefault: true
        },
    }
});
