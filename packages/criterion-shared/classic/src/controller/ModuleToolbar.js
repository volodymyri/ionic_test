Ext.define('criterion.controller.ModuleToolbar', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_moduletoolbar',

        listen : {
            global : {
                switchPageByRouting : 'handleSwitchPageByRouting'
            }
        },

        onAfterLayout : function() {
            var view = this.getView();

            Ext.Function.defer(function() {
                view.updateLayout();
            }, 100, this);
        },

        handleSwitchPageByRouting : function(card, subcard) {
            var subCardBtn;

            if (this.getView().moduleId === card) {
                if (subcard === 'employee') {
                    subcard = 'employees';
                }

                subCardBtn = this.lookup(subcard);

                if (subCardBtn && subCardBtn.setPressed) {
                    Ext.defer(function() {
                        subCardBtn.setPressed(true);
                        subCardBtn.focus();
                    }, 100)
                }
            }
        },

        init : function() {
            this.handleSwitchPageByRouting = Ext.Function.createBuffered(this.handleSwitchPageByRouting, 100, this);
            this.callParent(arguments);
        }
    };

});
