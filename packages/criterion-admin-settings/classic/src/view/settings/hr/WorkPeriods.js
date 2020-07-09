Ext.define('criterion.view.settings.hr.WorkPeriods', function() {

    return {
        alias : 'widget.criterion_settings_work_periods',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.WorkPeriods',
            'criterion.view.settings.hr.WorkPeriod'
        ],

        title : i18n.gettext('Work Periods'),

        layout : 'fit',

        controller : {
            type : 'criterion_employer_gridview',
            showTitleInConnectedViewMode : true,
            loadRecordOnEdit : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,

            connectParentView : {
                parentForSpecified : true
            },
            editor : {
                xtype : 'criterion_settings_work_period',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_employer_work_periods'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            }
        ]
    };

});
