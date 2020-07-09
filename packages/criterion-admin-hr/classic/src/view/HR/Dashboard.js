Ext.define('criterion.view.hr.Dashboard', function() {

    return {
        alias : 'widget.criterion_hr_dashboard',

        extend : 'criterion.ux.Panel',

        requires : [
            'Ext.layout.container.Border',
            'criterion.controller.hr.Dashboard',
            'criterion.store.Dashboard',
            'criterion.store.weekEvents',
            'criterion.model.dashboard.Value',
            'criterion.model.dashboard.Chart',
            'criterion.view.hr.dashboard.FeedPanel',
            'criterion.view.hr.dashboard.ValuesPanel',
            'criterion.view.hr.dashboard.ChartsPanel'
        ],

        controller : {
            type : 'criterion_hr_dashboard'
        },

        viewModel : {
            stores : {
                dashboard : {
                    type : 'criterion_dashboard',
                    storeId : 'Dashboard',
                    listeners : {
                        load : 'handleDashboardLoad'
                    }
                },
                feed : {
                    type : 'criterion_week_events',
                    clearOnPageLoad : false,
                    pageSize : 7
                },
                store1 : {
                    model : 'criterion.model.dashboard.Chart',
                    viewNumber : 1
                },
                store2 : {
                    model : 'criterion.model.dashboard.Chart',
                    viewNumber : 2
                },
                store3 : {
                    model : 'criterion.model.dashboard.Value',
                    viewNumber : 3
                }
            }
        },

        title : i18n.gettext('Dashboard'),

        border : false,

        layout : 'border',

        autoScroll : false,

        defaultType : 'panel',

        plugins : {
            ptype : 'criterion_lazyitems',
            items : [
                {
                    region : 'center',
                    xtype : 'container',
                    cls : 'widget-container',

                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    scrollable : 'vertical',

                    items : [
                        {
                            xtype : 'criterion_hr_dashboard_values_panel',
                            hidden : true,
                            bind : {
                                store : '{store3}',
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM, criterion.SecurityManager.READ, true)
                            },
                            listeners : {
                                scope : 'controller',
                                addPanelElement : 'handleAddPanelElement',
                                configValuePanelItem : 'handleConfigValuePanelItem'
                            }
                        },
                        {
                            xtype : 'criterion_hr_dashboard_charts_panel',
                            hidden : true,
                            bind : {
                                store : '{store2}',
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM, criterion.SecurityManager.READ, true)
                            },
                            listeners : {
                                scope : 'controller',
                                addPanelElement : 'handleAddPanelElement',
                                configChartPanelItem : 'handleConfigChartPanelItem'
                            },
                            minHeight : 300,
                            flex : 1,
                            maxCount : 1
                        },
                        {
                            xtype : 'criterion_hr_dashboard_charts_panel',
                            responsiveConfig : criterion.Utils.createResponsiveConfig([
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMEDIUM,
                                    config : {
                                        layout : {
                                            type : 'box',
                                            align : 'stretch',
                                            vertical : false
                                        }
                                    }
                                },
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MEDIUM,
                                    config : {
                                        layout : {
                                            type : 'box',
                                            align : 'stretch',
                                            vertical : true
                                        }
                                    }
                                }
                            ]),
                            hidden : true,
                            bind : {
                                store : '{store1}',
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM, criterion.SecurityManager.READ, true)
                            },
                            listeners : {
                                scope : 'controller',
                                addPanelElement : 'handleAddPanelElement',
                                configChartPanelItem : 'handleConfigChartPanelItem'
                            },
                            maxCount : 3,
                            defaults : {
                                minHeight : 250
                            }
                        }
                    ]
                },
                {
                    region : 'east',
                    xtype : 'criterion_hr_dashboard_feed'
                }
            ]
        }
    }
});
