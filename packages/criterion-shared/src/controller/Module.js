/**
 * Top level view controller for modules (HR, Payroll, etc).
 */
Ext.define('criterion.controller.Module', function() {

    var ROUTES = criterion.consts.Route;

    return {

        extend : 'criterion.app.ViewController',

        mixins : [
            'criterion.controller.mixin.CardRouter'
        ],

        alias : 'controller.criterion_module',

        listen : {
            global : {
                employeeChanged : 'handleEmployeeChanged'
            }
        },

        handleCardRoute : function(card, subcard) {
            var cardCt = this.getCard(card),
                layout = this.getView().getLayout(),
                subCardCt;

            if ([ROUTES.HR.MAIN, ROUTES.PAYROLL.MAIN, ROUTES.RECRUITING.MAIN, ROUTES.SCHEDULING.MAIN, ROUTES.SETTINGS.MAIN].indexOf(card) !== -1) {
                Ext.GlobalEvents.fireEvent('switchPageByRouting', card, Ext.isString(subcard) ? subcard.split('/')[0] : null);
            }

            if (layout.getActiveItem() !== cardCt) {
                layout.setActiveItem(cardCt);
            }

            if (subcard) {
                subCardCt = cardCt.lookup(subcard);

                if (subCardCt) {
                    if (cardCt.getLayout().setActiveItem) {
                        cardCt.setActiveItem(subCardCt);
                    }
                }
            }
        },

        handleEmployeeChanged : function(employee) {
            this.activeEmployee = employee;
        }
    };

});
