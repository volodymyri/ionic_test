Ext.define('criterion.view.settings.payroll.timesheetLayout.BreakConfiguration', function() {

    return {
        alias : 'widget.criterion_settings_timesheet_layout_break_configuration',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.payroll.timesheetLayout.BreakConfiguration'
        ],

        controller : {
            type : 'criterion_settings_timesheet_layout_break_configuration'
        },

        bind : {
            store : '{record.details}'
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Minimum Elapse'),
                dataIndex : 'minElapseHours',
                formatter : 'hoursToLongString',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Break'),
                dataIndex : 'breakHours',
                formatter : 'hoursToLongString',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Minimum Return'),
                dataIndex : 'minReturnHours',
                formatter : 'hoursToLongString',
                flex : 1
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
