Ext.define('criterion.model.employer.benefit.Type', function () {
    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_BENEFIT_TYPE
        },

        fields : [
            {
                name : 'employerId',
                type : 'int'
            },
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            }
        ]
    };
});