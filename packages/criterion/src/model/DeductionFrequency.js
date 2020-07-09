Ext.define('criterion.model.DeductionFrequency', function() {

    var DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'rateUnitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT
            },
            {
                name : 'first',
                type : 'boolean'
            },
            {
                name : 'second',
                type : 'boolean'
            },
            {
                name : 'third',
                type : 'boolean'
            },
            {
                name : 'fourth',
                type : 'boolean'
            },
            {
                name : 'fifth',
                type : 'boolean'
            },
            {
                name : 'last',
                type : 'boolean'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DEDUCTION_FREQUENCY
        }
    };
});
