Ext.define('criterion.view.employer.TimeOffPlan', function() {

    const API = criterion.consts.Api,
        DICT = criterion.consts.Dict,
        DAYS_OF_WEEK = criterion.Consts.DAYS_OF_WEEK,
        ACCRUAL_PERIOD_CODE = criterion.Consts.ACCRUAL_PERIOD_CODE,
        ACCRUAL_METHOD_TYPE_CODE = criterion.Consts.ACCRUAL_METHOD_TYPE_CODE,
        PERIOD_TYPE = criterion.Consts.PERIOD_TYPE;

    return {

        alias : 'widget.criterion_employer_time_off_plan',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.employer.timeOffPlan.Types',
            'criterion.controller.employer.TimeOffPlan'
        ],

        viewModel : {
            data : {
                yearEndDate : null,
                /*
                 @type  criterion.model.employer.TimeOffPlan
                 Parent TimeOff plan
                 */
                record : null
            },

            formulas : {

                // methods

                isFiscal : data => data('record.accrualMethodTypeCode') === ACCRUAL_METHOD_TYPE_CODE.FISCAL,

                isAnniversary : data => data('record.accrualMethodTypeCode') === ACCRUAL_METHOD_TYPE_CODE.ANNIV,

                isNonAccruing : data => data('record.accrualMethodTypeCode') === ACCRUAL_METHOD_TYPE_CODE.NA,

                // periods

                isWeekly : data => data('record.accrualPeriodCode') === ACCRUAL_PERIOD_CODE.WEEKLY,

                isAnnual : data => data('record.accrualPeriodCode') === ACCRUAL_PERIOD_CODE.ANNUAL,

                isBiWeekly : data => data('record.accrualPeriodCode') === ACCRUAL_PERIOD_CODE.BI_WEEKLY,

                isQuarterly : data => data('record.accrualPeriodCode') === ACCRUAL_PERIOD_CODE.QUARTERLY,

                //

                hideCarryover : data => data('isNonAccruing'),

                showOdd : data => data('isBiWeekly'),

                hideStartDayMonth : data => {
                    let result = (data('isBiWeekly') || data('isWeekly') || data('isQuarterly')) || data('isAnniversary') || data('isAnnual');

                    return result === null || result;
                },

                hideStartDayWeek : data => {
                    let result = data('isBiWeekly') || data('isWeekly');

                    return result === null || !result || data('isAnnual');
                },

                showProrateFirstPeriod : data => data('isFiscal'),

                showYearEndYear : data => data('isFiscal') && (data('isBiWeekly') || data('isWeekly')),

                yearEndDateEnabled : data => data('isFiscal') || (data('isNonAccruing') && data('record.periodTypeCode') === PERIOD_TYPE.FISCAL),

                month : {
                    get : function(get) {
                        let data = Ext.Date.format(get('record.yearEndDate'), API.DATE_MONTH_DAY); // yearEndDate: "06-11"

                        if (/^(\d){2}-(\d){2}$/.test(data)) {
                            return data.split('-')[0];
                        } else {
                            return '01';
                        }
                    },

                    set : function(value) {
                        this.set('record.yearEndDate', Ext.Date.parse(value + '-' + this.get('day'), API.DATE_MONTH_DAY));
                    }
                },

                day : {
                    get : function(get) {
                        let data = Ext.Date.format(get('record.yearEndDate'), API.DATE_MONTH_DAY);

                        if (/^(\d){2}-(\d){2}$/.test(data)) {
                            return data.split('-')[1];
                        } else {
                            return '01';
                        }
                    },

                    set : function(value) {
                        this.set('record.yearEndDate', Ext.Date.parse(this.get('month') + '-' + value, API.DATE_MONTH_DAY));
                    }
                },

                canAccrue : data => data('record') && data('record.isActive'),

                calculationTitle : data => data('isNonAccruing') ? i18n.gettext('Calculation') : i18n.gettext('Accrual Calculation'),

                inDaysLabel : data => data('isNonAccruing') ? i18n.gettext('In Days') : i18n.gettext('Accrual In Days'),

                formulaeLabel : data => data('isNonAccruing') ? i18n.gettext('Allowed per Year') : i18n.gettext('Accrual Formulae')

            },
            stores : {
                timeOffPlanTypes : {
                    type : 'criterion_employer_time_off_plan_types'
                },

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
                }
            }
        },

        controller : {
            type : 'criterion_employer_time_off_plan',
            externalUpdate : false
        },

        listeners : {
            scope : 'controller',
            loadRecord : 'handleLoadRecord'
        },

        autoScroll : true,

        bodyPadding : 0,

        items : [
            {
                xtype : 'criterion_panel',

                header : {
                    title : i18n.gettext('Time Off Plan Details'),

                    defaults : {
                        margin : '0 10 0 0'
                    },

                    items : [
                        {
                            xtype : 'button',
                            handler : 'handleShowFormulasForm',
                            cls : 'criterion-btn-feature',
                            glyph : criterion.consts.Glyph['android-list'],
                            tooltip : i18n.gettext('Formulas')
                        }
                    ]
                },

                bodyPadding : '0 10',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                disabled : true,
                                name : 'employerId',
                                hideTrigger : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Code'),
                                bind : '{record.code}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                bind : '{record.name}'
                            },
                            {
                                xtype : 'criterion_code_detail_field_multi_select',
                                fieldLabel : i18n.gettext('Time Off Type'),
                                reference : 'timeOffTypesCombo',
                                codeDataId : DICT.TIME_OFF_TYPE,
                                editable : false,
                                allowBlank : false,
                                bind : {
                                    readOnly : '{!isPhantom}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Accrual Method'),
                                reference : 'accrualMethod',
                                codeDataId : DICT.ACCRUAL_METHOD_TYPE,
                                bind : {
                                    value : '{record.accrualMethodTypeCd}',
                                    readOnly : '{!isPhantom}'
                                },
                                listeners : {
                                    change : 'onAccrualMethodChange'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Accrual Period'),
                                reference : 'accrualPeriod',
                                codeDataId : DICT.ACCRUAL_PERIOD,
                                bind : {
                                    value : '{record.accrualPeriodCd}',
                                    readOnly : '{!isPhantom}',
                                    hidden : '{isNonAccruing}',
                                    allowBlank : '{isNonAccruing}'
                                },
                                listeners : {
                                    change : 'onAccrualPeriodChange'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Active'),
                                bind : '{record.isActive}'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Potential'),
                                bind : {
                                    value : '{record.showPotential}',
                                    hidden : '{isNonAccruing}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Allow Negative'),
                                disabled : true,
                                bind : {
                                    value : '{record.allowNegative}',
                                    hidden : '{isNonAccruing}',
                                    disabled : '{!isPhantom}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Include Holidays'),
                                hidden : true,
                                bind : {
                                    value : '{record.isIncludeHolidays}',
                                    hidden : '{!isNonAccruing}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Include Closed Days'),
                                hidden : true,
                                bind : {
                                    value : '{record.isIncludeClosedDays}',
                                    hidden : '{!isNonAccruing}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('All Day Only'),
                                bind : '{record.isAllDayOnly}'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Notes Optional'),
                                bind : {
                                    value : '{record.notesOptional}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Period Type'),
                                reference : 'periodType',
                                codeDataId : DICT.PERIOD_TYPE,
                                hidden : true,
                                bind : {
                                    value : '{record.periodTypeCd}',
                                    readOnly : '{!isPhantom}',
                                    hidden : '{!isNonAccruing}',
                                    allowBlank : '{!isNonAccruing}'
                                }
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Year End'),
                                layout : 'hbox',
                                anchor : '100%',
                                bind : {
                                    disabled : '{!yearEndDateEnabled}',
                                    hidden : '{!yearEndDateEnabled}'
                                },
                                hidden : true,
                                items : [
                                    {
                                        xtype : 'numberfield',
                                        margin : {right : 5},
                                        hidden : true,
                                        reference : 'yearEndYear',
                                        flex : 1,
                                        minValue : 1970,
                                        bind : {
                                            value : '{record.yearEndYear}',
                                            hidden : '{!showYearEndYear}'
                                        },
                                        listeners : {
                                            change : 'onYearChange'
                                        }
                                    },

                                    {
                                        xtype : 'combobox',
                                        valueField : 'month',
                                        reference : 'yearEndMonth',
                                        sortByDisplayField : false,
                                        disableDirtyCheck : true,
                                        editable : false,
                                        bind : {
                                            value : '{month}'
                                        },
                                        flex : 1,
                                        margin : {right : 5},
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['month', 'text'],
                                            data : Ext.Array.map(criterion.Consts.MONTHS_ARRAY, (item, index) => ({
                                                month : Ext.String.leftPad((index + 1), 2, '0'),
                                                text : item
                                            }))
                                        }),

                                        listeners : {
                                            change : 'onMonthChange'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        reference : 'yearEndDate',
                                        valueField : 'day',
                                        allowBlank : false,
                                        sortByDisplayField : false,
                                        disableDirtyCheck : true,
                                        editable : false,
                                        bind : {
                                            value : '{day}'
                                        },
                                        flex : 1,
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['day', 'text'],
                                            data : Ext.Array.map(criterion.Utils.range(1, 31), item => {
                                                let day = Ext.String.leftPad(item, 2, '0');

                                                return {day : day, text : day};
                                            })
                                        })
                                    }
                                ]
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Income'),
                                layout : 'hbox',
                                margin : '5 0 0 0',
                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        bind : {
                                            value : '{record.incomeCode}'
                                        },
                                        readOnly : true
                                    },
                                    {
                                        xtype : 'button',
                                        scale : 'small',
                                        margin : '0 0 0 3',
                                        cls : 'criterion-btn-light',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        listeners : {
                                            click : 'handleIncomeSearch'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'panel',
                title : i18n.gettext('Limits'),
                bind : {
                    hidden : '{isNonAccruing}'
                },
                items : [
                    {
                        layout : 'hbox',

                        bodyPadding : '0 10',

                        plugins : [
                            'criterion_responsive_column'
                        ],

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Threshold'),
                                        bind : {
                                            value : '{record.expThreshold}',
                                            hidden : '{isNonAccruing}'
                                        }
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Accrual Cap'),
                                        bind : {
                                            value : '{record.expAccrualCap}',
                                            hidden : '{isNonAccruing}'
                                        }
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Negative Cap'),
                                        bind : {
                                            value : '{record.expNegativeCap}',
                                            hidden : '{isNonAccruing}'
                                        }
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Carryover Limit'),
                                        bind : {
                                            hidden : '{hideCarryover}',
                                            value : '{record.expCarryover}',
                                            allowBlank : '{isNonAccruing}'
                                        }
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Carryover Expiry'),
                                        bind : {
                                            hidden : '{hideCarryover}',
                                            value : '{record.carryoverExpireDays}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'panel',
                bind : {
                    title : '{calculationTitle}'
                },
                items : [
                    {
                        layout : 'hbox',

                        bodyPadding : '0 10',

                        plugins : [
                            'criterion_responsive_column'
                        ],

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'combobox',
                                        valueField : 'value',
                                        reference : 'startDayOfWeek',
                                        fieldLabel : i18n.gettext('Start day of week'),
                                        displayField : 'text',
                                        sortByDisplayField : false,
                                        disableDirtyCheck : true,
                                        hidden : true,
                                        editable : false,
                                        bind : {
                                            hidden : '{hideStartDayWeek}',
                                            disabled : '{hideStartDayWeek}',
                                            store : '{weekDays}',
                                            value : '{record.startDayOfWeek}'
                                        },

                                        listeners : {
                                            change : 'onStartDayChange'
                                        }
                                    },

                                    {
                                        xtype : 'combobox',
                                        valueField : 'day',
                                        fieldLabel : i18n.gettext('Start day of month'),
                                        reference : 'startMonthDay',
                                        displayField : 'text',
                                        sortByDisplayField : false,
                                        disableDirtyCheck : true,
                                        hidden : true,
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['day', 'text'],
                                            data : Ext.Array.map(criterion.Utils.range(1, 28), item => ({
                                                day : item,
                                                text : Ext.String.leftPad(item, 2, '0')
                                            }))
                                        }),
                                        bind : {
                                            hidden : '{hideStartDayMonth}',
                                            disabled : '{hideStartDayMonth}',
                                            value : '{record.startDayOfMonth}'
                                        },

                                        editable : false
                                    },

                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Accrue in Advance'),
                                        hidden : true,
                                        bind : {
                                            value : '{record.isAccrualInAdvance}',
                                            readOnly : '{!isPhantom}',
                                            hidden : '{isNonAccruing}'
                                        }
                                    },

                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Maximum per Request'),
                                        hidden : true,
                                        bind : {
                                            hidden : '{!isNonAccruing}',
                                            value : '{record.maxPerRequest}',
                                            allowBlank : '{!isNonAccruing}'
                                        }
                                    },

                                    {
                                        xtype : 'toggleslidefield',
                                        reference : 'isOddWeek',
                                        fieldLabel : i18n.gettext('Odd Week'),
                                        bind : {
                                            value : '{record.isOddWeek}',
                                            hidden : '{!showOdd}',
                                            readOnly : '{!isPhantom}'
                                        },

                                        listeners : {
                                            change : 'onOddWeekChange'
                                        }
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        bind : {
                                            value : '{record.isAccrualInDays}',
                                            fieldLabel : '{inDaysLabel}',
                                            readOnly : '{!isPhantom}'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        valueField : 'value',
                                        fieldLabel : i18n.gettext('Prorate First Period'),
                                        displayField : 'text',
                                        sortByDisplayField : false,
                                        hidden : true,
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['value', 'text'],
                                            data : criterion.Consts.PRORATE_FIRST_PERIOD_TYPE
                                        }),
                                        bind : {
                                            value : '{record.firstPeriodProrateType}',
                                            hidden : '{!showProrateFirstPeriod}',
                                            readOnly : '{!isPhantom}'
                                        },

                                        editable : false
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        padding : '15 25',
                        plugins : [
                            'criterion_responsive_column'
                        ],

                        items : [
                            {
                                defaults : {
                                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                                },
                                flex : 4,
                                padding : "0 30 0 0",
                                items : [
                                    {
                                        xtype : 'textarea',
                                        bind : {
                                            value : '{record.expCalcAccrued}',
                                            fieldLabel : '{formulaeLabel}'
                                        },
                                        width : '100%'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                margin : '0 25'
            },

            {
                xtype : 'container',
                layout : 'hbox',
                padding : '15 25',
                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        flex : 4,
                        padding : "0 30 0 0",
                        layout : 'fit',
                        items : [
                            {
                                xtype : 'criterion_htmleditor',
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                enableAlignments : false,
                                fieldLabel : i18n.gettext('Description'),
                                bind : '{record.description}',
                                width : '100%',
                                frame : false
                            }
                        ]
                    }
                ]
            }
        ]
    };
});
