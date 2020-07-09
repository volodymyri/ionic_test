Ext.define('criterion.model.employer.EssLink', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.employer.Abstract',

        fields : [
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'url',
                type : 'string'
            },
            {
                name : 'type',
                type : 'integer'
            },
            {
                name : 'destination',
                type : 'string'
            },
            {
                name : 'tooltip',
                type : 'string'
            },
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_ESS_LINK
        }
    };
});
