Ext.define('criterion.controller.settings.performanceReviews.reviewPeriod.Goals', function() {

    return {

        alias : 'controller.criterion_settings_performance_reviews_review_period_goals',

        extend : 'criterion.app.ViewController',

        handleEditReviewPeriodGoal(record) {
            let view = this.getView(),
                goalForm = this.lookup('goalForm');

            view.fireEvent('changeSelectGoal', record);
            view.setActiveItem(goalForm);

            goalForm.loadRecord(record);
        },

        handleBackFromForm() {
            let view = this.getView();

            view.fireEvent('changeSelectGoal', null);
            view.setActiveItem(this.lookup('goalList'));
        },

        handleDeleteGoal() {
            this.lookup('goalForm').fireEvent('deleteGoal');
        },

        handleSaveGoal() {
            this.lookup('goalForm').fireEvent('saveGoal');
        },

        onBeforeLoadData() {
            // move up to parent
            this.getView().fireEvent('beforeLoadData');
        },

        onAfterLoadData() {
            this.getView().fireEvent('afterLoadData');
        }
    }
});
