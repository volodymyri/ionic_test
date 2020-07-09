// @deprecated
Ext.define('criterion.view.settings.system.CustomForms', function() {

    return {

        alias : 'widget.criterion_settings_custom_forms',

        extend : 'criterion.view.settings.GridView',

        title : i18n.gettext('Custom Forms'),

        requires : [
            'criterion.store.CustomForms',
            'criterion.view.settings.system.CustomForm'
        ],

        controller : {
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_system_customform',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_customforms'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Form Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Field Count'),
                dataIndex : 'fieldCount',
                flex : 1
            }
        ]

    };

});
