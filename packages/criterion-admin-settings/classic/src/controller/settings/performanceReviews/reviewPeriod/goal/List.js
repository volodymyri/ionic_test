Ext.define('criterion.controller.settings.performanceReviews.reviewPeriod.goal.List', function() {

    return {
        alias : 'controller.criterion_settings_performance_reviews_review_period_goal_list',

        extend : 'criterion.controller.GridView',

        mixins : [
            'criterion.controller.mixin.goal.Import'
        ],

        load(opts) {
            let view = this.getView(),
                dfd = Ext.create('Ext.Deferred');

            view.fireEvent('beforeLoadData');

            this.callParent(arguments).then(
                () => {
                    view.fireEvent('afterLoadData');
                    dfd.resolve();
                },
                () => {
                    view.fireEvent('errorLoadData');
                    dfd.reject();
                }
            );

            return dfd.promise;
        },

        handleAddClick() {
            let record = this.getEmptyRecord();

            if (!record) {
                return;
            }

            this.getView().fireEvent('addAction', this.addRecord(record));
        },

        getImportGoalParams() {
            return 'reviewPeriodId=' + this.getViewModel().get('record.id');
        }
    }
});
