Ext.define('criterion.controller.ess.benefits.Plan', function() {

    return {
        extend : 'criterion.controller.employee.benefit.BenefitForm',

        alias : 'controller.criterion_selfservice_benefits_plan',

        requires : [
            'criterion.view.employee.SubmitConfirm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        getSaveParams : function() {
            return {
                isWorkflow : true,
                employeeId : this.getViewModel().get('employeeId')
            };
        },

        handleAfterRecordLoad : function(employeeBenefit) {
            this.loadWorkflowData(this.getEmployeeId(), criterion.Consts.WORKFLOW_TYPE_CODE.EE_BENEFIT);
            this.callParent(arguments);
        },

        afterAllChangesSet : function() {
            this.highlightFields();
        },

        // custom realization
        highlightFields : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                record = vm && vm.get('record'),
                isPendingWorkflow,
                workflowLog,
                requestData = {},
                dependentsList = this.lookup('dependentsList'),
                beneficiariesList = this.lookup('beneficiariesList'),
                contingentBeneficiariesList = this.lookup('contingentBeneficiariesList'),
                hasContingentField = this.lookup('hasContingentField'),
                contingentBeneficiariesListVm = contingentBeneficiariesList.getViewModel(),
                contingentBeneficiariesListData,
                clsHighlighted = criterion.Consts.UI_CLS.WORKFLOW_HIGHLIGHTED,
                clsHighlightedBox = criterion.Consts.UI_CLS.WORKFLOW_HIGHLIGHTED_BOX;

            if (!vm) {
                return;
            }

            isPendingWorkflow = vm.get('isPendingWorkflow');
            workflowLog = isPendingWorkflow && record.getWorkflowLog();

            if (workflowLog) {
                requestData = workflowLog.get('request');

                // options
                if (requestData['options']) {
                    Ext.Array.each(requestData['options'], function(optionVal) {
                        let field = view.down('[_connectedId=' + optionVal.id + ']');

                        field.setValue(optionVal.manualValue ? optionVal.manualValue : optionVal.benefitPlanOptionId);
                        field.resetOriginalValue();
                        field.addCls(clsHighlighted);
                    });
                }
                // dependents
                if (requestData['createdDependents'].length || requestData['removedDependents'].length) {
                    let dependentsFieldVal = dependentsList.getValue(),
                        dependentsVal = dependentsFieldVal['dependents'] ? dependentsFieldVal['dependents'] : [];

                    requestData['createdDependents'] && Ext.Array.each(requestData['createdDependents'], function(createdDependent) {
                        dependentsVal.push(createdDependent['personContactId']);
                    });
                    requestData['removedDependents'] && Ext.Array.each(requestData['removedDependents'], function(removedDependent) {
                        Ext.Array.remove(dependentsVal, removedDependent['personContactId']);
                    });

                    dependentsList.setValueWithOriginalValueReset({
                        dependents : dependentsVal
                    });
                    dependentsList.addCls(clsHighlightedBox);
                }

                // save contingent beneficiaries state
                contingentBeneficiariesListData = {
                    checkedPerson : contingentBeneficiariesListVm.get('checkedPerson'),
                    checkedPersonPercent : contingentBeneficiariesListVm.get('checkedPersonPercent')
                };

                // beneficiaries
                if (requestData['createdBeneficiaries'].length || requestData['removedBeneficiaries'].length || requestData['editedBeneficiaries'].length) {
                    let beneficiariesListVm = beneficiariesList.getViewModel(),
                        beneficiariesChecked = beneficiariesListVm.get('checkedPerson'),
                        beneficiariesCheckedPersonPercent = beneficiariesListVm.get('checkedPersonPercent');

                    requestData['createdBeneficiaries'] && Ext.Array.each(requestData['createdBeneficiaries'], function(createdBeneficiary) {
                        beneficiariesChecked[createdBeneficiary['personContactId']] = true;
                        beneficiariesCheckedPersonPercent[createdBeneficiary['personContactId']] = createdBeneficiary['beneficiaryPercent'];
                    });

                    requestData['editedBeneficiaries'] && Ext.Array.each(requestData['editedBeneficiaries'], function(editedBeneficiary) {
                        beneficiariesCheckedPersonPercent[editedBeneficiary['personContactId']] = editedBeneficiary['beneficiaryPercent'];
                    });

                    requestData['removedBeneficiaries'] && Ext.Array.each(requestData['removedBeneficiaries'], function(removedBeneficiary) {
                        delete beneficiariesChecked[removedBeneficiary['personContactId']];
                        delete beneficiariesCheckedPersonPercent[removedBeneficiary['personContactId']]
                    });

                    beneficiariesListVm.set({
                        checkedPerson : Ext.clone(beneficiariesChecked),
                        checkedPersonPercent : Ext.clone(beneficiariesCheckedPersonPercent)
                    });
                    beneficiariesList.addCls(clsHighlightedBox);

                    // restore contingent beneficiaries state
                    Ext.defer(function() {
                        contingentBeneficiariesListVm.set({
                            checkedPerson : Ext.clone(contingentBeneficiariesListData.checkedPerson),
                            checkedPersonPercent : Ext.clone(contingentBeneficiariesListData.checkedPersonPercent)
                        });
                    }, 100);
                }

                // contingent Beneficiaries
                Ext.defer(function() {
                    if (requestData['createdContingentBeneficiaries'].length || requestData['removedContingentBeneficiaries'].length || requestData['editedContingentBeneficiaries'].length) {
                        let contingentBeneficiariesChecked = contingentBeneficiariesListData.checkedPerson,
                            contingentBeneficiariesCheckedPersonPercent = contingentBeneficiariesListData.checkedPersonPercent,
                            hasContingents,
                            newHasContingents;

                        requestData['createdContingentBeneficiaries'] && Ext.Array.each(requestData['createdContingentBeneficiaries'], function(createdCBeneficiary) {
                            contingentBeneficiariesChecked[createdCBeneficiary['personContactId']] = true;
                            contingentBeneficiariesCheckedPersonPercent[createdCBeneficiary['personContactId']] = createdCBeneficiary['beneficiaryPercent'];
                        });

                        requestData['editedContingentBeneficiaries'] && Ext.Array.each(requestData['editedContingentBeneficiaries'], function(editedCBeneficiary) {
                            contingentBeneficiariesCheckedPersonPercent[editedCBeneficiary['personContactId']] = editedCBeneficiary['beneficiaryPercent'];
                        });

                        requestData['removedContingentBeneficiaries'] && Ext.Array.each(requestData['removedContingentBeneficiaries'], function(removedCBeneficiary) {
                            delete contingentBeneficiariesChecked[removedCBeneficiary['personContactId']];
                            delete contingentBeneficiariesCheckedPersonPercent[removedCBeneficiary['personContactId']]
                        });

                        hasContingents = vm.get('hasContingents');
                        newHasContingents = !!Ext.Object.getKeys(contingentBeneficiariesChecked).length;
                        if (hasContingents !== newHasContingents) {
                            hasContingentField.addCls(clsHighlighted);
                        }
                        vm.set('hasContingents', newHasContingents);

                        contingentBeneficiariesListVm.set({
                            checkedPerson : Ext.clone(contingentBeneficiariesChecked),
                            checkedPersonPercent : Ext.clone(contingentBeneficiariesCheckedPersonPercent)
                        });
                        contingentBeneficiariesList.addCls(clsHighlightedBox);
                    }
                }, 500);
            }
        },

        handleSubmit : function() {
            let vm = this.getViewModel(),
                employeeId = this.getEmployeeId(),
                beneficiariesList = this.lookup('beneficiariesList'),
                contingentBeneficiariesList = this.lookup('contingentBeneficiariesList'),
                workflowData = vm.get(this.getWorkflowVmIdent(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EE_BENEFIT)),
                confirmText = workflowData ? workflowData['confirmText'] : '',
                isSignature = workflowData ? workflowData['isSignature'] : false,
                me = this,
                picker;

            if (
                this.getView().getForm().isValid() &&
                (!vm.get('allowBeneficiaries') || (beneficiariesList.isValid() && contingentBeneficiariesList.isValid()))
            ) {
                picker = Ext.create('criterion.view.employee.SubmitConfirm', {
                    viewModel : {
                        data : {
                            text : '',
                            confirmText : confirmText,
                            isSignature : isSignature
                        }
                    },

                    items : [
                        {
                            xtype : 'component',
                            width : 200,
                            bind : {
                                html : '{confirmText}'
                            }
                        },
                        {
                            xtype : 'textarea',
                            fieldLabel : i18n.gettext('Reason for change'),
                            labelAlign : 'top',
                            bind : '{text}',
                            flex : 1
                        },
                        {
                            xtype : 'component',
                            html : i18n.gettext('Signature'),
                            margin : '10 0 0 0',
                            hidden : true,
                            bind : {
                                hidden : '{!isSignature}'
                            }
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
                })

                picker.show();
                picker.on({
                    confirmSubmit : (signature, vmData) => {
                        let rec = vm.get('record');

                        picker.destroy();

                        rec.set('reason', vmData.text);
                        if (signature) {
                            rec.set('signature', signature);
                        }

                        me.saveMainRecord();
                    },

                    cancelSubmit : _ => {
                        me.setCorrectMaskZIndex(false);
                    }
                });

                this.setCorrectMaskZIndex(true);
            }
        }

    };
});
