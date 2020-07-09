Ext.define('criterion.controller.settings.performanceReviews.reviewPeriod.Employees', function() {

    return {

        alias : 'controller.criterion_settings_performance_reviews_review_period_employees',

        extend : 'criterion.app.ViewController',

        handleEditReviewPeriodEmployee(record) {
            let view = this.getView(),
                employeeForm = this.lookup('employeeForm');

            view.fireEvent('changeSelectEmployee', record);
            view.setActiveItem(employeeForm);
            employeeForm.getViewModel().set('reviewEmployee', record)
        },

        handleBackFromEmployee() {
            let view = this.getView();

            view.fireEvent('changeSelectEmployee', null);
            view.setActiveItem(this.lookup('employeeList'));
        },

        handleDeleteEmployee() {
            this.lookup('employeeForm').fireEvent('deleteEmployee');
        },

        handleSaveEmployee() {
            this.lookup('employeeForm').fireEvent('saveEmployee');
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
