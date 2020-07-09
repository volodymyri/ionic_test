Ext.define('criterion.view.ess.Dashboard', function() {

    var RESPONSIVE_RULE = criterion.Consts.UI_CONFIG.RESPONSIVE.RULE;

    return {

        alias : 'widget.criterion_selfservice_dashboard',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.Dashboard',
            'criterion.view.ess.dashboard.Main',
            'criterion.view.ess.dashboard.LeftPanel',
            'criterion.view.ess.dashboard.RightLeftPanel',
            'criterion.view.ess.community.PostEditor',
            'criterion.plugin.LazyItems',
            'criterion.store.dashboard.Attendance',
            'criterion.store.dashboard.UpcomingEvents',
            'Ext.layout.container.Border',
            'Ext.layout.container.Center'
        ],

        layout : {
            type : 'border'
        },

        scrollable : 'vertical',

        controller : {
            type : 'criterion_selfservice_dashboard'
        },

        viewModel : {
            data : {
                upcomingTimeOff : null,
                emptyTimeOff : null,
                myPay : null,
                infoBox : null,
                widgets : 0,
                fullPageMode : false,

                attendanceEnabled : false,
                eventsEnabled : false,
                feedEnabled : false,
                infoBoxEnabled : false,
                linksEnabled : false,
                myPayEnabled : false,
                myTasksEnabled : false,
                myTimeOffsEnabled : false,
                upcomingTimeOffEnabled : false
            },
            stores : {
                attendanceStore : {
                    type : 'criterion_dashboard_attendance'
                },
                eventsStore : {
                    type : 'criterion_dashboard_upcoming_events'
                }
            },
            formulas : function() {
                var widgets = {};

                Ext.Array.each(criterion.Consts.ESS_WIDGETS, function(widget) {
                    widgets[widget.id + 'Enabled'] = function(get) {
                        var widgets = get('widgets');

                        if (!widgets) {
                            return false;
                        }

                        return widget.enabledValue & widgets;
                    };
                });

                return widgets;
            }()
        },

        plugins : [
            {

                ptype : 'criterion_lazyitems',

                items : [
                    {
                        xtype : 'container',

                        cls : 'overflow-visible',

                        layout : 'vbox',

                        region : 'west',

                        responsiveConfig : criterion.Utils.createResponsiveConfig([
                            {
                                rule : RESPONSIVE_RULE.MINIMAL + ' && !' + RESPONSIVE_RULE.FULL_PAGE_MODE,
                                config : {
                                    region : 'north',
                                    hidden : false
                                }
                            },
                            {
                                rule : RESPONSIVE_RULE.MTMINIMAL + ' && !' + RESPONSIVE_RULE.FULL_PAGE_MODE,
                                config : {
                                    region : 'west',
                                    hidden : false
                                }
                            },
                            {
                                rule : RESPONSIVE_RULE.FULL_PAGE_MODE,
                                config : {
                                    hidden : true
                                }
                            }
                        ]),

                        items : [
                            {
                                xtype : 'criterion_selfservice_dashboard_left_panel',

                                padding : 0,

                                width : 320,

                                margin : '25 0 20 20',

                                responsiveConfig : criterion.Utils.createResponsiveConfig([
                                    {
                                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MINIMAL,
                                        config : {
                                            width : '100%',
                                            margin : '25 25 20 20'
                                        }
                                    },
                                    {
                                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMINIMAL,
                                        config : {
                                            width : 320,
                                            margin : '25 0 20 20'
                                        }
                                    }
                                ]),

                                listeners : {
                                    boxready : 'onSelfserviceDashboardLeftPanelBoxReady'
                                }
                            },
                            {
                                xtype : 'criterion_selfservice_dashboard_right_left_panel',

                                padding : 0,

                                hidden : true,

                                width : 320,

                                margin : '0 0 25 20',

                                responsiveConfig : criterion.Utils.createResponsiveConfig([
                                    {
                                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MINIMAL,
                                        config : {
                                            width : '100%',
                                            margin : '0 25 25 20',
                                            hiddenByResponsive : false
                                        }
                                    },
                                    {
                                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMINIMAL,
                                        config : {
                                            width : 320,
                                            margin : '0 0 25 20',
                                            hiddenByResponsive : false
                                        }
                                    },
                                    {
                                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMEDIUM,
                                        config : {
                                            width : 320,
                                            hiddenByResponsive : true
                                        }
                                    },
                                    {
                                        rule : RESPONSIVE_RULE.FULL_PAGE_MODE,
                                        config : {
                                            hidden : true
                                        }
                                    }
                                ])
                            }
                        ]
                    },
                    {
                        xtype : 'panel',

                        layout : 'fit',

                        region : 'center',

                        flex : 1,

                        items : [
                            {
                                xtype : 'criterion_selfservice_dashboard_main',

                                margin : '25 0 20 20',

                                responsiveConfig : criterion.Utils.createResponsiveConfig([
                                    {
                                        rule : RESPONSIVE_RULE.MEDIUM + ' || ' + RESPONSIVE_RULE.FULL_PAGE_MODE,
                                        config : {
                                            margin : '25 20 20 20'
                                        }
                                    },
                                    {
                                        rule : RESPONSIVE_RULE.MTMEDIUM + ' && !' + RESPONSIVE_RULE.FULL_PAGE_MODE,
                                        config : {
                                            margin : '25 0 20 20'
                                        }
                                    }
                                ])
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_selfservice_dashboard_right_left_panel',

                        margin : '25 25 25 20',

                        padding : 0,

                        region : 'east',

                        width : 320,

                        hidden : true,

                        responsiveConfig : criterion.Utils.createResponsiveConfig([
                            {
                                rule : RESPONSIVE_RULE.MEDIUM + ' || ' + RESPONSIVE_RULE.FULL_PAGE_MODE,
                                config : {
                                    hiddenByResponsive : true
                                }
                            },
                            {
                                rule : RESPONSIVE_RULE.MTMEDIUM + ' && !' + RESPONSIVE_RULE.FULL_PAGE_MODE,
                                config : {
                                    hiddenByResponsive : false
                                }
                            },
                            {
                                rule : RESPONSIVE_RULE.FULL_PAGE_MODE,
                                config : {
                                    hidden : true
                                }
                            }
                        ])
                    }
                ]
            }
        ]
    };
});
