Ext.define('criterion.view.settings.benefits.benefit.OptionsGrid', function() {

    return {
        alias : 'widget.criterion_settings_benefit_options_grid',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.benefits.benefit.OptionsGrid',
            'criterion.model.employer.benefit.Option'
        ],

        controller : {
            type : 'criterion_settings_benefit_options_grid',
            loadRecordOnEdit : false
        },

        store : {
            type : 'employer_benefit_options'
        },

        scrollable : true,
        hidden : true,

        height : 'auto',
        padding : '10 0 0 0',

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add Option'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                dataIndex : 'name',
                flex : 1,
                text : i18n.gettext('Name')
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'code',
                flex : 1,
                text : i18n.gettext('Code')
            },
            {
                xtype : 'booleancolumn',
                dataIndex : 'isAllowDependent',
                flex : 1,
                text : i18n.gettext('Dependents Allowed'),
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No')
            },
            {
                xtype : 'booleancolumn',
                dataIndex : 'isAllowBeneficiary',
                flex : 1,
                text : i18n.gettext('Beneficiaries Allowed'),
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No')
            },
            {
                xtype : 'booleancolumn',
                dataIndex : 'isActive',
                flex : 1,
                text : i18n.gettext('Active'),
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No')
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction'
                    }
                ]
            }
        ]
    };

});
