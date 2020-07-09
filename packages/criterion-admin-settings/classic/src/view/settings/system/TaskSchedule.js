Ext.define('criterion.view.settings.system.TaskSchedule', function() {

    const TASK_SCHEDULE_LAST_RUN_STATUS = criterion.Consts.TASK_SCHEDULE_LAST_RUN_STATUS;

    return {
        alias : 'widget.criterion_settings_task_schedule',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.TaskSchedule',
            'criterion.store.EmployeeGroups'
        ],

        controller : {
            type : 'criterion_settings_task_schedule',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                days : {
                    fields : ['value', 'name'],
                    sorters : [
                        {
                            property : 'value',
                            direction : 'ASC'
                        }
                    ],
                    data : [
                        /* eslint-disable prefer-numeric-literals */
                        {
                            name : i18n.gettext('Sunday'),
                            value : parseInt('0000001', 2)
                        },
                        {
                            name : i18n.gettext('Monday'),
                            value : parseInt('0000010', 2)
                        },
                        {
                            name : i18n.gettext('Tuesday'),
                            value : parseInt('0000100', 2)
                        },
                        {
                            name : i18n.gettext('Wednesday'),
                            value : parseInt('0001000', 2)
                        },
                        {
                            name : i18n.gettext('Thursday'),
                            value : parseInt('0010000', 2)
                        },
                        {
                            name : i18n.gettext('Friday'),
                            value : parseInt('0100000', 2)
                        },
                        {
                            name : i18n.gettext('Saturday'),
                            value : parseInt('1000000', 2)
                        }
                        /* eslint-enable prefer-numeric-literals */
                    ]
                },
                employeeGroups : {
                    type : 'criterion_employee_groups'
                }
            },
            formulas : {
                isOneTime : data => data('record.recurrenceCode') === criterion.Consts.RECURRENCE_TYPES.ONE_TIME,
                isYearly : data => data('record.recurrenceCode') === criterion.Consts.RECURRENCE_TYPES.YEARLY,
                isDaily : data => data('record.recurrenceCode') === criterion.Consts.RECURRENCE_TYPES.DAILY,
                isWeekly : data => data('record.recurrenceCode') === criterion.Consts.RECURRENCE_TYPES.WEEKLY,
                isBiWeekly : data => data('record.recurrenceCode') === criterion.Consts.RECURRENCE_TYPES.BI_WEEKLY,
                isMonthly : data => data('record.recurrenceCode') === criterion.Consts.RECURRENCE_TYPES.MONTHLY,
                isInterval : data => data('record.recurrenceCode') === criterion.Consts.RECURRENCE_TYPES.INTERVAL,

                weekPatternValue : {
                    bind : {
                        bindTo : ['{days}', '{record}'],
                        deep : true
                    },
                    get : function(data) {
                        let rdValues = [],
                            days = data[0],
                            record = data[1],
                            weekPattern;

                        if (!days || !record) {
                            return;
                        }

                        weekPattern = record.get('weekPattern');

                        days.each(function(rdRecord) {
                            let rdValue = rdRecord.get('value');

                            if (!(~weekPattern & rdValue)) {
                                rdValues.push(rdValue)
                            }
                        });

                        return rdValues;
                    },
                    set : function(selectedDays) {
                        let value = Ext.Array.reduce(selectedDays, function(prev, val) {
                            return prev + val
                        }, 0);

                        this.set('record.weekPattern', value);
                    }
                },
                isMonthPatternDay : data => data('record.monthPattern') === criterion.Consts.MONTH_PATTERN_TYPE.DAY.value,
                lastRunTime : data => data('record.lastRunDate') ? Ext.Date.format(data('record.lastRunDate'), criterion.consts.Api.DATE_AND_TIME_FORMAT) : null,
                lastRunStatus : data => {
                    let lastRunStatus = data('record.lastRunStatus'),
                        lastRunStatusText = '';

                    switch (lastRunStatus) {
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
                hideLastRunError : data => data('record.lastRunStatus') !== TASK_SCHEDULE_LAST_RUN_STATUS.VALIDATION_ERROR,
                lastRunError : data => {
                    let lastRunStatus = data('record.lastRunStatus'),
                        lastRunError = {}, errorInfo = [], error = '';

                    if (lastRunStatus === TASK_SCHEDULE_LAST_RUN_STATUS.VALIDATION_ERROR) {
                        lastRunError = JSON.parse(data('record.lastRunError'));
                        errorInfo = lastRunError && criterion.consts.Error.getErrorInfo(lastRunError);
                        error = errorInfo && errorInfo.description;
                    }

                    return error;
                }
            }
        },

        bodyPadding : 0,

        title : i18n.gettext('Schedule Details'),

        setButtonConfig : function() {
            let buttons = [];

            buttons.push(
                {
                    xtype : 'button',
                    reference : 'delete',
                    text : i18n.gettext('Delete'),
                    cls : 'criterion-btn-remove',
                    listeners : {
                        click : 'handleDeleteClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{disableDelete}',
                        hidden : '{hideDelete}'
                    }
                },
                {
                    xtype : 'displayfield',
                    margin : '10 0 0 20',
                    labelWidth : 110,
                    fieldLabel : i18n.gettext('Last Run Time'),
                    value : i18n.gettext('Unknown'),
                    hidden : true,
                    bind : {
                        value : '{lastRunTime}',
                        hidden : '{isPhantom}'
                    }
                },
                {
                    xtype : 'displayfield',
                    margin : '0 0 0 40',
                    labelWidth : 110,
                    fieldLabel : i18n.gettext('Last Run Status'),
                    value : i18n.gettext('Unknown'),
                    hidden : true,
                    bind : {
                        value : '{lastRunStatus}',
                        hidden : '{isPhantom}'
                    }
                },
                {
                    xtype : 'displayfield',
                    margin : '0 0 0 40',
                    labelWidth : 110,
                    fieldLabel : i18n.gettext('Last Run Error'),
                    value : i18n.gettext('Unknown'),
                    hidden : true,
                    bind : {
                        value : '{lastRunError}',
                        hidden : '{isPhantom || hideLastRunError}'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    reference : 'cancel',
                    cls : 'criterion-btn-light',
                    listeners : {
                        click : 'handleCancelClick'
                    },
                    hidden : true,
                    bind : {
                        text : '{cancelBtnText}',
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'submit',
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'handleSubmitClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{disableSave}',
                        text : '{submitBtnText}',
                        hidden : '{hideSave}'
                    }
                }
            );

            this.buttons = buttons;
        },

        items : [
            {
                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : Ext.Object.merge({}, criterion.Consts.UI_CONFIG.TWO_COL_CONDENSED, {
                    xtype : 'container',
                    margin : '0 0 0 10'
                }),

                bodyPadding : '10 0',
                bodyStyle : {
                    'border-width' : '0 0 1px 0 !important'
                },

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                name : 'employerId',
                                disabled : true,
                                hideTrigger : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                name : 'name',
                                bind : '{record.name}'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : criterion.consts.Dict.RECURRENCE_TYPE,
                                sortByDisplayField : false,
                                fieldLabel : i18n.gettext('Recurrence'),
                                name : 'recurrenceCd',
                                bind : {
                                    value : '{record.recurrenceCd}',
                                    readOnly : '{record.isDailySystemTask}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Odd Week'),
                                name : 'isOddWeek',
                                hidden : true,
                                bind : {
                                    value : '{record.isOddWeek}',
                                    hidden : '{!isBiWeekly}',
                                    disabled : '{!isBiWeekly}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Active'),
                                name : 'isActive',
                                bind : '{record.isActive}'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Daily System Task'),
                                name : 'isDailySystemTask',
                                hidden : true,
                                bind : {
                                    value : '{record.isDailySystemTask}',
                                    hidden : '{isInterval}',
                                    disabled : '{isInterval}'
                                },
                                listeners : {
                                    change : 'handleChangeDailySystemTask'
                                }
                            },
                            {
                                xtype : 'timefield',
                                fieldLabel : i18n.gettext('Start Time'),
                                allowBlank : false,
                                hidden : true,
                                bind : {
                                    value : '{record.startTime}',
                                    hidden : '{isInterval || record.isDailySystemTask}',
                                    disabled : '{isInterval || record.isDailySystemTask}'
                                }
                            },
                            // one time
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Start Date'),
                                hidden : true,
                                allowBlank : false,
                                bind : {
                                    value : '{record.startDate}',
                                    hidden : '{!isOneTime}',
                                    disabled : '{!isOneTime}'
                                }
                            },
                            // daily
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Pattern'),
                                valueField : 'value',
                                sortByDisplayField : false,
                                allowBlank : false,
                                editable : false,
                                disableDirtyCheck : true,
                                store : Ext.create('Ext.data.Store', {
                                    fields : ['value', 'text'],
                                    data : Ext.Array.map([i18n.gettext('Everyday'), i18n.gettext('Weekday')], function(item, index) {
                                        return {
                                            value : index + 1,
                                            text : item
                                        };
                                    })
                                }),
                                hidden : true,
                                bind : {
                                    value : '{record.dayPattern}',
                                    hidden : '{!isDaily || record.isDailySystemTask}',
                                    disabled : '{!isDaily || record.isDailySystemTask}'
                                }
                            },
                            // weekly (biweekly)
                            {
                                xtype : 'tagfield',
                                bind : {
                                    store : '{days}',
                                    value : '{weekPatternValue}',
                                    hidden : '{!isWeekly && !isBiWeekly}',
                                    disabled : '{!isWeekly && !isBiWeekly}'
                                },
                                hidden : true,
                                disableDirtyCheck : true,
                                fieldLabel : i18n.gettext('Pattern'),
                                sortByDisplayField : false,
                                displayField : 'name',
                                valueField : 'value',
                                allowBlank : true,
                                editable : false,
                                queryMode : 'local'
                            },
                            // monthly
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Pattern'),
                                layout : 'hbox',
                                requiredMark : true,
                                hidden : true,
                                bind : {
                                    hidden : '{!isMonthly}'
                                },
                                margin : 0,
                                items : [
                                    {
                                        xtype : 'combobox',
                                        valueField : 'value',
                                        sortByDisplayField : false,
                                        allowBlank : false,
                                        editable : false,
                                        flex : 1,
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['value', 'text'],
                                            data : Ext.Object.getValues(criterion.Consts.MONTH_PATTERN_TYPE)
                                        }),
                                        bind : {
                                            value : '{record.monthPattern}',
                                            disabled : '{!isMonthly}'
                                        }
                                    },
                                    {
                                        xtype : 'numberfield',
                                        width : 100,
                                        allowBlank : false,
                                        minValue : 1,
                                        maxValue : 31,
                                        margin : {
                                            left : 5
                                        },
                                        hidden : true,
                                        bind : {
                                            value : '{record.monthPatternDay}',
                                            disabled : '{!isMonthly || !isMonthPatternDay}',
                                            hidden : '{!record.monthPattern || !isMonthPatternDay}'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        valueField : 'value',
                                        sortByDisplayField : false,
                                        allowBlank : false,
                                        editable : false,
                                        flex : 1,
                                        margin : {
                                            left : 5
                                        },
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['value', 'text'],
                                            data : Ext.Array.map(criterion.Consts.DAYS_OF_WEEK_ARRAY, function(item, index) {
                                                return {
                                                    value : index + 1,
                                                    text : item
                                                };
                                            })
                                        }),
                                        hidden : true,
                                        bind : {
                                            value : '{record.monthPatternWeek}',
                                            disabled : '{!isMonthly || isMonthPatternDay}',
                                            hidden : '{!record.monthPattern || isMonthPatternDay}'
                                        }
                                    }
                                ]
                            },
                            // yearly
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Start Date'),
                                layout : 'hbox',
                                requiredMark : true,
                                hidden : true,
                                bind : {
                                    hidden : '{!isYearly}'
                                },
                                margin : 0,
                                items : [
                                    {
                                        xtype : 'numberfield',
                                        width : 100,
                                        allowBlank : false,
                                        minValue : 1,
                                        maxValue : 31,
                                        bind : {
                                            value : '{record.yearPatternDay}',
                                            disabled : '{!isYearly}'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        valueField : 'month',
                                        sortByDisplayField : false,
                                        allowBlank : false,
                                        editable : false,
                                        flex : 1,
                                        margin : {
                                            left : 5
                                        },
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['month', 'text'],
                                            data : Ext.Array.map(Ext.Date.monthNames, function(item, index) {
                                                return {
                                                    month : index + 1,
                                                    text : item
                                                };
                                            })
                                        }),
                                        bind : {
                                            value : '{record.yearPatternMonth}',
                                            disabled : '{!isYearly}'
                                        }
                                    }
                                ]
                            },
                            // interval
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Interval'),
                                layout : 'hbox',
                                requiredMark : true,
                                hidden : true,
                                bind : {
                                    hidden : '{!isInterval}'
                                },
                                margin : 0,
                                items : [
                                    {
                                        xtype : 'numberfield',
                                        flex : 1,
                                        allowBlank : false,
                                        bind : {
                                            value : '{record.interval}',
                                            disabled : '{!isInterval}'
                                        }
                                    },
                                    {
                                        html : i18n.gettext('min'),
                                        margin : '10 0 0 10'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridpanel',
                tbar : [
                    {
                        xtype : 'component',
                        html : i18n.gettext('Tasks'),
                        cls : 'bold'
                    },
                    '->',
                    {
                        xtype : 'button',
                        reference : 'addButton',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddTask'
                        }
                    }
                ],
                listeners : {
                    scope : 'controller',
                    beforecellclick : 'handleEditTask'
                },
                hidden : true,
                bind : {
                    store : '{record.tasks}',
                    hidden : '{record.isDailySystemTask}'
                },
                columns : [
                    {
                        text : i18n.gettext('Type'),
                        flex : 1,
                        dataIndex : 'type',
                        renderer : function(value) {
                            let res = '';

                            Ext.Array.each(Ext.Object.getValues(criterion.Consts.SCHEDULE_TASK_TYPE), function(cfg) {
                                if (cfg.value === value) {
                                    res = cfg.text;

                                    return false;
                                }
                            });

                            return res;
                        }
                    },
                    {
                        text : i18n.gettext('Name'),
                        flex : 1,
                        renderer : function(value, meta, record) {
                            switch (record.get('type')) {
                                case criterion.Consts.SCHEDULE_TASK_TYPE.REPORT.value:
                                    return record.get('reportName');

                                case criterion.Consts.SCHEDULE_TASK_TYPE.TRANSFER.value:
                                    return record.get('transferName');

                                case criterion.Consts.SCHEDULE_TASK_TYPE.SYSTEM.value:
                                    return record.get('systemTaskName');

                                case criterion.Consts.SCHEDULE_TASK_TYPE.APP.value:
                                    return record.get('appName');

                                default:
                                    return '';
                            }
                        }
                    },
                    {
                        text : i18n.gettext('Recipient Type'),
                        flex : 1,
                        dataIndex : 'recipientType',
                        renderer : function(value) {
                            let res = '';

                            Ext.Array.each(Ext.Object.getValues(criterion.Consts.SCHEDULE_TASK_RECIPIENT_TYPES), function(cfg) {
                                if (cfg.value === value) {
                                    res = cfg.text;

                                    return false;
                                }
                            });

                            return res;
                        }
                    }
                ]
            }
        ]
    };

});
