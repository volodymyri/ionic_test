Ext.define('criterion.store.reports.Tree', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_reports_tree',

        extend : 'Ext.data.TreeStore',

        requires : [
            'criterion.data.reader.TreeData'
        ],

        model : 'criterion.model.reports.Tree',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.REPORT_GROUP_TREE,
            appendId : false,
            reader : 'treeData'
        }
    };
});
