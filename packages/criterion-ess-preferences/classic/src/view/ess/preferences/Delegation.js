Ext.define('criterion.view.ess.preferences.Delegation', function() {

    return {
        alias : 'widget.criterion_ess_preferences_delegation',

        extend : 'Ext.form.Panel',

        requires : [
            'criterion.controller.ess.preferences.Delegation',
            'criterion.view.ess.preferences.DelegationCfg'
        ],

        title : i18n.gettext('Delegation'),

        frame : true,

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        controller : {
            type : 'criterion_ess_preferences_delegation'
        },

        bbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                handler : 'handleSave'
            }
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        items : [
            {
                xtype : 'criterion_ess_preferences_delegation_cfg',
                reference : 'delegation'
            }
        ]
    };
});
