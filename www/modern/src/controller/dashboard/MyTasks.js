Ext.define('ess.controller.dashboard.MyTasks', function() {

    var DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE,
        yearFrom = new Date().getFullYear() - 1,
        yearTo = new Date().getFullYear() + 1;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_dashboard_my_tasks',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.WorkflowDetail'
        ],

        listen : {
            global : {
                menuBackAction : 'menuBackAction'
            }
        },

        load : function() {
            var me = this,
                vm = this.getViewModel(),
                workflowLogs = vm.getStore('workflowLogs');

            if (!this.getEmployeeId()) {
                return;
            }

            if (workflowLogs.isLoading()) {
                return;
            }

            this.deselectTasks();

            Ext.Deferred.sequence([
                function() {
                    return criterion.CodeDataManager.load([
                        DICT.TIME_OFF_TYPE,
                        DICT.ORG_STRUCTURE,
                        DICT.ENTITY_TYPE,
                        DICT.ASSIGNMENT_ACTION,
                        DICT.DATA_TYPE
                    ]);
                },
                function() {
                    return vm.getStore('customData').loadWithPromise({
                        params : {
                            entityTypeCd : criterion.CodeDataManager
                                .getCodeDetailRecord('code', criterion.Consts.getCustomizableEntities()
                                    .CUSTOMIZABLE_ENTITY_ASSIGNMENT_DETAIL.code, DICT.ENTITY_TYPE).getId()
                        }
                    });
                },
                function() {
                    return workflowLogs.loadWithPromise({
                        scope : me,
                        params : {
                            employeeId : me.getEmployeeId(),
                            withoutDetails : true
                        }
                    });
                }
            ]).then({
                scope : this,
                success : function() {
                    var aWorkflowLogs = vm.getStore('workflowLogs').getRange();

                    vm.set('hideList', false);

                    Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.WORKFLOW_PENDING_LOGS.storeId).loadRecords(aWorkflowLogs);

                    if (!aWorkflowLogs.length) {
                        // if there are not records -> move to the main page
                        Ext.GlobalEvents.fireEvent('toggleMainMenu');
                    }
                }
            });

        },

        loadDetails : function(id) {
            var me = this,
                employeeId = me.getEmployeeId();

            if (!employeeId) {
                return;
            }

            var workflowLogs = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.WORKFLOW_PENDING_LOGS.storeId),
                workflowLog = workflowLogs && workflowLogs.getById(+id);

            if (!workflowLog) {
                return;
            }

            criterion.model.workflowLog.PendingLogDetail
                .loadWithPromise(workflowLog.get('workflowQueueId'))
                .then({
                    scope : me,
                    success : me.onDetailsLoadSuccess
                });
        },

        formatCustomFieldValues : function(customFieldValues, removedCustomValues) {
            var me = this,
                vm = this.getViewModel(),
                customValueContainer = this.lookup('customValueContainer'),
                aCustomFieldValues = customFieldValues || [],
                aRemovedCustomValues = removedCustomValues || [];

            customValueContainer.removeAll();

            if (aCustomFieldValues.length || aRemovedCustomValues.length) {
                vm.set('showCustomFields', true);

                customValueContainer.add({
                    html : i18n.gettext('Custom Fields'),
                    cls : 'custom-field-block-label'
                });
            } else {
                vm.set('showCustomFields', false);
            }

            Ext.Array.each(aCustomFieldValues, function(cfv) {
                customValueContainer.add(me.createCustomField(cfv, true));
            });
            Ext.Array.each(aRemovedCustomValues, function(cfv) {
                customValueContainer.add(me.createCustomField(cfv, false));
            });
        },

        createCustomField : function(customFieldValue, setValue) {
            var vm = this.getViewModel(),
                customData = vm.getStore('customData'),
                customField = customData.getById(customFieldValue.customFieldId),
                customFieldData = customFieldValue.customField,
                label,
                dataType,
                codeTableId,
                codeTableCode,
                field = {
                    labelAlign : 'left',
                    cls : 'custom-value-field',
                    disabled : true,
                    flex : 1,
                    value : setValue ? customFieldValue.value : null
                };

            if (customFieldData) {
                label = customFieldData['label'];
                dataType = criterion.CodeDataManager.getCodeDetailRecord('id', customFieldData['dataTypeCd'], DICT.DATA_TYPE).get('code');
                codeTableId = customFieldData['codeTableId'];
            } else if (customField) {
                label = customField.get('label');
                dataType = criterion.CodeDataManager.getCodeDetailRecord('id', customField.get('dataTypeCd'), DICT.DATA_TYPE).get('code');
                codeTableId = customField.get('codeTableId');
            } else {
                label = '';
                dataType = null;
                codeTableId = null;
            }

            switch (dataType) {

                default:
                case DATA_TYPE.TEXT:
                    field = Ext.apply(field, {
                        xtype : 'textfield'
                    });

                    break;

                case DATA_TYPE.NUMBER:
                    field = Ext.apply(field, {
                        xtype : 'numberfield'
                    });

                    break;

                case DATA_TYPE.CURRENCY:
                    field = Ext.apply(field, {
                        xtype : 'criterion_field_currency_field'
                    });

                    break;

                case DATA_TYPE.DATE:
                    field = Ext.apply(field, {
                        xtype : 'datepickerfield',
                        picker : {
                            yearFrom : yearFrom,
                            yearTo : yearTo
                        },
                        value : setValue ? new Date(customFieldValue.value) : null
                    });

                    break;

                case DATA_TYPE.CHECKBOX:
                    field = Ext.apply(field, {
                        xtype : 'togglefield',
                        value : setValue ? customFieldValue.value === 'true' : null
                    });

                    break;

                case DATA_TYPE.DROPDOWN:
                    codeTableCode = criterion.CodeDataManager.getCodeTableNameById(codeTableId);

                    field = Ext.apply(field, {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : codeTableCode,
                        value : setValue ? parseInt(customFieldValue.value, 10) : null
                    });

                    break;
            }

            return {
                xtype : 'container',
                layout : 'hbox',
                items : [
                    {
                        html : label,
                        flex : 1,
                        margin : '10 20'
                    },
                    field
                ]
            };
        },

        menuBackAction : function() {
            if (this.checkViewIsActive()) {
                this.getViewModel().set('hideList', false);

                this.lookupReference('commentTextarea').setValue('');
            }
        },

        handleBeforeLoadWorkflow : function() {
            this.getView().setMasked({
                xtype : 'loadmask',
                message : 'Loading...'
            });
        },

        handleLoadWorkflow : function() {
            this.getView().setMasked(false);
        },

        onInboxTap : function(cmp, index, target, record) {
            this.loadDetails(record.getId());

            this.getView().down('ess_modern_menubar').toggleNavMode(function() {
                this.deselectTasks();
            }, this);
        },

        deselectTasks : function() {
            this.lookupReference('workflowLogGrid').deselectAll();
            this.getView().down('ess_modern_menubar').toggleNavMode();
        },

        handleApprove : function() {
            var commentTextarea = this.lookup('commentTextarea');

            Ext.defer(commentTextarea.clearInvalid, 100, commentTextarea);

            this.approveWorkflowLog();
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

            if (!commentTextarea.getValue().length) {
                criterion.Msg.error(i18n.gettext('Please fill the comment field first.'), function() {
                    commentTextarea.focus();
                });

                return;
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
                        }).then(function () {
                            me.load();
                            me.cleanupForm();
                            view.setLoading(false, null);
                        }, function () {
                            view.setLoading(false, null);
                        });
                    }
                }
            );
        },

        cleanupForm : function() {
            var vm = this.getViewModel();

            vm.set({
                approverComment : ''
            });

            Ext.GlobalEvents.fireEvent('afterWorkflowAction');
        }
    };
});
