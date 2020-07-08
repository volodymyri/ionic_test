Ext.define('ess.view.time.teamPunch.FilterForm', function() {

    const TIMESHEET_OPTION_PERIOD = criterion.Consts.TIMESHEET_OPTION_PERIOD;

    return {
        alias : 'widget.ess_modern_time_team_punch_filter_form',

        extend : 'Ext.container.Container',

        requires : [
            'ess.controller.time.teamPunch.FilterForm'
        ],

        controller : {
            type : 'ess_modern_time_team_punch_filter_form'
        },

        viewModel : {
            formulas : {
                isPredefinedCustom : function(data) {
                    return data('options.period') !== TIMESHEET_OPTION_PERIOD.PAY_PERIOD.value && data('options.period') !== TIMESHEET_OPTION_PERIOD.DATE_RANGE.value;
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        scrollable : true,

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : 'Filter Team Timesheets'
            },
            {
                xtype : 'formpanel',
                reference : 'filterForm',
                items : [
                    {
                        xtype : 'criterion_combobox',
                        picker : 'floated',
                        label : i18n.gettext('Timesheet Layout'),
                        bind : {
                            store : '{timesheetTypes}',
                            value : '{options.timesheetTypeId}'
                        },
                        valueField : 'id',
                        displayField : 'nameWithEmployer',
                        required : true,
                        queryMode : 'local',
                        autoSelect : true,
                        listeners : {
                            change : 'handleTimesheetLayoutChange'
                        }
                    },

                    {
                        xtype : 'criterion_field_tagfield',
                        multiSelect : true,
                        displayField : 'name',
                        valueField : 'id',
                        label : 'Employee Groups',
                        bind : {
                            store : '{employeeGroups}',
                            value : '{options.employeeGroupIds}'
                        }
                    },

                    {
                        xtype : 'criterion_combobox',
                        picker : 'floated',
                        label : i18n.gettext('Period'),
                        store : Ext.create('Ext.data.Store', {
                            fields : ['text', 'value'],
                            data : Ext.Object.getValues(TIMESHEET_OPTION_PERIOD)
                        }),
                        bind : {
                            value : '{options.period}'
                        },
                        valueField : 'value',
                        displayField : 'text',
                        queryMode : 'local',
                        required : true,
                        sortByDisplayField : false,
                        listeners : {
                            change : 'handlePeriodChange'
                        }
                    },

                    {
                        xtype : 'criterion_combobox',
                        picker : 'floated',
                        label : i18n.gettext('Payroll Schedule'),
                        reference : 'payrollSchedule',
                        bind : {
                            value : '{options.payrollScheduleId}',
                            hidden : '{!options.period || options.isCustomPeriod}',
                            disabled : '{options.isCustomPeriod}',
                            store : '{payrollSchedules}'
                        },
                        hidden : true,
                        valueField : 'id',
                        displayField : 'name',
                        queryMode : 'local',
                        required : true,
                        listeners : {
                            change : 'handlePayrollScheduleChange'
                        }
                    },
                    {
                        xtype : 'criterion_combobox',
                        picker : 'floated',
                        reference : 'payrollPeriod',
                        label : i18n.gettext('Payroll Period'),
                        bind : {
                            store : '{payrollPeriods}',
                            hidden : '{!options.period || options.isCustomPeriod || !options.payrollScheduleId}',
                            disabled : '{options.isCustomPeriod}',
                            value : '{options.payrollPeriodId}'
                        },
                        hidden : true,
                        displayField : 'number',
                        valueField : 'id',
                        editable : false,
                        required : true,
                        forceSelection : false,
                        queryMode : 'local',
                        itemTpl : '<span class="x-list-label">{number}, {periodStartDate:date("m/d/Y")} to {periodEndDate:date("m/d/Y")}</span>',
                        displayTpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '<tpl if="periodStartDate">',
                            '{number}, {periodStartDate:date("m/d/Y")} to {periodEndDate:date("m/d/Y")}',
                            '<tpl else>',
                            i18n.gettext('Not selected'),
                            '</tpl>',
                            '</tpl>'
                        )
                    },

                    {
                        xtype : 'datefield',
                        reference : 'startDate',
                        label : i18n.gettext('Start Date'),
                        hidden : true,
                        bind : {
                            hidden : '{!options.period || !options.isCustomPeriod}',
                            disabled : '{!options.isCustomPeriod}',
                            value : '{options.startDate}',
                            readOnly : '{isPredefinedCustom}'
                        },
                        required : true
                    },
                    {
                        xtype : 'datefield',
                        reference : 'endDate',
                        label : i18n.gettext('End Date'),
                        hidden : true,
                        bind : {
                            hidden : '{!options.period || !options.isCustomPeriod}',
                            disabled : '{!options.isCustomPeriod}',
                            value : '{options.endDate}',
                            readOnly : '{isPredefinedCustom}'
                        },
                        required : true
                    }
                ]
            },

            {
                xtype : 'container',
                layout : 'hbox',
                margin : '20 20 10 20',
                docked : 'bottom',
                items : [
                    {
                        xtype : 'button',
                        ui : 'act-btn-light',
                        handler : 'handleNext',
                        text : i18n.gettext('Next'),
                        flex : 1
                    }
                ]
            }
        ]
    };
});
