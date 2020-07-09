Ext.define('criterion.controller.employee.AddTimeOffPlan', function() {

    /**
     * @event plansadded
     *
     * Fired after selected plans were added to employee.
     *
     * @param {Ext.data.Model[]} Added employee plan records.
     */

    return {
        alias : 'controller.employee_add_time_off_plan',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.model.employee.TimeOffPlan'
        ],

        onAdd : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                addedPlans = [],
                promises = [];

            view.setLoading(true);

            Ext.Array.each(view.getSelection(), function(plan) {
                var employeePlan = Ext.create('criterion.model.employee.TimeOffPlan', {
                    timeOffPlanId : plan.get('timeOffPlanId'),
                    employeeId : vm.get('employeeId'),
                    startDate : plan.get('startDate')
                });

                addedPlans.push(employeePlan);
                promises.push(employeePlan.saveWithPromise());
            });

            Ext.promise.Promise.all(promises).then({
                scope : this,
                success : function() {
                    view.setLoading(false);
                    view.fireEvent('plansadded');
                    view.destroy();
                },
                failure : function() {
                    view.setLoading(false);
                }
            });
        },

        onCancel : function() {
            this.getView().destroy();
        },

        onSelectionChange : function(selModel, selectedRecords) {
            this.lookupReference('addButton').setDisabled(!selectedRecords.length);
        }
    };

});
