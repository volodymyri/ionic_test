Ext.define('criterion.controller.ess.benefits.OpenEnrollments', function() {

    return {
        alias : 'controller.criterion_selfservice_benefits_open_enrollments',

        extend : 'criterion.controller.employee.GridView',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        handleAfterEdit : function() {
            this.callParent(arguments);
            this.load();
        },

        load : function() {
            var employeeId = this.getEmployeeId();

            if (!employeeId) {
                return;
            }

            this.getView().getStore().loadWithPromise({
                params : {
                    employeeId : employeeId,
                    isActive : true
                }
            });
        },

        edit : function(record) {
            Ext.History.add(criterion.consts.Route.SELF_SERVICE.BENEFITS_OPEN_ENROLLMENTS + '/' + record.getId());

            this.callParent(arguments);
        }
    }
});
