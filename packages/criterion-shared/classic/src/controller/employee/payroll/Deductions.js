Ext.define('criterion.controller.employee.payroll.Deductions', function() {

    return {

        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.criterion_employee_payroll_deductions',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        suppressIdentity : ['employeeGlobal'],

        load : function(opts = {}) {
            let showInactiveField = this.lookup('showInactive');

            if (showInactiveField && !showInactiveField.getValue()) {
                Ext.merge(opts, {
                    params : {
                        activeOnly : true
                    }
                });
            }

            return this.callParent([opts]);
        },

        handleAfterEdit : function() {
            this.callParent(arguments);
            this.load();
        },

        handleChangeShowInactive : function() {
            this.load();
        }

    };
});
