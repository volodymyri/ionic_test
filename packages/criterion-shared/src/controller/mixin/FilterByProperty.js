/**
 *  Adds handler for filterByProperty event of criterion.view.FilterWithSelectorBar
 *  Expects that load method setup store proxy params to keep them after page change
 *  As load may override existing proxy extra params we override load to add filter params to load options in any load call
 */
Ext.define('criterion.controller.mixin.FilterByProperty', function() {

    return {

        extend : 'Ext.Mixin',

        mixinConfig : {

            id : 'filterWithSelector',

            after : {
                constructor : 'initMixin'
            }
        },

        filterByPropertyParams : {},

        initMixin : function() {
            let overriddenLoad = this.load;

            this.load = function(opts = {}) {
                overriddenLoad.call(this, Ext.merge(opts, {
                    params : this.filterByPropertyParams
                }));
            }
        },

        handleFilterByProperty : function(property, value) {
            let me = this,
                lastFilterByProperty = me.lastFilterByProperty || property,
                filterByPropertyParams = me.filterByPropertyParams;

            if (property) {
                let doLoad = false;

                if (Ext.isEmpty(value)) {
                    if (filterByPropertyParams.hasOwnProperty(lastFilterByProperty)) {
                        delete filterByPropertyParams[lastFilterByProperty];
                        doLoad = true;
                    }

                    me.lastFilterByProperty = null;
                } else {
                    filterByPropertyParams[property] = value;
                    me.lastFilterByProperty = property;
                    doLoad = true;
                }

                if (doLoad) {
                    me.load();
                }

            }
        }

    };

});
