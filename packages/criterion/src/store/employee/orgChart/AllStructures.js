Ext.define('criterion.store.employee.orgChart.AllStructures', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employee_orgchart_all_structures',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.orgChart.AllStructures',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_ORG_CHART_ALL_STRUCTURES
        }
    };
});
