Ext.define('criterion.view.settings.system.CustomFieldFormats', {

    extend : 'criterion.view.settings.GridView',

    requires : [
        'criterion.store.CustomFieldFormats',
        'criterion.view.settings.system.CustomFieldFormat'
    ],

    alias : 'widget.criterion_settings_system_custom_field_formats',

    controller : {
        type : 'criterion_gridview',
        connectParentView : false,
        showTitleInConnectedViewMode : true,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_settings_system_custom_field_format',
            plugins : [
                {
                    ptype : 'criterion_sidebar',
                    modal : true,
                    height : 'auto',
                    width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                }
            ]
        }
    },

    store : {
        type : 'criterion_custom_field_formats'
    },

    title : i18n.gettext('Custom Field Formats'),

    columns : [
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Name'),
            dataIndex : 'name',
            flex : 1
        }
    ]
});
