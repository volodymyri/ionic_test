Ext.define('criterion.view.settings.payroll.TimesheetLayout', function() {

    const DICT = criterion.consts.Dict,
        DAYS_OF_WEEK = criterion.Consts.DAYS_OF_WEEK,
        PAY_FREQUENCY_CODE = criterion.Consts.PAY_FREQUENCY_CODE,
        TIMESHEET_LAYOUT_ENTRY_TYPE = criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE;

    return {

        alias : 'widget.criterion_settings_timesheet_layout',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.payroll.TimesheetLayout',
            'criterion.view.settings.payroll.timesheetLayout.BreakConfiguration',
            'criterion.store.employeeGroup.TimesheetTypes',
            'criterion.store.CustomData'
        ],

        controller : {
            type : 'criterion_settings_timesheet_layout',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                weekDays : {
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'value',
                            type : 'int'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ],
                    data : Ext.Object.getKeys(DAYS_OF_WEEK).map(day => ({
                        text : day,
                        value : DAYS_OF_WEEK[day]
                    }))
                },
                monthDays : {
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'day',
                            type : 'int'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ],
                    data : Ext.Array.map(criterion.Utils.range(1, 28), item => ({
                        day : item,
                        text : Ext.String.leftPad(item, 2, '0')
                    }))
                },
                employeeGroupTimesheetTypes : {
                    type : 'criterion_employee_group_timesheet_types'
                },
                customdata : {
                    type : 'criterion_customdata'
                },
                entryTypes : {
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'integer'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ],
                    data : [
                        {
                            id : TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL,
                            text : i18n.gettext('Manual')
                        },
                        {
                            id : TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON,
                            text : i18n.gettext('Button')
                        },
                        {
                            id : TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_AND_BUTTON,
                            text : i18n.gettext('Manual & Button')
                        },
                        {
                            id : TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY,
                            text : i18n.gettext('Manual Day')
                        }
                    ]
                }
            },
            formulas : {
                isVertical : get => get('record.timesheetFormatCode') === criterion.Consts.TIMESHEET_FORMAT.VERTICAL,
                isAggregate : get => get('record.timesheetFormatCode') === criterion.Consts.TIMESHEET_FORMAT.AGGREGATE,

                frequencyFilters : () => ({
                    property : 'attribute2',
                    value : true
                }),
                weekDaysFilters : get => {
                    let frequencyCd = get('record.frequencyCd'),
                        codeDataRecord = frequencyCd && criterion.CodeDataManager.getCodeDetailRecord('id', frequencyCd, DICT.PAY_FREQUENCY);

                    return codeDataRecord && codeDataRecord.get('code') === PAY_FREQUENCY_CODE.SEMI_MONTHLY ? {
                            property : 'text',
                            operator : '<',
                            value : 14
                        } : []
                },
                isWeekly : get => {
                    let frequencyCd = get('record.frequencyCd'),
                        codeDataRecord = frequencyCd && criterion.CodeDataManager.getCodeDetailRecord('id', frequencyCd, DICT.PAY_FREQUENCY);

                    return codeDataRecord && Ext.Array.contains([PAY_FREQUENCY_CODE.WEEKLY, PAY_FREQUENCY_CODE.BI_WEEKLY, PAY_FREQUENCY_CODE.CUSTOM], codeDataRecord.get('code'));
                },
                isCustomFrequency : get => {
                    let frequencyCd = get('record.frequencyCd'),
                        codeDataRecord = frequencyCd && criterion.CodeDataManager.getCodeDetailRecord('id', frequencyCd, DICT.PAY_FREQUENCY);

                    return codeDataRecord && codeDataRecord.get('code') === PAY_FREQUENCY_CODE.CUSTOM;
                },
                isRoundingDisabled : get => {
                    let entryType = get('record.entryType');

                    return get('isAggregate') || entryType === TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY || entryType === TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL;
                },
                showOddWeek : get => {
                    let frequencyCd = get('record.frequencyCd'),
                        codeDataRecord = frequencyCd && criterion.CodeDataManager.getCodeDetailRecord('id', frequencyCd, DICT.PAY_FREQUENCY);

                    return codeDataRecord && codeDataRecord.get('code') === PAY_FREQUENCY_CODE.BI_WEEKLY;
                },
                isAutoPopulateDisabled : get => get('isAggregate'),

                allowAttestationMessage : get => {
                    let entryType = get('record.entryType');

                    return !get('isAggregate') && entryType !== TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY && entryType !== TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL;
                },
                isShowTimeDisabled : data => !data('isVertical') || data('record.entryType') === TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY
            }
        },

        bodyPadding : 0,

        header : {
            title : i18n.gettext('Timesheet Layout Details'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',
                    handler : 'handleShowAlertForm',
                    cls : 'criterion-btn-feature',
                    glyph : criterion.consts.Glyph['android-notifications'],
                    hidden : true,
                    bind : {
                        hidden : '{isAggregate}'
                    }
                },
                {
                    xtype : 'button',
                    handler : 'handleShowSettingsForm',
                    cls : 'criterion-btn-feature',
                    glyph : criterion.consts.Glyph['ios7-pricetags']
                }
            ]
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        modelValidation : true,

        defaults : {
            xtype : 'criterion_panel',
            layout : 'hbox',

            plugins : [
                'criterion_responsive_column'
            ],

            bodyPadding : '0 10',
            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER
        },

        items : [
            {
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
                                bind : {
                                    readOnly : '{!isPhantom}'
                                },
                                allowBlank : false
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.PAY_FREQUENCY,
                                fieldLabel : i18n.gettext('Frequency'),
                                name : 'frequencyCd',
                                bind : {
                                    filters : '{frequencyFilters}',
                                    value : '{record.frequencyCd}',
                                    readOnly : '{!isPhantom}'
                                },
                                allowBlank : false,
                                listeners : {
                                    change : 'handleChangeFrequency'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.TIMESHEET_FORMAT,
                                fieldLabel : i18n.gettext('Layout'),
                                name : 'timesheetFormatCd',
                                bind : {
                                    value : '{record.timesheetFormatCd}',
                                    readOnly : '{!isPhantom}'
                                },
                                allowBlank : false
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Entry Type'),
                                name : 'entryType',
                                valueField : 'id',
                                displayField : 'text',
                                allowBlank : false,
                                editable : false,

                                bind : {
                                    store : '{entryTypes}',
                                    value : '{record.entryType}',
                                    disabled : '{isAggregate}'
                                }
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Time Entry Type'),
                                name : 'isFTE',
                                store : Ext.create('Ext.data.Store', {
                                    fields : ['text', 'value'],
                                    data : [
                                        {
                                            value : false,
                                            text : i18n.gettext('Hours')
                                        },
                                        {
                                            value : true,
                                            text : i18n.gettext('FTEs')
                                        }
                                    ]
                                }),
                                valueField : 'value',
                                allowBlank : false,
                                editable : false,
                                hidden : true,
                                bind : {
                                    value : '{record.isFTE}',
                                    hidden : '{!isAggregate}',
                                    readOnly : '{!isPhantom}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Rounding'),
                                name : 'rounding',
                                allowBlank : false,
                                bind : {
                                    value : '{record.rounding:minutesToShortString}',
                                    disabled : '{isRoundingDisabled}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Attestation Message'),
                                name : 'attestationMessage',
                                maxLength : 256,
                                bind : {
                                    value : '{record.attestationMessage}',
                                    hidden : '{!allowAttestationMessage}',
                                    disabled : '{!allowAttestationMessage}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Auto-populate Hours'),
                                bind : {
                                    value : '{record.isAutopopulateHours}',
                                    disabled : '{isAutoPopulateDisabled}'
                                },
                                name : 'isAutopopulateHours'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Auto Timeoff Approval'),
                                bind : {
                                    value : '{record.isTimeoffAutoapprove}',
                                    disabled : '{isAggregate}'
                                },
                                name : 'isTimeoffAutoapprove'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Enter Time Offs'),
                                bind : {
                                    value : '{record.isEnterTimeoff}'
                                },
                                name : 'isEnterTimeoff'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Enter Holidays'),
                                bind : {
                                    value : '{record.isEnterHoliday}'
                                },
                                name : 'isEnterHoliday'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Time'),
                                hidden : true,
                                bind : {
                                    value : '{record.isShowTime}',
                                    disabled : '{isShowTimeDisabled}',
                                    hidden : '{isShowTimeDisabled}'
                                },
                                name : 'isShowTime'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Odd Week'),
                                bind : {
                                    hidden : '{!showOddWeek}',
                                    disabled : '{!showOddWeek}',
                                    readOnly : '{!isPhantom}'
                                },
                                name : 'isOddWeek'
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Income'),
                                layout : 'hbox',
                                requiredMark : true,
                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        bind : {
                                            value : '{record.incomeCode}'
                                        },
                                        name : 'incomeCode',
                                        readOnly : true
                                    },
                                    {
                                        xtype : 'button',
                                        scale : 'small',
                                        cls : 'criterion-btn-light',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        listeners : {
                                            click : 'handleIncomeSearch'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'criterion_employee_group_combobox',
                                reference : 'employeeGroupCombo',
                                fieldLabel : i18n.gettext('Employee Groups'),
                                objectParam : 'timesheetTypeId',
                                bind : {
                                    valuesStore : '{employeeGroupTimesheetTypes}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'container',

                plugins : null,

                padding : '0 25',

                items : [
                    {
                        xtype : 'component',
                        autoEl : 'hr',
                        cls : 'criterion-horizontal-ruler'
                    }
                ]
            },

            {
                items : [
                    {
                        items : [
                            {
                                xtype : 'timefield',
                                fieldLabel : i18n.gettext('Start Time Of Day'),
                                allowBlank : false,
                                name : 'startTimeOfDay',
                                bind : {
                                    readOnly : '{!isPhantom}',
                                    disabled : '{isAggregate}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Start Day Custom List'),
                                name : 'startDayCustomId',
                                store : criterion.CodeDataManager.getCodeTablesStore(),
                                filters : {
                                    property : 'isCustom',
                                    value : true,
                                    operator : '='
                                },
                                queryMode : 'local',
                                hidden : true,
                                allowBlank : false,
                                readOnly : true,
                                bind : {
                                    value : '{record.startDayCustomId}',
                                    hidden : '{!isCustomFrequency}',
                                    allowBlank : '{!isCustomFrequency}',
                                    readOnly : '{!isPhantom}'
                                },
                                valueField : 'id',
                                displayField : 'name'
                            },
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Start Day Of Week'),
                                name : 'startDayOfWeek',
                                sortByDisplayField : false,
                                bind : {
                                    store : '{weekDays}',
                                    readOnly : '{!isPhantom}'
                                },
                                valueField : 'value',
                                allowBlank : false
                            },
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Start Day Of Month'),
                                name : 'startDayOfMonth',
                                reference : 'startDayOfMonth',
                                bind : {
                                    store : '{monthDays}',
                                    hidden : '{isWeekly}',
                                    disabled : '{isWeekly}',
                                    filters : '{weekDaysFilters}',
                                    readOnly : '{!isPhantom}'
                                },
                                valueField : 'day',
                                allowBlank : false
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'container',

                plugins : null,

                padding : '0 25',

                items : [
                    {
                        xtype : 'component',
                        autoEl : 'hr',
                        cls : 'criterion-horizontal-ruler'
                    }
                ]
            },
            {
                title : i18n.gettext('Break Configuration'),
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                hidden : true,
                bind : {
                    hidden : '{!isVertical}'
                },
                bodyPadding : 0,
                margin : '0 0 20 0',
                plugins : [],
                items : [
                    {
                        xtype : 'criterion_settings_timesheet_layout_break_configuration',
                        reference : 'breaks',
                        flex : 1,
                        margin : 0,
                        padding : 0
                    }
                ]
            },
            {
                title : i18n.gettext('Custom Fields'),
                cls : 'custom-fields-panel',

                items : [
                    {
                        items : [
                            {
                                xtype : 'extended_combobox',
                                name : 'customField1Id',
                                bind : {
                                    store : '{customdata}'
                                },
                                fieldLabel : i18n.gettext('Field 1'),
                                displayField : 'label',
                                valueField : 'id',
                                queryMode : 'local',
                                editable : false,
                                allowBlank : true,
                                disableDirtyCheck : true
                            },
                            {
                                xtype : 'extended_combobox',
                                name : 'customField2Id',
                                bind : {
                                    store : '{customdata}'
                                },
                                fieldLabel : i18n.gettext('Field 2'),
                                displayField : 'label',
                                valueField : 'id',
                                queryMode : 'local',
                                editable : false,
                                allowBlank : true,
                                disableDirtyCheck : true
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'extended_combobox',
                                name : 'customField3Id',
                                bind : {
                                    store : '{customdata}'
                                },
                                fieldLabel : i18n.gettext('Field 3'),
                                displayField : 'label',
                                valueField : 'id',
                                queryMode : 'local',
                                editable : false,
                                allowBlank : true,
                                disableDirtyCheck : true
                            },
                            {
                                xtype : 'extended_combobox',
                                name : 'customField4Id',
                                bind : {
                                    store : '{customdata}'
                                },
                                fieldLabel : i18n.gettext('Field 4'),
                                displayField : 'label',
                                valueField : 'id',
                                queryMode : 'local',
                                editable : false,
                                allowBlank : true,
                                disableDirtyCheck : true
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function() {
            let me = this;

            this.callParent(arguments);
            // defer need because value set by viewmodel + template -> value : '{record.rounding:minutesToShortString}'
            Ext.Function.defer(function() {
                me.down('[name=rounding]').resetOriginalValue();
            }, 100);
        }
    };

});
