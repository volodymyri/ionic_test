Ext.define('criterion.controller.settings.Main', function() {

    return {
        extend : 'criterion.app.ViewController',

        mixins : [
            'criterion.controller.mixin.CardRouter'
        ],

        alias : 'controller.criterion_settings',

        showDefaultCard : false,

        listen : {
            global : {
                disableSettingsPanel : 'handleDisableSettingsPanel'
            }
        },

        childTabClick : function(panel, childCard, parentCard) {
            if (parentCard.getLayout().getActiveItem() === childCard) {
                childCard.fireEvent('activate', childCard);
            }
        },

        handleCardRoute : function(card, subcard) {
            var me = this,
                cardCt = this.getCard(card),
                layout = this.getView().getLayout(),
                subCardCt,
                subCardElId;

            layout.setActiveItem(cardCt);

            if (subcard) {
                if (/\//.test(subcard)) {
                    subCardElId = subcard.split('/')[1];
                    subcard = subcard.split('/')[0];
                }

                subCardCt = cardCt.lookup(subcard);
                if (subCardCt) {
                    cardCt.setActiveItem(subCardCt);
                }

                if (!cardCt.__reRoute) {
                    if (subCardElId) {
                        Ext.History.add(me.getBaseCardToken() + '/' + card + '/' + subcard, true);

                        Ext.defer(function() {
                            cardCt.__reRoute = true;
                            Ext.History.add(me.getBaseCardToken() + '/' + card + '/' + subcard + '/' + subCardElId, true);
                        }, 10);
                    }
                }
            }
        },

        handleDisableSettingsPanel : function(disabled) {
            this.getView().setLoading(disabled);
        }
    };
});

