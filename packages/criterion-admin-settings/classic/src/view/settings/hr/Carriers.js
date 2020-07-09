Ext.define('criterion.view.settings.hr.Carriers', function() {

    return {
        alias : 'widget.criterion_settings_carriers',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.employer.GridView',
            'criterion.store.employer.Carriers',
            'criterion.view.settings.hr.Carrier'
        ],

        title : i18n.gettext('Carriers'),

        layout: 'fit',

        store : {
            type : 'criterion_employer_carriers'
        },

        controller : {
            type : 'criterion_employer_gridview',
            connectParentView : true,
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_hr_carrier',
                allowDelete : true,
                controller : {
                    externalUpdate : false
                }
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                dataIndex : 'code',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Master Policy Number'),
                dataIndex : 'masterPolicyNumber',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            }
        ]
    };

});
