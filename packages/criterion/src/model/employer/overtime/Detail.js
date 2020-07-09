Ext.define('criterion.model.employer.overtime.Detail', function () {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.proxy.Rest'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_OVERTIME_DETAIL
        },

        fields : [
            {
                name : 'overtimeId',
                type : 'integer',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'incomeListId',
                type : 'integer',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'sequence',
                type : 'integer'
            },
            {
                name : 'expCalcTime',
                type : 'string'
            }
        ]
    };

});
