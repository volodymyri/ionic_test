Ext.define('criterion.controller.ess.time.timeOffHistory.TimeOffForm', function() {

    var WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {
        extend : 'criterion.controller.employee.benefit.TimeOffForm',

        alias : 'controller.criterion_selfservice_time_time_off_history_time_off_form',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        onEmployeeChange : Ext.emptyFn,

        handleRecordLoad : function(record) {
            var employeeId = record.get('employeeId');

            this.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIME_OFF);

            this.callParent(arguments);
        },

        handleRecordUpdate : function(record, scope, callback) {
            var vm = this.getViewModel();

            record.getProxy().setExtraParams({
                employeeId : vm.get('employeeId')
            });

            this.callParent(arguments);
        },

        deleteRecord : function() {
            var record = this.getRecord(),
                vm = this.getViewModel();

            record.getProxy().setExtraParams({
                employeeId : vm.get('employeeId')
            });

            this.callParent(arguments);
        },

        _submitInProgress : false,

        handleSubmit : function() {
            var record = this.getViewModel().get('record');

            if (!this.getView().getForm().isValid()) {
                this.focusInvalidField();
                return;
            }

            this._submitInProgress = true;
            this.handleRecordUpdate(record, this, this.submitTimeOffCallback);
        },

        submitTimeOffCallback : function(record, scope, ids) {
            var me = scope,
                employeeId = record.get('employeeId'),
                view = me.getView();

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIME_OFF).then(function(signature) {
                var jsonData = {
                    employeeId : employeeId,
                    timeOffIds : ids
                };

                view.setLoading(true);
                me.setCorrectMaskZIndex(false);

                if (signature) {
                    jsonData['signature'] = signature;
                }

                criterion.Api.requestWithPromise({
                    method : 'PUT',
                    url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_SUBMIT,
                    jsonData : jsonData
                }).then({
                    scope : this,
                    success : function(response) {
                        view.setLoading(false);
                        me._blockClose = false;
                        me._submitInProgress = false;
                        criterion.Utils.toast(i18n.gettext('The Time Off is submitted.'));
                        view.fireEvent('submitted', record);
                        me.close();
                    },
                    failure : function() {
                        me._blockClose = false;
                        me._submitInProgress = false;
                        me.close();
                    }
                });
            });
        },

        afterSuccessUploadAttachment : function() {
            var me = this,
                view = this.getView(),
                documentField = this.lookup('document'),
                documentFieldInput = documentField && documentField.inputEl;

            if (!view) {
                return;
            }

            view.setLoading(false);

            if (!me._submitInProgress) {
                me._blockClose = false;
            }

            if (documentField) {
                documentField.reset();
                documentFieldInput.setStyle('background-color', '#fff');
            }

            me.close();
        },

        afterFailureUploadAttachment : function() {
            var me = this,
                view = this.getView(),
                documentField = this.lookup('document'),
                documentFieldInput = documentField && documentField.inputEl;

            if (!view) {
                return;
            }

            view.setLoading(false);

            if (!me._submitInProgress) {
                me._blockClose = false;
            }

            if (documentField) {
                documentField.reset();
                documentFieldInput.setStyle('background-color', '#fff');
            }
        },

        handleRecallRequest : function() {
            var me = this,
                view = this.getView(),
                record = this.getRecord(),
                vm = this.getViewModel(),
                confirmWindow,
                employeeId = vm.get('employeeId'),
                workflowData = vm.get(this.getWorkflowVmIdent(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIME_OFF)),
                confirmText = workflowData ? workflowData['confirmText'] : '',
                isApproved = record.get('timeOffStatusCode') === WORKFLOW_STATUSES.APPROVED,
                isSignature = isApproved && (workflowData ? workflowData['isSignature'] : false);

            confirmWindow = Ext.create({
                xtype : 'window',
                title : i18n.gettext('Confirm'),
                modal : true,
                closable : true,
                draggable : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : '80%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],
                viewModel : {
                    data : {
                        confirmText : confirmText,
                        isSignature : isSignature
                    }
                },

                buttons : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        ui : 'light',
                        listeners : {
                            click : function() {
                                this.up('window').destroy();
                            }
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Ok'),
                        listeners : {
                            click : function() {
                                var confirmWindow = this.up('window'),
                                    field = confirmWindow.down('[name=deleteTimeOff]'),
                                    form = confirmWindow.down('form'),
                                    signaturePad = confirmWindow.down('[reference=signaturePad]'),
                                    comment = confirmWindow.down('[reference=comment]'),
                                    vm = confirmWindow.getViewModel();

                                if (form.isValid()) {
                                    confirmWindow.fireEvent('cancelRequest', field.getValue(), vm.get('isSignature') ? signaturePad.getValue() : null, comment.getValue());
                                }
                            }
                        }
                    }
                ],

                bodyPadding : 20,

                items : [
                    {
                        xtype : 'form',
                        reference : 'form',
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        items : [
                            {
                                xtype : 'radiogroup',
                                columns : 1,
                                vertical : true,
                                items : [
                                    {
                                        boxLabel : i18n.gettext('Cancel Request and Delete Time Off'),
                                        name : 'deleteTimeOff',
                                        inputValue : 1,
                                        checked : true
                                    },
                                    {
                                        boxLabel : i18n.gettext('Cancel Request and Keep Time Off'),
                                        name : 'deleteTimeOff',
                                        inputValue : 0
                                    }
                                ]
                            },
                            {
                                xtype : 'textarea',
                                fieldLabel : i18n.gettext('Comment'),
                                labelAlign : 'top',
                                reference : 'comment',
                                margin : '0 10 30 0'
                            },
                            {
                                xtype : 'criterion_signature_pad',
                                reference : 'signaturePad',
                                margin : '0 10 10 0',
                                hidden : true,
                                flex : 1,
                                bind : {
                                    hidden : '{!isSignature}'
                                }
                            }
                        ]
                    }
                ]
            });

            confirmWindow.show();
            confirmWindow.on({
                cancelRequest : function(deleteRequest, signature, comment) {
                    var jsonData = {};

                    if (signature) {
                        jsonData['signature'] = signature;
                    }

                    if (comment) {
                        jsonData['comment'] = comment;
                    }

                    me.setCorrectMaskZIndex(false);
                    confirmWindow.destroy();

                    view.setLoading(true);

                    criterion.Api.requestWithPromise({
                        url : Ext.util.Format.format(
                            criterion.consts.Api.API.EMPLOYEE_TIME_OFF_RECALL,
                            record.getId()
                        ) + '?employeeId=' + employeeId + (deleteRequest ? '&delete=true' : ''),
                        method : 'PUT',
                        jsonData : jsonData
                    }).then({
                        success : function(result) {
                            view.fireEvent('submitted', record);
                            view.close();
                        }
                    }).always(function() {
                        view.setLoading(false);
                    });
                }
            });
            this.setCorrectMaskZIndex(true);
        },

        handleEditTimeoffDetail : function(record) {
            var vm = this.getViewModel();

            if (vm.get('readOnlyMode')) {
                return;
            }

            this.callParent(arguments);
        }
    }
});

