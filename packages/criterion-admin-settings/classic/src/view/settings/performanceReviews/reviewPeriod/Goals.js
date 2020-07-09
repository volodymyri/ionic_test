Ext.define('criterion.view.settings.performanceReviews.reviewPeriod.Goals', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_period_goals',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.settings.performanceReviews.reviewPeriod.Goals',
            'criterion.view.settings.performanceReviews.reviewPeriod.goal.List',
            'criterion.view.settings.performanceReviews.reviewPeriod.goal.Form'
        ],

        controller : {
            type : 'criterion_settings_performance_reviews_review_period_goals'
        },

        listeners : {
            backFromForm : 'handleBackFromForm',
            deleteGoal : 'handleDeleteGoal',
            saveGoal : 'handleSaveGoal'
        },

        viewModel : {},

        layout : 'card',

        defaults : {
            header : false,
            scrollable : 'vertical'
        },

        bodyPadding : 0,

        items : [
            {
                xtype : 'criterion_settings_performance_reviews_review_period_goal_list',
                reference : 'goalList',
                listeners : {
                    addAction : 'handleEditReviewPeriodGoal',
                    editaction : 'handleEditReviewPeriodGoal',

                    beforeLoadData : 'onBeforeLoadData',
                    afterLoadData : 'onAfterLoadData'
                }
            },
            {
                xtype : 'criterion_settings_performance_reviews_review_period_goal_form',
                reference : 'goalForm',
                listeners : {
                    back : 'handleBackFromForm'
                }
            }
        ],

        setReviewPeriodId(reviewPeriodId) {
            this.getViewModel().set('reviewPeriodId', reviewPeriodId);
        }
    };

});
