Ext.define('criterion.controller.ess.performance.MyGoals', function() {
    
    return {

        extend : 'criterion.controller.person.Goals',

        alias : 'controller.criterion_selfservice_performance_my_goals',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        afterMainStoreLoaded() {
            this.fillReviews();
        },

        handleChangeWeight() {
            let store = this.getView().getStore(),
                weights = {},
                values,
                somePendingWorkflow = false;

            store.each(rec => {
                let weightInPercent = rec.get('weightInPercent'),
                    reviewId = rec.get('reviewId');

                somePendingWorkflow = somePendingWorkflow || rec.get('isPendingWorkflow');
                rec.set('weight', weightInPercent / 100);

                if (!weights[reviewId]) {
                    weights[reviewId] = 0;
                }

                weights[reviewId] += rec.get('weightInPercent');
            });

            values = Ext.Object.getValues(weights);

            this.getViewModel().set('canSubmit', Ext.Array.sum(values) === (100 * values.length));
        },

        doConfirmAndSubmitWeights(workflows) {
            let me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                employeeId = vm.get('employeeId'),
                store = me.getView().getStore(),
                workflowsToSubmit = {},
                workflowIds;

            function confirmNextWorkflow() {
                if (workflowIds.length) {
                    let workflow = workflows.getById(workflowIds[0]),
                        workflowData,
                        workflowVmIdent = me.getWorkflowVmIdent(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL),
                        goalsWithoutWorkflow;

                    workflowIds.splice(0, 1);

                    if (workflow) {
                        workflowData = workflow.data;
                        vm.set(workflowVmIdent, workflowData.isActive ? Ext.clone(workflowData) : null);

                        // delay for correct find the mask element
                        Ext.defer(function() {
                            me.setCorrectMaskZIndex(true);
                        }, 10);

                        me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL).then(function(signature) {

                            view.setLoading(true);
                            me.setCorrectMaskZIndex(false);

                            if (signature) {
                                store.getModifiedRecords().forEach(function(record) {
                                    if (record.get('workflowId') === workflow.getId()) {
                                        record.set('signature', signature);
                                    }
                                });
                            }

                            confirmNextWorkflow();

                        }).otherwise(function() {
                            view.setLoading(false);
                        });
                    } else {
                        view.setLoading(false);
                        goalsWithoutWorkflow = Ext.Array.map(store.getModifiedRecords(), goal => goal.get('name'));
                        criterion.Msg.error(Ext.String.format(i18n.gettext('Workflow is not set for goal') + '{0}: {1}', goalsWithoutWorkflow.length === 1 ? '' : 's', goalsWithoutWorkflow.join(', ')));
                    }
                } else {
                    view.setLoading(true);

                    store.each(rec => rec.dirty = true);

                    store.syncWithPromise().then(() => {
                        view.setLoading(false);

                        me.getViewModel().set('canSubmit', false);

                        me.load();

                        criterion.Utils.toast(i18n.gettext('Weight changes saved.'));
                    }).otherwise(() => {
                        view.setLoading(false);
                    });
                }
            }

            store.each(function(goal) {
                workflowsToSubmit[goal.get('workflowId')] = true;
            });
            workflowIds = Ext.Object.getKeys(workflowsToSubmit);

            confirmNextWorkflow();
        },

        handleSubmitWeights() {
            let me = this,
                vm = me.getViewModel(),
                workflowTypeCd,
                submitWorkflows = vm.getStore('submitWorkflows');

            Ext.Deferred.sequence([
                function() {
                    return criterion.CodeDataManager.getCodeDetailRecordStrict('code', criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL, criterion.consts.Dict.WORKFLOW).then(function(workflowTypeRec) {
                        workflowTypeCd = workflowTypeRec.getId();
                    })
                },
                function() {
                    return submitWorkflows.loadWithPromise({
                        params : {
                            workflowTypeCd : workflowTypeCd,
                            employerId : vm.get('employerId')
                        }
                    })
                }
            ]).then(function() {
                me.doConfirmAndSubmitWeights(submitWorkflows);
            });
        },

        fillReviews() {
            let store = this.getView().getStore(),
                employeeReviewsData = {},
                employeeReviews = this.getViewModel().getStore('employeeReviews');

            store.each(rec => {
                let reviewId = rec.get('reviewId');

                if (!employeeReviewsData[reviewId]) {
                    employeeReviewsData[reviewId] = {
                        id : reviewId,
                        reviewPeriodName : rec.get('reviewPeriodName'),
                        periodStart : rec.get('reviewPeriodStart'),
                        periodEnd : rec.get('reviewPeriodEnd')
                    }
                }
            });

            employeeReviews.loadData(Ext.Object.getValues(employeeReviewsData));
        },

        handleBeforeReviewSelect(combo, value) {
            let me = this,
                view = me.getView(),
                store = view.getStore();

            if (!combo.suspendConfirmSelection && value && store.getModifiedRecords().length) {
                criterion.Msg.confirm(
                    i18n.gettext('Change Review'),
                    i18n.gettext('You have unsaved weight changes. They will be lost after change. Do you want to change?'),
                    function(btn) {
                        if (btn === 'yes') {
                            store.rejectChanges();
                            combo.suspendConfirmSelection = true;

                            combo.setValue(value);
                        }
                    }
                );

                return false;
            }

            combo.suspendConfirmSelection = false;
        },

        handleReviewChange(combo, value) {
            let me = this,
                view = me.getView(),
                store = view.getStore();

            if (value) {
                store.filter('reviewId', value);
            } else {
                store.clearFilter();
            }

            me.handleChangeWeight();
        }
    }
});
