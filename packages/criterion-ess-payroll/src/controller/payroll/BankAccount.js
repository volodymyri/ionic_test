Ext.define('criterion.controller.ess.payroll.BankAccount', function() {

    return {
        alias : 'controller.criterion_selfservice_payroll_bank_account',

        extend : 'criterion.controller.person.BankAccount',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        getPersonId() {
            return criterion.Api.getCurrentPersonId();
        },

        bankNumberFieldRender : function(cmp) {
            var infoWrapper = cmp.labelEl.down('.info');

            Ext.create({
                xtype : 'image',
                alt : 'Check Sample',
                tooltipEnabled : true,
                glyph : criterion.consts.Glyph['ios7-information-outline'],
                style : {
                    fontSize : '16px',
                    cursor : 'pointer'
                },
                renderTo : infoWrapper,
                tooltip : new Ext.tip.ToolTip({
                    target : infoWrapper,
                    html : '<img style="width: 434px; height: 244px;" src="resources/images/check_sample.gif" alt="Check Sample" />',
                    width : 484,
                    padding : '20 20',
                    autoHide : true,
                    showOnTap : true
                })
            });
        },

        handleWorkflowSubmitClick : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                employeeId = vm.get('employeeId'),
                me = this;

            if (!view.isValid()) {
                return;
            }

            record.set({
                first : vm.get('cb1'),
                second : vm.get('cb2'),
                third : vm.get('cb3'),
                fourth : vm.get('cb4'),
                fifth : vm.get('cb5'),
                last : vm.get('cb6')
            });

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.PERSON_BANK_ACCOUNT).then(function(signature) {
                view.setLoading(true);
                me.setCorrectMaskZIndex(false);

                if (signature) {
                    record.set('signature', signature);
                }

                record.saveWithPromise({
                    isWorkflow : true,
                    employeeId : vm.get('employeeId')
                }).then(function() {
                    view.fireEvent('save');
                    me.onAfterSave.call(me, view, record);
                });
            });
        },

        handleWorkflowDeleteClick : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                employeeId = vm.get('employeeId'),
                me = this;

            if (!record.phantom) {
                criterion.Msg.confirmDelete({
                        title : i18n.gettext('Delete record'),
                        message : view.getDeleteConfirmMessage(record)
                    },
                    function(btn) {
                        if (btn === 'yes') {
                            // delay for correct find the mask element
                            Ext.defer(function() {
                                me.setCorrectMaskZIndex(true);
                            }, 10);

                            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.PERSON_BANK_ACCOUNT).then(function(signature) {
                                me.setCorrectMaskZIndex(false);

                                if (signature) {
                                    record.set('signature', signature);
                                }

                                record.eraseWithPromise({
                                    isWorkflow : true,  // don't remove this
                                    employeeId : employeeId
                                }).then({
                                    success : function() {
                                        view.fireEvent('afterDelete', me);
                                        me.close();
                                    },
                                    failure : function() {
                                        record.reject();
                                    }
                                })
                            });
                        }
                    }
                );
            }
        },

        handleRecallRequest : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                record = vm.get('record'),
                employeeId = vm.get('employeeId');

            criterion.Msg.confirm(
                i18n.gettext('Confirm'),
                i18n.gettext('Do you want to cancel changes?'),
                function(btn) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : Ext.util.Format.format(
                                criterion.consts.Api.API.PERSON_BANK_ACCOUNT_RECALL,
                                record.getId()
                            ) + '?employeeId=' + employeeId,
                            method : 'PUT'
                        }).then({
                            success : function(result) {
                                view.fireEvent('save');
                                me.onAfterSave.call(me, view, record);
                            }
                        });
                    }
                }
            );
        },

        handleRecordLoad : function(record) {
            var view = this.getView(),
                vm = this.getViewModel(),
                employeeId = vm.get('employeeId'),
                workflowLog = Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog(),
                isPendingWorkflow = workflowLog && Ext.Array.contains(['PENDING_APPROVAL', 'VERIFIED'], workflowLog.get('stateCode'));

            this.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.PERSON_BANK_ACCOUNT);

            Ext.Array.each(view.getForm().getFields().getRange(), function(field) {
                var bind = field.bind,
                    fieldName = bind.value.stub.name;

                if (isPendingWorkflow && Ext.Array.contains(Ext.Object.getAllKeys(workflowLog.data.request), fieldName)) {
                    var value = workflowLog.data.request[fieldName];

                    field.setValue(value);
                    field.addCls('criterion-field-highlighted');
                } else {
                    field.removeCls('criterion-field-highlighted');
                }
            });

            // phantom workflow doesn't have workflowLog entry yet
            if (record.phantom || !isPendingWorkflow) {
                vm.set({
                    readOnly : false
                });
            }

            this.callParent(arguments);
        }
    };
});
