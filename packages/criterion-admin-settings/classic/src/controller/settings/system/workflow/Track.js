Ext.define('criterion.controller.settings.system.workflow.Track', function() {

        const WORKFLOW_TYPE_CODE = criterion.Consts.WORKFLOW_TYPE_CODE;

        return {
            extend : 'criterion.app.ViewController',

            alias : 'controller.criterion_settings_workflow_track',

            requires : [
                'criterion.view.settings.system.workflow.track.Approve',
                'criterion.view.settings.system.workflow.track.Reject',
                'criterion.view.settings.system.workflow.track.Purge'
            ],

            mixins : [
                'criterion.controller.mixin.ControlMaskZIndex'
            ],

            listen : {
                global : {
                    gridAction_approveAct : 'handleApprove',
                    gridAction_rejectAct : 'handleReject',
                    gridAction_delegateAct : 'handleDelegate',
                    gridAction_recallAct : 'handleRecall'
                }
            },

            init : function() {
                var me = this;

                me.handleActivate = Ext.Function.createBuffered(me.handleActivate, 100, me);

                this.callParent(arguments);
            },

            load : function() {
                let vm = this.getViewModel(),
                    store = vm.getStore('transactions'),
                    employeeName = this.lookup('employeeName').getValue();

                store.getProxy().setExtraParam('employeeName', employeeName);
                store.loadWithPromise();
            },

            handleEmployeeNameChange : function() {
                this.load();
            },

            handleActivate : function() {
                var me = this;

                // Load on activate is fired by paging toolbar, so here it will be duplication that also may lead to wrong results if pager pageSize is less than default

                this.lookup('workflow').focus();

                Ext.GlobalEvents.on('beforeHideForm', function() {
                    me.handleBack();

                    return true;
                }, this, {
                    buffer : 1,
                    single : true
                });
            },

            handlePurgeCompletedLogs : function() {
                var me = this,
                    vm = this.getViewModel(),
                    workflowId = vm.get('wfRecord.id'),
                    wnd;

                wnd = Ext.create('criterion.view.settings.system.workflow.track.Purge', {
                    viewModel : {
                        data : {
                            workflow : vm.get('wfRecord.name')
                        }
                    }
                });
                wnd.on({
                    cancelAction : function() {
                        me.setCorrectMaskZIndex(false);
                        wnd.destroy();
                    },
                    submit : function(date) {
                        me.purge(workflowId, date).then(function() {
                            me.setCorrectMaskZIndex(false);
                            me.load();
                            wnd.destroy();
                            me.lookup('workflow').focus();
                        });
                    },
                    scope : this
                });
                wnd.show();
                wnd.focusFirstField();
                this.setCorrectMaskZIndex(true);
            },

            purge : function(workflowId, date) {
                var vm = this.getViewModel();

                return criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.WORKFLOW_TRANSACTION_PURGE,
                        jsonData : {
                            employeeId : vm.get('employeeId'),
                            workflowId : workflowId,
                            date : Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT)
                        },
                        method : 'PUT'
                    }
                )
            },

            handleBack : function() {
                this.getView().fireEvent('close');
            },

            handleApprove : function(record) {
                var me = this,
                    wnd,
                    workflowQueueId = record.get('workflowQueueId');

                wnd = Ext.create('criterion.view.settings.system.workflow.track.Approve', {
                    viewModel : {
                        data : {
                            action : record.get('action')
                        }
                    }
                });
                wnd.on({
                    cancelAction : function() {
                        me.setCorrectMaskZIndex(false);
                        wnd.destroy();
                    },
                    submit : function(comment) {
                        me.approve(workflowQueueId, comment).then(function() {
                            me.setCorrectMaskZIndex(false);
                            me.load();
                            wnd.destroy();
                        });
                    },
                    scope : this
                });
                wnd.show();
                wnd.focusFirstField();
                this.setCorrectMaskZIndex(true);
            },

            approve : function(workflowQueueId, comment) {
                var vm = this.getViewModel();

                return criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.WORKFLOW_TRANSACTION_APPROVE,
                        jsonData : {
                            employeeId : vm.get('employeeId'),
                            workflowQueueId : workflowQueueId,
                            comment : comment
                        },
                        method : 'PUT'
                    }
                )
            },

            handleReject : function(record) {
                var me = this,
                    wnd,
                    workflowQueueId = record.get('workflowQueueId'),
                    workflowLogId = record.get('workflowTransactionLogId');

                wnd = Ext.create('criterion.view.settings.system.workflow.track.Reject');
                wnd.on({
                    cancelAction : function() {
                        me.setCorrectMaskZIndex(false);
                        wnd.destroy();
                    },
                    submit : function(comment) {
                        var afterAct = function() {
                            me.setCorrectMaskZIndex(false);
                            me.load();
                            wnd.destroy();
                        };

                        if (record.get('isApprovedTimesheet')) {
                            if (record.get('isApplied')) {
                                criterion.Msg.confirm(
                                    i18n.gettext('Reject'),
                                    i18n.gettext('Some or all days in the timesheet have been applied to payroll. Do you wish to continue?'),
                                    function(btn) {
                                        if (btn === 'yes') {
                                            me.reset(workflowLogId, comment).then(afterAct);
                                        }
                                    }
                                );
                            } else {
                                me.reset(workflowLogId, comment).then(afterAct);
                            }
                        } else {
                            me.reject(workflowQueueId, comment).then(afterAct);
                        }
                    },
                    scope : this
                });
                wnd.show();
                wnd.focusFirstField();

                this.setCorrectMaskZIndex(true);
            },

            reject : function(workflowQueueId, comment) {
                var vm = this.getViewModel();

                return criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.WORKFLOW_TRANSACTION_REJECT,
                        jsonData : {
                            employeeId : vm.get('employeeId'),
                            workflowQueueId : workflowQueueId,
                            comment : comment
                        },
                        method : 'PUT'
                    }
                )
            },

            reset : function(workflowLogId, comment) {
                var vm = this.getViewModel();

                return criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.WORKFLOW_TRANSACTION_RESET,
                        jsonData : {
                            employeeId : vm.get('employeeId'),
                            workflowLogId : workflowLogId,
                            comment : comment
                        },
                        method : 'PUT'
                    }
                )
            },

            handleDelegate : function(record) {
                var picker = Ext.create('criterion.view.employee.EmployeePicker', {
                        isActive : true
                    }),
                    me = this,
                    workflowQueueId = record.get('workflowQueueId');

                picker.show();
                picker.on('select', function(searchRecord) {
                    var toEmployeeId = parseInt(searchRecord.get('employeeId'), 10);

                    me.delegate(workflowQueueId, toEmployeeId).then(function() {
                        me.load();
                    });
                }, this);
            },

            delegate : function(workflowQueueId, toEmployeeId) {
                var vm = this.getViewModel();

                return criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.WORKFLOW_TRANSACTION_DELEGATE,
                        jsonData : {
                            employeeId : vm.get('employeeId'),
                            workflowQueueId : workflowQueueId,
                            toEmployeeId : toEmployeeId
                        },
                        method : 'PUT'
                    }
                )
            },

            renderObjectColumn : function(value, metaData, record) {
                var workflowTypeCode = this.getViewModel().get('wfRecord.workflowTypeCode'),
                    object = record.get('workflowEntityIdentifier') || {};

                switch (workflowTypeCode) {
                    case WORKFLOW_TYPE_CODE.TIMESHEET:
                        return Ext.String.format(
                            '{0} &mdash; {1}',
                            Ext.Date.format(Ext.Date.parse(object.startDate, criterion.consts.Api.DATE_FORMAT), criterion.consts.Api.SHOW_DATE_FORMAT),
                            Ext.Date.format(Ext.Date.parse(object.endDate, criterion.consts.Api.DATE_FORMAT), criterion.consts.Api.SHOW_DATE_FORMAT)
                        );

                    case WORKFLOW_TYPE_CODE.TIME_OFF:
                        return Ext.String.format(
                            '{0} &mdash; {1}. {2}',
                            Ext.Date.format(Ext.Date.parse(object.startDate, criterion.consts.Api.RAW_DATE_TIME_FORMAT), criterion.consts.Api.DATE_AND_TIME_FORMAT),
                            Ext.Date.format(Ext.Date.parse(object.endDate, criterion.consts.Api.RAW_DATE_TIME_FORMAT), criterion.consts.Api.DATE_AND_TIME_FORMAT),
                            object.notes
                        );

                    case WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW:
                        return Ext.String.format(
                            '<strong>Employee:</strong> {0}<br><strong>Period:</strong> {1} &mdash; {2}. {3}<br><strong>Type:</strong> {4} <strong>Review Date:</strong> {5}',
                            object.employeeFullName,

                            Ext.Date.format(Ext.Date.parse(object.periodStart, criterion.consts.Api.DATE_FORMAT), criterion.consts.Api.SHOW_DATE_FORMAT),
                            Ext.Date.format(Ext.Date.parse(object.periodEnd, criterion.consts.Api.DATE_FORMAT), criterion.consts.Api.SHOW_DATE_FORMAT),

                            object.reviewPeriodName,

                            object.reviewTypeName,
                            Ext.Date.format(Ext.Date.parse(object.reviewDate, criterion.consts.Api.DATE_FORMAT), criterion.consts.Api.SHOW_DATE_FORMAT)
                        );
                }

                return '';
            },

            handleRecall : function(record) {
                var me = this;

                criterion.Msg.confirm(
                    i18n.gettext('Confirm'),
                    i18n.gettext('Do you want to recall?'),
                    function(btn) {
                        if (btn === 'yes') {
                            criterion.Api.requestWithPromise({
                                url : Ext.String.format(criterion.consts.Api.API.WORKFLOW_TRANSACTION_LOG_RECALL, record.get('workflowTransactionId')),
                                method : 'PUT'
                            }).then(function() {
                                me.setCorrectMaskZIndex(false);
                                me.load();
                            });
                        }
                    }
                );
            },

            handleDownloadReport() {
                let vm = this.getViewModel(),
                    options = Ext.JSON.encode({
                            "advancedParams" : [],
                            "groupByParams" : [],
                            "isExternalLoaded" : false,
                            "showOnLaunch" : 1,
                            "filters" : [],
                            "hiddenColumns" : [],
                            "orderBy" : [
                                {
                                    "key" : "order_1",
                                    "fieldName" : "assigned_name",
                                    "dir" : "asc",
                                    "displayName" : "Assigned Employee",
                                    "selected" : false
                                },
                                {
                                    "key" : "order_2",
                                    "fieldName" : "wtl.action_time",
                                    "dir" : "asc",
                                    "displayName" : "Date/Time",
                                    "selected" : false
                                },
                                {
                                    "key" : "order_3",
                                    "fieldName" : "log_id",
                                    "dir" : "asc",
                                    "displayName" : "ID",
                                    "selected" : false
                                }, {

                                    "key" : "order_4",
                                    "fieldName" : "initiator_name",
                                    "dir" : "asc",
                                    "displayName" : "Initiator",
                                    "selected" : false
                                }
                            ],
                            "groupBy" : [],
                            "parameters" : [
                                {
                                    "name" : "workflowId",
                                    "label" : "Workflow Id",
                                    "mandatory" : false,
                                    "valueType" : "integer",
                                    "hidden" : false,
                                    "isTransferParameter" : false,
                                    "value" : vm.get('wfRecord.id')
                                }
                            ]
                        }
                    );

                window.open(criterion.Api.getSecureResourceUrl(
                    Ext.util.Format.format(criterion.consts.Api.API.REPORT_DOWNLOAD_BY_NAME, 'workflow_status', encodeURI(options))
                ));
            }
        }

    }
);
