Ext.define('criterion.controller.employee.wizard.Onboarding', function() {

    return {
        extend : 'criterion.controller.employee.Onboarding',

        alias : 'controller.criterion_employee_wizard_onboarding',

        getEmployerId : function() {
            return this.getViewModel().get('employer.id');
        },

        getEmployeeId : function() {
            return this.getViewModel().get('employee.id');
        },

        afterAddOnboardingListDetails : Ext.emptyFn,

        load : Ext.emptyFn,

        handleEditAction : function(record) {
            if (this.getViewModel().get('readOnly')) {
                return;
            }
            this.callParent(arguments);
        }

    }
});
