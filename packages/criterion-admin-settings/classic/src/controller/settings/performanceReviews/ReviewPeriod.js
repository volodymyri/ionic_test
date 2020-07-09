Ext.define('criterion.controller.settings.performanceReviews.ReviewPeriod', function() {

    const REVIEW_PERIOD_FREQUENCY = criterion.Consts.REVIEW_PERIOD_FREQUENCY;

    return {
        alias : 'controller.criterion_settings_performance_reviews_review_period',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.employee.EmployeePicker'
        ],

        handleAfterRecordLoad : function(record) {
            let vm = this.getViewModel(),
                view = this.getView(),
                me = this,
                reviewTypeValue = [],
                reviewTypeCombo = me.lookup('reviewType'),
                anonymousTypeValue = [],
                anonymousTypeCombo = me.lookup('anonymousType');

            if (record.phantom) {
                view.remove(this.lookup('employeePanel'));
                view.remove(this.lookup('goalPanel'));
                view.updateStates();
            }

            vm.set('isPhantom', record.phantom);

            this.callParent(arguments);

            reviewTypeCombo.getStore().each(codeDetail => {
                if (!(~record.get('reviewType') & parseInt(codeDetail.get('attribute1'), 10))) {
                    reviewTypeValue.push(codeDetail.getId());
                }
            });
            reviewTypeCombo.setValue(reviewTypeValue);

            anonymousTypeCombo.getStore().each(codeDetail => {
                if (!(~record.get('anonymousType') & parseInt(codeDetail.get('attribute1'), 10))) {
                    anonymousTypeValue.push(codeDetail.getId());
                }
            });
            anonymousTypeCombo.setValue(anonymousTypeValue);

            vm.set('isInLoading', true);

            Ext.promise.Promise.all([
                vm.getStore('reviewTemplates').loadWithPromise({
                    params : {
                        isRecruiting : false
                    }
                }),
                vm.getStore('workflows').loadWithPromise({
                    params : {
                        workflowTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW, criterion.consts.Dict.WORKFLOW).getId()
                    }
                })
            ]).then(function() {
                me.lookup('reviewTemplateField').resetOriginalValue();
                me.lookup('reviewType').resetOriginalValue();
                me.lookup('workflowField').resetOriginalValue();

                vm.set('isInLoading', false);
            });
        },

        onTemplateChange(combo, value) {
            let vm = this.getViewModel(),
                selectedRecord = combo.getSelectedRecord();

            if (selectedRecord && value) {
                vm.set('templateName', selectedRecord.get('name'));
            }
        },

        handleWorkflowChange : function(combo, value) {
            let vm = this.getViewModel(),
                selectedRecord = combo.getSelectedRecord();

            if (selectedRecord && !selectedRecord.get('isActive')) {
                criterion.Msg.warning({
                    title : i18n.gettext('Inactive Workflow'),
                    message : i18n.gettext('Warning: the selected Workflow is inactive. Activate the selected Workflow or choose another.')
                });
            }

            selectedRecord && vm.set('workflowEmployerId', selectedRecord.get('employerId'));
        },

        updateRecord : function(record, handler) {
            let reviewTypeCombo = this.lookup('reviewType'),
                reviewTypes = reviewTypeCombo.getStore(),
                reviewType = 0,
                anonymousTypeCombo = this.lookup('anonymousType'),
                anonymousTypes = anonymousTypeCombo.getStore(),
                anonymousType = 0;

            Ext.Array.each(reviewTypeCombo.getValue(), rtValue => {
                reviewType += parseInt(reviewTypes.getById(rtValue).get('attribute1'), 10);
            });

            Ext.Array.each(anonymousTypeCombo.getValue(), atValue => {
                anonymousType += parseInt(anonymousTypes.getById(atValue).get('attribute1'), 10);
            });

            record.set({
                reviewType : reviewType,
                anonymousType : anonymousType
            });

            this.callParent(arguments);
        },

        handleSubmitClick : function() {
            let me = this,
                form = me.lookup('periodForm'),
                record = this.getRecord();

            if (form.isValid()) {
                me.updateRecord(record, this.handleRecordUpdate);
            }
        },

        handleNextClick : function() {
            let me = this,
                vm = this.getViewModel(),
                form = this.lookup('periodForm'),
                record = this.getRecord(),
                activeViewIndex = vm.get('activeViewIndex');

            if (form.isValid() && activeViewIndex === 0) {
                // Data of review period on first step should be saved after clicking on 'Next' button (as Yuriy says)
                // https://perfecthr.atlassian.net/wiki/spaces/QC/pages/383877228/Test+report+-+Performance+Reviews+2.0 (39)
                me.updateRecord(record, function() {
                    record.save({
                        params : me.getRecordSaveParams(),
                        success : function(record) {
                            vm.set('activeViewIndex', activeViewIndex + 1);
                            criterion.Utils.toast(i18n.gettext('Saved.'));
                        },
                        failure : function(record, operation) {
                            me.onFailureSave(record, operation);
                        }
                    });
                });
            } else if (activeViewIndex === 1) {
                // refill employees
                vm.getStore('goalEmployees').loadData(this.lookup('reviewPeriodEmployees').getEmployeesData());

                vm.set('activeViewIndex', activeViewIndex + 1);
            }
        },

        handlePrevClick : function() {
            let vm = this.getViewModel(),
                activeViewIndex = vm.get('activeViewIndex');

            vm.set('activeViewIndex', activeViewIndex - 1);
        },

        handleChangeSelectEmployee : function(employee) {
            let vm = this.getViewModel();

            if (employee) {
                vm.set('selectedEmployeeName', employee.get('employeeName'));
            } else {
                vm.set('selectedEmployeeName', null);
            }
        },

        handleDeleteEmployee : function() {
            this.lookup('reviewPeriodEmployees').fireEvent('deleteEmployee');
        },

        handleBackFromEmployee : function() {
            this.getViewModel().set('selectedEmployeeName', null);
            this.lookup('reviewPeriodEmployees').fireEvent('backFromEmployee');
        },

        handleSaveEmployee : function() {
            this.lookup('reviewPeriodEmployees').fireEvent('saveEmployee');
        },

        handleChangeSelectGoal(goal) {
            let vm = this.getViewModel();

            if (goal) {
                vm.set('selectedGoalId', goal.getId());
            } else {
                vm.set('selectedGoalId', null);
            }
        },

        handleDeleteGoal() {
            this.lookup('reviewPeriodGoals').fireEvent('deleteGoal');
        },

        handleBackFromGoal() {
            this.getViewModel().set('selectedGoalId', null);
            this.lookup('reviewPeriodGoals').fireEvent('backFromForm');
        },

        handleSaveGoal() {
            this.lookup('reviewPeriodGoals').fireEvent('saveGoal');
        },

        onBeforeLoadData() {
            this.getViewModel().set('isInLoading', true);
        },

        onAfterLoadData() {
            this.getViewModel().set('isInLoading', false);
        },

        handleChangeFrequency : function(cmp) {
            let selection = cmp.getSelection(),
                frequency = selection && selection.get('code'),
                record = this.getRecord();

            if (frequency && frequency === REVIEW_PERIOD_FREQUENCY.CUSTOM) {
                record.set({
                    periodStartStr : null,
                    reviewDateStr : null,
                    reviewDeadlineStr : null
                });
            } else if (frequency) {
                record.set({
                    periodStart : null,
                    periodEnd : null,
                    reviewDate : null,
                    reviewDeadline : null,
                    nextReviewDate : null
                });
            }
        },

        isViewActive() {
            let view = this.getView();

            return view.isVisible(true);
        },

        navCancelHandler() {
            if (this.isViewActive()) {
                this.handleCancelClick();
            }
        },

        navDeleteHandler(_, event) {
            let targetEl = Ext.fly(event.target),
                targetCmp = targetEl && targetEl.component;

            if (!targetCmp || !targetCmp.isTextInput) {
                if (!this.getViewModel().get('isPhantom') && this.isViewActive()) {
                    this.handleDeleteClick();
                }
            }
        }
    };

});
