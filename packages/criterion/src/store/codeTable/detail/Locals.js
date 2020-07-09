Ext.define('criterion.store.codeTable.detail.Locals', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_code_table_detail_locals',

        extend : 'criterion.store.AbstractStore',

        requires : [
            'criterion.model.codeTable.detail.Local'
        ],

        model : 'criterion.model.codeTable.detail.Local',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.CODE_TABLE_DETAIL_LOCAL
        }
    };

});
