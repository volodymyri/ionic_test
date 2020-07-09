Ext.define('criterion.view.employee.timeOffPlan.AccruePlan', function() {

    return {
        alias : 'widget.criterion_employee_timeoffplan_accrue_plan',

        requires : [
            'criterion.controller.employee.timeOffPlan.AccruePlan'
        ],

        extend : 'criterion.view.FormView',

        modal : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        viewModel : {
            data : {
                employeeTimeOffPlanId : null,

                /*
                    @type  criterion.model.employee.TimeOffPlan
                    Parent TimeOff plan
                */
                timeOffPlan : null,

                /*
                    @type Date 
                    Min possible date to select
                */
                minDate : null
            }
        },

        controller : {
            type : 'criterion_employee_timeoffplan_accrue_plan'
        },

        bodyPadding : 20,

        draggable : true,

        title : i18n.gettext('Accrue Employee Plan'),

        items : [
            {
                xtype : 'datefield',
                reference : 'accrualDate',
                flex : 1,
                bind : {
                    minValue : '{minDate}'
                },
                fieldLabel : i18n.gettext('Accrual Date'),
                allowBlank : false
            }
        ]
    }
});
