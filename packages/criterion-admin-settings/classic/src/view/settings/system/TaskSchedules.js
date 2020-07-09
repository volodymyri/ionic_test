Ext.define('criterion.view.settings.system.TaskSchedules', function() {

    const TASK_SCHEDULE_LAST_RUN_STATUS = criterion.Consts.TASK_SCHEDULE_LAST_RUN_STATUS;

    return {
        alias : 'widget.criterion_settings_task_schedules',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.view.settings.system.TaskSchedule',
            'criterion.controller.employer.GridView',
            'criterion.store.employer.Schedules'
        ],

        title : i18n.gettext('Task Scheduler'),

        viewModel : {
            stores : {
                schedules : {
                    type : 'criterion_employer_schedules'
                }
            }
        },

        controller : {
            type : 'criterion_employer_gridview',
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            connectParentView : {
                parentForSpecified : true
            },
            editor : {
                xtype : 'criterion_settings_task_schedule',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                allowDelete : true
            }
        },

        bind : {
            store : '{schedules}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'recurrenceCd',
                codeDataId : criterion.consts.Dict.RECURRENCE_TYPE,
                text : i18n.gettext('Recurrence'),
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Number of Tasks'),
                dataIndex : 'numberTasks',
                renderer : function(value, meta, record) {
                    return record.tasks().count();
                },
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Last Run Time'),
                dataIndex : 'lastRunDate',
                format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Last Run Status'),
                dataIndex : 'lastRunStatus',
                renderer : function(value) {
                    let lastRunStatusText = '';

                    switch (value) {
                        case TASK_SCHEDULE_LAST_RUN_STATUS.SUCCESS:
                            lastRunStatusText = i18n.gettext('Success');
                            break;
                        case TASK_SCHEDULE_LAST_RUN_STATUS.SYSTEM_ERROR:
                            lastRunStatusText = i18n.gettext('System Error');
                            break;
                        case TASK_SCHEDULE_LAST_RUN_STATUS.VALIDATION_ERROR:
                            lastRunStatusText = i18n.gettext('Validation Error');
                            break;
                        default:
                            lastRunStatusText = i18n.gettext('Not Launched');
                            break;
                    }

                    return lastRunStatusText;
                },
                flex : 1
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Active'),
                dataIndex : 'isActive',
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No'),
                flex : 1
            }
        ]
    };

});
