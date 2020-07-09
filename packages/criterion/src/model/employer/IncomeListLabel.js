Ext.define('criterion.model.employer.IncomeListLabel', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_INCOME_LIST_LABEL
        },

        fields : [
            {
                name : 'incomeListId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'labelCd',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});
