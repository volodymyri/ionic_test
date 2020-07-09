Ext.define('criterion.controller.ess.dashboard.Main', function() {

    var ONBOARDING_TASK_TYPES = criterion.Consts.ONBOARDING_TASK_TYPES,
        hasStreamContainer = false,
        taskContainer,
        selectedId, lastSelectedLog,
        ROUTES = criterion.consts.Route,
        SELF_SERVICE = ROUTES.SELF_SERVICE;

    return {

        extend : 'criterion.controller.ess.Base',

        requires : [
            'criterion.model.workflowLog.PendingLogDetail',
            'criterion.ux.grid.column.Time',
            'criterion.view.common.OnboardingForm',
            'criterion.model.employee.Onboarding'
        ],

        alias : 'controller.criterion_selfservice_dashboard_main',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.WorkflowDetail',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.ReRouting'
        ],

        listen : {
            global : {
                loadWorkflowDetail : 'loadDetails'
            }
        },

        init : function() {
            this.getViewModel().bind('{hideWorkflow}', function(val) {
                Ext.GlobalEvents.fireEvent('changeHideWorkflowState', val);
            });

            this.setReRouting();

            this.callParent(arguments);
        },

        baseURL : criterion.consts.Route.SELF_SERVICE.DASHBOARD,

        getRoutes : function() {
            var routes = this.callParent(arguments);

            routes[this.baseURL] = 'showStream';
            routes[this.baseURL + '/inbox/:id'] = 'loadDetails';
            routes[this.baseURL + '/task/:id'] = 'showTask';

            return routes;
        },

        showStream : function() {
            var view = this.getView();

            if (!hasStreamContainer) {

                hasStreamContainer = true;

                view.add(
                    {
                        xtype : 'panel',

                        cls : 'info-panel-element info-box',

                        bodyPadding : 20,

                        margin : '0 0 20 0',

                        hidden : true,

                        bind : {
                            title : '{infoBox.title}',
                            hidden : '{!infoBoxEnabled || !infoBox || hideStream}'
                        },

                        items : [
                            {
                                xtype : 'container',
                                bind : {
                                    html : '{infoBox.text}'
                                }
                            },
                            {
                                xtype : 'dataview',
                                margin : '0 0 20 0',
                                cls : 'video-list',
                                itemSelector : 'div.video',
                                height : 'auto',
                                bind : {
                                    store : '{infoBox.videos}'
                                },
                                tpl : new Ext.XTemplate(
                                    '<tpl for=".">' +
                                    '   <div class="video">' +
                                    '       <div class="mask"></div>',
                                    '       <div class="frame-container">',
                                    '           <iframe src="{url}"></iframe>' +
                                    '       </div>',
                                    '       <div class="title">{name}</div>' +
                                    '   </div>' +
                                    '</tpl>'
                                ),
                                listeners : {
                                    itemclick : function(dataview, record) {
                                        var popup = Ext.create('criterion.ux.Panel', {
                                            plugins : [
                                                {
                                                    ptype : 'criterion_sidebar',
                                                    modal : true,
                                                    height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                                                    width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_2_WIDTH
                                                }
                                            ],

                                            closable : false,
                                            scrollable : false,
                                            title : record.get('name'),

                                            bodyPadding : 20,

                                            layout : 'fit',

                                            buttons : [
                                                '->',
                                                {
                                                    xtype : 'button',
                                                    text : i18n.gettext('Close'),
                                                    ui : 'light',
                                                    handler : function() {
                                                        popup.destroy();
                                                    }
                                                }
                                            ],

                                            items : [
                                                {
                                                    xtype : 'uxiframe',
                                                    src : record.get('url')
                                                }
                                            ]
                                        });

                                        popup.show();
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        hidden : true,

                        bind : {
                            hidden : '{!feedEnabled || hideStream}'
                        },

                        layout : 'fit',

                        reference : 'streamContainer',

                        items : [
                            {
                                xtype : 'criterion_ess_community_stream',

                                layout : {
                                    type : 'vbox',
                                    align : 'stretch'
                                },

                                scrollable : false,

                                listeners : {
                                    postingCancel : 'onPostingCancel',
                                    postSaved : 'onPostSaved',
                                    communityPostCreateStatus : 'onCommunityPostCreateStatusChange'
                                }
                            }
                        ]
                    }
                )
            } else {
                this.load();
                Ext.GlobalEvents.fireEvent('reloadActionPanel');
            }

            selectedId = null;
            Ext.GlobalEvents.fireEvent('changeSelectedWorkflowDetail', selectedId);
            lastSelectedLog = null;
            Ext.GlobalEvents.fireEvent('changeLastSelectedWorkflowDetail', lastSelectedLog);

            this.getViewModel().set({
                hideStream : false,
                hideWorkflow : true,
                hideTasks : true,
                fullPageMode : false
            });
        },

        showTask : function(id) {
            let me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                onboardingId = parseInt(id, 10);

            if (!onboardingId) {
                criterion.Utils.toast(i18n.gettext('Can\'t find pending task with ID ' + id));
                this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD, null);

                return;
            }

            if (!taskContainer) {
                taskContainer = view.add(
                    {
                        xtype : 'container',

                        padding : 0,

                        margin : 0,

                        scrollable : false,

                        hidden : true,

                        bind : {
                            hidden : '{hideTasks}'
                        },

                        items : [
                            {
                                xtype : 'criterion_common_onboarding_form',

                                closeAction : 'hide',

                                ui : 'clean',

                                padding : 0,

                                viewModel : {
                                    data : {
                                        readOnly : true,
                                        dueInDays : false,
                                        hideDownloadDocumentIcon : true,
                                        showWorkflowName : true
                                    },
                                    formulas : {
                                        hideSave : () => true,
                                        cancelBtnText : () => i18n.gettext('Close'),
                                        showMarkAsComplete : data => data('record.hasMarkAsComplete'),
                                        isCourseTaskType : data => data('record.onboardingTaskTypeCode') === ONBOARDING_TASK_TYPES.COURSE,
                                        isDocumentTaskType : data => data('record.onboardingTaskTypeCode') === ONBOARDING_TASK_TYPES.DOCUMENT,
                                        isVideoTaskType : data => data('record.onboardingTaskTypeCode') === ONBOARDING_TASK_TYPES.VIDEO,
                                        isFormTaskType : data => data('record.onboardingTaskTypeCode') === ONBOARDING_TASK_TYPES.FORM,
                                        displayEmployeeName : data => data('record.employeeName')
                                    }
                                },

                                flex : 1,

                                cls : 'criterion-ess-panel',

                                frame : true,

                                dockedItems : [
                                    {
                                        xtype : 'toolbar',
                                        dock : 'top',
                                        items : [
                                            '->',
                                            {
                                                xtype : 'button',
                                                text : i18n.gettext('Go to page'),
                                                bind : {
                                                    hidden : '{!(isSystemTaskType || isCourseTaskType)}'
                                                },
                                                handler : function() {
                                                    var record = this.up('criterion_common_onboarding_form').getViewModel().get('record'),
                                                        redirectTo = criterion.Consts.ONBOARDING_SYSTEM_TASK_LINKS[record.get('onboardingTaskTypeCode')];

                                                    if (redirectTo) {
                                                        me.redirectTo(redirectTo);
                                                    }
                                                }
                                            },
                                            {
                                                xtype : 'button',
                                                text : i18n.gettext('Watch Video'),
                                                bind : {
                                                    hidden : '{!isVideoTaskType}'
                                                },
                                                handler : function() {
                                                    var record = this.up('criterion_common_onboarding_form').getViewModel().get('record'),
                                                        url = record.get('employerVideoUrl');

                                                    if (url) {
                                                        window.open(url);
                                                    }
                                                }
                                            },
                                            {
                                                xtype : 'button',
                                                text : i18n.gettext('Download'),
                                                bind : {
                                                    hidden : '{!isDocumentTaskType}'
                                                },
                                                handler : 'handleDocumentDownload'
                                            },
                                            {
                                                xtype : 'button',
                                                text : i18n.gettext('Mark as complete'),
                                                bind : {
                                                    hidden : '{!showMarkAsComplete}'
                                                },
                                                handler : function() {
                                                    let onboardingTaskId = this.up('criterion_common_onboarding_form').getViewModel().get('record.id');

                                                    criterion.Api.requestWithPromise({
                                                        url : Ext.String.format(criterion.consts.Api.API.DASHBOARD_ONBOARDING_TASKS_COMPLETED, onboardingTaskId),
                                                        jsonData : {
                                                            completionDate : Ext.Date.format(new Date(), criterion.consts.Api.DATE_FORMAT)
                                                        },
                                                        method : 'PUT'
                                                    }).then(function() {
                                                        criterion.Utils.toast(i18n.gettext('Successfully'));

                                                        vm.set({
                                                            hideStream : false,
                                                            hideWorkflow : true,
                                                            hideTasks : true,
                                                            fullPageMode : false
                                                        });

                                                        Ext.GlobalEvents.fireEvent('reloadActionPanel');

                                                        me.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD);
                                                    });
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar',
                                        dock : 'top'
                                    }
                                ]
                            }
                        ]
                    }
                );
            }

            criterion.model.employee.Onboarding.loadWithPromise(onboardingId).then(function(task) {
                let onboardingForm = taskContainer.down('criterion_common_onboarding_form');

                onboardingForm.getViewModel().set('record', task);
                onboardingForm.getController().handleRecordLoad(task);

                onboardingForm.on('close', function() {
                    vm.set({
                        hideStream : false,
                        hideWorkflow : true,
                        hideTasks : true,
                        fullPageMode : false
                    });
                    me.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD);
                });

                if (onboardingForm.isHidden()) {
                    onboardingForm.show();
                }

                vm.set({
                    hideStream : true,
                    hideWorkflow : true,
                    hideTasks : false
                });

            });
        },

        loadDetails : function(id) {
            let me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                employeeId = me.getEmployeeId(),
                workflowLogs = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.WORKFLOW_PENDING_LOGS.storeId),
                commentTextarea;

            view.fillWorkflowContainer();
            commentTextarea = me.lookup('commentTextarea');

            if (selectedId && Ext.isNumeric(selectedId) && selectedId === id) {
                return;
            }

            selectedId = +id;

            if (!selectedId) {
                return;
            }

            Ext.GlobalEvents.fireEvent('changeSelectedWorkflowDetail', selectedId);

            if (!employeeId) {
                selectedId = null;

                view.on('viewEmployeeChange', function() {
                    me.loadDetails(id);
                }, this, {single : true});

                return;
            }

            if (workflowLogs.loadCount === 0) {
                selectedId = null;

                Ext.GlobalEvents.on('workflowLogPendingLogsLoaded', function() {
                    me.loadDetails(id);
                }, this, {
                    single : true
                });

                return;
            }

            let workflowLog = workflowLogs && workflowLogs.getById(selectedId),
                workflowTypeCode = workflowLog && workflowLog.get('workflowTypeCode'),
                seq = [
                    function() {
                        return criterion.CodeDataManager.loadIfEmpty(criterion.consts.Dict.DATA_TYPE);
                    },
                    function() {
                        return criterion.model.workflowLog.PendingLogDetail.loadWithPromise(workflowLog.get('workflowQueueId')).then({
                            scope : me,
                            success : me.onDetailsLoadSuccess
                        });
                    }
                ],
                delegatedByEmployeeId;

            if (!workflowLog || !workflowLog.get('workflowQueueId')) {
                criterion.Utils.toast(i18n.gettext('Can\'t find pending request with ID ' + id));
                this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD, null);

                return;
            }

            delegatedByEmployeeId = workflowLog.get('delegatedByEmployeeId');

            commentTextarea.setValue('');
            commentTextarea.clearInvalid();
            vm.set({
                workflowLog : workflowLog.getData(),
                hasCustomFields : false
            });

            if (Ext.isNumeric(selectedId)) {
                Ext.GlobalEvents.fireEvent('selectDashboardWorkflow', workflowLog);
            }

            view.setLoading(true);

            if (Ext.Array.contains([criterion.Consts.WORKFLOW_TYPE_CODE.FORM, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_ONBOARDING], workflowTypeCode)) {
                seq.push(function() {
                    return me.loadWorkflowData(employeeId, workflowTypeCode, delegatedByEmployeeId, vm.get('workflowLog.actualData.workflowId'));
                });
            }

            Ext.Deferred.sequence(seq);
        },

        onEmployeeChange : function(newVal, oldVal) {
            oldVal && this.getViewModel().set({
                hideStream : false,
                hideWorkflow : true,
                hideTasks : true,
                fullPageMode : false
            });
        },

        load : function() {
            Ext.GlobalEvents.fireEvent('reloadWorkflowStore');
        },

        handleSave : function() {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                selectedRecord = vm.get('workflowLog');

            if (vm.get('canSave')) {
                if (vm.get('isFillableForm')) {
                    this.saveFillableForm();
                } else {
                    var reviewForm = me.lookup('reviewForm'),
                        reviewData;

                    if (selectedRecord) {
                        reviewData = Ext.apply(reviewForm.getReviewData(), reviewForm.getReviewCustomData());
                    }

                    view.setLoading(true, null);
                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.WORKFLOW_TRANSACTION_SAVE,
                        params : {
                            workflowQueueId : selectedRecord.workflowQueueId,
                            employeeId : me.getEmployeeId()
                        },
                        jsonData : reviewData,
                        method : 'PUT'
                    }).then({
                        success : function() {
                            criterion.Utils.toast(i18n.gettext('Review saved.'));
                        }
                    }).always(function() {
                        view.setLoading(false, null);
                    });
                }
            }
        },

        handleApprove : function() {
            var vm = this.getViewModel(),
                commentTextarea = this.lookup('commentTextarea');

            Ext.defer(commentTextarea.clearInvalid, 100, commentTextarea);

            if (vm.get('isReview') && !vm.get('needApprove')) {
                this.submitReview();
            } else if (vm.get('isFillableForm') && !vm.get('needApprove')) {
                this.submitFillableForm();
            } else {
                this.approveWorkflowLog();
            }
        },

        submitReview : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                reviewForm = me.lookup('reviewForm'),
                selectedLog = vm.get('workflowLog'),
                promise;

            view.setLoading(true);

            promise = selectedLog && reviewForm.submitReview();
            if (promise) {
                promise.then({
                    success : function() {
                        lastSelectedLog = selectedLog;
                        Ext.GlobalEvents.fireEvent('changeLastSelectedWorkflowDetail', lastSelectedLog);
                        selectedId = null;
                        Ext.GlobalEvents.fireEvent('changeSelectedWorkflowDetail', selectedId);

                        me.load();
                        me.cleanupForm();
                    }
                }).always(function() {
                    view.setLoading(false);
                });
            }
        },

        isFillableFormValid : function() {
            let me = this,
                vm = this.getViewModel(),
                fillableForm = me.lookup(vm.get('isFillableWebForm') ? 'fillableWebForm' : 'fillableDataForm'),
                isValid = fillableForm.isValid();

            if (!isValid) {
                fillableForm.findNextInvalidFormField && fillableForm.findNextInvalidFormField(me.getView().up('criterion_selfservice_dashboard'));
            }

            return isValid;
        },

        saveFillableForm : function() {
            var me = this,
                vm = this.getViewModel(),
                selectedLog = vm.get('workflowLog');

            if (!me.isFillableFormValid() || !selectedLog) {
                return;
            }

            me.sendFillableFormData(criterion.consts.Api.API.WORKFLOW_TRANSACTION_SAVE + '?workflowQueueId=' + selectedLog.workflowQueueId);
        },

        sendFillableFormData : function(url, extraData = {}) {
            let me = this,
                view = me.getView(),
                vm = this.getViewModel(),
                fillableForm = me.lookup(vm.get('isFillableWebForm') ? 'fillableWebForm' : 'fillableDataForm'),
                selectedLog = vm.get('workflowLog'),
                comment = vm.get('approverComment');

            extraData.employeeId = me.getEmployeeId();

            if (comment) {
                extraData.comment = comment;
            }

            view.setLoading(true, null);

            criterion.Api.submitFakeForm(fillableForm.getFormValues(), {
                url : url,
                method : 'PUT',
                extraData : extraData,
                replaceNameWith : 'fieldId',
                scope : this,
                success : function() {
                    lastSelectedLog = selectedLog;
                    Ext.GlobalEvents.fireEvent('changeLastSelectedWorkflowDetail', lastSelectedLog);
                    selectedId = null;
                    Ext.GlobalEvents.fireEvent('changeSelectedWorkflowDetail', selectedId);

                    me.load();
                    me.cleanupForm();
                    view.setLoading(false);
                },
                failure : function() {
                    view.setLoading(false);
                }
            });
        },

        submitFillableForm() {
            let me = this,
                vm = me.getViewModel(),
                employeeId = me.getEmployeeId(),
                selectedLog = vm.get('workflowLog');

            if (!me.isFillableFormValid() || !selectedLog) {
                return;
            }

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            me.actWorkflowConfirm(
                employeeId,
                selectedLog['workflowTypeCode'],
                false,
                i18n.gettext('Do you want to submit the form?')
            ).then(function(signature) {
                let extraData = {},
                    url = selectedLog['workflowTypeCode'] === criterion.Consts.WORKFLOW_TYPE_CODE.FORM ?
                        criterion.consts.Api.API.WORKFLOW_TRANSACTION_FORM_SUBMIT :
                        criterion.consts.Api.API.WORKFLOW_TRANSACTION_ONBOARDING_SUBMIT;

                me.setCorrectMaskZIndex(false);

                if (signature) {
                    extraData['signature'] = signature;
                }

                me.sendFillableFormData(Ext.String.format(url, selectedLog.workflowQueueId), extraData);
            });
        },

        approveWorkflowLog : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                selectedLog = vm.get('workflowLog');

            selectedLog && criterion.Msg.confirm(
                i18n.gettext('Approve request'),
                i18n.gettext('Do you want to approve the request?'),
                function(btn) {
                    if (btn === 'yes') {
                        view.setLoading(true, null);

                        criterion.Api.requestWithPromise({
                            url : Ext.String.format(criterion.consts.Api.API.WORKFLOW_TRANSACTION_LOG_APPROVE, selectedLog.workflowQueueId),
                            jsonData : {
                                comment : vm.get('approverComment'),
                                employeeId : me.getEmployeeId()
                            },
                            method : 'PUT'
                        }).then(function() {
                            lastSelectedLog = selectedLog;
                            Ext.GlobalEvents.fireEvent('changeLastSelectedWorkflowDetail', lastSelectedLog);
                            selectedId = null;
                            Ext.GlobalEvents.fireEvent('changeSelectedWorkflowDetail', selectedId);

                            me.cleanupForm();

                            Ext.defer(function() {
                                view.setLoading(false);
                                me.load();
                            }, 100);
                        }, function() {
                            view.setLoading(false);
                        });
                    }
                }
            );
        },

        handleReject : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                commentTextarea = this.lookup('commentTextarea'),
                selectedLog = vm.get('workflowLog');

            if (!commentTextarea.isValid()) {
                Ext.defer(function() {
                    commentTextarea.clearInvalid();
                    commentTextarea.focus();
                }, 1000);
                return
            }

            selectedLog && criterion.Msg.confirm(
                i18n.gettext('Reject request'),
                i18n.gettext('Do you want to reject the request?'),
                function(btn) {
                    if (btn === 'yes') {
                        view.setLoading(true, null);

                        criterion.Api.requestWithPromise({
                                url : criterion.consts.Api.API.WORKFLOW_TRANSACTION_LOG_REJECT + '/' + selectedLog.workflowQueueId,
                                jsonData : {
                                    comment : vm.get('approverComment'),
                                    employeeId : me.getEmployeeId()
                                },
                                method : 'PUT'
                            }
                        ).then(function() {
                            lastSelectedLog = selectedLog;
                            Ext.GlobalEvents.fireEvent('changeLastSelectedWorkflowDetail', lastSelectedLog);
                            selectedId = null;
                            Ext.GlobalEvents.fireEvent('changeSelectedWorkflowDetail', selectedId);

                            me.load();
                            me.cleanupForm();
                            view.setLoading(false, null);
                        }, function() {
                            view.setLoading(false, null);
                        });
                    }
                }
            );
        },

        cleanupForm : function() {
            var vm = this.getViewModel(),
                timesheetHorizontal = this.lookup('timesheetHorizontal'),
                timesheetVertical = this.lookup('timesheetVertical'),
                timesheetAggregate = this.lookup('timesheetAggregate');

            vm.set({
                approverComment : ''
            });

            timesheetHorizontal && timesheetHorizontal.hide();
            timesheetVertical && timesheetVertical.hide();
            timesheetAggregate && timesheetAggregate.hide();
        },

        handleCancel : function() {
            let vm = this.getViewModel(),
                fillableForm = this.lookup(vm.get('isFillableWebForm') ? 'fillableWebForm' : 'fillableDataForm'),
                reviewForm = this.lookup('reviewForm'),
                record;

            if (fillableForm && fillableForm.isVisible()) {
                if (fillableForm.getStore) {
                    fillableForm.getStore().rejectChanges();
                }

                record = fillableForm.record || fillableForm.getRecord && fillableForm.getRecord();
                record && record.reject();

            }

            if (reviewForm && reviewForm.isVisible()) {
                let reviewFormVM = reviewForm.getViewModel();

                reviewFormVM.get('record').reject();
            }

            vm.set({
                hideStream : false,
                hideWorkflow : true,
                hideTasks : true,
                fullPageMode : false
            });

            this.redirectTo(SELF_SERVICE.DASHBOARD);
        },

        onPostingCancel : function() {
            this.getView().fireEvent('postingCancel');
        },

        onPostSaved : function() {
            this.getView().fireEvent('postSaved');
        },

        onCommunityPostCreateStatusChange : function(val) {
            var vm = this.getViewModel();

            this.getView().fireEvent('communityPostCreateStatus');

            vm.set({
                hidePosting : val
            });
        },

        onShowComments : function() {
            var comments = this.getViewModel().get('workflowLog.comments'),
                commentsPopup = Ext.create('criterion.view.ess.CommentsPopup', {
                    viewModel : {
                        stores : {
                            comments : {
                                fields : [
                                    {
                                        name : 'commentator',
                                        type : 'string'
                                    },
                                    {
                                        name : 'comment',
                                        type : 'string'
                                    },
                                    {
                                        name : 'personId',
                                        type : 'integer'
                                    },
                                    {
                                        name : 'date',
                                        type : 'date'
                                    },
                                    {
                                        name : 'commentatorPhotoUrl',
                                        depends : ['personId'],
                                        convert : function(value, record) {
                                            return criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.PERSON_PHOTO_THUMB + '/' + record.get('personId'))
                                        },
                                        persist : false
                                    }
                                ],
                                data : comments
                            }
                        }
                    },

                    buttons : [
                        '->',
                        {
                            xtype : 'button',
                            text : i18n.gettext('Close'),
                            handler : function() {
                                commentsPopup.destroy();
                            }
                        }
                    ]
                });
            commentsPopup.show();
        },

        handleDownloadAttachedFile : function() {
            var vm = this.getViewModel(),
                attachmentId = vm.get('workflowLog.actualData.attachmentId');

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(criterion.consts.Api.API.EMPLOYEE_TIME_OFF_DOWNLOAD_ATTACHMENT, attachmentId)
            ));
        }
    };
});
