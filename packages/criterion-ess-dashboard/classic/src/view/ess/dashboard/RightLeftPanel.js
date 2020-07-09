Ext.define('criterion.view.ess.dashboard.RightLeftPanel', function() {

    return {

        extend : 'Ext.container.Container',

        alias : 'widget.criterion_selfservice_dashboard_right_left_panel',

        requires : [
            'criterion.controller.ess.dashboard.RightLeftPanel'
        ],

        cls : 'criterion-selfservice-dashboard-right-left-panel',

        layout : {
            type : 'vbox',
            align : 'center'
        },

        config : {
            hiddenByResponsive : false
        },

        scrollable : false,

        padding : 0,

        controller : {
            type : 'criterion_selfservice_dashboard_right_left_panel'
        },

        items : [
            {
                xtype : 'panel',

                header : {
                    title : i18n.gettext('Attendance'),
                    listeners : {
                        scope : 'controller',
                        click : 'gotoTimesheets'
                    },
                    cls : 'cursor-pointer'
                },

                cls : 'info-panel-element attendance',
                iconCls : 'icon-attendance',

                collapsible : true,
                titleCollapse : true,

                width : '100%',
                margin : '0 0 12 0',

                layout : {
                    type : 'vbox',
                    align : 'center'
                },

                hidden : true,

                bind : {
                    hidden : '{!attendanceEnabled}'
                },

                items : [
                    {
                        xtype : 'component',
                        cls : 'month-year',
                        padding : '0 10',
                        html : Ext.Date.format(new Date(), 'F, Y')
                    },
                    {
                        xtype : 'dataview',

                        bind : {
                            store : '{attendanceStore}'
                        },

                        padding : '0 10 10 12',

                        itemSelector : 'div.data',

                        tpl : new Ext.XTemplate(
                            '<tpl for=".">' +
                            '<div class="data' +
                            '<tpl if="endOfWeek"> end-of-week</tpl>' +
                            '<tpl if="isDayName"> day-name</tpl>' +
                            '<tpl if="isWeekend"> weekend</tpl>' +
                            '<tpl if="hasHours"> has-hours</tpl>">' +
                            '<div class="date">{dateValue}</div>' +
                            '<div class="hours">{hoursValue}</div>' +
                            '</div>' +
                            '</tpl>'
                        )
                    }
                ]
            },

            {
                xtype : 'panel',
                header : {
                    title : i18n.gettext('Upcoming Time Off'),
                    listeners : {
                        scope : 'controller',
                        click : 'gotoTimeOffs'
                    },
                    cls : 'cursor-pointer'
                },

                cls : 'info-panel-element upcoming-time-off',
                iconCls : 'icon-upcoming-time-offs',

                collapsible : true,
                titleCollapse : true,

                width : '100%',
                margin : '0 0 12 0',
                bodyPadding : '0 18',

                layout : {
                    type : 'vbox',
                    align : 'center'
                },

                hidden : true,
                bind : {
                    hidden : '{!upcomingTimeOffEnabled}'
                },

                items : [
                    {
                        xtype : 'component',

                        html : i18n.gettext('You have no upcoming time offs'),

                        cls : 'empty-text',

                        margin : '10 0 30 0',

                        bind : {
                            hidden : '{!!upcomingTimeOff}'
                        }
                    },
                    {
                        xtype : 'container',

                        layout : {
                            type : 'vbox',

                            align : 'begin'
                        },

                        margin : '0 0 20 0',

                        hidden : true,

                        bind : {
                            hidden : '{!upcomingTimeOff}'
                        },

                        items : [
                            {
                                xtype : 'component',

                                cls : 'description',

                                margin : '3 0 10 0',

                                bind : {
                                    html : '{upcomingTimeOff.description}'
                                }
                            },
                            {
                                xtype : 'container',

                                layout : {
                                    type : 'hbox'
                                },

                                items : [
                                    {
                                        xtype : 'container',

                                        layout : 'vbox',

                                        width : 110,

                                        items : [
                                            {
                                                xtype : 'component',

                                                cls : 'date-title',

                                                html : i18n.gettext('Start:'),

                                                margin : '0 0 6 0'
                                            },
                                            {
                                                xtype : 'component',

                                                bind : {
                                                    html : '<span class="start-date">{upcomingTimeOff.startDate:date}</span>'
                                                }
                                            },
                                            {
                                                xtype : 'component',

                                                hidden : true,

                                                bind : {
                                                    html : '<span class="start-time">{upcomingTimeOff.startDate:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}</span>',

                                                    hidden : '{upcomingTimeOff.isFullDay}'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'component',

                                        html : '<span class="grey-line"></span>',

                                        width : 21,

                                        margin : '30 45 0 18'
                                    },
                                    {
                                        xtype : 'container',

                                        layout : 'vbox',

                                        width : 110,

                                        items : [
                                            {
                                                xtype : 'component',

                                                cls : 'date-title',

                                                html : i18n.gettext('End:'),

                                                margin : '0 0 6 0'
                                            },
                                            {
                                                xtype : 'component',

                                                bind : {
                                                    html : '<span class="end-date">{upcomingTimeOff.endDate:date}</span>'
                                                }
                                            },
                                            {
                                                xtype : 'component',

                                                hidden : true,

                                                bind : {
                                                    html : '<span class="end-time">{upcomingTimeOff.endDate:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}</span>',

                                                    hidden : '{upcomingTimeOff.isFullDay}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'panel',

                header : {
                    title : i18n.gettext('My Pay'),
                    listeners : {
                        scope : 'controller',
                        click : 'gotoPayrolls'
                    },
                    cls : 'cursor-pointer'
                },

                cls : 'info-panel-element my-pay',

                iconCls : 'icon-pay',

                collapsible : true,

                collapsed : true,

                titleCollapse : true,

                width : '100%',

                margin : '0 0 12 0',

                layout : {
                    type : 'vbox',

                    align : 'center'
                },

                hidden : true,

                bind : {
                    hidden : '{!myPayEnabled}'
                },

                bodyPadding : '9 22 0',

                items : [
                    {
                        xtype : 'component',

                        html : i18n.gettext('Pay data is missing'),

                        cls : 'empty-text',

                        margin : '10 0 30 0',

                        bind : {
                            hidden : '{!!myPay}'
                        }
                    },
                    {
                        xtype : 'container',

                        layout : {
                            type : 'hbox'
                        },

                        hidden : true,

                        bind : {
                            hidden : '{!myPay}'
                        },

                        items : [
                            {
                                xtype : 'container',

                                layout : 'vbox',

                                width : 110,

                                items : [
                                    {
                                        xtype : 'component',

                                        cls : 'date-title',

                                        html : i18n.gettext('Last pay date:'),

                                        margin : '0 0 6 0'
                                    },
                                    {
                                        xtype : 'component',

                                        bind : {
                                            html : '<span class="last-pay-date">{myPay.lastPayDate}</span>'
                                        }
                                    },
                                    {
                                        xtype : 'component',

                                        bind : {
                                            html : '<span class="net-pay">' + i18n.gettext('Net') + ': {myPay.lastPayNet}</span>'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'component',

                                html : '<span class="grey-line-vertical"></span>',

                                width : 1,

                                height : 69,

                                margin : '0 42 0 28'
                            },
                            {
                                xtype : 'container',

                                layout : 'vbox',

                                width : 110,

                                items : [
                                    {
                                        xtype : 'component',

                                        cls : 'date-title',

                                        html : i18n.gettext('Next pay date:'),

                                        margin : '0 0 6 0'
                                    },
                                    {
                                        xtype : 'component',

                                        bind : {
                                            html : '<span class="next-pay-date">{myPay.nextPayDate}</span>'
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

                header : {
                    title : i18n.gettext('Events'),
                    listeners : {
                        scope : 'controller',
                        click : 'gotoEvents'
                    },
                    cls : 'cursor-pointer'
                },

                cls : 'info-panel-element events',

                iconCls : 'icon-events',

                collapsible : true,

                titleCollapse : true,

                width : '100%',

                margin : 0,

                bodyPadding : '15 15 0',

                hidden : true,

                bind : {
                    hidden : '{!eventsEnabled}'
                },

                items : [
                    {
                        xtype : 'dataview',

                        emptyText : Ext.String.format('<div class="empty-text">{0}</div>', i18n.gettext('No events are planned')),

                        bind : {
                            store : '{eventsStore}'
                        },

                        itemSelector : 'div.data',

                        tpl : new Ext.XTemplate(
                            '<tpl for=".">' +
                            '<div class="data">' +
                            '<div class="date">{date:date}</div>' +
                            '<div class="title">{companyEventName}</div>' +
                            '<div class="description">{description}</div>' +
                            '</div>' +
                            '</tpl>'
                        )
                    }
                ]
            }
        ],

        updateHiddenByResponsive : function(value) {
            let vm = this.getViewModel(),
                attendanceEnabled = vm ? vm.get('attendanceEnabled') : false,
                upcomingTimeOffEnabled = vm ? vm.get('upcomingTimeOffEnabled') : false,
                myPayEnabled = vm ? vm.get('myPayEnabled') : false,
                eventsEnabled = vm ? vm.get('eventsEnabled') : false;

            if (value) {
                this.hide();
            } else {
                this.setVisible(!attendanceEnabled && !upcomingTimeOffEnabled && !myPayEnabled && !eventsEnabled);
            }
        }
    }

});
