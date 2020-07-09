Ext.define('criterion.controller.ess.performance.TeamGoals', function() {

    return {

        extend : 'criterion.controller.ess.performance.MyGoals',

        alias : 'controller.criterion_selfservice_performance_team_goals',

        requires : [
            'criterion.view.common.FileAttachForm'
        ],

        mixins : [
            'criterion.controller.mixin.goal.Import'
        ],

        handleChangeEmployeeName(field, employeeName) {
            let me = this,
                store = me.getView().getStore();

            store.getProxy().setExtraParam('employeeName', employeeName);
            store.load();
        },

        afterMainStoreLoaded() {
            this.callParent(arguments);
            this.fillEmployees();
        },

        fillEmployees() {
            let store = this.getView().getStore(),
                employeeData = {},
                teamEmployees = this.getViewModel().getStore('teamEmployees');

            store.each(rec => {
                let employeeId = rec.get('employeeId');

                if (!employeeData[employeeId]) {
                    employeeData[employeeId] = {
                        id : employeeId,
                        fullName : rec.get('fullName'),
                        employerId : rec.get('employerId')
                    }
                }
            });

            teamEmployees.loadData(Ext.Object.getValues(employeeData));
        },

        handleChangeWeight() {
            let store = this.getView().getStore();

            this.getViewModel().set(
                'canSubmit',
                store.getGroups().each(function(group) {
                    let weights = {},
                        values;

                    group.each(rec => {
                        let weightInPercent = rec.get('weightInPercent'),
                            reviewId = rec.get('reviewId');

                        rec.set('weight', weightInPercent / 100);

                        if (!weights[reviewId]) {
                            weights[reviewId] = 0;
                        }

                        weights[reviewId] += rec.get('weightInPercent');
                    });

                    values = Ext.Object.getValues(weights);

                    return Ext.Array.sum(values) === 100 * values.length;
                }) &&
                store.getModifiedRecords().length
            );
        }

    }
});
