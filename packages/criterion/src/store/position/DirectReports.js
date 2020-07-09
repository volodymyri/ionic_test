/**
 * @deprecated
 */
Ext.define('criterion.store.position.DirectReports', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'Ext.data.TreeStore',
        alias: 'store.position_direct_reports',

        requires: [
            'criterion.data.reader.TreeData'
        ],

        model : 'criterion.model.position.DirectReport',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION_DIRECT_REPORT,
            reader : 'treeData',
            appendId : false
        }
    };
});
