Ext.define('criterion.view.ess.time.TimeOffDashboard', function() {

    return {

        alias : 'widget.criterion_selfservice_time_time_off_dashboard',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.time.TimeOffDashboard',
            'criterion.view.ess.time.dashboard.timeOffHistory.TimeOffList',
            'criterion.view.ess.time.dashboard.timeOffHistory.TimeOffCharts',
            'criterion.view.ess.time.dashboard.TimeOffCalendar',
            'criterion.store.employer.WorkLocations',
            'criterion.store.employee.timeOff.AvailableTypes',
            'Ext.menu.DatePicker'
        ],

        viewModel : {
            data : {
                activeViewIdx : 0,
                managerMode : false,
                date : new Date(),
                year : (new Date()).getFullYear(),
                showTaken : false,
                showTimeOffTypeIds : null
            },
            formulas : {
                isList : function(get) {
                    return get('activeViewIdx') === 0;
                },
                titleText : function(get) {
                    return get('managerMode') ? i18n.gettext('Team Time Offs') : i18n.gettext('My Time Offs')
                },
                textDate : function(get) {
                    var today = Ext.Date.format(new Date(), criterion.Consts.UI_DATE_FORMAT.SHORT_DATE),
                        date = Ext.Date.format(get('date'), criterion.Consts.UI_DATE_FORMAT.SHORT_DATE);

                    return date === today ? i18n.gettext('Today') : date;
                }
            },
            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                availableTimeOffType : {
                    type : 'criterion_employee_time_off_available_types',
                    filters : [
                        {
                            filterFn : function(record) {
                                return !parseInt(record.get('attribute5')); // 'hideInEss' param
                            }
                        }
                    ]
                }
            }
        },

        layout : 'card',

        cls : 'criterion-selfservice-time-time-off-dashboard',

        frame : true,

        ui : 'no-footer',

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        bind : {
            activeItem : '{activeViewIdx}'
        },

        controller : {
            type : 'criterion_selfservice_time_time_off_dashboard'
        },

        header : {
            title : {
                height : 0
            },

            layout : {
                type : 'vbox',
                align : 'stretch'
            },

            items : [
                {
                    xtype : 'container',

                    layout : {
                        type : 'hbox',
                        align : 'top'
                    },

                    items : [
                        {
                            xtype : 'component',

                            cls : 'plain-header-title',
                            margin : '7 0 0 10',
                            bind : {
                                html : '{titleText}'
                            }
                        },
                        {
                            xtype : 'button',
                            ui : 'secondary',
                            text : i18n.gettext('Back'),
                            margin : '5 0 0 10',
                            handler : 'handleReturnToTeamDashboard',
                            hidden : true,
                            bind : {
                                hidden : '{!managerMode}'
                            }
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Options'),
                            ui : 'feature',
                            handler : 'handleOptions',
                            margin : '4 10 0 0',
                            bind : {
                                disabled : '{rebuildState}',
                                tooltip : '{employeeGroupsList}',
                                hidden : '{isList}'
                            }
                        },
                        {
                            xtype : 'tbfill'
                        },
                        {
                            xtype : 'tbfill',
                            hidden : true,
                            bind : {
                                hidden : '{!managerMode}'
                            }
                        },
                        {
                            xtype : 'component',
                            html : i18n.gettext('Balance as of: '),
                            margin : '8 10 0 0',
                            style : {
                                fontSize : '13px',
                                fontWeight : 600,
                                color : '#787c85'
                            }
                        },
                        {
                            xtype : 'button',
                            ui : 'secondary',
                            arrowVisible : false,
                            margin : '4 0 0 0',
                            glyph : criterion.consts.Glyph['android-calendar'],
                            iconAlign : 'right',
                            bind : {
                                text : '{textDate}'
                            },
                            menuAlign : 't-b',
                            menu : {
                                xtype : 'datemenu',
                                listeners : {
                                    scope : 'controller',
                                    select : 'handleDateSelect'
                                }
                            }
                        },
                        {
                            xtype : 'tbfill'
                        },
                        {
                            xtype : 'combobox',
                            fieldLabel : i18n.gettext('Employee'),
                            labelWidth : 80,
                            margin : '4 20 0 0',
                            ui : 'secondary',
                            hidden : true,
                            bind : {
                                store : '{teamTimeOffs}',
                                value : '{teamTimeOffEmployeeId}',
                                hidden : '{!managerMode}'
                            },
                            queryMode : 'local',
                            displayField : 'employeeName',
                            valueField : 'id',
                            editable : false,
                            listeners : {
                                change : 'handleTimeOffEmployeeChange'
                            }
                        },
                        {
                            xtype : 'button',
                            ui : 'feature',
                            text : i18n.gettext('Add time off'),
                            margin : '4 10 0 0',
                            handler : 'handleAddClick'
                        },
                        {
                            xtype : 'button',
                            scale : 'medium',
                            reference : 'legendToggle',
                            enableToggle : true,
                            cls : 'criterion-btn-glyph-only',
                            glyph : criterion.consts.Glyph['ios7-help-outline'],
                            bind : {
                                pressed : '{showLegend}',
                                tooltip : '{legendButtonText}',
                                hidden : '{isList}'
                            }
                        },
                        {
                            xtype : 'tbspacer'
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-glyph-only',
                            tooltip : i18n.gettext('Show Calendar'),
                            scale : 'medium',
                            glyph : criterion.consts.Glyph['android-calendar'],
                            margin : '-2 0 0 0',
                            handler : 'handleSwitchToCalendarView',
                            bind : {
                                hidden : '{!isList}'
                            }
                        },
                        {
                            xtype : 'tbspacer'
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-glyph-only',
                            glyph : criterion.consts.Glyph['grid'],
                            tooltip : i18n.gettext('Show Grid'),
                            scale : 'medium',
                            handler : 'handleSwitchToGridView',
                            bind : {
                                hidden : '{isList}'
                            }
                        },
                        {
                            xtype : 'tbspacer'
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-glyph-only',
                            glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                            scale : 'medium',
                            listeners : {
                                click : 'handleRefreshClick'
                            },
                            bind : {
                                hidden : '{!isList}'
                            }
                        }
                    ]
                },
                {
                    xtype : 'criterion_selfservice_time_dashboard_time_off_history_time_off_charts',
                    reference : 'charts',
                    bind : {
                        hidden : '{!isList}'
                    }
                },
                {
                    xtype : 'toolbar',
                    layout : {
                        type : 'hbox',
                        align : 'bottom'
                    },
                    padding : 0,
                    bind : {
                        hidden : '{!isList}'
                    },
                    items : [
                        {
                            xtype : 'button',
                            enableToggle : true,
                            pressed : true,
                            allowDepress : false,
                            toggleGroup : 'timeOffList',
                            reference : 'showPlannedButton',
                            text : i18n.gettext('Planned'),
                            cls : 'criterion-plain-toggle-btn',
                            listeners : {
                                click : 'showPlanned'
                            }
                        },
                        {
                            xtype : 'button',
                            enableToggle : true,
                            allowDepress : false,
                            toggleGroup : 'timeOffList',
                            reference : 'showTakenButton',
                            text : i18n.gettext('Taken'),
                            cls : 'criterion-plain-toggle-btn',
                            listeners : {
                                click : 'showTaken'
                            }
                        },
                        '->',
                        {
                            xtype : 'button',
                            glyph : criterion.consts.Glyph['ios7-arrow-left'],
                            ui : 'secondary',
                            listeners : {
                                click : 'onYearPrev'
                            }
                        },
                        {
                            xtype : 'component',
                            cls : 'year',
                            bind : {
                                html : '{year}'
                            }
                        },
                        {
                            xtype : 'button',
                            glyph : criterion.consts.Glyph['ios7-arrow-right'],
                            ui : 'secondary',
                            listeners : {
                                click : 'onYearNext'
                            }
                        }
                    ]
                }
            ]
        },

        initComponent() {
            let controller = this.getController();

            this.items = this.items || [
                {
                    xtype : 'criterion_selfservice_time_dashboard_time_off_history_time_off_list',
                    reference : 'history',
                    listeners : {
                        editorShow : () => controller.setOpacityEditorShow(),
                        editorDestroy : () => controller.setOpacityEditorDestroy(),
                        switchToTaken : () => controller.switchToTaken(),
                        switchToPlanned : () => controller.switchToPlanned()
                    }
                },
                {
                    xtype : 'criterion_selfservice_time_dashboard_time_off_calendar',
                    reference : 'calendar'
                },
                {
                    html : Ext.util.Format.format('<p>{0}</p>', i18n.gettext('No assignments found. Assign employee to a position before manage Time Offs.')),
                    margin : 10
                }
            ];

            this.callParent(arguments);
        }
    };

});
