Ext.define('criterion.model.employer.payroll.Import', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.PAYROLL_IMPORT
        },

        fields : [
            {
                name: 'employerId',
                type: 'int'
            },
            {
                name: 'payrollBatchId',
                type: 'int'
            },
            {
                name: 'name',
                type: 'string'
            },
            {
                name: 'importDate',
                type: 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name: 'errorsCount',
                type: 'int'
            },
            {
                name: 'successCount',
                type: 'int'
            },
            {
                name : 'isAdded',
                type: 'boolean'
            }
        ]
    };
});
