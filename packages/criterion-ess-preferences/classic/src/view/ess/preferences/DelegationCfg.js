Ext.define('criterion.view.ess.preferences.DelegationCfg', function() {

    return {
        alias : 'widget.criterion_ess_preferences_delegation_cfg',

        extend : 'Ext.Container',

        requires : [
            'criterion.controller.ess.preferences.DelegationCfg'
        ],

        controller : {
            type : 'criterion_ess_preferences_delegation_cfg'
        },

        viewModel : {
            data : {
                enableDelegation : false,
                record : null
            }
        },

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
            maxWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
        },

        items : [
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Enable Delegation'),
                inputValue : true,
                bind : '{enableDelegation}'
            },

            {
                xtype : 'container',
                layout : 'hbox',
                margin : '0 0 20 0',
                hidden : true,
                bind : {
                    hidden : '{!enableDelegation}'
                },
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        fieldLabel : i18n.gettext('Delegate To'),
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH + 5,
                        readOnly : true,
                        allowBlank : false,
                        bind : {
                            value : '{record.delegatedToEmployeeName}'
                        }
                    },
                    {
                        xtype : 'button',
                        ui : 'light',
                        scale : 'small',
                        margin : '0 0 0 3',
                        glyph : criterion.consts.Glyph['ios7-search'],
                        handler : 'handleSearchEmployee'
                    }
                ]
            },

            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Start Date'),
                allowBlank : false,
                hidden : true,
                bind : {
                    hidden : '{!enableDelegation}',
                    disabled : '{!enableDelegation}',
                    value : '{record.startDate}'
                }
            },

            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('End Date'),
                allowBlank : false,
                hidden : true,
                bind : {
                    hidden : '{!enableDelegation}',
                    disabled : '{!enableDelegation}',
                    value : '{record.endDate}'
                }
            }
        ]
    };
});
