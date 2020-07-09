Ext.define('criterion.view.settings.system.overtime.IncomeForm', function() {

    return {
        alias : 'widget.criterion_settings_overtime_income_form',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        title : i18n.gettext('Income'),

        modal : true,

        modelValidation : true,

        items : [
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Income'),
                bind : {
                    store : '{incomeLists}',
                    value : '{record.incomeListId}'
                },
                valueField : 'id',
                displayField : 'description',
                queryMode : 'local'
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Formulae'),
                bind : '{record.expCalcTime}'
            }
        ]
    };

});
