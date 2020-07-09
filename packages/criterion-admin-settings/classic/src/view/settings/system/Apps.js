Ext.define('criterion.view.settings.system.Apps', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_settings_system_apps',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.controller.settings.system.Apps',
            'criterion.store.Apps',
            'criterion.view.settings.system.App'
        ],

        title : i18n.gettext('Apps'),

        tbar : [
            '->',
            {
                xtype : 'criterion_splitbutton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAdd'
                },
                width : 120,
                menu : [
                    {
                        text : i18n.gettext('Add Custom'),
                        listeners : {
                            click : 'handleAddCustom'
                        }
                    }
                ]
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        layout : 'fit',

        viewModel : {
            stores : {
                appsStore : {
                    type : 'criterion_apps'
                }
            }
        },

        controller : {
            type : 'criterion_settings_system_apps',
            connectParentView : {
                parentForSpecified : true
            },
            showTitleInConnectedViewMode : true,
            loadRecordOnEdit : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_system_app',
                deleteConfirmMessage : i18n.gettext('Do you want to uninstall this App?'),
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        bind : {
            store : '{appsStore}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 2,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Vendor'),
                flex : 2,
                dataIndex : 'vendor'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Version'),
                flex : 1,
                dataIndex : 'version'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Endpoint'),
                flex : 2,
                dataIndex : 'endpoint'
            }
        ]
    };

});
