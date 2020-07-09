Ext.define('criterion.model.employee.benefit.Document', function() {

    const API = criterion.consts.Api.API,
          VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_BENEFIT_DOCUMENT
        },

        fields : [
            {
                name : 'employeeBenefitId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'documentName',
                type : 'string'
            }
        ]
    };
});
