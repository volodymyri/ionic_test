Ext.define('criterion.model.TeReciprocity', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.TE_RECIPROCITY
        },

        fields : [
            {
                name : 'jurisdictionDescription',
                type : 'string',
                persist : false
            },
            {
                name : 'code',
                type : 'integer',
                persist : false
            }
        ]
    };
});

