Ext.define('criterion.view.ess.preferences.TeamDelegation', function() {

    return {
        alias : 'widget.criterion_ess_preferences_team_delegation',

        extend : 'Ext.form.Panel',

        requires : [
            'criterion.controller.ess.preferences.TeamDelegation',
            'criterion.view.ess.preferences.DelegationCfg'
        ],

        title : i18n.gettext('Team Delegation'),

        frame : true,

        controller : {
            type : 'criterion_ess_preferences_team_delegation'
        },

        viewModel : {
            data : {
                delegatedByEmployeeId : null,
                delegatedByEmployeeName : null
            }
        },

        bbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                handler : 'handleSave',
                disabled : true,
                bind : {
                    disabled : '{!delegatedByEmployeeId}'
                }
            }
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        items : [
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '0 0 20 0',
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        fieldLabel : i18n.gettext('Employee Name'),
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH + 5,
                        maxWidth : 480,
                        readOnly : true,
                        allowBlank : false,
                        border : '0 0 1 0',
                        style : {
                            borderColor : '#EEE',
                            borderStyle : 'solid',
                            padding : '0 0 20px 0',
                        },
                        bind : {
                            value : '{delegatedByEmployeeName}'
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
                xtype : 'criterion_ess_preferences_delegation_cfg',
                reference : 'delegation',
                hidden : true,
                bind : {
                    hidden : '{!delegatedByEmployeeId}'
                }
            }
        ]
    };
});
