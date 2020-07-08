Ext.define('criterion.view.Grid', function() {

    return {
        alias : [
            'widget.criterion_grid'
        ],

        extend : 'Ext.grid.Grid',

        requires : [
            'criterion.ux.grid.column.CodeData',
            'criterion.ux.grid.cell.Action',
            'criterion.ux.grid.cell.StoreValue',
            'criterion.ux.grid.column.Selection',
            'Ext.grid.plugin.ColumnResizing'
        ],

        plugins : [
            {
                type : 'columnresizing'
            }
        ]

    };
});
