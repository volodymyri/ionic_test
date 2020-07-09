Ext.define('criterion.ux.grid.StatefulFiltered', {
    extend: 'Ext.plugin.Abstract',

    alias : 'plugin.criterion_grid_stateful_filtered',

    init : function(grid) {
        Ext.apply(grid, {
            stateEvents : [
                'sortchange',
                'filterchange',
                'columnmove',
                'columnhide',
                'columnshow'
            ],

            bindStore : function() {
                grid.superclass.bindStore.apply(grid, arguments);

                var store = grid.store,
                    gridfilters = grid.getPlugin('gridfilters');

                if (this.filtersHolder && gridfilters) {
                    var filters = grid.filtersHolder,
                        storeFilters = store.getFilters(),
                        updates = filters.length;

                    gridfilters.store = store;
                    grid.filtersHolder = null;

                    storeFilters.beginUpdate();

                    Ext.Array.each(filters, function(filter) {
                        var column = Ext.Array.findBy(grid.columns, function(item) {
                            return item.dataIndex == filter.dataIndex || item.filter.dataIndex == filter.dataIndex
                        });

                        if (column && Ext.isDefined(filter.value)) {
                            if(column.filter.options && column.filter.options.isStore){
                                column.filter.options.on('datachanged', function(_store) {

                                    updates--;
                                    column.filter.bindMenuStore(_store);
                                    !column.filter.menu && column.filter.createMenu();
                                    column.filter.filter.setValue(filter.value);
                                    column.filter.setActive(true);

                                    if(!updates) {
                                        storeFilters.endUpdate();
                                    }
                                }, grid, {single : true})
                            }else{
                                updates--;
                                column.filter.setValue(filter.value);
                                column.filter.setActive(true);
                                if(!updates) {
                                    storeFilters.endUpdate();
                                }
                            }
                        }
                    });

                    if(!updates) {
                        storeFilters.endUpdate();
                    }
                }
            }
        });

        this.callParent(arguments);
    }
});
