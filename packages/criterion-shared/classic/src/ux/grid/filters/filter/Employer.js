Ext.define('criterion.ux.grid.filters.filter.Employer', {

    extend: 'Ext.grid.filters.filter.List',

    alias: 'grid.filter.employer',

    type: 'list',

    operator: 'in',

    itemDefaults: {
        checked: false,
        hideOnClick: false
    },

    idField: 'id',

    labelField: 'legalName',

    dataIndex: 'employerId',

    constructor: function (config) {
        var me = this,
            gridStore;

        me.options = Ext.StoreManager.lookup('Employers');

        me.callParent([config]);
    }
});

