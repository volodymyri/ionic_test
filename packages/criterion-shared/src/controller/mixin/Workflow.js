Ext.define('criterion.controller.mixin.Workflow', function() {

    const WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'Ext.Mixin',

        mixinConfig : {
            id : 'workflow'
        },

        // must be set
        // WORKFLOW_TYPE_CODE : null,
        // RECALL_URL : null,

        connectIsPendingWorkflow() {
            let view = this.getView();

            this.getViewModel().bind(
                {
                    bindTo : '{isPendingWorkflow}'
                },
                (isPendingWorkflow) => {
                    view.setSwitchOffDirtyConfirmation(isPendingWorkflow);
                }
            );
        },

        formDataIsReady(record) {
            return true;
        },

        handleWorkflowSubmit() {
            let vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record');

            if (view.isValid() && this.formDataIsReady(record)) {
                this.doWorkflowSubmit(record);
            }
        },

        doWorkflowSubmit(record) {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                employeeId = vm.get('employeeId');

            // delay for correct find the mask element
            Ext.defer(() => {
                Ext.isFunction(me.setCorrectMaskZIndex) && me.setCorrectMaskZIndex(true);
            }, 10);

            me.actWorkflowConfirm(employeeId, me.WORKFLOW_TYPE_CODE).then(signature => {
                view.setLoading(true);
                Ext.isFunction(me.setCorrectMaskZIndex) && me.setCorrectMaskZIndex(false);

                if (signature) {
                    record.set('signature', signature);
                }

                record.saveWithPromise({
                    employeeId : employeeId,
                    isWorkflow : true
                }).then(() => {
                    view.setLoading(false);

                    view.fireEvent('save');
                    view.fireEvent('afterSave', view, record);
                    me.close();
                }, () => {
                    view.setLoading(false);
                    criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                });
            });
        },

        handleWorkflowDelete() {
            let vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                me = this;

            if (!record.phantom) {
                criterion.Msg.confirmDelete({
                        title : i18n.gettext('Delete record'),
                        message : view.getDeleteConfirmMessage(record)
                    },
                    btn => {
                        if (btn === 'yes') {
                            me.doDelete(record);
                        }
                    }
                );
            }
        },

        doDelete(record) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                employeeId = vm.get('employeeId'),
                statusCode = record.get('statusCode');

            let actEraseRecord = function(signature) {
                if (signature) {
                    record.set('signature', signature);
                }

                record.eraseWithPromise({
                    isWorkflow : true,  // don't remove this
                    employeeId : employeeId
                }).then({
                    success : () => {
                        view.fireEvent('afterDelete', me);
                        me.close();
                    },
                    failure : () => {
                        record.reject();
                    }
                })
            };

            if (Ext.Array.contains([WORKFLOW_STATUSES.REJECTED, WORKFLOW_STATUSES.NOT_SUBMITTED], statusCode)) {
                actEraseRecord();
            } else {
                // delay for correct find the mask element
                Ext.defer(() => {
                    me.setCorrectMaskZIndex(true);
                }, 10);

                me.actWorkflowConfirm(employeeId, me.WORKFLOW_TYPE_CODE).then(function(signature) {
                    me.setCorrectMaskZIndex(false);
                    actEraseRecord(signature);
                });
            }
        },

        handleRecallRequest() {
            let me = this,
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
                                me.RECALL_URL,
                                record.getId()
                            ) + '?employeeId=' + employeeId,
                            method : 'PUT'
                        }).then(() => {
                            view.fireEvent('save');
                            view.fireEvent('afterSave', view, record);
                            me.close();
                        }, () => {
                            criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                        });
                    }
                }
            );
        },

        doLoadRecord(record) {
            let vm = this.getViewModel(),
                employeeId = vm.get('employeeId'),
                workflowLog = Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog(),
                isPendingWorkflow = workflowLog && workflowLog.isModel && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], workflowLog.get('stateCode'));

            vm.set('record', record);

            this.loadWorkflowData(employeeId, this.WORKFLOW_TYPE_CODE);

            if (record.phantom || !isPendingWorkflow) {
                vm.set('readOnly', false);
            } else if (isPendingWorkflow) {
                vm.set('readOnly', true);
            }

            this.highlightWorkflowLogFields(workflowLog);
        }
    }

});
