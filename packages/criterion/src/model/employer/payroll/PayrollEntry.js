Ext.define('criterion.model.employer.payroll.PayrollEntry', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        requires: [
            'criterion.model.Payroll',
            'criterion.model.payroll.Income',
            'criterion.model.payroll.AssignmentDetails'
        ],

        fields: [
            {
                name: 'personName',
                type: 'string'
            },
            {
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name: 'positionCode',
                type: 'string'
            },
            {
                name : 'assignmentDetailsPayRate',
                type : 'float',

                calculate : function(data) {
                    if (data.assignmentDetails && data.assignmentDetails.length) {
                        return data.assignmentDetails[0].assignmentPayRate;
                    }
                },
                depends : []
            },
            {
                name : 'assignmentDetailsPayRateUnitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT,
                allowNull: true,

                calculate : function(data) {
                    if (data.assignmentDetails && data.assignmentDetails.length) {
                        return data.assignmentDetails[0].assignmentPayRateUnitCd;
                    }
                },
                depends : []
            },
            {
                name : 'netPay',
                type : 'float',
                persist : false,
                mapping : function(data) {
                    return data.payroll && data.payroll.netPay;
                }
            },
            {
                name : 'isPaid',
                type : 'boolean',
                persist : false,
                mapping : function(data) {
                    return data.payroll && data.payroll.isPaid;
                }
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.Payroll',
                name : 'payroll',
                associationKey : 'payroll'
            },
            {
                model : 'criterion.model.payroll.AssignmentDetails',
                name : 'assignmentDetails',
                associationKey : 'assignmentDetails'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.payroll.Income',
                name : 'payrollIncomes',
                associationKey : 'payrollIncomes'
            }
        ]
    };
});
