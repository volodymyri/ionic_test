Ext.define('criterion.view.employee.timeOffPlan.Adjustment', function() {

    return {
        alias : 'widget.criterion_employee_timeoffplan_adjustment',

        requires : [
            'criterion.controller.employee.timeOffPlan.Adjustment'
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
                 @type  Double
                 */
                accrued : null,

                /*
                 @type  Date
                 */
                accrualDate : null,

                /*
                 @type  String
                 */
                reason : null,

                /*
                 @type  String
                 */
                unit : '',

                /*
                 @type  criterion.model.employee.TimeOffPlan
                 Parent TimeOff plan
                 */
                timeOffPlan : null
            }
        },

        controller : {
            type : 'criterion_employee_timeoffplan_adjustment'
        },

        bodyPadding : 20,

        draggable : true,

        title : i18n.gettext('Adjustment'),

        items : [
            {
                xtype : 'datefield',
                reference : 'accrualDate',
                flex : 1,
                fieldLabel : i18n.gettext('Accrual Date'),
                allowBlank : false,
                bind : {
                    value : '{accrualDate}',
                    minValue : '{timeOffPlan.startDate}',
                    maxValue : '{timeOffPlan.endDate}'
                }
            },
            {
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'criterion_form_high_precision_field',
                        fieldLabel : i18n.gettext('Adjustment'),
                        name : 'potential',
                        margin : '0 0 20 0',
                        flex : 1,
                        allowBlank : false,
                        bind : '{accrued}'
                    },
                    {
                        bind : {
                            html : '{unit}'
                        },
                        margin : '10 0 0 10',
                        width : 40
                    }
                ]
            },

            {
                xtype : 'textarea',
                fieldLabel : i18n.gettext('Reason'),
                name : 'reason',
                allowBlank : false,
                width : '100%',
                bind : '{reason}'
            }
        ]
    }
});
