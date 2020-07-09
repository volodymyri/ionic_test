// @deprecated
Ext.define('criterion.model.CustomForm', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CUSTOM_FORM
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'fieldCount',
                type : 'integer',
                persist : false
            }
        ]
    };

});
