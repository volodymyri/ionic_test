Ext.define('criterion.controller.settings.performanceReviews.reviewPeriod.goal.Form', function() {

    return {
        alias : 'controller.criterion_settings_performance_reviews_review_period_goal_form',

        extend : 'criterion.controller.person.Goal',

        init() {
            this.handleEmployeeChange = Ext.Function.createDelayed(this.handleEmployeeChange, 200, this, null, null);

            this.callParent(arguments);
        },

        getCurrentEmployerId() {
            return this.getViewModel().get('workflowEmployerId');
        },

        getCurrentEmployeeId() {
            return this.getViewModel().get('record.employeeId');
        },

        getCurrentReviewPeriodId() {
            return this.getViewModel().get('reviewPeriodId');
        },

        getRecord() {
            return this.getViewModel().get('record');
        },

        afterLoadRecord(record) {
            let fields = this.getView().getForm().getFields(),
                employeeSelector = this.lookup('employeeSelector');

            if (record.phantom) {
                Ext.defer(() => {
                    employeeSelector.focus();

                    fields.each(field => {
                        field.clearInvalid && field.clearInvalid();
                    });
                }, 100);
            }
        },

        handleEmployeeChange(cmp, value) {
            let view = this.getView(),
                rec = cmp.getSelection(),
                reviewId,
                reviewField = this.lookup('reviewField');

            if (!rec) {
                return;
            }

            this.getRecord().set('employerId', rec.get('employerId'));
            reviewId = this.getRecord().get('reviewId');

            view.setLoading(true);

            Ext.Deferred.all([
                this.loadReviews(),
                this.loadWorkflows()
            ]).always(_ => {
                view.setLoading(false);

                if (reviewId) {
                    reviewField.setValue(reviewId);
                }
            });
        },

        handleDeleteGoal() {
            let view = this.getView(),
                record = this.getRecord();

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete record'),
                    message : i18n.gettext('Do you want to delete the record?')
                },
                btn => {
                    if (btn === 'yes') {
                        record.eraseWithPromise().always(_ => {
                            view.fireEvent('back');
                        })
                    }
                }
            );
        },

        handleSaveGoal() {
            let view = this.getView(),
                record = this.getRecord();

            if (view.isValid()) {
                view.setLoading(true);

                record.saveWithPromise().then(_ => {
                    view.fireEvent('back');
                }).always(_ => {
                    view.setLoading(false);
                });
            } else {
                this.focusInvalidField();
            }
        },
        loadReviews() {
            return this.getStore('reviews').loadWithPromise({
                params : {
                    employeeId : this.getCurrentEmployeeId(),
                    reviewPeriodId : this.getCurrentReviewPeriodId()
                }
            });
        },

    }
});
