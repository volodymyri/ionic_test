Ext.define('criterion.view.settings.payroll.payGroup.IncomeLists', function() {

    return {
        alias : 'widget.criterion_payroll_settings_pay_group_income_lists',

        extend : 'Ext.Window',

        requires : [
            'criterion.controller.settings.payroll.payGroup.IncomeLists'
        ],

        title : i18n.gettext('Select Income'),

        controller : {
            type : 'criterion_payroll_settings_pay_group_income_lists'
        },

        modal : true,
        closable : true,
        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Select'),
                listeners : {
                    click : 'onSelect'
                }
            }
        ],

        bodyPadding: 20,

        items : [{
            xtype : 'form',
            reference : 'form',

            items : [
                {
                    xtype : 'combobox',
                    width : '100%',
                    reference : 'incomeType',
                    bind : {
                        store : '{incomeLists}'
                    },
                    valueField : 'id',
                    displayField : 'code',
                    queryMode : 'local',
                    allowBlank : false
                }
            ]
        }]
    };

});