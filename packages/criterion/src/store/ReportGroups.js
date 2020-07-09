Ext.define('criterion.store.ReportGroups', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_report_groups',

        extend : 'criterion.data.Store',

        model : 'criterion.model.ReportGroup',
        autoLoad : false,
        autoSync : false,
        pageSize : false,

        proxy : {
            type : 'criterion_rest',
            url : API.REPORT_GROUP
        }
    };
});
