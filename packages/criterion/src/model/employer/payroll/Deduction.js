Ext.define('criterion.model.employer.payroll.Deduction', function() {

    return {

        extend : 'Ext.data.Model',

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'deductionAmount',
                type : 'float'
            },
            {
                name : 'amount', // normalize for use in conjunction with criterion.model.employer.payroll.Tax
                calculate : function(data) {
                    return data['deductionAmount']
                },
                persist : false
            },
            {
                name : 'ytdAmount',
                type : 'float'
            },
            {
                name : 'ytd',  // normalize for use in conjunction with criterion.model.employer.payroll.Tax
                calculate : function(data) {
                    return data['ytdAmount'] + data['deductionAmount']
                },
                persist : false
            },
            {
                name : 'payrollId',
                type : 'int'
            },
            {
                name : 'deductionId',
                type : 'int'
            },
            {
                name : 'valueType',
                type : 'int'
            },
            {
                name : 'isEmployee',
                type : 'boolean'
            },
            {
                name : 'noCashOption',
                type : 'boolean'
            }
        ]
    };

});
