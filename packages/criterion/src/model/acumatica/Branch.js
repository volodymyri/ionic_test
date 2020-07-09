Ext.define('criterion.model.acumatica.Branch', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.ACUMATICA_BRANCH
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            }
        ]
    };
});
