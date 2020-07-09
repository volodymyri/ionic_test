Ext.define('criterion.view.settings.hr.CompanyEvents', function() {

    return {
        alias : 'widget.criterion_settings_company_events',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.CompanyEvents',
            'criterion.controller.settings.hr.CompanyEvents',
            'criterion.view.settings.hr.CompanyEvent'
        ],

        title : i18n.gettext('Company Events'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_company_events',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_company_event',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_employer_company_events'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Year'),
                flex : 1,
                dataIndex : 'year'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                flex : 1,
                dataIndex : 'code'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 2,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Event Count'),
                flex : 1,
                dataIndex : 'eventCount'
            }
        ]
    };

})
;
