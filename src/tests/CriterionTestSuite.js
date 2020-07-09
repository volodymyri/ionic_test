Class('criterion.TestSuite', {

    isa : Siesta.Test.ExtJS,

    methods : {

        waitForThrottledAjax : function(callback, scope, timeout) {
            var Ext = this.Ext();
            var msg, counter = 0, interval;

            interval = setInterval(function() {
                counter++;
            }, 100);

            msg = ' ' + Siesta.Resource('Siesta.Test.ExtJS.Ajax', 'allAjaxRequestsToComplete');

            return this.waitFor({
                method : function() {
                    var result = false;

                    if (Ext.Ajax.isLoading()) {
                        counter = 0;
                    } else {
                        if (counter > 5) {
                            clearInterval(interval);
                            result = true;
                        }
                    }

                    return result;
                },
                callback : callback,
                scope : scope,
                timeout : timeout,
                assertionName : 'waitForThrottledAjax',
                description : msg
            });
        },

        waitForActiveCard : function(cardCt, activeCardSelector, callback, scope) {
            var me  = this,
                Ext = me.getExt();

            return this.waitFor({
                method      : function () {
                    var card = Ext.first(activeCardSelector),
                        container = cardCt.isComponent ? cardCt : Ext.first(cardCt);

                    return card && container && container.getLayout().getActiveItem() === card
                },
                callback    : callback,
                scope       : scope,
                timeout     : 1000, // use fixed short timeout
                assertionName   : 'waitForActiveCard',
                description     : ' ' + 'for active card ' + ': ' + activeCardSelector
            });
        }
    }
});