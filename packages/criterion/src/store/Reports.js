Ext.define('criterion.store.Reports', function () {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_reports',

        extend : 'criterion.data.Store',

        model : 'criterion.model.Report',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.REPORT
        }
    };
});
