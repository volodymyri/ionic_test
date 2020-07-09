Ext.define('criterion.ux.grid.column.Selection', function() {

    return {

        alias : [
            'widget.criterion_selection_column'
        ],

        extend : 'Ext.grid.column.Selection',

        requires : [
            'criterion.ux.grid.cell.CustomCheck'
        ],

        constructor(config) {
            if (Ext.isFunction(config.skipFn)) {
                config.cell = {
                    xtype : 'criterion_custom_checkcell',
                };

                config.cell['skipFn'] = config.skipFn;
            }

            this.callParent(arguments);
        },

        toggleAll(e) {
            let me = this,
                checked = !me.allChecked;

            if (me.fireEvent('beforeheadercheckchange', me, checked, e) !== false) {
                me.doToggleAll(checked);
                me.setHeaderStatus(checked);
                me.fireEvent('headercheckchange', me, checked, e);
            }
        },

        doToggleAll(checked) {
            let me = this,
                store = me.getGrid().getStore();

            store.each(function(record) {
                if (Ext.isFunction(me.skipFn) && me.skipFn(record)) {
                    return;
                }
                me.setRecordChecked(record, checked);
            });
        }
    };

});
