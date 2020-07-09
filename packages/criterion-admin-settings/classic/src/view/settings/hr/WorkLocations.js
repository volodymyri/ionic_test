Ext.define('criterion.view.settings.hr.WorkLocations', function() {

    return {
        alias : 'widget.criterion_settings_work_locations',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.view.settings.hr.LocationDetails',
            'criterion.store.WorkLocations'
        ],

        title : i18n.gettext('Work Locations'),

        layout : 'fit',

        controller : {
            type : 'criterion_gridview',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_location_details',
                allowDelete : true
            }
        },

        store : {
            type : 'work_locations',
            autoSync : false
        },

        initComponent : function() {
            this.columns = [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Code'),
                    dataIndex : 'code'
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Description'),
                    dataIndex : 'description',
                    flex : 1
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('City'),
                    dataIndex : 'city',
                    flex : 1
                },
                {
                    xtype : 'criterion_codedatacolumn',
                    dataIndex : 'stateCd',
                    codeDataId : criterion.consts.Dict.STATE,
                    text : i18n.gettext('State'),
                    flex : 1
                },
                {
                    xtype : 'criterion_codedatacolumn',
                    dataIndex : 'countryCd',
                    codeDataId : criterion.consts.Dict.COUNTRY,
                    text : i18n.gettext('Country'),
                    flex : 1
                }
            ];

            this.callParent(arguments);
        }
    };

});
