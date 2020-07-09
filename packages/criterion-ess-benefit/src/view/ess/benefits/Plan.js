Ext.define('criterion.view.ess.benefits.Plan', function() {

    return {

        alias : 'widget.criterion_selfservice_benefits_plan',

        extend : 'criterion.view.employee.benefit.BenefitForm',

        requires : [
            'criterion.controller.ess.benefits.Plan',
            'criterion.ux.button.Back'
        ],

        controller : {
            type : 'criterion_selfservice_benefits_plan'
        },

        bodyPadding : 20,

        viewModel : {
            data : {
                hideManualOverride : true,
                hideCustomFields : true
            },
            formulas : {

                isPendingWorkflow : data => Ext.Array.contains([criterion.Consts.WORKFLOW_STATUSES.PENDING_APPROVAL, criterion.Consts.WORKFLOW_STATUSES.VERIFIED], data('record.statusCode')),

                submitText : data => data('isPendingWorkflow') ? i18n._('Reviewing') : i18n._('Submit'),

                readOnly : data => data('isPendingWorkflow'),

                readOnlyMode : data => data('isPendingWorkflow'), // used for documents component

                canChangePlan : data => false,

                hideEmployeeCost : data => !Ext.Array.contains([criterion.Consts.COST_VISIBILITY.EMPLOYEE, criterion.Consts.COST_VISIBILITY.EMPLOYEE_AND_EMPLOYER], data('record.costVisibilityCode')),
                hideEmployerCost : data => data('record.costVisibilityCode') !== criterion.Consts.COST_VISIBILITY.EMPLOYEE_AND_EMPLOYER,

                isOptionsReadOnly : data => !data('record.benefitPlan.isAllowChangeEss'),
                isParamsReadOnly : data => true
            }
        },

        frame : true,

        header : {
            title : {
                text : i18n.gettext('Benefit Plan'),
                minimizeWidth : true
            },

            items : [
                {
                    flex : 1
                },
                {
                    xtype : 'component',
                    userCls : 'sub-title',
                    bind : {
                        html : '{record.planName}'
                    }
                }
            ]
        },

        buttons : [
            {
                xtype : 'component',
                cls : 'criterion-profile-pending-changes-tooltip',
                hidden : true,
                html : '<span>&nbsp;</span> ' + i18n._('Highlighted fields were recently changed and being reviewed.'),
                bind : {
                    hidden : '{!isPendingWorkflow}'
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
                handler : 'handleSubmit',
                bind : {
                    text : '{submitText}',
                    disabled : '{isPendingWorkflow}'
                }
            }
        ]

    };

});
