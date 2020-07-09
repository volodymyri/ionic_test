Ext.define('criterion.view.ess.personalInformation.BasicDemographics', function() {

    return {
        alias : 'widget.criterion_selfservice_personal_information_basic_demographics',

        extend : 'criterion.view.employee.demographic.Basic',

        viewModel : {
            data : {
                upts : +new Date(),
                readOnly : true,
                editMode : false
            },
            formulas : {
                isPendingWorkflow : function(vmget) {
                    var _up = vmget('upts'),
                        person = vmget('person'),
                        workflowLog;

                    if (person && Ext.isFunction(person.getWorkflowLog)) {
                        workflowLog = person.getWorkflowLog();

                        if (workflowLog && ['PENDING_APPROVAL', 'VERIFIED'].indexOf(workflowLog.get('stateCode')) !== -1) {
                            return true;
                        }
                    }

                    return false;
                },
                updateButtonText : function(vmget) {
                    return vmget('isPendingWorkflow') ? i18n.gettext('Reviewing') : i18n.gettext('Update Demographics');
                },
                allowRecallBtn : function(vmget) {
                    return vmget('person.canRecall');
                },
                phoneFormatParams : function(vmget) {
                    let employerId = vmget('employerId'),
                        employer = employerId && ess.getApplication().getEmployersStore().getById(employerId),
                        employerCountryCode = employer && employer.get('countryCode');

                    return employerCountryCode ? {
                        countryCode : employerCountryCode
                    } : null
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
                        this.up('criterion_selfservice_personal_information_basic_demographics').fireEvent('recallRequest');
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
                    disabled : '{isPendingWorkflow}',
                    text : '{updateButtonText}'
                },
                listeners : {
                    click : function() {
                        var view = this.up('criterion_selfservice_personal_information_basic_demographics'),
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
                        this.up('criterion_selfservice_personal_information_basic_demographics').fireEvent('personCancel');
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
                        this.up('criterion_selfservice_personal_information_basic_demographics').fireEvent('personSave');
                    }
                }
            }
        ]
    };

});
