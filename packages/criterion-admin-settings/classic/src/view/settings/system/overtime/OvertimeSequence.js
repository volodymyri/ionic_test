Ext.define('criterion.view.settings.system.overtime.OvertimeSequence', function() {

    return {
        alias : 'widget.criterion_settings_overtime_sequence',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.system.overtime.OvertimeSequence'
        ],

        controller : {
            type : 'criterion_settings_overtime_sequence'
        },

        orderField : 'sequence',

        sortableColumns : false,

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add Income'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Income'),
                dataIndex : 'incomeListId',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                renderer : 'renderIncome'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Sequence'),
                dataIndex : 'sequence',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Formulae'),
                dataIndex : 'expCalcTime',
                flex : 1
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 2,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-up'],
                        tooltip : i18n.gettext('Move Up'),
                        text : '',
                        action : 'moveupaction'
                    },
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-down'],
                        tooltip : i18n.gettext('Move Down'),
                        text : '',
                        action : 'movedownaction'
                    }
                ]
            }
        ]
    };

});
