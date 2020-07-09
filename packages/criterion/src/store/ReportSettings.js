Ext.define('criterion.store.ReportSettings', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_report_settings',

        model : 'criterion.model.ReportSettings',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.REPORT_SETTINGS
        }
    };
});
