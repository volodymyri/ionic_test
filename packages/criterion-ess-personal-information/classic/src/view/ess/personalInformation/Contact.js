Ext.define('criterion.view.ess.personalInformation.Contact', function() {

    return {

        alias : 'widget.criterion_selfservice_personal_information_contact',

        extend : 'criterion.view.person.Contact',

        requires : [
            'criterion.controller.ess.personalInformation.Contact',
            'criterion.vm.workflow.Base'
        ],

        noButtons : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

        controller : {
            type : 'criterion_selfservice_personal_information_contact'
        },

        viewModel : {
            type : 'criterion_workflow_base',

            formulas : {
                phoneFormatParams : data => {
                    let countryCd = data('record.countryCode'),
                        employerId,
                        employer,
                        employerCountryCode,
                        formatParams;

                    if (countryCd) {
                        formatParams = {
                            countryCode : countryCd
                        };
                    } else {
                        employerId = data('employerId');
                        employer = employerId && ess.getApplication().getEmployersStore().getById(employerId);
                        employerCountryCode = employer && employer.get('countryCode');

                        formatParams = employerCountryCode ? {
                            countryCode : employerCountryCode
                        } : null;
                    }

                    return formatParams;
                }
            }
        },

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Delete'),
                ui : 'remove',
                handler : 'handleWorkflowDelete',
                hidden : true,
                bind : {
                    hidden : '{hideDeleteBtn}'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Recall'),
                ui : 'remove',
                handler : 'handleRecallRequest',
                hidden : true,
                bind : {
                    hidden : '{!allowRecallBtn}'
                }
            },
            ' ',
            {
                xtype : 'component',
                cls : 'criterion-profile-pending-changes-tooltip',
                hidden : true,
                bind : {
                    hidden : '{!isPendingWorkflow}',
                    html : '{workflowMessage}'
                }
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                handler : 'handleCancelClick'
            },
            ' ',
            {
                xtype : 'button',
                text : i18n.gettext('Submit'),
                handler : 'handleWorkflowSubmit',
                bind : {
                    text : '{submitText}',
                    disabled : '{readOnly}'
                }
            }
        ]
    }
});
