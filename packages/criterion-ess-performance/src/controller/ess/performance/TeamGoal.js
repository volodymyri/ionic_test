Ext.define('criterion.controller.ess.performance.TeamGoal', function() {

    return {

        extend : 'criterion.controller.ess.performance.Goal',

        alias : 'controller.criterion_selfservice_performance_team_goal',

        init() {
            this.handleEmployeeChange = Ext.Function.createDelayed(this.handleEmployeeChange, 200, this, null, null);

            this.callParent(arguments);
        },

        getCurrentEmployerId() {
            return this.getViewModel().get('record.employerId');
        },

        getCurrentEmployeeId() {
            return this.getViewModel().get('record.employeeId');
        },

        handleEmployeeChange(cmp, value) {
            let vm = this.getViewModel(),
                view = this.getView(),
                rec = cmp.getSelection();

            if (!rec) {
                return;
            }

            vm.get('record').set('employerId', rec.get('employerId'));

            view.setLoading(true);

            Ext.Deferred.all([
                this.loadReviews(),
                this.loadWorkflows()
            ]).always(() => {
                view.setLoading(false);
            });
        },

        getLinkToBaseUpdateRecordMethod() {
            return this.superclass.superclass.updateRecord;
        }
    }
});
