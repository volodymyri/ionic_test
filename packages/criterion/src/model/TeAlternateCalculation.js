Ext.define('criterion.model.TeAlternateCalculation', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.TE_ALTERNATE_CALCULATION_DROPDOWN
        },

        fields : [
            {
                name : 'taxName',
                type : 'string',
                persist : false
            },
            {
                name : 'jurisdictionDescription',
                type : 'string',
                persist : false
            },
            {
                name : 'taxId',
                type : 'integer',
                persist : false
            },
            {
                name : 'code',
                type : 'int',
                persist : false
            },
            {
                name : 'geoCode',
                type : 'string',
                persist : false
            }
        ]
    };
});

