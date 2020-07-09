/**
 * @deprecated
 */
Ext.define('criterion.ux.grid.cell.Action', {
    extend : 'Ext.grid.cell.Text',
    xtype : 'actioncell',

    config : {
        icon : null,
        cls : 'action-cell',
        align : 'right'
    },

    updateRecord : function(record) {
        this.callParent(arguments);
        this.innerElement.dom.innerHTML = '<span class="x-fa fa-chevron-right action-icon"></span>';
    },

    initElement : function() {
        this.callParent(arguments);
        this.innerElement.on({
            click : '_act',
            tap : '_act',
            scope : this
        });
    },

    _act : function() {
        this.fireEvent('act', null, null, null, this.getRecord());
    }
});

