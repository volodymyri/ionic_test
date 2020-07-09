Ext.define('criterion.controller.mixin.CardRouter', function() {

    var debug = false;

    return {

        extend : 'Ext.Mixin',

        mixinConfig : {
            id : 'cardrouter',

            after : {
                init : 'initCardRoutes'
            }
        },

        /**
         * @cfg {String} base token
         */
        baseCardToken : null,

        useReferenceAsBaseToken : true,

        chainParent : true,

        /**
         * @cfg {Boolean} show default card
         */
        showDefaultCard : true,

        /**
         * @cfg {String} default card reference
         */
        defaultCard : null,

        /**
         * @private
         */
        needToReRoute : null,

        getBaseCardToken : function() {
            var result = '',
                baseCardToken = '';

            if (this.baseCardToken) {
                baseCardToken = this.baseCardToken;
            } else if (this.useReferenceAsBaseToken && this.getView().reference) {
                baseCardToken = this.getView().reference;
            }

            if (this.chainParent) {
                var parent = this.getView().up();

                if (parent && parent.getController && parent.getController().getBaseCardToken) {
                    var parentToken = parent.getController().getBaseCardToken();

                    if (parentToken) {
                        result += parentToken + '/';
                    }
                }
            }

            result += baseCardToken;

            return result;
        },

        getCards : function() {
            return this.view.items;
        },

        getFirstCard : function() {
            return this.getCards().findBy(function(card) {
                return !card.isDisabled();
            });
        },

        getCardToken : function(cardRef) {
            return (this.getBaseCardToken() ? this.getBaseCardToken() + '/' : '') + cardRef;
        },

        getCard : function(cardRef) {
            var me = this,
                cards = me.getCards();

            return me.lookupReference(cardRef) || cards.get(cardRef) || cards.getAt(+cardRef);
        },

        showNoCardsMessage : function() {
            console && console.error('Module ' + this.view.reference + ' has no cards to display.');
        },

        reRoute : function() {
            // check if we need to reroute and token weren't changed
            if (Ext.History.getToken() === this.needToReRoute) {
                debug && console && console.warn('re-routing', this.$className, this.needToReRoute);
                Ext.route.Router.onStateChange(Ext.History.getToken());
            }

            this.needToReRoute = false;
        },

        redirectToCard : function(toCard) {
            var me = this,
                card;

            card = toCard && this.lookupReference(toCard) || me.getFirstCard();

            if (!card) {
                return this.showNoCardsMessage();
            }

            me.redirectTo(me.getCardToken(card.reference || '0'), null);
        },

        handleBeforeDefaultCardRoute : function(action) {
            var me = this;

            action.stop(true);

            if (me.showDefaultCard) {
                me.redirectToCard(me.defaultCard);
            }
        },

        handleBeforeCardRoute : function(card) {
            var me = this,
                action = arguments[arguments.length - 1],
                cardCt;

            cardCt = me.getCard(card);

            if (debug) {
                console && console.log('--------------------');
                console && console.log(arguments);
                console && console.trace('cardCt : ', cardCt && cardCt.reference);
                console && console.log('--------------------');
            }

            if (cardCt) {
                cardCt.title && criterion.Utils.setPageTitle(cardCt.title, !!this.getBaseCardToken());
                this.needToReRoute = false;
                return action.resume();
            }

            action.stop(false);

            me.redirectToCard(this.defaultCard);
        },

        handleCardRoute : function(card) {
            var cardCt = this.getCard(card),
                layout = this.getView().getLayout();

            if (layout.getActiveItem() !== cardCt) {
                layout.setActiveItem(cardCt);
            }
        },

        getCardRoutes : function() {
            var routes = {},
                prefix,
                subprefix;

            prefix = this.getBaseCardToken();

            subprefix = prefix ? prefix + '/' : '';
            routes[prefix || '#'] = {
                before : 'handleBeforeDefaultCardRoute'
            };
            routes[subprefix + ':card'] = {
                before : 'handleBeforeCardRoute',
                action : 'handleCardRoute'
            };
            routes[subprefix + ':card/:rest'] = {
                before : 'handleBeforeCardRoute',
                action : 'handleCardRoute',
                conditions : {
                    ':rest' : '(.+)'
                }
            };
            routes[subprefix + ':card/:rest/:tab/:subtab'] = {
                before : 'handleBeforeCardRoute',
                action : 'handleCardRoute',
                conditions : {
                    ':rest' : '(.+)'
                }
            };

            return routes;
        },

        initCardRoutes : function() {
            var me = this,
                routes = this.getRoutes() || {};

            if (Ext.isModern) {
                return;
            }

            routes = Ext.apply(routes, this.getCardRoutes());

            debug && console && console.log(Ext.Object.getKeys(routes));

            me.setRoutes(routes);

            this.view.on('beforerender', function() {
                // late routing, caused by lazy items / deferred render
                if (criterion.Utils.routerRecognizeFor(Ext.History.getToken(), this).length) {
                    this.needToReRoute = Ext.History.getToken();
                    debug && console && console.log('possibly need to re route', this.$className, this.needToReRoute);
                    this.view.on('afterrender', this.reRoute, this, {single : true, buffer : 1});
                }
            }, this, {single : true});
        }

    };

});
