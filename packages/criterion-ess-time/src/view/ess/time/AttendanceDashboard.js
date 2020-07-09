Ext.define('criterion.view.ess.time.AttendanceDashboard', function() {

    const ATTENDANCE_DASHBOARD_MODE = criterion.Consts.ATTENDANCE_DASHBOARD_MODE;

    return {

        alias : 'widget.criterion_selfservice_time_attendance_dashboard',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.ess.time.AttendanceDashboard',
            'criterion.store.employee.attendance.Dashboard',
            'criterion.store.employee.attendance.Overtime',
            'criterion.view.ess.time.attendanceDashboard.PeriodWidget',
            'criterion.view.ess.time.attendanceDashboard.HoursBarWidget',
            'criterion.store.EmployeeGroups',
            'criterion.ux.grid.column.TimePeriod',
            'criterion.ux.form.field.Search',
            'Ext.menu.DatePicker'
        ],


        controller : {
            type : 'criterion_selfservice_time_attendance_dashboard'
        },

        viewModel : {
            data : {
                date : Ext.Date.clearTime(new Date()),
                employeeGroupIds : [],
                employee : null,

                dailyHrsGrt : null,
                weeklyHrsGrt : null,
                shiftGapGrt : null,
                isCurrentlyWorking : false,

                hideScheduledHours : false,
                hideVariance : false,

                mode : ATTENDANCE_DASHBOARD_MODE.OVERTIME,

                columnsVariance : [
                    {
                        xtype : 'gridcolumn',
                        width : 200,
                        text : i18n._('Last Name'),
                        dataIndex : 'lastName'
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 200,
                        text : i18n._('First Name'),
                        dataIndex : 'firstName'
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 150,
                        text : i18n._('Employee ID'),
                        dataIndex : 'employeeNumber',
                        hidden : true
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 150,
                        encodeHtml : false,
                        text : i18n._('Hours (Total)'),
                        dataIndex : 'totalTimesheetHours',
                        renderer : (value, record) => Ext.util.Format.employerAmountPrecision(value)
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 180,
                        text : i18n._('Hours (Scheduled)'),
                        dataIndex : 'scheduledHours',
                        bind : {
                            hidden : '{hideScheduledHours}'
                        },
                        renderer : (value, record) => Ext.util.Format.employerAmountPrecision(value)
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 120,
                        text : i18n._('Variance'),
                        dataIndex : 'variance',
                        bind : {
                            hidden : '{hideVariance}'
                        },
                        encodeHtml : false,
                        renderer : (value, record) => {
                            let val = Ext.util.Format.employerAmountPrecision(value);

                            return val < 0 ? '<span class="criterion-red">' + val + '</span>' : val;
                        }
                    },
                    {
                        xtype : 'criterion_time_period_column',
                        flex : 1,
                        minWidth : 300,
                        widget : {
                            xtype : 'criterion_selfservice_time_attendance_dashboard_period_widget',
                            listeners : {
                                editException : 'handleEditEmployeeException'
                            }
                        },
                        menuDisabled : true,
                        hideable : false,
                        editable : false,
                        ignore : true,
                        onWidgetAttach : (column, widget, record) => {
                            widget.setAdRecord(record);
                        }
                    }
                ],

                columnsOvertime : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n._('Last Name'),
                        dataIndex : 'lastName'
                    },
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n._('First Name'),
                        dataIndex : 'firstName'
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 150,
                        text : i18n._('Employee ID'),
                        dataIndex : 'employeeNumber',
                        hidden : true
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 150,
                        text : i18n._('Title'),
                        dataIndex : 'employeeTitle',
                        hidden : true
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 150,
                        encodeHtml : false,
                        text : i18n._('Shift Gap'),
                        dataIndex : 'shiftGap',
                        renderer : (value, record) => Ext.util.Format.employerAmountPrecision(value)
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 150,
                        encodeHtml : false,
                        text : i18n._('Hours (Day)'),
                        dataIndex : 'hoursDay',
                        renderer : (value, record) => Ext.util.Format.employerAmountPrecision(value)
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 180,
                        text : i18n._('Hours (Week)'),
                        dataIndex : 'hoursWeek',
                        renderer : (value, record) => Ext.util.Format.employerAmountPrecision(value)
                    },
                    {
                        xtype : 'criterion_widgetcolumn',
                        width : 200,
                        text : i18n._('Hours Bar (Day)'),
                        widget : {
                            xtype : 'criterion_selfservice_time_attendance_dashboard_hours_bar_widget'
                        },
                        menuDisabled : true,
                        hideable : false,
                        editable : false,
                        ignore : true,
                        sortable : false,
                        resizable : false,
                        onWidgetAttach : (column, widget, record) => {
                            widget.setRec(record.getDay());
                        }
                    },
                    {
                        xtype : 'criterion_widgetcolumn',
                        width : 200,
                        text : i18n._('Hours Bar (Week)'),
                        widget : {
                            xtype : 'criterion_selfservice_time_attendance_dashboard_hours_bar_widget'
                        },
                        menuDisabled : true,
                        hideable : false,
                        editable : false,
                        ignore : true,
                        sortable : false,
                        resizable : false,
                        onWidgetAttach : (column, widget, record) => {
                            widget.setRec(record.getWeek());
                        }
                    }
                ]
            },

            stores : {
                attendanceDashboard : {
                    type : 'criterion_employee_attendance_dashboard',
                    proxy : {
                        extraParams : {
                            date : '{date:date("Y.m.d")}'
                        }
                    },
                    filters : [
                        {
                            property : 'fullName',
                            value : '{searchValue}',
                            operator : 'like'
                        }
                    ]
                },
                attendanceOvertime : {
                    type : 'criterion_employee_attendance_overtime',
                    proxy : {
                        extraParams : {
                            date : '{date:date("Y.m.d")}'
                        }
                    },
                    filters : [
                        {
                            property : 'fullName',
                            value : '{searchValue}',
                            operator : 'like'
                        }
                    ]
                },
                employeeGroups : {
                    type : 'criterion_employee_groups'
                }
            },

            formulas : {
                searchValue : data => {
                    let employee = data('employee');

                    return employee ? employee : ' ';
                },

                enableGlobalException : data => !!data('employeeGroupIds').length,

                isOvertime : data => data('mode') === ATTENDANCE_DASHBOARD_MODE.OVERTIME,

                columns : data => data('isOvertime') ? data('columnsOvertime') : data('columnsVariance'),

                store : data => data('isOvertime') ? data('attendanceOvertime') : data('attendanceDashboard'),

                employeeGroupsList : data => {
                    let employeeGroupIds = data('employeeGroupIds'),
                        store = data('employeeGroups');

                    if (!store.isLoaded() || !employeeGroupIds.length) {
                        return '';
                    }

                    let employeeGroups = [];

                    Ext.each(employeeGroupIds, function(id) {
                       let employeeGroup = store.getById(id);
                       if (employeeGroup) {
                           employeeGroups.push(employeeGroup.get('name'));
                       }
                    });

                    return employeeGroups.length ? criterion.Utils.generateTipRow(i18n.gettext('Employee Groups'), employeeGroups.join(', ')) : '';
                },

                overtimeParams : data => {
                    return data('employeeGroupsList') +
                        (data('dailyHrsGrt') ? criterion.Utils.generateTipRow(i18n.gettext('Daily Hours Greater than'), data('dailyHrsGrt')) : '') +
                        (data('weeklyHrsGrt') ? criterion.Utils.generateTipRow(i18n.gettext('Weekly Hours Greater than'), data('weeklyHrsGrt')) : '') +
                        (data('shiftGapGrt') ? criterion.Utils.generateTipRow(i18n.gettext('Shift Gap Greater than'), data('shiftGapGrt')) : '') +
                        (data('isCurrentlyWorking') ? criterion.Utils.generateTipRow(i18n.gettext('Currently Working'), i18n.gettext('Yes')) : '')
                }
            }
        },

        header : {
            title : {
                text : i18n._('Attendance Dashboard'),
                minimizeWidth : true
            },

            items : [
                {
                    xtype : 'criterion_splitbutton',
                    text : i18n._('Options'),
                    ui : 'feature',
                    width : 150,
                    handler : 'handleOptionsVariance',
                    hidden : true,
                    bind : {
                        tooltip : '{employeeGroupsList}',
                        hidden : '{isOvertime}'
                    },
                    menu : [
                        {
                            text : i18n._('Global Exception'),
                            handler : 'handleGlobalException',
                            disabled : true,
                            bind : {
                                disabled : '{!enableGlobalException}'
                            }
                        }
                    ]
                },
                {
                    xtype : 'button',
                    text : i18n._('Options'),
                    ui : 'feature',
                    handler : 'handleOptionsOvertime',
                    hidden : true,
                    bind : {
                        tooltip : '{overtimeParams}',
                        hidden : '{!isOvertime}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'dateSelector',
                    arrowVisible : false,
                    ui : 'secondary',
                    glyph : criterion.consts.Glyph['android-calendar'],
                    iconAlign : 'right',
                    bind : {
                        text : '{date:date()}'
                    },
                    menuAlign : 't-b',
                    menu : {
                        xtype : 'datemenu',
                        listeners : {
                            select : 'dateSelectorSelect',
                            show : 'dateSelectorShow'
                        }
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
                    bind : {
                        value : '{employee}'
                    }
                },
                {
                    xtype : 'combobox',
                    hideLabel : true,
                    sortByDisplayField : false,
                    editable : false,
                    encodeHtml : true,
                    store : Ext.create('Ext.data.Store', {
                        fields : ['text', 'value'],
                        data : [
                            {
                                text : i18n.gettext('Overtime'), value : ATTENDANCE_DASHBOARD_MODE.OVERTIME
                            },
                            {
                                text : i18n.gettext('Variance'), value : ATTENDANCE_DASHBOARD_MODE.VARIANCE
                            }
                        ]
                    }),
                    bind : {
                        value : '{mode}'
                    },
                    margin : '0 0 0 20',
                    width : 140,
                    displayField : 'text',
                    valueField : 'value',
                    queryMode : 'local',
                    forceSelection : true,
                    autoSelect : true
                }
            ]
        },

        bind : {
            store : '{store}',
            columns : '{columns}'
        },

        tbar : null,

        listeners : {
            changeDate : 'handleChangeDate'
        },

        viewConfig : {
            stripeRows : true
        },

        columns : []
    };

});
