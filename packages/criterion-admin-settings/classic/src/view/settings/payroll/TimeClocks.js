Ext.define('criterion.view.settings.payroll.TimeClocks', function() {

    return {

        alias : 'widget.criterion_payroll_settings_time_clocks',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.view.settings.payroll.TimeClock',
            'criterion.store.TimeClocks'
        ],

        controller : {
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_payroll_settings_time_clock',
                allowDelete : true
            }
        },

        viewModel : {
            stores : {
                timeClocks : {
                    type : 'criterion_time_clocks'
                }
            }
        },

        title : i18n.gettext('Time Clock'),

        bind : {
            store : '{timeClocks}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                flex : 1,
                dataIndex : 'code'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 1,
                dataIndex : 'name'
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Last Sync Time'),
                dataIndex : 'lastSyncTime',
                format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                flex : 1
            }
        ]
    };

});
