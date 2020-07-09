Ext.define('criterion.view.ess.personalInformation.Address', function() {

    return {
        alias : 'widget.criterion_selfservice_personal_information_address',

        extend : 'criterion.view.employee.demographic.Address',

        viewModel : {
            data : {
                readOnly : true,
                editMode : false
            },
            formulas : {
                isPendingWorkflow : function(vmget) {
                    var address = vmget('address'),
                        workflowLog;

                    if (address && Ext.isFunction(address.getWorkflowLog)) {
                        workflowLog = address.getWorkflowLog();

                        if (workflowLog && ['PENDING_APPROVAL', 'VERIFIED'].indexOf(workflowLog.get('stateCode')) !== -1) {
                            return true;
                        }
                    }

                    return false;
                },
                updateButtonText : function(vmget) {
                    return vmget('isPendingWorkflow') ? i18n.gettext('Reviewing') : i18n.gettext('Update Address');
                },
                allowRecallBtn : function(vmget) {
                    return vmget('address.canRecall');
                }
            }
        },

        frame : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

        bbar : [
            {
                xtype : 'button',
                text : i18n.gettext('Recall'),
                ui : 'remove',
                listeners : {
                    click : function() {
                        this.up('criterion_selfservice_personal_information_address').fireEvent('recallRequest');
                    }
                },
                hidden : true,
                bind : {
                    hidden : '{!allowRecallBtn}'
                }
            },
            {
                xtype : 'component',
                margin : '0 0 0 20',
                cls : 'criterion-profile-pending-changes-tooltip',
                html : Ext.util.Format.format(i18n.gettext('<{0}>Highlighted</{0}> fields were recently changed and being reviewed.'), 'span'),
                bind : {
                    hidden : '{!isPendingWorkflow}'
                }
            },
            '->',
            {
                xtype : 'button',
                bind : {
                    hidden : '{editMode}',
                    text : '{updateButtonText}',
                    disabled : '{isPendingWorkflow}'
                },
                listeners : {
                    click : function() {
                        var view = this.up('criterion_selfservice_personal_information_address'),
                            vm = view.getViewModel();

                        if (!vm.get('isPendingWorkflow')) {
                            vm.set({
                                editMode : true,
                                readOnly : false
                            });
                        }
                    }
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                bind : {
                    hidden : '{!editMode}'
                },
                listeners : {
                    click : function() {
                        this.up('criterion_selfservice_personal_information_address').fireEvent('addressCancel');
                    }
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Submit'),
                bind : {
                    hidden : '{!editMode}'
                },
                listeners : {
                    click : function() {
                        this.up('criterion_selfservice_personal_information_address').fireEvent('addressSave');
                    }
                }
            }
        ]
    };

});
