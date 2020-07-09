Ext.define('criterion.view.hr.dashboard.ChartsPanelItem', function() {

    var DASHBOARD = criterion.consts.Dashboard,
        CHART_TYPES = DASHBOARD.getChartTypes();

    function getChart(record, metric) {
        var type = record.get('chartType'),
            store = Ext.create('criterion.store.dashboard.ChartData'),
            viewNumber = record.store.viewNumber,
            isLarge = viewNumber === DASHBOARD.VIEW.LARGE_CHARTS,
            value, title;

        value = metric.mapping ? metric.mapping.value : 'value';
        title = metric.mapping ? metric.mapping.title : 'title';

        if (metric.sortCfg) {
            store.setSorters(metric.sortCfg);
            store.sort();
        }

        switch (type) {

            case CHART_TYPES.LINE.name:
            case CHART_TYPES.AREA.name:

                return {
                    xtype : 'cartesian',
                    downloadServerUrl : '-',
                    animate : true,
                    shadow : false,
                    theme : 'criterion',
                    store : store,

                    axes : [
                        {
                            type : 'numeric',
                            fields : value,
                            position : 'left',
                            minimum : 0,
                            renderer : function(axes, v) {
                                return Ext.isDefined(metric.precision) ? v.toFixed(metric.precision) : v;
                            }
                        },
                        {
                            type : 'category',
                            fields : title,
                            position : 'bottom',
                            renderer : function(axes, v) {
                                if (this.getFields()[0] === 'date') {
                                    return Ext.Date.format(Ext.Date.parse(v, criterion.consts.Api.DATE_FORMAT), criterion.consts.Api.DATE_FORMAT_US);
                                }

                                return v;
                            },
                            minimum : 0
                        }
                    ],
                    series : [
                        {
                            type : type.toLocaleLowerCase(),
                            xField : title,
                            yField : value,
                            style : {
                                strokeStyle : type === CHART_TYPES.LINE.name ? DASHBOARD.CHART_COLORS[0] : 'none'
                            }
                        }
                    ]
                };

            case CHART_TYPES.PIE.name:
                return {
                    xtype : 'polar',
                    downloadServerUrl : '-',
                    store : store,
                    insetPadding : 0,
                    innerPadding : 1,
                    theme : 'criterion',
                    legend : {
                        type : 'dom',
                        docked : 'right',
                        toggleable : false,
                        width : '40%'
                    },
                    series : [
                        {
                            type : 'pie',
                            angleField : value,
                            donut : 50,
                            label : {
                                field : title,
                                calloutLine : {
                                    color : 'rgba(0,0,0,0)'
                                },
                                renderer : function() {
                                    return '';
                                }
                            },
                            tooltip : {
                                trackMouse : true,
                                renderer : function(tooltip, record, item) {
                                    tooltip.setHtml(record.get(title));
                                }
                            }
                        }
                    ]
                };

            case CHART_TYPES.BAR.name:

                return {
                    xtype : 'cartesian',
                    downloadServerUrl : '-',
                    flipXY : true,
                    store : store,
                    theme : 'criterion',
                    axes : [
                        {
                            type : 'numeric',
                            position : 'bottom',
                            adjustByMajorUnit: !metric.axisOnlyInteger,
                            renderer : function(axes, v) {
                                return metric.axisOnlyInteger ?
                                    (Number.isInteger(v) ? v : '') :
                                    (Ext.isDefined(metric.precision) ? v.toFixed(metric.precision) : v);
                            },
                            style : {
                                textPadding : isLarge ? 80 : 20
                            }
                        },
                        {
                            type : 'category',
                            position : 'left',
                            label : {
                                axisLine : false,
                                calloutLine : false,
                                textAlign : 'right'
                            },
                            style : isLarge ? {
                                axisLine : false,
                                strokeStyle : 'rgba(0, 0, 0, 0)'
                            } : {
                                textPadding : 1
                            }
                        }
                    ],
                    series : [
                        {
                            type : 'bar',
                            xField : title,
                            yField : value,
                            label : isLarge ? {
                                field : value,
                                display : 'insideEnd'
                            } : null,
                            renderer : function(sprite, config, rendererData, index) {
                                return {
                                    fill : DASHBOARD.CHART_COLORS[index % DASHBOARD.CHART_COLORS.length]
                                };
                            },
                            tooltip : {
                                trackMouse : true,
                                renderer : function(tooltip, record, item) {
                                    tooltip.setHtml(record.get(title));
                                }
                            }
                        }
                    ]
                };

            case CHART_TYPES.BAR_STACKED.name:

                return {
                    xtype : 'cartesian',
                    downloadServerUrl : '-',
                    store : store,
                    theme : 'criterion',
                    legend : isLarge ? {
                        docked : 'right',
                        toggleable : false,
                        border : {
                            lineWidth : 0,
                            fillStyle : 'none',
                            strokeStyle : 'none'
                        }
                    } : null,
                    axes : [
                        {
                            type : 'numeric',
                            position : 'left',
                            fields : value,
                            renderer : function(axes, v) {
                                return Ext.isDefined(metric.precision) ? v.toFixed(metric.precision) : v;
                            }
                        },
                        {
                            type : 'category',
                            position : 'bottom',
                            fields : title,
                            renderer : function(axes, v) {
                                var dateSplitted, date;

                                if (this.getFields()[0] === 'date') {
                                    if (v) {
                                        dateSplitted = v.split('.');
                                        date = new Date(dateSplitted[0], dateSplitted[1] - 1, dateSplitted[2]);
                                    }

                                    return Ext.Date.format(date, 'm/d/Y');
                                }

                                return v;
                            }
                        }
                    ],
                    series : [
                        {
                            type : 'bar',
                            axis : 'left',
                            xField : title,
                            yField : value
                        }
                    ]
                };
        }
    }

    return {

        extend : 'criterion.ux.Panel',

        mixins : [],

        requires : [
            'criterion.store.dashboard.ChartData',
            'criterion.ux.chart.theme.Criterion',
            'Ext.chart.*'
        ],

        alias : 'widget.criterion_hr_dashboard_charts_panel_item',

        layout : 'fit',

        getRequestParams : function(record) {
            var params = {},
                data = record.getData({
                    serialize : true
                });

            if (data.metric) {
                Ext.Object.each(data.metric.additionalParams, function(key) {
                    data[key] ? params[key] = data[key] : null;
                });
            }

            return params;
        },

        setRecord : function(record) {
            var me = this,
                metric = record.get('metric'),
                data = record.getData({
                    serialize : true
                });

            this.setTitle(metric.name);

            if (this.data && this.data.chartType !== data.chartType || !this.chart) {
                this.rendered && this.down('#wrapper').removeAll();
                this.chart = Ext.create(getChart(record, metric));
            }

            me.data = data;
            me.record = record;

            this.setLoading(true);

            criterion.Api.request({
                method : 'GET',
                url : metric.url,
                params : this.getRequestParams(record),
                scope : this,
                success : function(result) {
                    me.setLoading(false);
                    if (me.rendered) {
                        me.initChart(record, result);
                    } else {
                        me.on('render', function() {
                            this.initChart(record, result);
                        }, me, {single : true});
                    }
                }
            });
        },

        initChart : function(record, result) {
            var me = this,
                metric = record.get('metric'),
                wrapper = me.down('#wrapper');

            if (record.get('chartType') === CHART_TYPES.BAR.name) {
                var legendStore = this.chart.getLegendStore();

                if (legendStore) {
                    var title = metric.mapping ? metric.mapping.title : 'title';

                    legendStore.removeAll();

                    Ext.Array.each(this.chart.getSeries(), function(series) {
                        Ext.Array.each(result, function(item, idx, arr) {
                            legendStore.add({
                                name : String(item[title]),
                                series : series.getId(),
                                mark : DASHBOARD.CHART_COLORS[arr.length - idx % DASHBOARD.CHART_COLORS.length - 1]
                            });
                        });
                    });
                }

                result.reverse();
            }

            me.chart.getStore().loadData(result);

            // Fixes bug with legend rendered outside panel
            if (!me.chart.ownerCt) {
                wrapper.add(me.chart);
            }
        },

        initComponent : function(config) {
            var me = this;

            me.items = [
                {
                    xtype : 'container',
                    cls : 'criterion-hr-dashboard-charts-panel-item-wrap',
                    layout : 'fit',
                    itemId : 'wrapper'
                }
            ];

            me.callParent(arguments);
        },

        handleMouseEnter : function() {
            var me = this;

            me.configEl.setOpacity(1, {
                duration : 200,
                easing : 'ease-in'
            });
        },

        handleMouseLeave : function() {
            var me = this;

            me.configEl.setOpacity(0, {
                duration : 200,
                easing : 'ease-in'
            });
        },

        onBoxReady : function() {
            var me = this,
                configBtn = Ext.create('Ext.button.Button', {
                    cls : 'criterion-hr-dashboard-panel-item-config',
                    renderTo : me.body,
                    handler : function(btn) {
                        me.fireEvent('configChartPanelItem', me.up().getStore(), me.record);
                    },
                    hidden : true,
                    bind : {
                        hidden : criterion.SecurityManager.getComplexSecurityFormula({
                            rules : {
                                AND : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM,
                                        actName : criterion.SecurityManager.UPDATE,
                                        reverse : true
                                    },
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.DASHBOARD_ITEM,
                                        actName : criterion.SecurityManager.DELETE,
                                        reverse : true
                                    }
                                ]
                            }
                        })
                    },
                    glyph : criterion.consts.Glyph['arrow-down-b']
                });

            me.configEl = configBtn.el;
            me.configEl.setOpacity(0);

            me.mon(me.body, {
                scope : me,
                mouseenter : me.handleMouseEnter
            });
            me.mouseMonitor = me.body.monitorMouseLeave(100, me.handleMouseLeave, me);
        }

    };

});
