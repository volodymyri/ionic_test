Ext.define('criterion.view.employee.timesheet.dashboard.Options', function() {

    var TIMESHEET_OPTION_PERIOD = criterion.Consts.TIMESHEET_OPTION_PERIOD,
        ALL_PERIODS_REC_ID = -100;

    function getNameWithEmployer(isBlank, name, employerId, text) {
        if (isBlank) {
            return text
        }

        var employers = Ext.StoreManager.lookup('Employers'),
            employer = employers.getById(employerId);

        if (employers.count() > 1 && employer) {
            name += Ext.util.Format.format(' [{0}]', employer.get('legalName'));
        }

        return name
    }

    return {

        extend : 'criterion.ux.form.Panel',

        alias : 'widget.criterion_employee_timesheet_dashboard_options',

        requires : [
            'criterion.controller.employee.timesheet.dashboard.Options'
        ],

        controller : {
            type : 'criterion_employee_timesheet_dashboard_options'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        closable : true,
        draggable : false,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        title : i18n.gettext('Timesheet Options'),

        initialOptions : null,

        viewModel : {
            data : {
                // use main view's vm data
            },
            formulas : {
                isPredefinedCustom : function(data) {
                    return data('options.period') !== TIMESHEET_OPTION_PERIOD.PAY_PERIOD.value && data('options.period') !== TIMESHEET_OPTION_PERIOD.DATE_RANGE.value;
                },
                filterEmployerId : function(data) {
                    let timesheetTypeId = data('options.timesheetTypeId'),
                        timesheetType = timesheetTypeId && data('timesheetTypes').getById(timesheetTypeId);

                    return timesheetType ? timesheetType.get('employerId') : data('employerId');
                }
            }
        },

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                listeners : {
                    scope : 'controller',
                    click : 'onCancel'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Apply'),
                listeners : {
                    scope : 'controller',
                    click : 'onSelect'
                }
            }
        ],

        items : [
            {
                xtype : 'extended_combo',
                reference : 'timesheetType',
                fieldLabel : i18n.gettext('Timesheet Layout'),
                bind : {
                    store : '{timesheetTypes}',
                    value : '{options.timesheetTypeId}'
                },
                valueField : 'id',
                displayField : 'name',
                tpl : Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain"><tpl for=".">',
                    '<li role="option" class="x-boundlist-item">{[this.getName(values.isBlank, values.name, values.employerId, values.text)]}</li>',
                    '</tpl></ul>',
                    {
                        getName : getNameWithEmployer
                    }),
                displayTpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '{[this.getName(values.isBlank, values.name, values.employerId, values.text)]}',
                    '</tpl>',
                    {
                        getName : getNameWithEmployer
                    }
                ),
                queryMode : 'local',
                listeners : {
                    scope : 'controller',
                    change : 'handleLayoutChange'
                },
                forceSelection : true,
                editable : true,
                anyMatch : true,
                allowBlank : true
            },
            {
                xtype : 'criterion_tagfield',
                fieldLabel : i18n.gettext('Employee Groups'),
                bind : {
                    store : '{employeeGroups}',
                    value : '{options.employeeGroupIds}',
                    filters : [
                        {
                            property : 'employerId',
                            value : '{filterEmployerId}',
                            exactMatch : true
                        }
                    ]
                },
                growMax : 100,
                queryMode : 'local',
                valueField : 'id',
                displayField : 'nameWithEmployer'
            },

            {
                xtype : 'combo',
                fieldLabel : i18n.gettext('Period'),
                reference : 'periodCombo',
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
                editable : false,
                allowBlank : false,
                sortByDisplayField : false,
                listeners : {
                    scope : 'controller',
                    change : 'handlePeriodChange'
                }
            },

            {
                xtype : 'combo',
                fieldLabel : i18n.gettext('Payroll Schedule'),
                reference : 'payrollSchedule',
                bind : {
                    value : '{options.payrollScheduleId}',
                    hidden : '{!options.period || options.isCustomPeriod}',
                    disabled : '{options.isCustomPeriod}',
                    store : '{payrollSchedules}',
                    filters : [
                        {
                            property : 'employerId',
                            value : '{filterEmployerId}',
                            exactMatch : true
                        }
                    ]
                },
                hidden : true,
                valueField : 'id',
                displayField : 'name',
                queryMode : 'local',
                editable : false,
                allowBlank : false,
                listeners : {
                    scope : 'controller',
                    change : 'onPayrollScheduleChange'
                }
            },
            {
                xtype : 'extended_combo',
                reference : 'payrollPeriod',
                fieldLabel : i18n.gettext('Payroll Period'),
                bind : {
                    store : '{payrollPeriods}',
                    hidden : '{!options.period || options.isCustomPeriod || !options.payrollScheduleId}',
                    disabled : '{options.isCustomPeriod}',
                    value : '{options.payrollPeriodId}'
                },
                hidden : true,
                valueField : 'id',
                editable : false,
                allowBlank : false,
                forceSelection : false,
                queryMode : 'local',
                tpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '<tpl if="id == ' + ALL_PERIODS_REC_ID + ' ">',
                    '<div class="x-boundlist-item">' + i18n.gettext('Show all periods...') + '</div>',
                    '<tpl elseif="periodStartDate">',
                    '<div class="x-boundlist-item">{number}, {periodStartDate:date("m/d/Y")} to {periodEndDate:date("m/d/Y")}</div>',
                    '<tpl else>',
                    '<div class="x-boundlist-item">' + i18n.gettext('Not selected') + '</div>',
                    '</tpl>',
                    '</tpl>'
                ),
                displayTpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '<tpl if="periodStartDate">',
                    '{number}, {periodStartDate:date("m/d/Y")} to {periodEndDate:date("m/d/Y")}',
                    '<tpl else>',
                    i18n.gettext('Not selected'),
                    '</tpl>',
                    '</tpl>'
                ),
                listeners : {
                    beforeselect : function(combo, record) {
                        let store = combo.getStore();

                        if (record.getId() === ALL_PERIODS_REC_ID) {
                            store.clearFilter();
                            store.remove(record);
                            return false;
                        }
                    }
                }
            },
            {
                xtype : 'datefield',
                reference : 'startDate',
                fieldLabel : i18n.gettext('Start Date'),
                hidden : true,
                bind : {
                    hidden : '{!options.period || !options.isCustomPeriod}',
                    disabled : '{!options.isCustomPeriod}',
                    value : '{options.startDate}',
                    readOnly : '{isPredefinedCustom}'
                },
                allowBlank : false,
                maxWidth : criterion.Consts.UI_DEFAULTS.DATE_ITEM_WIDTH
            },
            {
                xtype : 'datefield',
                reference : 'endDate',
                fieldLabel : i18n.gettext('End Date'),
                hidden : true,
                bind : {
                    hidden : '{!options.period || !options.isCustomPeriod}',
                    disabled : '{!options.isCustomPeriod}',
                    value : '{options.endDate}',
                    readOnly : '{isPredefinedCustom}'
                },
                allowBlank : false,
                maxWidth : criterion.Consts.UI_DEFAULTS.DATE_ITEM_WIDTH
            }

        ]
    }
});
