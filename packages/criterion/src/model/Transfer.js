Ext.define('criterion.model.Transfer', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.TRANSFER
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                serialize : criterion.Utils.emptyToNull
            },
            {
                name : 'isImport',
                type : 'boolean'
            },
            {
                name : 'transferTypeCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : criterion.consts.Dict.TRANSFER_TYPE
            },
            {
                name : 'isCustomTransfer',
                type : 'boolean',
                persist : false
            }
        ]
    };
});
