define(function() {
    return {
        readCookie: function(name) {
            var nameEQ = name + '=',
                ca = document.cookie.split(';'),
                c;

            for (var i = 0; i < ca.length; i++) {
                c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length).split('|')[0];
                }
            }
            return '';
        },

        writeCookie: function(name, value, domain) {
            var domainSegment = '';
            if (domain !== undefined && domain !== null && domain.length > 0) {
                domainSegment = ', domain=' + domain;
            }
            document.cookie = name + '=' + value + domainSegment + ', path=/, secure';
        }
    };
});
