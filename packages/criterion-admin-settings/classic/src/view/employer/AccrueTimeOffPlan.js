Ext.define('criterion.view.employer.AccrueTimeOffPlan', function() {

    return {
        alias : 'widget.criterion_employer_accrue_time_off_plan',

        requires : [
            'criterion.controller.employer.AccrueTimeOffPlan'
        ],

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        controller : {
            type : 'criterion_employer_accrue_time_off_plan'
        },

        viewModel : {
            data : {
                closeYearCb : true
            }
        },

        modelValidation : true,

        bodyPadding : 20,

        draggable : true,

        title : i18n.gettext('Accrue Plan'),

        items : [
            {
                xtype : 'datefield',
                reference : 'accrualDate',
                flex : 1,
                fieldLabel : i18n.gettext('Accrual Date'),
                allowBlank : false
            }
        ]
    }
});
