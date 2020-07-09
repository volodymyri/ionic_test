Ext.define('criterion.model.employer.GLAccount', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        fields : [
            {
                name : 'accountNumber',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'accountName',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'fullName',
                persist : false,
                calculate : function(data) {
                    return data.accountNumber + ' ' + data.accountName;
                }
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_GL_ACCOUNT
        }
    };
});
