Ext.define('criterion.store.CodeTables', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_code_tables',

        extend : 'criterion.data.Store',

        requires : [
            'criterion.model.CodeTable'
        ],

        model : 'criterion.model.CodeTable',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.CODE_TABLE
        }
    };

});
