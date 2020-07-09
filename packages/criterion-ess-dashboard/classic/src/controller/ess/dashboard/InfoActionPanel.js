Ext.define('criterion.controller.ess.dashboard.InfoActionPanel', function() {

    const DICT = criterion.consts.Dict;

    let selectedId, lastSelectedLog;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_dashboard_info_action_panel',

        requires : [
            'criterion.store.dashboard.OnboardingTasks'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        listen : {
            global : {
                selectDashboardWorkflow : 'onSelectDashboardWorkflow',
                changeSelectedWorkflowDetail : 'onChangeSelectedWorkflowDetail',
                changeLastSelectedWorkflowDetail : 'onChangeLastSelectedWorkflowDetail',
                reloadWorkflowStore : 'onReloadWorkflowStore',
                reloadActionPanel : 'onReloadActionPanel'
            }
        },

        onChangeSelectedWorkflowDetail : function(newSelectedId) {
            selectedId = newSelectedId;
        },

        onChangeLastSelectedWorkflowDetail : function(newLastSelectedLog) {
            lastSelectedLog = newLastSelectedLog;
        },

        onReloadWorkflowStore : function() {
            Ext.promise.Promise.all([
                this.getViewModel().getStore('onboardingTasks').loadWithPromise(),
                Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.WORKFLOW_PENDING_LOGS.storeId).loadWithPromise({
                    params : {
                        employeeId : this.getEmployeeId(),
                        withoutDetails : true
                    }
                })
            ]).then({
                scope : this,
                success : this.onLoadSuccess
            });
        },

        init : function() {
            var wlStore,
                vm = this.getViewModel();

            this.onReloadWorkflowStore = Ext.Function.createDelayed(this.onReloadWorkflowStore, 500, this, null, null);

            wlStore = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.WORKFLOW_PENDING_LOGS.storeId);
            wlStore.on({
                load : this.onWLStoreChanged,
                datachanged : this.onWLStoreChanged,
                scope : this
            });
            vm.set('workflowLogs', wlStore);

            this.callParent(arguments);
        },

        onWLStoreChanged : function(store) {
            this.getViewModel().set('myTaskCount', store.getCount());
        },

        onSelectDashboardWorkflow : function(workflowLog) {
            var me = this;

            Ext.defer(function() {
                me.lookup('myTasks').selectDashboardWorkflow(workflowLog.getId());
            }, 500);
        },

        deselectTasks : function() {
            this.lookup('myTasks').deselectAllWorkflow();
        },

        onEmployeeChange : function(newVal, oldVal) {
            this.deselectTasks();
            this.load();
        },

        onReloadActionPanel : function() {
            this.load();
        },

        load : function() {
            var me = this,
                employeeId = me.getEmployeeId();

            if (!employeeId) {
                return;
            }

            var vm = me.getViewModel(),
                timeOffs = vm.getStore('timeOffs'),
                essLinks = vm.getStore('essLinks'),
                employerId = me.getEmployerId(),
                params = {
                    employeeId : employeeId,
                    withoutDetails : true
                };

            Ext.promise.Promise.all([
                criterion.CodeDataManager.load([
                    DICT.TIME_OFF_TYPE,
                    DICT.ORG_STRUCTURE,
                    DICT.ASSIGNMENT_ACTION,
                    DICT.TERMINATION,
                    DICT.DATA_TYPE,
                    DICT.RELATIONSHIP_TYPE
                ]),
                timeOffs.loadWithPromise({
                    scope : me,
                    params : params
                }),
                essLinks.loadWithPromise({
                    scope : this,
                    params : {
                        employerId : employerId
                    }
                }).then({
                    success : function() {
                        vm.set('showEssLinks', essLinks.count() > 0);
                    }
                })
            ]).then({
                scope : this,
                success : this.onLoadSuccess
            })
        },

        onLoadSuccess : function(response) {
            let me = this,
                vm = this.getViewModel(),
                workflowLogs = vm.get('workflowLogs'),
                onboardingTasks = vm.get('onboardingTasks'),
                myTasksGrouping = this.lookup('myTasks').getView().getFeature('grouping'),
                onboardingGroupName = criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_ONBOARDING, criterion.consts.Dict.WORKFLOW).get('description'), // i18n.gettext('Onboarding'),
                afterWorkflowLoad = function() {
                    workflowLogs.each(workflowLog => {
                        let employeeOnboarding = workflowLog.getEmployeeOnboarding();

                        if (workflowLog.get('isOnboarding') && employeeOnboarding) {
                            workflowLog.set({
                                workflowTypeDescription : onboardingGroupName,
                                id : employeeOnboarding.get('id'),
                                employeeName : employeeOnboarding.get('name'),
                                dueDate : employeeOnboarding.get('dueDate'),
                                isOnboardingForm : true
                            });
                        }
                    });

                    onboardingTasks.each(onboardingTask => {
                        let onboardingTaskId = onboardingTask.getId(),
                            pIndex = workflowLogs.findBy(rec => (rec.getId() === onboardingTaskId && rec.get('isOnboarding')));

                        if (pIndex === -1) {
                            workflowLogs.add({
                                workflowTypeDescription : onboardingGroupName,
                                id : onboardingTaskId,
                                employeeName : onboardingTask.get('name'),
                                dueDate : onboardingTask.get('dueDate'),
                                isOnboarding : true,
                                assignedToEmployeeName : onboardingTask.get('assignedToEmployeeName')
                            });
                        }
                    });

                    if (myTasksGrouping.getGroup(onboardingGroupName)) {
                        myTasksGrouping.collapse(onboardingGroupName);
                    }

                    if (selectedId) {
                        Ext.GlobalEvents.fireEvent('loadWorkflowDetail', selectedId);
                        return;
                    }

                    if (lastSelectedLog) {
                        me.selectNearLogRecord(lastSelectedLog);
                    }
                };

            if (workflowLogs.isLoading()) {
                workflowLogs.on('load', function() {
                    afterWorkflowLoad();
                }, me, {single : true});
            } else {
                afterWorkflowLoad();
            }

        },

        selectNearLogRecord : function(log) {
            var workflowLogs = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.WORKFLOW_PENDING_LOGS.storeId),
                firstRecordByType = workflowLogs.findRecord('workflowTypeCode', log.workflowTypeCode),
                selectRecord = firstRecordByType || workflowLogs.count() && workflowLogs.first(),
                selectRecordId = selectRecord && selectRecord.getId(),
                isOnboardingTaskSelect = selectRecord && selectRecord.get('isOnboarding'),
                isOnboardingForm = selectRecord && selectRecord.get('isOnboardingForm');

            if (!selectRecordId) {
                this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD, null);
            } else if (isOnboardingTaskSelect && !isOnboardingForm) {
                this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD_TASK + '/' + selectRecordId, null);
            } else {
                this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD_INBOX + '/' + selectRecordId, null);
            }
        },

        handleTasksGroupCollapse : function(grid) {
            // for prevent bug with focus on a destroyed el (D2-10608)
            grid.blur();
        },

        gotoTimeOffs() {
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.TIME_TIME_OFF_DASHBOARD, null);
        }
    }
});
