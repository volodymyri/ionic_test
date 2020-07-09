Ext.define('criterion.view.recruiting.jobs.PositionPicker', function() {

    return {
        extend : 'criterion.view.PositionPicker',

        initComponent: function() {
            this.callParent(arguments);

            var me = this,
                panel = this.down('criterion_gridpanel');
            panel.addDocked({
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'checkbox',
                    fieldLabel : i18n.gettext('Show unassigned position only'),
                    itemId: 'isUnassigned',
                    labelWidth: 230,
                    value: true,
                    listeners : {
                        scope : me,
                        change : 'handleSearchClick'
                    }
                }]
            })
        },

        /**
         * Method overridden to include additional search param.
         */
        handleSearchClick : function() {
            var store = this.down('grid').getStore(),
                me = this,
                query = this.down('#query').getValue().trim(),
                extraParams = store.getProxy().getExtraParams();

            Ext.Object.each(extraParams, function(key, value) {
                if (Ext.Array.findBy(me.getSearchFields(), function(item) {
                        return item.fieldName == key;
                    })) {
                    delete extraParams[key];
                }
            });

            if (query) {
                extraParams[this.down('combo').getValue()] = query;
            }

            if (this.down('#isUnassigned').getValue()) {
                extraParams['isUnassigned'] = true;
            } else {
                delete extraParams['isUnassigned'];
            }

            store.getProxy().setExtraParams(extraParams);

            this.load();
        }
    };

});
