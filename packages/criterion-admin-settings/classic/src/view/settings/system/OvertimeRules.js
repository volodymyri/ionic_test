Ext.define('criterion.view.settings.system.OvertimeRules', {

    alias : 'widget.criterion_settings_system_overtime_rules',

    extend : 'criterion.view.settings.employer.GridView',

    requires : [
        'criterion.controller.employer.GridView',
        'criterion.store.employer.Overtimes',
        'criterion.view.settings.system.overtime.OvertimeRule'
    ],

    controller : {
        type : 'criterion_employer_gridview',
        showTitleInConnectedViewMode : true,
        connectParentView : {
            parentForSpecified : true
        },
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_settings_system_overtime_rule',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        }
    },

    title : i18n.gettext('Overtime Rules'),

    store : {
        type : 'criterion_employer_overtimes'
    },

    columns : [
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Code'),
            width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
            dataIndex : 'code'
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Description'),
            flex : 1,
            dataIndex : 'description'
        }
    ]

});
