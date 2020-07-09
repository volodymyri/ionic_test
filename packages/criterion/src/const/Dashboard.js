Ext.require('criterion.consts.Api', function () {

    var API = criterion.consts.Api.API;

    Ext.define('criterion.consts.Dashboard', function () {

        return {
            singleton : true,

            VIEW : {
                SMALL_CHARTS : 1,
                LARGE_CHARTS : 2,
                VALUES : 3
            },

            // see https://criterion.atlassian.net/browse/CRITERION-868
            CHART_COLORS : [
                '#2EA4E6',
                '#F4788A',
                '#EFB16C',
                '#9CC772',
                '#D67FD3',

                '#DD664D',
                '#1FCFB7',
                '#46A8DB',
                '#FCB150',
                '#E64C65',
                '#BF77DA',
                '#A0D654',
                '#7F6FE4',
                '#1879FD',
                '#EDE740'
            ],

            VALUE_COLORS : [
                '#F4788A',
                '#EFB16C',
                '#9CC772'
            ],

            getChartTypes : function() {
                return {
                    LINE : {
                        name : 'Line',
                        title : i18n.gettext('Line')
                    },
                    AREA : {
                        name : 'Area',
                        title : i18n.gettext('Area')
                    },
                    PIE : {
                        name : 'Pie',
                        title : i18n.gettext('Pie')
                    },
                    BAR : {
                        name : 'Bar',
                        title : i18n.gettext('Bar')
                    },
                    BAR_STACKED : {
                        name : 'Bar Stacked',
                        title : i18n.gettext('Bar Stacked')
                    }
                };
            },

            getValueMetrics : function(metric_id) {
                var dateFieldLabel = Ext.util.Format.format(i18n.gettext('Date {0}(leave blank for auto set today){1}'), '<p class="tipForLabel">', '</p>'),
                    VALUE_METRICS = [
                        {
                            id : 1,
                            name : i18n.gettext('Employed Person Count'),
                            url : API.DASHBOARD_PERSON_TOTAL_EMPLOYED,
                            type : 'integer',
                            additionalParams : {
                                date : {
                                    xtype : 'datefield',
                                    fieldLabel : dateFieldLabel,
                                    name : 'date'
                                }
                            }
                        },
                        {
                            id : 2,
                            name : i18n.gettext('Total Person Count'),
                            url : API.DASHBOARD_PERSON_TOTAL,
                            type : 'integer',
                            additionalParams : {
                                date : {
                                    xtype : 'datefield',
                                    fieldLabel : dateFieldLabel,
                                    name : 'date'
                                }
                            }
                        },
                        {
                            id : 3,
                            name : i18n.gettext('Completed Person Percent'),
                            url : API.DASHBOARD_PERSON_COMPLETE,
                            type : '%',
                            additionalParams : {
                                date : {
                                    xtype : 'datefield',
                                    fieldLabel : dateFieldLabel,
                                    name : 'date'
                                }
                            }
                        },
                        {
                            id : 4,
                            name : i18n.gettext('Revenue/FTE'),
                            url : API.DASHBOARD_REVENUE_TO_FTE,
                            type : 'currency',
                            additionalParams : {
                                revenue : {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Revenue'),
                                    minValue : 0.01,
                                    name : 'revenue',
                                    allowBlank : false
                                }
                            }
                        },
                        {
                            id : 5,
                            name : i18n.gettext('Turnover rate'),
                            url : API.DASHBOARD_TURNOVER_RATE,
                            type : '%',
                            additionalParams : {
                                date : {
                                    xtype : 'datefield',
                                    fieldLabel : dateFieldLabel,
                                    name : 'date'
                                }
                            }
                        },
                        {
                            id : 6,
                            name : i18n.gettext('Average Age'),
                            url : API.DASHBOARD_AVERAGE_AGE,
                            type : 'float'
                        },
                        {
                            id : 7,
                            name : i18n.gettext('Absence Rate'),
                            url : API.DASHBOARD_ABSENCE_RATE,
                            type : '%',
                            additionalParams : {
                                date : {
                                    xtype : 'datefield',
                                    fieldLabel : dateFieldLabel,
                                    name : 'date'
                                }
                            }
                        },
                        {
                            id : 9,
                            name : i18n.gettext('Active Employees'),
                            url : API.DASHBOARD_ACTIVE_EMPLOYEES,
                            type : 'integer'
                        },
                        {
                            id : 10,
                            name : i18n.gettext('Active Positions'),
                            url : API.DASHBOARD_ACTIVE_POSITIONS,
                            type : 'integer'
                        },
                        {
                            id : 11,
                            name : i18n.gettext('Overtime Hours MTD'),
                            url : API.DASHBOARD_OVERTIME_HOURS_MONTHLY,
                            type : '%',
                            additionalParams : {
                                employerId : {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    allowBlank : true
                                }
                            }
                        },
                        // TODO: revert after resolving performance issue D2-12139
                        /*{
                            id : 12,
                            name : i18n.gettext('Overtime Hours YTD'),
                            url : API.DASHBOARD_OVERTIME_HOURS_YEARLY,
                            type : '%',
                            additionalParams : {
                                employerId : {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    allowBlank : true
                                }
                            }
                        },*/
                        {
                            id : 13,
                            name : i18n.gettext("Worker's Comp Claims YTD"),
                            url : API.DASHBOARD_COMPENSATION_CLAIMS,
                            type : 'integer',
                            additionalParams : {
                                employerId : {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    allowBlank : true
                                }
                            }
                        },
                        {
                            id : 14,
                            name : i18n.gettext('Hours Lost Due to Injury YTD'),
                            url : API.DASHBOARD_INJURY_LOST_HOURS,
                            type : 'integer',
                            additionalParams : {
                                employerId : {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    allowBlank : true
                                }
                            }
                        },
                        {
                            id : 15,
                            name : i18n.gettext("Worker's Comp Costs YTD"),
                            url : API.DASHBOARD_COMPENSATION_COSTS,
                            type : 'currency',
                            additionalParams : {
                                employerId : {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    allowBlank : true
                                }
                            }
                        },
                        {
                            id : 16,
                            name : i18n.gettext('Overdue Onboarding Tasks Count'),
                            url : API.DASHBOARD_ONBOARDING_EMPLOYER_OVERDUES_COUNT,
                            type : 'integer',
                            additionalParams : {
                                employerId : {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    allowBlank : true
                                }
                            }
                        }
                    ];

                if (metric_id) {
                    return this.findMetricById(VALUE_METRICS, metric_id);
                }

                return VALUE_METRICS;
            },

            getChartMetrics : function(metric_id) {
                var dateFieldLabel = Ext.util.Format.format(i18n.gettext('Date {0}(leave blank for auto set today){1}'), '<p class="tipForLabel">', '</p>'),
                    limitFieldLabel = i18n.gettext('Number of Departments'),
                    CHART_TYPES = this.getChartTypes(),
                    CHART_METRICS = [
                        {
                            id : 11,
                            name : i18n.gettext('Total Person Count'),
                            url : API.DASHBOARD_PERSON_STATS,
                            precision : 0,
                            mapping : {
                                value : 'count',
                                title : 'title'
                            },
                            sortCfg : {
                                property : 'title',
                                direction : 'ASC'
                            },
                            availableCharts : [
                                CHART_TYPES.PIE, CHART_TYPES.BAR
                            ]
                        },
                        {
                            id : 12,
                            name : i18n.gettext('Total Person Count Historical'),
                            url : API.DASHBOARD_PERSON_TOTAL_EMPLOYED_HISTORY,
                            precision : 0,
                            mapping : {
                                value : 'count',
                                title : 'date'
                            },
                            sortCfg : {
                                property : 'date',
                                direction : 'ASC'
                            },
                            additionalParams : {
                                from : {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('Start Date'),
                                    name : 'from',
                                    allowBlank : false
                                },
                                to : {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('End Date'),
                                    name : 'to',
                                    allowBlank : false
                                }
                            },
                            availableCharts : [
                                CHART_TYPES.LINE, CHART_TYPES.AREA
                            ]
                        },
                        {
                            id : 13,
                            name : i18n.gettext('Monthly Hires and Termination'),
                            url : API.DASHBOARD_MONTHLY_HIRES_AND_TERMINATION,
                            precision : 0,
                            mapping : {
                                value : [
                                    'terminated', 'hired'
                                ],
                                title : 'date'
                            },
                            sortCfg : {
                                property : 'date',
                                direction : 'ASC'
                            },
                            additionalParams : {
                                date : {
                                    xtype : 'datefield',
                                    fieldLabel : dateFieldLabel,
                                    name : 'date'
                                }
                            },
                            availableCharts : [
                                CHART_TYPES.BAR_STACKED
                            ]
                        },
                        {
                            id : 14,
                            name : i18n.gettext('Employee Count By Gender'),
                            url : API.DASHBOARD_GROUPED_PERSONS_BY_GENDER,
                            mapping : {
                                value : 'count',
                                title : 'title'
                            },
                            sortCfg : {
                                property : 'title',
                                direction : 'ASC'
                            },
                            availableCharts : [
                                CHART_TYPES.PIE
                            ]
                        },
                        {
                            id : 15,
                            name : i18n.gettext('Employee Count By Ethnic Group'),
                            url : API.DASHBOARD_GROUPED_PERSONS_BY_ETHNICITY,
                            mapping : {
                                value : 'count',
                                title : 'title'
                            },
                            sortCfg : {
                                property : 'title',
                                direction : 'ASC'
                            },
                            availableCharts : [
                                CHART_TYPES.PIE
                            ]
                        },
                        {
                            id : 16,
                            name : i18n.gettext('Employee Count by Department'),
                            url : API.DASHBOARD_EMPLOYEE_COUNT_BY_DEPARTMENT,
                            precision : 0,
                            mapping : {
                                value : 'count',
                                title : 'title'
                            },
                            additionalParams : {
                                limit : {
                                    xtype : 'numberfield',
                                    fieldLabel : limitFieldLabel,
                                    allowBlank : false,
                                    minValue : 1,
                                    maxValue : 10,
                                    name : 'limit'
                                }
                            },
                            availableCharts : [
                                CHART_TYPES.BAR
                            ]
                        },
                        {
                            id : 17,
                            name : i18n.gettext('Overdue Onboarding Tasks Count'),
                            url : API.DASHBOARD_ONBOARDING_EMPLOYEE_OVERDUES_COUNT,
                            axisOnlyInteger : true,
                            mapping : {
                                value : 'count',
                                title : 'employeeName'
                            },
                            type : 'integer',
                            additionalParams : {
                                employerId : {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    allowBlank : true
                                }
                            },
                            availableCharts : [
                                CHART_TYPES.BAR
                            ]
                        }
                    ];

                if (metric_id) {
                    return this.findMetricById(CHART_METRICS, metric_id);
                }

                return CHART_METRICS;
            },

            findMetricById : function(array, value) {
                return Ext.Array.findBy(array, function(item) {
                    return item['id'] === value
                });
            }
        }
    });

});
