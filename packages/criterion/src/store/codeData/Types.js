Ext.define('criterion.store.codeData.Types', function() {

    return {
        alternateClassName : [
            'criterion.store.codeData.Types'
        ],

        alias : 'store.criterion_codedata_types',

        extend : 'criterion.data.Store',

        requires : [
            'criterion.model.codeData.Type'
        ],

        model : 'criterion.model.codeData.Type',

        sorters: [
            {
                property: 'description',
                direction: 'ASC'
            }
        ],

        autoLoad: false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.CODE_TABLE
        }
    };

});
