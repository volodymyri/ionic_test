Ext.define('criterion.controller.employee.ResetPassword', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employee_reset_password',

        handleCancel : function() {
            this.getView().destroy();
        },

        handleReset : function() {
            var me = this,
                form = me.getView(),
                vm = me.getViewModel(),
                data = vm.getData(),
                resetData = {};

            if (form.isValid()) {
                if (data.typeEmail) {
                    resetData.email = data.email;
                } else {
                    resetData.password = data.password;
                }

                resetData.forceReset = data.forceReset;

                form.fireEvent('reset', resetData);
            } else {
                me.focusInvalidField();
            }
        }

    }
});
