Ext.define('criterion.view.ess.time.dashboard.timeOffHistory.Chart', function() {
    var me = this;

    return {
        alias : 'widget.criterion_selfservice_time_dashboard_time_off_history_chart',

        requires : [
            'criterion.controller.ess.time.dashboard.timeOffHistory.Chart',
            'Ext.chart.series.Pie',
            'Ext.chart.interactions.ItemHighlight'
        ],

        extend : 'Ext.container.Container',

        controller : {
            type : 'criterion_selfservice_time_dashboard_time_off_history_chart'
        },

        tooltipTpl : new Ext.XTemplate(
            // @formatter:off
            '<div class="criterion-chart-tooltip">',
                '<div class="title">Time Off Type:</div>',
                '<div class="types">{timeOffTypes}</div>',
                '<table width="100%" cellspacing="0">',
                    '<tr class="head">',
                        '<td></td>',
                        '<td class="nowrap">Net Carryover</td>',
                        '<td class="right">{[this.getNetCarryover(values)]} {units}</td>',
                    '</tr>',
                    '<tr class="head">',
                        '<td></td>',
                        '<td>Accrued</td>',
                        '<td class="right">{record.accrued:round(Ext.util.Format.amountPrecision)} {units}</td>',
                    '</tr>',
                    '<tr>',
                        '<td><span class="circle gray"></span></td>',
                        '<td>Taken</td>',
                        '<td class="right">-{record.taken:round(Ext.util.Format.amountPrecision)} {units}</td>',
                    '</tr>',
                    '<tr>',
                        '<td><span class="circle lightgray"></span></td>',
                        '<td>Planned</td>',
                        '<td class="right">-{record.planned:round(Ext.util.Format.amountPrecision)} {units}</td>',
                    '</tr>',
                        '<tr class="total">',
                        '<td><span class="circle balance"></span></td>',
                        '<td class="line">Balance</td>',
                        '<td class="line right">{record.balance:round(Ext.util.Format.amountPrecision)} {units}</td>',
                    '</tr>',
                '</table>',
            '</div>',
            // @formatter:on
            {
                getNetCarryover : function(viewModel) {
                    var rec = viewModel.record;
                    return Ext.util.Format.round(rec.carryover - rec.carryoverExpired, Ext.util.Format.amountPrecision);
                }
            }
        ),

        viewModel : {
            data : {
                record : null,
                colors : null
            },

            formulas : {
                sprites : function(get) {
                    var balance = get('record.balance'),
                        planIsAccrualInDays = get('record.planIsAccrualInDays'),
                        recordName = get('record.name');

                    return this.getView().getSpritesConfig(balance, planIsAccrualInDays, recordName);
                }
            },

            stores : {
                pieChart : {
                    fields : ['name', 'value']
                }
            }
        },

        layout : {type : 'vbox', align : 'stretch'},

        listeners : {
            mouseleave : {
                element : 'el',
                fn : function() {
                    var tip = this.component.down('[type=pie]').getTooltip();
                    tip.inside = false;
                    tip.hide();
                }
            }
        },

        items : [
            {
                xtype : 'container',
                layout : {
                    type : 'hbox'
                },

                padding : 10,

                cls : 'charts-wrapper',

                items : [
                    {
                        xtype : 'container',
                        reference : 'chartContainer',
                        cls : 'chart'
                    },
                    {
                        xtype : 'component',
                        cls : 'plan-name-wrapper',
                        bind : {
                            html : '<div class="plan-name">{record.name}</div>'
                        }
                    }
                ]
            }
        ],

        renderChart : function() {
            var vm = this.getViewModel(),
                colors = vm.get('colors'),
                chartContainer = this.lookup('chartContainer');

            chartContainer.removeAll();

            chartContainer.add({
                xtype : 'polar',
                downloadServerUrl : '-',
                width : 70,
                height : 70,
                insetPadding : 0,
                plugins : {
                    ptype : 'chartitemevents',
                    moveEvents : true
                },
                background : 'none',
                colors : [colors.balance, colors.taken, colors.planned],
                bind : {
                    store : '{pieChart}',
                    sprites : '{sprites}'
                },
                series : {
                    type : 'pie',
                    angleField : 'value',
                    donut : 80,
                    subStyle : {
                        strokeStyle : 'none'
                    },
                    background : 'none',
                    tooltip : {
                        trackMouse : true,
                        width : 235,
                        scope : this,
                        dismissDelay : 1000,
                        mouseOffset : [15, 25],
                        renderer : this.popupRenderer,
                        listeners : {
                            beforehide : function(tip) {
                                if (tip.inside) {
                                    return false;
                                }
                            }
                        }
                    },
                    listeners : {
                        itemmouseout : 'onMouseChartLeave'
                    }
                }
            });
        },

        popupRenderer : function(tooltip, rec, ctx) {
            var vm = this.getViewModel(),
                record = vm.get('record'),
                types = record.get('timeOffTypes'),
                html = this.tooltipTpl.apply({
                    record : record.getData(),
                    units : record.get('planIsAccrualInDays') ? i18n.gettext('days') : i18n.gettext('hrs'),
                    timeOffTypes : types ? types.join(', ') : ''
                });

            tooltip.setHtml(html);
        },

        getSpritesConfig : function(balance, planIsAccrualInDays, recordName) {
            var vm = this.getViewModel(),
                font = 'Open Sans',
                width = 70,
                height = 70;

            return [
                {
                    type : 'text',
                    x : width / 2,
                    y : height / 2 + 3,
                    textAlign : 'center',
                    lineWidth : width,
                    text : balance ? Ext.String.ellipsis(Ext.util.Format.round(balance, 2).toString(), 7) : '00:00',
                    fontSize : 16,
                    fontFamily : font,
                    fontWeight : 600,
                    fillStyle : vm.get('colors.balance')
                },
                {
                    type : 'text',
                    x : width / 2,
                    y : (height / 2) + 17,
                    textAlign : 'center',
                    text : planIsAccrualInDays ? i18n.gettext('d') : i18n.gettext('h'),
                    lineWidth : width,
                    fontSize : 12,
                    fontFamily : font,
                    fillStyle : vm.get('colors.taken')
                }
            ]
        },

        getChartSurface : function() {
            return this.down('polar').getSurface();
        }
    };

});
