Ext.define('criterion.view.settings.scheduling.RequiredCoverages', function() {

    return {
        alias : 'widget.criterion_settings_scheduling_required_coverages',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.view.settings.scheduling.RequiredCoverage',
            'criterion.controller.settings.scheduling.RequiredCoverages',
            'criterion.store.employer.RequiredCoverages',
            'criterion.store.employer.WorkLocations',
            'criterion.store.workLocation.Areas',
            'criterion.store.Positions'
        ],

        title : i18n.gettext('Required Coverage'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_scheduling_required_coverages',
            connectParentView : true,
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_scheduling_required_coverage',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            }
        },

        viewModel : {
            stores : {
                requiredCoverages : {
                    type : 'criterion_employer_required_coverages'
                },
                positions : {
                    type : 'positions'
                },
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                workLocationAreas : {
                    type : 'work_location_areas'
                }
            }
        },

        bind : {
            store : '{requiredCoverages}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Work Location'),
                flex : 1,
                dataIndex : 'locationName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Work Area'),
                flex : 1,
                dataIndex : 'areaName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Position'),
                flex : 1,
                dataIndex : 'positionTitle'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Time Range'),
                flex : 1,
                renderer : function(value, meta, record) {
                    return Ext.Date.format(record.get('startTime'), criterion.consts.Api.TIME_FORMAT_US) + ' - ' + Ext.Date.format(record.get('endTime'), criterion.consts.Api.TIME_FORMAT_US);
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Required Coverage per Unit'),
                flex : 1,
                dataIndex : 'requiredNum'
            }
        ]
    };

});
