//fix-coffee

(function () {
    use strict;

    function y() {
        console.warn('Y has happened!');
    }

    function fixCofeeJs() {
        var x = 100;
        if (x === 100) {
            y();
        }
    }

    //<-- indentation
    //<-- indentation
    //<-- indentation
})();