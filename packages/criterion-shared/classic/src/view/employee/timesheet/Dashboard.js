Ext.define('criterion.view.employee.timesheet.Dashboard', function() {

    const TEAM_TIMESHEET_VIEW_TYPE = criterion.Consts.TEAM_TIMESHEET_VIEW_TYPE;

    function setWidgetUniqSelector(widget, selector) {
        // It appeared that widget can has several "selectors" at one time, so try to keep just one
        if (widget.lastSelector) {
            delete widget[widget.lastSelector];
        }

        widget[selector] = 1;
        widget.lastSelector = selector;
    }

    return {

        extend : 'criterion.ux.grid.Panel',

        requires : [
            'criterion.controller.employee.timesheet.Dashboard',
            'criterion.store.employer.payroll.Schedules',
            'criterion.store.TimesheetTypes',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods',
            'criterion.store.dashboard.SubordinateTimesheets',
            'criterion.store.dashboard.subordinateTimesheet.Grid',
            'criterion.store.employee.timesheet.Incomes',
            'criterion.store.Apps',
            'criterion.model.dashboard.subordinateTimesheet.GridDetail',
            'criterion.ux.form.field.ExtendedComboBox',
            'criterion.view.employee.timesheet.dashboard.Options',
            'criterion.store.EmployeeGroups',
            'criterion.ux.form.field.Search',
            'criterion.store.CustomData',
            'criterion.model.App'
        ],

        mixins : [
            'criterion.ux.mixin.TitleReplaceable'
        ],

        alias : 'widget.criterion_employee_timesheet_dashboard',

        viewModel : {
            data : {
                options : {
                    isCustomPeriod : false,
                    payrollScheduleId : null,
                    timesheetTypeId : null,
                    payrollPeriodId : null,
                    startDate : null,
                    endDate : null,
                    employeeGroupIds : [],
                    isAggregateTimesheet : false,
                    isFTE : false
                },

                optionDescription : {
                    payrollSchedule : null,
                    timesheetType : null,
                    employeeGroups : null,
                    startDate : null,
                    endDate : null
                },

                blockedState : false,
                isLstInterval : true,
                isFirstInterval : true,
                showWeekIterationButtons : false,
                employeesPageIndex : null,

                viewMode : TEAM_TIMESHEET_VIEW_TYPE.LIST.value,
                isManualDay : false,
                firstBtnId : null
            },
            stores : {
                payrollSchedules : {
                    type : 'criterion_employer_payroll_schedules',
                    sorters : [
                        {
                            property : 'periodStartDate',
                            direction : 'ASC'
                        }
                    ]
                },
                customData : {
                    type : 'criterion_customdata'
                },
                timesheetTypes : {
                    type : 'criterion_timesheet_types'
                },
                payrollPeriods : {
                    type : 'criterion_employer_payroll_payroll_schedule_payroll_periods'
                },
                subordinateTimesheets : {
                    type : 'criterion_dashboard_subordinate_timesheets'
                },
                subordinateTimesheetsGrid : {
                    type : 'criterion_dashboard_subordinate_timesheet_grid'
                },
                gridDetails : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    sorters : [
                        {
                            property : 'employeeId',
                            direction : 'ASC'
                        },
                        {
                            property : 'sorter',
                            direction : 'ASC'
                        }
                    ],
                    filters : [
                        {
                            property : 'employeeId',
                            value : null // don't remove
                        }
                    ],
                    model : 'criterion.model.dashboard.subordinateTimesheet.GridDetail',
                    listeners : {
                        filterchange : 'onGridStoreFilterChange'
                    }
                },
                employeesStore : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    sorters : [
                        {
                            property : 'lastName',
                            direction : 'ASC'
                        }
                    ],
                    fields : [
                        {
                            name : 'id',
                            type : 'integer'
                        },
                        {
                            name : 'firstName',
                            type : 'string'
                        },
                        {
                            name : 'lastName',
                            type : 'string'
                        },
                        {
                            name : 'employeeNumber',
                            type : 'string'
                        }
                    ]
                },
                employeeGroups : {
                    type : 'criterion_employee_groups'
                },

                actions : {
                    fields : ['text', 'action'],
                    data : Ext.Object.getValues(criterion.Consts.TEAM_TIMESHEET_ACTIONS),
                    filters : [
                        {
                            disabled : '{timesheetLayoutSelected}',
                            property : 'list',
                            value : '{actionFilter}'
                        },
                        {
                            disabled : '{!timesheetLayoutSelected || !options.isAggregateTimesheet}',
                            property : 'hideWhenAggregated',
                            value : false
                        }
                    ]
                },
                timesheetSyncApps : {
                    type : 'criterion_apps'
                }
            },

            formulas : {
                optionsTooltip : function(data) {
                    return criterion.Utils.generateTipRow(i18n.gettext('Period'), data('optionDescription.periodName')) +
                        (data('options.period') === criterion.Consts.TIMESHEET_OPTION_PERIOD.PAY_PERIOD.value ? criterion.Utils.generateTipRow(i18n.gettext('Payroll Schedule'), data('optionDescription.payrollSchedule')) : '') +
                        criterion.Utils.generateTipRow(
                            i18n.gettext('Time period'), Ext.String.format('{0} - {1}',
                                Ext.Date.format(data('optionDescription.startDate'), criterion.consts.Api.SHOW_DATE_FORMAT),
                                Ext.Date.format(data('optionDescription.endDate'), criterion.consts.Api.SHOW_DATE_FORMAT))
                        ) +
                        criterion.Utils.generateTipRow(i18n.gettext('Timesheet Layout'), data('optionDescription.timesheetType')) +
                        criterion.Utils.generateTipRow(i18n.gettext('Employee Groups'), data('optionDescription.employeeGroupsFullText'));
                },

                timesheetLayoutSelected : {
                    bind : {
                        bindTo : '{options}',
                        deep : true
                    },
                    get : function() {
                        return !!this.get('options.timesheetTypeId');
                    }
                },

                onlyList : function(data) {
                    return !data('timesheetLayoutSelected');
                },

                actionFilter : function(data) {
                    return data('timesheetLayoutSelected') ? null : 1;
                },

                isViewList : function(data) {
                    return data('viewMode') === TEAM_TIMESHEET_VIEW_TYPE.LIST.value;
                },

                hideNextBtn : function(data) {
                    let employeesPageIndex = data('employeesPageIndex');

                    return employeesPageIndex === null || employeesPageIndex + 1 >= data('maxEmployeesPage');
                },

                disableSave : function(data) {
                    return data('blockedState');
                },

                hideHours : data => data('isManualDay')
            }
        },

        controller : {
            type : 'criterion_employee_timesheet_dashboard'
        },

        listeners : {
            activate : 'onActivate',
            recalculateTotalHours : 'onRecalculateTotalHours',
            recalculateTotalDays : 'onRecalculateTotalDays',
            taskRecordChanges : 'onTaskRecordChanges',
            projectChange : 'onProjectChange',
            addNewTaskLine : 'onAddNewTaskLine',
            setNewAvailableDates : 'onSetNewAvailableDates',
            setupRowByPayCode : 'onSetupRowByPayCode'
        },

        frame : true,

        ui : 'no-footer',

        userCls : 'with-top-bar',

        header : {

            title : {

                text : i18n.gettext('Team Timesheets'),

                minimizeWidth : true
            },

            items : [
                {
                    xtype : 'button',
                    ui : 'feature',
                    text : i18n.gettext('Options'),
                    reference : 'optionsButton',
                    listeners : {
                        click : 'onShowOptions'
                    },

                    bind : {
                        tooltip : '{optionsTooltip}'
                    }
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['ios7-arrow-left'],
                    ui : 'secondary',
                    listeners : {
                        click : 'onPrevInterval'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{isFirstInterval}',
                        hidden : '{!showWeekIterationButtons || isViewList}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'component',
                    hidden : true,
                    bind : {
                        html : '{startDate:date} &mdash; {options.isAggregateTimesheet?(endDate:date):(weekEndDate:date)}',
                        hidden : '{!showWeekIterationButtons || isViewList}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['ios7-arrow-right'],
                    ui : 'secondary',
                    listeners : {
                        click : 'onNextInterval'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{isLastInterval}',
                        hidden : '{!showWeekIterationButtons || isViewList}'
                    }
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'criterion_search_field',
                    ui : 'search-alt',
                    checkChangeBuffer : 1000,
                    emptyText : i18n.gettext('Employee'),
                    reference : 'employeeSearch',
                    listeners : {
                        change : 'handleEmployeeSearch'
                    }
                },

                {
                    xtype : 'combo',
                    reference : 'employeeSelect',
                    width : 200,
                    margin : '0 0 0 20',
                    hidden : true,
                    bind : {
                        store : '{employeesStore}'
                    },
                    queryMode : 'local',
                    tpl : Ext.create('Ext.XTemplate',
                        '<ul class="x-list-plain"><tpl for=".">',
                        '<li role="option" class="x-boundlist-item">{lastName} {firstName} ({employeeNumber})</li>',
                        '</tpl></ul>'),
                    displayTpl : Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{lastName} {firstName}',
                        '</tpl>'
                    ),
                    listeners : {
                        change : 'handleSelectGridEmployee'
                    },
                    displayField : 'lastName',
                    matchFieldWidth : false,
                    valueField : 'id',
                    forceSelection : true,
                    allowBlank : true,
                    editable : true,
                    anyMatch : true,
                    emptyText : i18n.gettext('Select Employee')
                },

                {
                    xtype : 'combo',
                    reference : 'actionCombo',
                    width : 200,
                    margin : '0 0 0 20',
                    bind : {
                        store : '{actions}'
                    },
                    listeners : {
                        change : 'handleSelectAction'
                    },
                    sortByDisplayField : false,
                    displayField : 'text',
                    valueField : 'action',
                    queryMode : 'local',
                    forceSelection : false,
                    allowBlank : true,
                    editable : false,
                    emptyText : i18n.gettext('Select the action')
                },

                {
                    xtype : 'combo',
                    store : Ext.create('Ext.data.Store', {
                        fields : ['text', 'value'],
                        data : Ext.Object.getValues(criterion.Consts.TEAM_TIMESHEET_VIEW_TYPE)
                    }),
                    bind : {
                        value : '{viewMode}',
                        hidden : '{onlyList}'
                    },
                    valueField : 'value',
                    displayField : 'text',
                    queryMode : 'local',
                    editable : false,
                    allowBlank : false,
                    sortByDisplayField : false,
                    margin : '0 0 0 20',
                    width : 100,
                    listeners : {
                        change : 'handleChangeViewType'
                    }
                },
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
            ]
        },

        buttons : {
            padding : '15 0 0 0',
            hidden : true,
            bind : {
                hidden : '{isViewList}'
            },
            items : [
                {
                    xtype : 'button',
                    ui : 'glyph',
                    glyph : criterion.consts.Glyph['ios7-arrow-back'],
                    hidden : true,
                    bind : {
                        hidden : '{employeesPageIndex == null}',
                        disabled : '{employeesPageIndex == 0}'
                    },
                    tooltip : 'Ctrl + <-',
                    handler : 'handlePrev'
                },
                {
                    xtype : 'component',
                    bind : {
                        html : i18n.gettext('page') + ' {employeesPageIndex + 1} ' + i18n.gettext('of') + ' {maxEmployeesPage}',
                        hidden : '{employeesPageIndex == null}'
                    }
                },
                {
                    xtype : 'button',
                    ui : 'glyph',
                    glyph : criterion.consts.Glyph['ios7-arrow-forward'],
                    hidden : true,
                    bind : {
                        hidden : '{employeesPageIndex == null}',
                        disabled : '{hideNextBtn}'
                    },
                    tooltip : 'Ctrl + ->',
                    handler : 'handleNext'
                },
                '->',
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    text : i18n.gettext('Save'),
                    listeners : {
                        click : {
                            fn : 'handleSave',
                            buffer : 300
                        }
                    },
                    bind : {
                        disabled : '{disableSave}'
                    }
                }
            ]
        },

        bind : {
            store : '{subordinateTimesheets}'
        },

        viewConfig : {
            markDirty : false
        },

        // dynamic
        columns : [],

        prepareGridColumns : function(viewType) {
            let columns,
                me = this,
                vm = this.getViewModel(),
                customData = vm.getStore('customData'),
                isList = viewType === TEAM_TIMESHEET_VIEW_TYPE.LIST.value,
                store = vm.getStore(isList ? 'subordinateTimesheets' : 'gridDetails'),
                timesheetType;

            let focusEnter = function(cmp) {
                cmp.getWidgetColumn().el.addCls('tt-column-focused');
            };

            let focusLeave = function(cmp) {
                cmp.getWidgetColumn().el.removeCls('tt-column-focused');
            };

            if (isList) {
                columns = [
                    {
                        xtype : 'gridcolumn',
                        width : 10,
                        dataIndex : 'typeName',
                        cls : 'type_header',
                        encodeHtml : false,
                        renderer : 'timesheetMarkRenderer'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Last Name'),
                        dataIndex : 'lastName',
                        flex : 1,
                        minWidth : 150
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('First Name'),
                        dataIndex : 'firstName',
                        flex : 1,
                        minWidth : 150
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee#'),
                        dataIndex : 'employeeNumber',
                        flex : 1,
                        minWidth : 150
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Timesheet Period'),
                        encodeHtml : false,
                        renderer : 'timesheetPeriodRenderer',
                        dataIndex : 'timesheets',
                        menuDisabled : true,
                        sortable : false,
                        minWidth : 260
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Total Hours'),
                        encodeHtml : false,
                        dataIndex : 'timesheets',
                        menuDisabled : true,
                        sortable : false,
                        minWidth : 130,
                        renderer : 'timesheetTotalHoursRenderer',
                        hidden : false,
                        bind : {
                            hidden : '{hideHours}'
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Total Days'),
                        encodeHtml : false,
                        dataIndex : 'timesheets',
                        menuDisabled : true,
                        sortable : false,
                        minWidth : 130,
                        renderer : 'timesheetTotalDaysRenderer',
                        hidden : true,
                        bind : {
                            hidden : '{!hideHours}'
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Status'),
                        encodeHtml : false,
                        dataIndex : 'timesheets',
                        flex : 1,
                        menuDisabled : true,
                        sortable : false,
                        minWidth : 130,
                        renderer : 'timesheetStatusRenderer',
                    },

                    {
                        xtype : 'widgetcolumn',
                        header : '',
                        menuDisabled : true,
                        sortable : false,
                        widget : {
                            xtype : 'button',
                            width : 75,
                            height : 30,
                            padding : 0,
                            margin : '10 0 0 5',
                            text : i18n.gettext('Add').toUpperCase(),
                            handler : 'onDashboardAddTimesheet'
                        }
                    }
                ];
            } else {
                let customFieldsColumns = [],
                    daysColumns = [],
                    layoutColumns = [],
                    isShowWorkLocation,
                    isFTE = vm.get('options.isFTE'),
                    isManualDay = vm.get('isManualDay');

                timesheetType = vm.getStore('timesheetTypes').getById(vm.get('options.timesheetTypeId'));

                isShowWorkLocation = timesheetType.get('isShowWorkLocation');

                // custom fields
                Ext.Array.each(criterion.Utils.range(1, 4), (index) => {
                    let fieldName = Ext.String.format('customField{0}Id', index),
                        customField = timesheetType.get(fieldName) && customData.getById(timesheetType.get(fieldName));

                    if (!customField || customField.get('isHidden')) {
                        return;
                    }

                    let dataType = criterion.CodeDataManager.getCodeDetailRecord('id', customField.get('dataTypeCd'), criterion.consts.Dict.DATA_TYPE).get('code'),
                        isDateCustomField = dataType === criterion.Consts.DATA_TYPE.DATE,
                        codeTableId = customField.get('codeTableId'),
                        filterIdent = criterion.Utils.getCustomFieldFilterIdent(customField, 'paycodeId');

                    customFieldsColumns.push({
                        xtype : 'widgetcolumn',
                        text : customField.get('label') || '',
                        dataIndex : Ext.String.format('customValue{0}', index),
                        flex : 1,
                        minWidth : 150,
                        menuDisabled : true,
                        sortable : false,
                        widget : Ext.merge({
                            ui : 'mini',
                            margin : '5 0 0 0',
                            matchFieldWidth : false,
                            editable : true,
                            anyMatch : true,
                            listConfig : {
                                minWidth : 145,
                                listeners : {
                                    show : function(boundlist) {
                                        let parentCombo = boundlist.ownerCmp,
                                            record = parentCombo.getWidgetRecord(),
                                            valId = filterIdent && record.get(filterIdent);

                                        if (!filterIdent) {
                                            return;
                                        }

                                        parentCombo.suspendEvents(false);

                                        boundlist.store.clearFilter();

                                        if (filterIdent !== '__employeeTaskId__') {
                                            valId && boundlist.store.setFilters([{
                                                filterFn : rec => Ext.Array.contains(Ext.Array.map((rec.get('attribute1') || '').split(','), v => parseInt(v, 10)), valId)
                                            }]);
                                        } else {
                                            // custom binding for employee_task_id
                                            let recId = record.getId(),
                                                val,
                                                taskCombo = parentCombo.up('criterion_employee_timesheet_dashboard').query('[__employeeTask_' + recId + ']');

                                            if (taskCombo.length) {
                                                val = taskCombo[0].getSelection();

                                                val && boundlist.store.setFilters([{
                                                    filterFn : rec => {
                                                        let codeTableDetails = Ext.Array.toValueMap(val.get('codeTableDetails') || [], 'codeTableId'),
                                                            ids = [];

                                                        if (codeTableDetails[codeTableId]) {
                                                            ids = Ext.Array.map((codeTableDetails[codeTableId]['value'] || '').split(','), v => parseInt(v, 10));
                                                        }

                                                        return Ext.Array.contains(ids, rec.getId());
                                                    }
                                                }]);
                                            }
                                        }

                                        parentCombo.resumeEvents();
                                    },

                                    hide : function(boundlist) {
                                        boundlist.store.clearFilter();
                                    }
                                }
                            },

                            listeners : {
                                change : (cmp, value) => {
                                    let record = cmp.getWidgetRecord && cmp.getWidgetRecord();

                                    if (!cmp || cmp.destroyed || !record) {
                                        return;
                                    }

                                    if (isDateCustomField) {
                                        value = Ext.isDate(value) ? Ext.Date.format(value, criterion.consts.Api.DATE_FORMAT) : value;
                                    }

                                    record.set(cmp.getWidgetColumn().dataIndex, value);
                                },
                                focusenter : focusEnter,
                                focusleave : focusLeave
                            }
                        }, criterion.Utils.getCustomFieldEditorConfig(customField), isDateCustomField ? {format : criterion.consts.Api.DATE_FORMAT} : {}),

                        onWidgetAttach : (column, widget, record) => {
                            setWidgetUniqSelector(widget, '__task_' + record.getId());
                        }
                    })
                });

                // days fields
                if (vm.get('options.isAggregateTimesheet')) {
                    daysColumns.push({
                        xtype : 'widgetcolumn',
                        dataIndex : 'day1hours',
                        dayIndex : 1,
                        width : 180,
                        cls : 'day_header',
                        menuDisabled : true,
                        sortable : false,
                        text : i18n.gettext('Hours'),
                        widget : {
                            xtype : 'textfield',
                            ui : 'mini',
                            margin : '5 0 0 0',
                            disabled : isFTE,
                            listeners : {
                                blur : (cmp) => {
                                    if (!cmp || cmp.destroyed || !cmp.getWidgetRecord) {
                                        return;
                                    }

                                    let value = cmp.getValue(),
                                        hasError = false,
                                        parsed,
                                        hours,
                                        minutes,
                                        cmpRecord = cmp.getWidgetRecord(),
                                        cmpColumn = cmp.getWidgetColumn(),
                                        dateHours = cmpRecord.get('dateHours'),
                                        date = cmpRecord.get('_' + cmpColumn.dayIndex + 'day');

                                    if (value.search('d|h|m') > -1) {
                                        parsed = criterion.Utils.parseDuration(value, false, true);
                                        hours = parsed.hours;
                                        minutes = parsed.minutes;
                                    } else if (value.indexOf(':') > -1) {
                                        parsed = value.split(':');
                                        hours = parseInt(parsed[0], 10);
                                        minutes = parseInt(parsed[1], 10);
                                    } else {
                                        if (value) {
                                            parsed = criterion.Utils.hoursToDuration(value);
                                            hours = parsed.hours;
                                            minutes = parsed.minutes;
                                        } else {
                                            // clear value
                                            Ext.Array.each(dateHours, (dateHour) => {
                                                if (dateHour.date === date) {
                                                    dateHour.hours = null;
                                                }
                                            });
                                            cmpRecord.set(cmpColumn.dataIndex, null);
                                        }
                                    }

                                    if (!isNaN(hours) || !isNaN(minutes)) {
                                        let timeObj = {
                                                hours : isNaN(hours) ? 0 : parseInt(hours, 10),
                                                minutes : isNaN(minutes) ? 0 : parseInt(minutes, 10)
                                            },
                                            hValue = timeObj.hours + timeObj.minutes / 60;

                                        cmpRecord.set(cmpColumn.dataIndex, criterion.Utils.dateTimeObjToStr(criterion.Utils.hoursToDuration(hValue)));

                                        let changed = false;

                                        Ext.Array.each(dateHours, (dateHour) => {
                                            if (dateHour.date === date) {
                                                dateHour.hours = hValue;
                                                changed = true;
                                            }
                                        });

                                        if (!changed) {
                                            dateHours.push({
                                                date : date,
                                                hours : hValue
                                            });
                                        }

                                    } else {
                                        hasError = true;
                                    }

                                    if (value && hasError) {
                                        cmp.markInvalid(i18n.gettext('Wrong format, should be : \'12:45\', \'1h 20m\', \'1h\', \'20m\''));
                                    }

                                    me.fireEvent('recalculateTotalHours', cmpRecord.get('employeeId'));
                                },
                                focusenter : focusEnter,
                                focusleave : focusLeave
                            }
                        },
                        onWidgetAttach : (column, widget, record) => {
                            setWidgetUniqSelector(widget, '__timeField_' + record.get('employeeId') + '_' + record.get('sorter'));
                            widget.dayIndex = column.dayIndex;
                        }
                    });

                    if (isFTE) {
                        daysColumns.push({
                            xtype : 'widgetcolumn',
                            dataIndex : 'day1fte',
                            fteIndex : 1,
                            width : 180,
                            cls : 'day_header',
                            menuDisabled : true,
                            sortable : false,
                            text : i18n.gettext('FTE'),
                            widget : {
                                xtype : 'numberfield',
                                ui : 'mini',
                                margin : '5 0 0 0',
                                maxValue : 1,
                                msgTarget : 'qtip',
                                listeners : {
                                    blur : (cmp) => {
                                        if (!cmp || cmp.destroyed || !cmp.getWidgetRecord) {
                                            return;
                                        }

                                        let value = cmp.getValue(),
                                            cmpRecord = cmp.getWidgetRecord(),
                                            cmpColumn = cmp.getWidgetColumn(),
                                            fteMultiplier = cmpRecord.get(Ext.String.format('day{0}fteMultiplier', cmpColumn.fteIndex)) || cmpRecord.get('commonFteMultiplier'),
                                            dateHours = cmpRecord.get('dateHours'),
                                            date = cmpRecord.get('_' + cmpColumn.fteIndex + 'day');

                                        cmpRecord.set(
                                            Ext.String.format('day{0}hours', cmpColumn.fteIndex),
                                            criterion.Utils.dateTimeObjToStr(criterion.Utils.hoursToDuration(
                                                value * fteMultiplier
                                            ))
                                        );
                                        cmpRecord.set(
                                            Ext.String.format('day{0}fte', cmpColumn.fteIndex),
                                            value
                                        );

                                        let changed = false;

                                        Ext.Array.each(dateHours, (dateHour) => {
                                            if (dateHour.date === date) {
                                                dateHour.fte = value;
                                                changed = true;
                                            }
                                        });

                                        if (!changed) {
                                            dateHours.push({
                                                date : date,
                                                fte : value
                                            });
                                        }

                                        Ext.defer(() => {
                                            let dayCmp = me.down('textfield[dayIndex=1]');

                                            !!dayCmp && dayCmp.fireEvent('blur', dayCmp);
                                        }, 100);
                                    },
                                    focusenter : focusEnter,
                                    focusleave : focusLeave
                                }
                            },
                            onWidgetAttach : (column, widget, record) => {
                                setWidgetUniqSelector(widget, '__fteField_' + record.get('employeeId') + '_' + record.get('sorter'));
                                widget.fteIndex = column.fteIndex;
                            }
                        });
                    }
                } else {
                    Ext.Array.each(criterion.Utils.range(1, Ext.Date.DAYS_IN_WEEK), (index) => {
                        daysColumns.push(this.getHoursDaysColumn(isManualDay, index, focusEnter, focusLeave));
                    });
                }

                if (timesheetType.get('isShowAssignment')) {
                    layoutColumns.push({
                        xtype : 'widgetcolumn',
                        text : timesheetType.get('labelAssignment') || i18n.gettext('Assignment'),
                        dataIndex : 'assignmentId',
                        sortable : false,
                        menuDisabled : true,
                        flex : 1,
                        minWidth : 150,
                        widget : {
                            xtype : 'combobox',
                            ui : 'mini',
                            margin : '5 0 0 0',
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 145
                            },
                            forceSelection : false,
                            editable : true,
                            anyMatch : true,
                            queryMode : 'local',
                            valueField : 'assignmentId',
                            displayField : 'title',
                            listeners : {
                                scope : 'controller',
                                change : (cmp, value) => {
                                    if (!cmp || cmp.destroyed || !cmp.getWidgetRecord || !value) {
                                        return;
                                    }

                                    let cmpRecord = cmp.getWidgetRecord();

                                    cmpRecord.set(cmp.getWidgetColumn().dataIndex, value);
                                    if (isFTE) {
                                        criterion.Api.requestWithPromise({
                                            url : criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_AGGREGATE_CALC_FTE_MULTIPLIER,
                                            method : 'GET',
                                            params : {
                                                assignmentId : value,
                                                timesheetTypeId : timesheetType.getId()
                                            }
                                        }).then(function(fteMultiplier) {
                                            cmpRecord.set('commonFteMultiplier', fteMultiplier);
                                        });
                                    }
                                },
                                focusenter : focusEnter,
                                focusleave : focusLeave
                            }
                        },
                        onWidgetAttach : (column, widget, record) => {
                            let store = Ext.create('criterion.data.Store', {
                                type : 'memory',
                                fields : [
                                    {
                                        name : 'assignmentId',
                                        type : 'integer'
                                    },
                                    {
                                        name : 'title',
                                        type : 'string'
                                    }
                                ],
                                sorters : [
                                    {
                                        property : 'title',
                                        direction : 'ASC'
                                    }
                                ]
                            });

                            store.add(Ext.clone(record.get('assignments')));
                            widget.setStore(store);
                            setWidgetUniqSelector(widget, '__' + column.dataIndex + '_' + record.get('employeeId') + '_' + record.get('sorter'));
                        }
                    });
                }

                if (isShowWorkLocation) {
                    layoutColumns.push({
                        xtype : 'widgetcolumn',
                        text : timesheetType.get('labelWorkLocation') || i18n.gettext('Location'),
                        dataIndex : 'employerWorkLocationId',
                        sortable : false,
                        menuDisabled : true,
                        flex : 1,
                        minWidth : 150,
                        widget : {
                            xtype : 'combobox',
                            ui : 'mini',
                            margin : '5 0 0 0',
                            forceSelection : true,
                            editable : true,
                            anyMatch : true,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 145
                            },
                            queryMode : 'local',
                            valueField : 'employerWorkLocationId',
                            displayField : 'employerLocationName',
                            listeners : {
                                scope : 'controller',
                                change : (cmp, value) => {
                                    if (!cmp || cmp.destroyed || !cmp.getWidgetRecord) {
                                        return;
                                    }

                                    let record = cmp.getWidgetRecord(),
                                        workLocationAreaId = record.get('workLocationAreaId');

                                    if (workLocationAreaId && value) {
                                        let workLocationArea = Ext.Array.findBy(record.get('workLocationAreas'), wla => {
                                            return wla.id === record.get('workLocationAreaId')
                                        });

                                        if (workLocationArea && workLocationArea.workLocationId !== cmp.getSelectedRecord().get('workLocationId')) {
                                            record.set('workLocationAreaId', null);
                                        }
                                    }

                                    if (!value) {
                                        record.set('workLocationAreaId', null);
                                    }

                                    record.set(cmp.getWidgetColumn().dataIndex, value);
                                },
                                focusenter : focusEnter,
                                focusleave : focusLeave
                            }
                        },
                        onWidgetAttach : (column, widget, record) => {
                            let store = Ext.create('criterion.data.Store', {
                                type : 'memory',
                                fields : [
                                    {
                                        name : 'employerWorkLocationId',
                                        type : 'integer'
                                    },
                                    {
                                        name : 'employerLocationName',
                                        type : 'string'
                                    }
                                ],
                                sorters : [
                                    {
                                        property : 'employerLocationName',
                                        direction : 'ASC'
                                    }
                                ]
                            });

                            store.add(Ext.clone(record.get('workLocations')));
                            widget.setStore(store);
                            setWidgetUniqSelector(widget, '__' + column.dataIndex + '_' + record.get('employeeId') + '_' + record.get('sorter'));
                        }
                    });
                }

                if (timesheetType.get('isShowWorkArea')) {
                    layoutColumns.push({
                        xtype : 'widgetcolumn',
                        text : timesheetType.get('labelWorkArea') || i18n.gettext('Area'),
                        dataIndex : 'workLocationAreaId',
                        sortable : false,
                        menuDisabled : true,
                        flex : 1,
                        minWidth : 150,
                        widget : {
                            xtype : 'combobox',
                            ui : 'mini',
                            margin : '5 0 0 0',
                            forceSelection : true,
                            editable : true,
                            anyMatch : true,
                            matchFieldWidth : false,
                            queryMode : 'local',
                            valueField : 'id',
                            displayField : 'nameWithCode',
                            tpl : Ext.create('Ext.XTemplate',
                                '<ul class="x-list-plain"><tpl for=".">',
                                '<li role="option" class="x-boundlist-item">{code} - {name}</li>',
                                '</tpl></ul>'),
                            displayTpl : Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{name}',
                                '</tpl>'
                            ),
                            isAreaCombo : true,
                            listeners : {
                                scope : 'controller',
                                change : (cmp, value) => {
                                    if (!cmp || cmp.destroyed || !cmp.getWidgetRecord) {
                                        return;
                                    }

                                    let record = cmp.getWidgetRecord(),
                                        taskId = record.get('taskId');

                                    if (taskId) {
                                        let task = Ext.Array.findBy(record.get('tasks'), task => {
                                            return (taskId === task.id && Ext.Array.contains(task.workLocationAreaIds, value));
                                        });

                                        if (!task) {
                                            record.set('taskId', null);
                                        }
                                    }

                                    cmp.getWidgetRecord().set(cmp.getWidgetColumn().dataIndex, value);
                                },
                                focusenter : focusEnter,
                                focusleave : focusLeave
                            },
                            listConfig : {
                                minWidth : 145,
                                listeners : {
                                    show : function(boundlist) {

                                        var parentCombo = boundlist.ownerCmp,
                                            record = parentCombo.getWidgetRecord(),
                                            employerWorkLocationId = record.get('employerWorkLocationId'),
                                            workLocation = Ext.Array.findBy(record.get('workLocations'), wl => wl && wl.employerWorkLocationId === employerWorkLocationId);

                                        parentCombo.suspendEvents(false);

                                        boundlist.store.clearFilter();

                                        boundlist.store.setFilters(
                                            {
                                                property : 'workLocationId',
                                                value : workLocation ? workLocation.workLocationId : 0,
                                                operator : '='
                                            }
                                        );

                                        parentCombo.resumeEvents();
                                    }
                                }
                            }
                        },
                        onWidgetAttach : (column, widget, record) => {
                            let store = Ext.create('criterion.data.Store', {
                                type : 'memory',
                                fields : [
                                    {
                                        name : 'id',
                                        type : 'integer'
                                    },
                                    {
                                        name : 'workLocationId',
                                        type : 'integer'
                                    },
                                    {
                                        name : 'code',
                                        type : 'string'
                                    },
                                    {
                                        name : 'nameWithCode',
                                        type : 'string',
                                        persist : false,
                                        calculate : data => data.code + ' - ' + data.name
                                    },
                                    {
                                        name : 'name',
                                        type : 'string'
                                    }
                                ],
                                sorters : [
                                    {
                                        property : 'name',
                                        direction : 'ASC'
                                    }
                                ]
                            });

                            store.add(Ext.clone(record.get('workLocationAreas')));
                            widget.setStore(store);
                            setWidgetUniqSelector(widget, '__' + column.dataIndex + '_' + record.get('employeeId') + '_' + record.get('sorter'));
                        }
                    });
                }

                if (timesheetType.get('isShowProject')) {
                    layoutColumns.push(
                        {
                            xtype : 'widgetcolumn',
                            text : timesheetType.get('labelProject') || i18n.gettext('Project'),
                            dataIndex : 'projectId',
                            sortable : false,
                            menuDisabled : true,
                            flex : 1,
                            minWidth : 150,
                            widget : {
                                xtype : 'combobox',
                                ui : 'mini',
                                margin : '5 0 0 0',
                                forceSelection : true,
                                editable : true,
                                anyMatch : true,
                                matchFieldWidth : false,
                                listConfig : {
                                    minWidth : 145
                                },
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'name',
                                listeners : {
                                    scope : 'controller',
                                    change : (cmp, value) => {
                                        let record = cmp.getWidgetRecord();

                                        if (!cmp || cmp.destroyed || !cmp.getWidgetRecord) {
                                            return;
                                        }

                                        record.set(cmp.getWidgetColumn().dataIndex, value);

                                        me.fireEvent('projectChange', record.getId(), value);
                                    },
                                    focusenter : focusEnter,
                                    focusleave : focusLeave
                                }
                            },
                            onWidgetAttach : (column, widget, record) => {
                                let recId = record.getId(),
                                    store = Ext.create('criterion.data.Store', {
                                        type : 'memory',
                                        fields : [
                                            {
                                                name : 'id',
                                                type : 'integer'
                                            },
                                            {
                                                name : 'name',
                                                type : 'string'
                                            },
                                            {
                                                name : 'description',
                                                type : 'string'
                                            },
                                            {
                                                name : 'code',
                                                type : 'string'
                                            }
                                        ],
                                        sorters : [
                                            {
                                                property : 'name',
                                                direction : 'ASC'
                                            }
                                        ]
                                    });

                                store.add(Ext.clone(record.get('projects')));
                                widget.setStore(store);

                                setWidgetUniqSelector(widget, '__employeeProject_' + recId);
                            }
                        }
                    );
                }

                if (timesheetType.get('isShowTasks')) {
                    layoutColumns.push(
                        {
                            xtype : 'widgetcolumn',
                            text : timesheetType.get('labelTask') || i18n.gettext('Task'),
                            dataIndex : 'taskId',
                            sortable : false,
                            menuDisabled : true,
                            flex : 1,
                            minWidth : 150,
                            widget : {
                                xtype : 'combobox',
                                ui : 'mini',
                                margin : '5 0 0 0',
                                forceSelection : true,
                                editable : true,
                                anyMatch : true,
                                matchFieldWidth : false,
                                listConfig : {
                                    minWidth : 145,
                                    listeners : {
                                        show : function(boundlist) {
                                            let parentCombo = boundlist.ownerCmp,
                                                record = parentCombo.getWidgetRecord(),
                                                workLocationAreaId = record.get('workLocationAreaId'),
                                                projectId = record.get('projectId');

                                            parentCombo.suspendEvents(false);

                                            boundlist.store.clearFilter();

                                            boundlist.store.setFilters([{
                                                filterFn : record => {
                                                    let workLocationAreaIds = record.get('workLocationAreaIds'),
                                                        recordProjectId = record.get('projectId'),
                                                        recordIsActive = record.get('isActive');

                                                    return (workLocationAreaId && !projectId ? (workLocationAreaIds.length ? Ext.Array.contains(workLocationAreaIds, workLocationAreaId) : true) : true) &&
                                                        (projectId ? (recordProjectId === projectId && recordIsActive) : (!recordProjectId && recordIsActive && (!workLocationAreaId ? !workLocationAreaIds.length : true)));
                                                }
                                            }]);

                                            parentCombo.resumeEvents();
                                        }
                                    }
                                },
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'descriptionWithCode',
                                tpl : Ext.create('Ext.XTemplate',
                                    '<ul class="x-list-plain"><tpl for=".">',
                                    '<li role="option" class="x-boundlist-item">{[this.getTaskName(values)]}</li>',
                                    '</tpl></ul>', {
                                        getTaskName : function(val) {
                                            return `${val['code']} - ${val['description'] || val['name']}`;
                                        }
                                    }),
                                displayTpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{[this.getDescriptionOrCode(values)]}',
                                    '</tpl>', {
                                        getDescriptionOrCode : function(val) {
                                            return val['description'] || val['code'];
                                        }
                                    }
                                ),
                                listeners : {
                                    scope : 'controller',
                                    change : (cmp, value) => {
                                        let record = cmp.getWidgetRecord(),
                                            taskRec = cmp.getSelection(),
                                            classificationCodesAndValues = taskRec && taskRec.get('classificationCodesAndValues');

                                        if (!cmp || cmp.destroyed || !cmp.getWidgetRecord) {
                                            return;
                                        }

                                        record.set(cmp.getWidgetColumn().dataIndex, value);

                                        classificationCodesAndValues && classificationCodesAndValues.length && me.fireEvent('taskRecordChanges', record.getId(), classificationCodesAndValues);
                                    },
                                    focusenter : focusEnter,
                                    focusleave : focusLeave
                                }
                            },
                            onWidgetAttach : (column, widget, record) => {
                                let recId = record.getId(),
                                    store = Ext.create('criterion.data.Store', {
                                        type : 'memory',
                                        fields : [
                                            {
                                                name : 'id',
                                                type : 'integer'
                                            },
                                            {
                                                name : 'name',
                                                type : 'string'
                                            },
                                            {
                                                name : 'description',
                                                type : 'string'
                                            },
                                            {
                                                name : 'code',
                                                type : 'string'
                                            },
                                            {
                                                name : 'descriptionWithCode',
                                                type : 'string',
                                                persist : false,
                                                calculate : data => data.code + ' - ' + data.description
                                            },
                                            {
                                                name : 'workLocationAreaIds'
                                            },
                                            {
                                                name : 'projectId',
                                                type : 'integer',
                                                allowNull : true
                                            }
                                        ],
                                        sorters : [
                                            {
                                                property : 'name',
                                                direction : 'ASC'
                                            }
                                        ]
                                    });

                                store.add(Ext.clone(record.get('tasks')));
                                widget.setStore(store);

                                setWidgetUniqSelector(widget, '__employeeTask_' + recId);
                                //setWidgetUniqSelector(widget, '__employeeTask_' + record.get('employeeId') + '_' + record.get('sorter'));
                            }
                        }
                    );
                }

                columns = [
                    {
                        xtype : 'criterion_widgetcolumn',
                        width : 40,
                        menuDisabled : true,
                        sortable : false,
                        widget : {
                            xtype : 'button',
                            glyph : criterion.consts.Glyph['plus-round'],
                            tooltip : i18n.gettext('Add'),
                            cls : 'criterion-btn-transparent addBtn',
                            listeners : {
                                scope : this,
                                click : function(cmp) {
                                    me.fireEvent('addNewTaskLine', cmp.getWidgetRecord());
                                }
                            }
                        },
                        onWidgetAttach : function(column, widget, record) {
                            let vm = column.up('criterion_employee_timesheet_dashboard').getViewModel();

                            if (!vm.get('firstBtnId')) {
                                vm.set('firstBtnId', widget.getId());
                            }
                            widget[record.get('sorter') ? 'hide' : 'show']();
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee'),
                        dataIndex : 'fullName',
                        menuDisabled : true,
                        sortable : false,
                        flex : 2,
                        minWidth : 200
                    },

                    {
                        xtype : 'widgetcolumn',
                        text : i18n.gettext('Paycode'),
                        dataIndex : 'paycodeId',
                        sortable : false,
                        menuDisabled : true,
                        flex : 1,
                        minWidth : 150,
                        widget : {
                            xtype : 'criterion_employee_timesheet_income_combo',
                            ui : 'mini',
                            margin : '5 0 0 0',
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 145
                            },
                            forceSelection : false,
                            editable : true,
                            anyMatch : true,
                            queryMode : 'local',
                            valueField : 'id',
                            displayField : 'name',
                            listeners : {
                                scope : 'controller',
                                change : 'handlePaycodeChange',
                                focusenter : focusEnter,
                                focusleave : focusLeave
                            }
                        },
                        onWidgetAttach : (column, widget, record) => {
                            let store,
                                paycodeId = record.get('paycodeId'),
                                isNotIncome = paycodeId && parseInt(paycodeId.split('-')[0], 10) !== criterion.Consts.PAYCODE.INCOME;

                            if (record.get('_markNew') || isNotIncome) {
                                store = Ext.create('criterion.store.employee.timesheet.Incomes', {
                                    type : 'memory',
                                    sorters : [
                                        {
                                            property : 'name',
                                            direction : 'ASC'
                                        }
                                    ]
                                });
                            } else {
                                store = Ext.create('criterion.store.employee.timesheet.Incomes', {
                                    type : 'memory',
                                    sorters : [
                                        {
                                            property : 'name',
                                            direction : 'ASC'
                                        }
                                    ],
                                    filters : [
                                        {
                                            property : 'paycode',
                                            value : criterion.Consts.PAYCODE.INCOME,
                                            exactMatch : true
                                        }
                                    ]
                                });
                            }

                            store.add(Ext.clone(record.get('paycodes')));

                            if (paycodeId && !store.getById(paycodeId) && record.get('paycodeDetail')) {
                                // if paycode is absent - need to add
                                store.add(Ext.Object.merge(Ext.clone(record.get('paycodeDetail')), {
                                    availableDates : []
                                }));
                            }

                            let groupCodes = {};
                            store.each(function(incomeCode) {
                                if (!groupCodes[incomeCode.get('paycode')]) {
                                    groupCodes[incomeCode.get('paycode')] = true;
                                    incomeCode.set('isFirstInGroup', true);
                                }
                            });

                            widget.setStore(store);
                            setWidgetUniqSelector(widget, '__' + column.dataIndex + '_' + record.get('employeeId') + '_' + record.get('sorter'));

                            if (!record.get('_markNew') && paycodeId) {
                                widget.setDisabled(isNotIncome);
                            } else {
                                widget.setDisabled(false);
                            }

                            if (paycodeId && paycodeId == widget.getValue()) {
                                // Ext reuse widgets, so if combo has same payCode as needed, it's change event wouldn't fire, but we still need setup row by new paycode
                                me.fireEvent('setupRowByPayCode', widget, paycodeId);
                            }
                        }
                    },

                    ...layoutColumns,

                    ...customFieldsColumns,

                    ...daysColumns,

                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'totalHours',
                        text : i18n.gettext('Total Hours'),
                        encodeHtml : false,
                        minWidth : 130,
                        hidden : false,
                        renderer : function(value) {
                            return value !== null ? criterion.Utils.timeObjToStr(criterion.Utils.hourStrParse((value || 0) + '', true)) : '';
                        },
                        bind : {
                            hidden : '{hideHours}'
                        }
                    },

                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'totalDays',
                        text : i18n.gettext('Total Days'),
                        encodeHtml : false,
                        minWidth : 130,
                        hidden : true,
                        renderer : function(value) {
                            return value !== null ? (value || 0) : '';
                        },
                        bind : {
                            hidden : '{!hideHours}'
                        }
                    }
                ];
            }

            this.reconfigure(store, columns);
        },

        getHoursDaysColumn : function(isManualDay, index, focusEnter, focusLeave) {
            let me = this,
                fieldName = isManualDay ? 'day{0}days' : 'day{0}hours',
                fieldType = isManualDay ? 'numberfield' : 'textfield';

            return {
                xtype : 'widgetcolumn',
                dataIndex : Ext.String.format(fieldName, index),
                dayIndex : index,
                width : 90,
                cls : 'day_header',
                hidden : true,
                menuDisabled : true,
                sortable : false,
                bind : {
                    text : '{day' + index + 'label}',
                    hidden : '{!day' + index + 'label}'
                },
                widget : {
                    xtype : fieldType,
                    ui : 'mini',
                    margin : '5 0 0 0',
                    listeners : {
                        blur : (cmp) => {
                            if (!cmp || cmp.destroyed || !cmp.getWidgetRecord) {
                                return;
                            }

                            let value = cmp.getValue(),
                                hasError = false,
                                parsed,
                                hours,
                                minutes,
                                cmpRecord = cmp.getWidgetRecord(),
                                cmpColumn = cmp.getWidgetColumn(),
                                dateHours = cmpRecord.get('dateHours'),
                                date = cmpRecord.get('_' + cmpColumn.dayIndex + 'day');

                            if (isManualDay) {
                                cmpRecord.set(
                                    Ext.String.format('day{0}days', cmpColumn.dayIndex),
                                    value
                                );

                                let changed = false,
                                    cleared = false;

                                Ext.Array.each(dateHours, (dateHour) => {
                                    if (dateHour.date === date) {
                                        if (value) {
                                            dateHour.hours = null;
                                            dateHour.days = value;
                                            changed = true;
                                        } else {
                                            // clear value
                                            dateHour.hours = null;
                                            dateHour.days = null;

                                            cleared = true;
                                        }
                                    }
                                });

                                if (cleared)
                                    cmpRecord.set(cmpColumn.dataIndex, null);

                                if (!changed) {
                                    dateHours.push({
                                        date : date,
                                        hours : null,
                                        days : value
                                    });
                                }

                                me.fireEvent('recalculateTotalDays', cmpRecord.get('employeeId'));
                            } else {
                                if (value.search('d|h|m') > -1) {
                                    parsed = criterion.Utils.parseDuration(value, false, true);
                                    hours = parsed.hours;
                                    minutes = parsed.minutes;
                                } else if (value.indexOf(':') > -1) {
                                    parsed = value.split(':');
                                    hours = parseInt(parsed[0], 10);
                                    minutes = parseInt(parsed[1], 10);
                                } else {
                                    if (value) {
                                        parsed = criterion.Utils.hoursToDuration(value);
                                        hours = parsed.hours;
                                        minutes = parsed.minutes;
                                    } else {
                                        // clear value
                                        Ext.Array.each(dateHours, (dateHour) => {
                                            if (dateHour.date === date) {
                                                dateHour.hours = null;
                                                dateHour.days = null;
                                            }
                                        });
                                        cmpRecord.set(cmpColumn.dataIndex, null);
                                    }
                                }

                                if (!isNaN(hours) || !isNaN(minutes)) {
                                    let timeObj = {
                                            hours : isNaN(hours) ? 0 : parseInt(hours, 10),
                                            minutes : isNaN(minutes) ? 0 : parseInt(minutes, 10)
                                        },
                                        hValue = timeObj.hours + timeObj.minutes / 60;

                                    cmpRecord.set(cmpColumn.dataIndex, criterion.Utils.dateTimeObjToStr(criterion.Utils.hoursToDuration(hValue)));

                                    let changed = false;

                                    Ext.Array.each(dateHours, (dateHour) => {
                                        if (dateHour.date === date) {
                                            dateHour.hours = hValue;
                                            dateHour.days = null;
                                            changed = true;
                                        }
                                    });

                                    if (!changed) {
                                        dateHours.push({
                                            date : date,
                                            hours : hValue,
                                            days : null
                                        });
                                    }

                                } else {
                                    hasError = true;
                                }

                                if (value && hasError) {
                                    cmp.markInvalid(i18n.gettext('Wrong format, should be : \'12:45\', \'1h 20m\', \'1h\', \'20m\''));
                                }

                                me.fireEvent('recalculateTotalHours', cmpRecord.get('employeeId'));
                            }
                        },
                        focusenter : focusEnter,
                        focusleave : focusLeave
                    }
                },
                onWidgetAttach : (column, widget, record) => {
                    setWidgetUniqSelector(widget, '__timeField_' + record.get('employeeId') + '_' + record.get('sorter'));
                    widget.dayIndex = column.dayIndex;
                }
            };
        }
    }
});
