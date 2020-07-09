Ext.define('criterion.view.settings.performanceReviews.reviewPeriod.Employees', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_period_employees',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.settings.performanceReviews.reviewPeriod.Employees',
            'criterion.view.settings.performanceReviews.reviewPeriod.employee.List',
            'criterion.view.settings.performanceReviews.reviewPeriod.employee.Form'
        ],

        controller : {
            type : 'criterion_settings_performance_reviews_review_period_employees'
        },

        listeners : {
            backFromEmployee : 'handleBackFromEmployee',
            deleteEmployee : 'handleDeleteEmployee',
            saveEmployee : 'handleSaveEmployee'
        },

        viewModel : {},

        layout : 'card',

        defaults : {
            header : false,
            autoScroll : true
        },

        bodyPadding : 0,

        items : [
            {
                xtype : 'criterion_settings_performance_reviews_review_period_employee_list',
                reference : 'employeeList',
                listeners : {
                    editaction : 'handleEditReviewPeriodEmployee',

                    beforeLoadData : 'onBeforeLoadData',
                    afterLoadData : 'onAfterLoadData'
                }
            },
            {
                xtype : 'criterion_settings_performance_reviews_review_period_employee_form',
                reference : 'employeeForm',
                listeners : {
                    back : 'handleBackFromEmployee'
                }
            }
        ],

        setReviewPeriodId(reviewPeriodId) {
            this.getViewModel().set('reviewPeriodId', reviewPeriodId);
        },

        setIs360(is360) {
            this.getViewModel().set('is360', is360);
        },

        getEmployeesData() {
            return this.lookup('employeeList').getEmployeesData();
        }
    };

});
