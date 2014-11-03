define([], function() {
    return {
        'name': 'megaMenu',
        'data': {
            'navigation': {},
            'logoUrl': ''
        },
        'actions': {
            'document_click': true,
            'contact_details_click': true,
            'demos_click': true,
            'legal_det_click': true,
            'update_logo': true,
            'atm_pref': true,
            'message_center': true
        },
        'states': {
            'enable_documents': true,
            'enable_contact_details': true,
            'enable_demos': true,
            'enable_legal_details': true
        }
    };
});