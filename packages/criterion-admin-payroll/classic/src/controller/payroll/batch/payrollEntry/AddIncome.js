Ext.define('criterion.controller.payroll.batch.payrollEntry.AddIncome', function() {

    /**
     * @event addIncome
     * @param {Object} data
     * @param {Object} data.assignmentId
     * @param {Object} data.incomeListId
     * @param {Object} data.taskId
     * @param {Object} data.employerWorkLocationId
     */

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_payroll_entry_add_income',

        handleAdd : function() {
            let view = this.getView();

            view.fireEvent('addIncome', view.lookupReference('form').getForm().getValues(false, false, false, true));

            view.destroy();
        },

        handleCancel : function() {
            this.getView().destroy();
        }
    };
});

