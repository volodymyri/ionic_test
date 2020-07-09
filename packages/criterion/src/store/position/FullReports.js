Ext.define('criterion.store.position.FullReports', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'Ext.data.TreeStore',

        requires: [
            'criterion.data.reader.TreeData'
        ],

        model : 'criterion.model.position.TreeReport',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION_FULL_REPORT,
            reader: 'treeData'
        }
    };
});
