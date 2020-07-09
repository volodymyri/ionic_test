Ext.define('criterion.view.ess.preferences.Calendars', function() {

    return {
        alias : 'widget.criterion_ess_preferences_calendars',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.view.ess.preferences.Calendar',
            'criterion.controller.ess.preferences.Calendars',
            'criterion.store.employee.Calendars',
            'Ext.grid.column.Template'
        ],

        header : {

            title : i18n.gettext('Calendars'),

            items : [
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'addButton',
                    text : i18n.gettext('Add'),
                    ui : 'feature',
                    listeners : {
                        click : 'handleAddClick'
                    }
                }
            ]
        },

        tbar : null,

        frame : true,

        store : {
            type : 'criterion_employee_calendars'
        },

        controller : {
            type : 'criterion_ess_preferences_calendars',
            baseRoute : criterion.consts.Route.SELF_SERVICE.PREFERENCES_CALENDAR,
            showTitleInConnectedViewMode : true,
            editor : {
                xtype : 'criterion_ess_preferences_calendar',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],

                frame : true
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Name'),
                dataIndex : 'name'
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Default'),
                align : 'center',
                dataIndex : 'isDefault',
                trueText : '✓',
                falseText : '-',
                width : 100
            },
            {
                xtype : 'gridcolumn',
                flex : 2,
                text : i18n.gettext('Address'),
                dataIndex : 'address',
                encodeHtml : false,
                renderer : function(value) {
                    return '<a href="' + value + '" target="_blank">' + value + '</a>';
                }
            }
        ]
    };
});

