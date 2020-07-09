Ext.define('criterion.model.employee.ACA', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_ACA
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'taxYear',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'planStartMonth',
                type : 'string', // todo date ?,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'offerOfCoverage',
                type : 'string'
            },
            {
                name : 'employeeCost',
                type : 'float'
            },
            {
                name : 'safeHarbor',
                type : 'string'
            },
            {
                name : 'isSelfInsured',
                type : 'boolean'
            },
            {
                name : 'isManualOverride',
                type : 'boolean'
            }
        ]
    };
});
