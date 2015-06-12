/**
 * 
 * @module myProfile/ElementObserver
 */
define(function(require) {

    return function ElementObserver() {

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
            elements = [],
            observer;

            if(MutationObserver){
                observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        for(i=0, l = mutation.addedNodes.length; i <l; i++){
                            elements.forEach(function(element){
                                if(mutation.addedNodes[i].parentNode && mutation.addedNodes[i].parentNode.querySelector(element.selector)){
                                    element.callback.call(this, element.selector);
                                    element.isInserted = true;
                                }
                            });
                        }
                    });
                    elements.forEach(function(element, index){
                        element.isInserted && elements.splice(index, 1);
                    });
                    !elements.length && observer.disconnect();
                });

                this.isInserted = function(elementSelector, callbackFunction){
                    if(document.querySelector(elementSelector)){
                        callbackFunction.call(this, elementSelector);
                    } else {
                        if(!elements.length){
                            observer.observe(document.body, { childList: true, subtree: true });
                        }
                        elements.push({ 'selector': elementSelector, 'callback': callbackFunction });
                    }
                }
            } else {
                this.isInserted = function(elementSelector, callbackFunction){
                    if(document.querySelector(elementSelector)) {
                        callbackFunction.call(this, elementSelector);
                    } else {
                        var intervalId = setInterval( function(){
                           if(document.querySelector(elementSelector)){
                                callbackFunction.call(this, elementSelector);
                                clearInterval(intervalId);
                           }
                        }, 50);
                    }
                }
            }
        return this;
    };
});
