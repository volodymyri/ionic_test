Ext.define('criterion.model.employee.benefit.Event', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_BENEFIT_EVENT
        },

        fields : [
            {
                name : 'employeeBenefitId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'data',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isProcessed',
                type : 'boolean'
            },
            {
                name : 'personName',
                type : 'string',
                persist : false
            },
            {
                name : 'employeeNumber',
                type : 'string',
                persist : false
            },
            {
                name : 'displayData',
                type : 'string',
                calculate : function(data) {
                    if(data){
                        return Ext.util.Format.format('{0} - {1} ({2})', data.personName, Ext.Date.format(data.effectiveDate, criterion.consts.Api.SHOW_DATE_FORMAT), data.employeeBenefitId)
                    }
                }
            }
        ]
    };
});