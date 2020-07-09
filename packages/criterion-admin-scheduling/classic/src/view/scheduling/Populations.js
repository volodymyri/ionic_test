Ext.define('criterion.view.scheduling.Populations', {

    extend : 'criterion.view.GridView',

    requires : [
        'criterion.controller.scheduling.Populations',
        'criterion.view.scheduling.Population',

        'criterion.store.employer.PopulationCounts',
        'criterion.store.employer.WorkLocations',
        'criterion.store.workLocation.Areas'
    ],

    alias : 'widget.criterion_scheduling_populations',

    controller : {
        type : 'criterion_scheduling_populations',
        connectParentView : false,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_scheduling_population',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar',
                    modal : true,
                    width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                    height : 'auto'
                }
            ],
            draggable : true,
            modal : true
        }
    },

    viewModel : {
        stores : {
            populationCount : {
                type : 'criterion_employer_population_counts'
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
        store : '{populationCount}'
    },

    dockedItems : [
        {
            xtype : 'criterion_settings_employer_bar',
            context : 'criterion_scheduling_populations',
            padding : '10 25',
            dock : 'top'
        }
    ],

    tbar : [
        {
            xtype : 'button',
            reference : 'addButton',
            text : i18n.gettext('Add'),
            cls : 'criterion-btn-feature',
            listeners : {
                click : 'handleAddClick'
            },
            hidden : true,
            bind : {
                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_POPULATION, criterion.SecurityManager.CREATE, true)
            }
        },
        '->',
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
            text : i18n.gettext('Count'),
            dataIndex : 'count',
            width : 150
        }
    ]
});
