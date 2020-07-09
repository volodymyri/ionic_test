Ext.define('criterion.model.Tax', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.TAX
        },

        fields : [
            {
                name : 'geocode',
                type : 'string',
                allowNull : true
            },
            {
                name : 'schdist',
                type : 'string',
                allowNull : true
            },
            {
                name : 'schdistName',
                type : 'string',
                persist : false
            },
            {
                name : 'countyName',
                type : 'string',
                persist : false
            },
            {
                name : 'cityName',
                type : 'string',
                persist : false
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taxNumber',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isEmployer',
                type : 'boolean',
                allowNull : true
            },
            {
                name : 'countryCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COUNTRY,
                allowNull : true
            },
            {
                name : 'wageBase',
                type : 'float',
                allowNull : true
            },
            {
                name : 'rate',
                type : 'float',
                allowNull : true
            },
            {
                name : 'isManual',
                type : 'boolean'
            },
            {
                name : 'used',
                type : 'boolean',
                persist : false
            }
        ]
    };
});
