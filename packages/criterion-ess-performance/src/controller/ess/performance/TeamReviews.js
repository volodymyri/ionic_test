Ext.define('criterion.controller.ess.performance.TeamReviews', function() {

    return {

        extend : 'criterion.controller.ess.performance.Reviews',

        alias : 'controller.criterion_selfservice_performance_team_reviews',

        handleActivate : function() {
            var vm = this.getViewModel();

            vm.getStore('employeeReviews').getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_REVIEW_SUBORDINATE_AGGREGATED);

            this.callParent(arguments);
        },

        loadReviews : function() {
            var me = this,
                view = this.getView(),
                reviewPeriod = this.getViewModel().get('reviewPeriod.selection'),
                employee = this.lookup('employee').getValue(),
                params = {
                    periodId : reviewPeriod.getId()
                };

            if (employee) {
                params['employeeName'] = employee;
            }

            view.setLoading(true);

            me.getStore('employeeReviews').loadWithPromise({
                params : params
            }).always(function() {
                view.setLoading(false);
            });
        }
    }
});
