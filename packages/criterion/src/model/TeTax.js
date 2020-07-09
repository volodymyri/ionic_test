Ext.define('criterion.model.TeTax', function() {

    const API = criterion.consts.Api.API,
          VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.teTax.Rate'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.TE_TAX
        },

        fields : [
            {
                name : 'taxNumber',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taxName',
                type : 'string'
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.teTax.Rate',
                name : 'rates',
                associationKey : 'rates'
            }
        ]
    };
});
