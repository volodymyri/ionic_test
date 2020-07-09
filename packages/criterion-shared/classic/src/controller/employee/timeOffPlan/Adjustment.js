Ext.define('criterion.controller.employee.timeOffPlan.Adjustment', function() {

    return {
        alias : 'controller.criterion_employee_timeoffplan_adjustment',

        extend : 'criterion.app.ViewController',

        handleCancelClick : function() {
            this.getView().close();
        },

        handleSubmitClick : function() {
            var me = this,
                form = me.getView(),
                vm = me.getViewModel(),
                accrualDate = this.lookupReference('accrualDate');

            if (form.isValid()) {
                form.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_PLAN_ADJUSTMENT,
                    urlParams : {
                        employeeTimeOffPlanId : vm.get('employeeTimeOffPlanId'),
                        employeeId : criterion.Api.getEmployeeId()
                    },
                    jsonData : Ext.JSON.encode({
                        accrualDate : Ext.Date.format(accrualDate.getValue(), criterion.consts.Api.DATE_FORMAT),
                        reason : vm.get('reason'),
                        accrued : vm.get('accrued')
                    }),
                    method : 'POST'
                })
                .then(function() {
                    criterion.Utils.toast(i18n.gettext('Action was successful.'));
                    vm.get('timeOffPlan').load();
                })
                .always(function() {
                    form.setLoading(false);
                    form.close();
                });
            }
        }

    };

});
