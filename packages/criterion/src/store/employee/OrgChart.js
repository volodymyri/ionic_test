Ext.define('criterion.store.employee.OrgChart', function() {

    return {
        extend : 'Ext.data.TreeStore',
        alias: 'store.employee_org_chart',

        model : 'criterion.model.employee.OrgChart',
        autoLoad : false,
        autoSync : false,
        clearOnLoad: true,
        clearRemovedOnLoad: true,

        proxy : {
            type : 'memory'
        }
    };
});