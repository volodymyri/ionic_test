Ext.define('criterion.store.codeTable.Details', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_code_table_details',

        extend : 'criterion.data.Store',

        requires : [
            'criterion.model.codeTable.Detail'
        ],

        model : 'criterion.model.codeTable.Detail',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.CODE_TABLE_DETAIL
        }
    };

});
