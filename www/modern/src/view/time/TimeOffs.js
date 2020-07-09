Ext.define('ess.view.time.TimeOffs', function() {

    return {
        alias : 'widget.ess_modern_time_timeoffs',

        extend : 'Ext.Container',

        requires : [
            'criterion.vm.time.TimeOffs',
            'ess.controller.time.TimeOffs',
            'ess.controller.time.TimeOffsGrid',
            'ess.view.time.TimeOff',
            'ess.view.time.timeOff.Detail',
            'ess.view.time.timeOff.TimeBalances',
            'criterion.chart.PolarChart'
        ],

        title : 'Manage Time Off',

        cls : 'criterion-time-timeoffs',

        viewModel : {
            type : 'criterion_time_timeoffs',

            formulas : {
                hasTimeBalances : {
                    bind : {
                        bindTo : '{timeBalances}',
                        deep : true
                    },
                    get : function(store) {
                        return !!store.count();
                    }
                },

                timeBalancesTotals : {
                    bind : {
                        bindTo : '{timeBalances}',
                        deep : true
                    },
                    get : function(store) {
                        let data = [];

                        store.each(balance => {
                            data.push({
                                title : balance.get('name'),
                                value : balance.get('positiveBalance'),
                                isNegative : balance.get('balance') < 0,
                                text : Ext.util.Format.round(balance.get('balance'), 2) + ' ' + (balance.get('planIsAccrualInDays') ? i18n.gettext('days') : i18n.gettext('hours'))
                            })
                        });

                        return data;
                    }
                }
            }
        },

        controller : {
            type : 'ess_modern_time_timeoffs'
        },

        listeners : {
            activate : 'handleActivate'
        },

        layout : 'card',

        items : [
            {
                xtype : 'container',
                id : 'timeOffsGridWrapper',
                height : '100%',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                items : [
                    {
                        xtype : 'ess_modern_menubar',
                        docked : 'top',
                        title : 'Time Offs',
                        actions : [
                            {
                                xtype : 'button',
                                text : '',
                                iconCls : 'md-icon-add',
                                iconAlign : 'center',
                                bind : {
                                    disabled : '{blockAdd}'
                                },
                                handler : 'handleAdd'
                            }
                        ]
                    },
                    {
                        xtype : 'component',
                        cls : 'info-blk',
                        html : i18n.gettext('Time left:'),
                        padding : '16 0 10 16',
                        hidden : true,
                        bind : {
                            hidden : '{!hasTimeBalances}'
                        },

                        responsiveConfig : {
                            landscape : {
                                height : 0,
                                padding : 0
                            },
                            portrait : {
                                height : 'auto',
                                padding : '16 0 10 16'
                            }
                        }
                    },
                    {
                        xtype : 'criterion_polar',

                        width : '100%',

                        margin : 0,
                        innerPadding : 5,
                        background : criterion.consts.Colors.B_GRAY,

                        hidden : true,
                        bind : {
                            store : '{timeBalancesTotals}',
                            hidden : '{!hasTimeBalances}'
                        },

                        responsiveConfig : {
                            landscape : {
                                height : 0
                            },
                            portrait : {
                                height : '40%'
                            }
                        },

                        series : [
                            {
                                type : 'criterion_pie',
                                angleField : 'value',
                                donut : 70,
                                rotation : 120,
                                legendField : 'title',
                                background : criterion.consts.Colors.B_GRAY,
                                label : {
                                    field : 'text',
                                    display : 'outside',
                                    fontSize : criterion.Consts.UI_DEFAULTS.TOUCH_DEVICE_LOW_HEIGHT ? 10 : 12,
                                    fontWeight : 'bold',
                                    color : criterion.consts.Colors.BLACK,
                                    calloutLine : {
                                        length : 20
                                    }
                                },
                                highlight : true,
                                renderer : function(sprite, config, rendererData, index) {
                                    let isNegative = rendererData.store.getAt(index).get('isNegative'),
                                        color = rendererData.series.getColors()[index];

                                    return {
                                        fillStyle : isNegative ? criterion.Utils.rgbToString(criterion.Utils.hexToRgb(color), 0.1) : color,
                                        strokeStyle : color
                                    };
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_gridview',
                        reference : 'timeoffsGrid',
                        cls : 'ess-grid-with-workflow',
                        bind : {
                            store : '{timeOffs}'
                        },

                        controller : {
                            type : 'ess_modern_time_timeoffs_grid'
                        },

                        listeners : {
                            doAdd : 'onTimeOffEdit',
                            doEdit : 'onTimeOffEdit'
                        },

                        height : '100%',
                        flex : 1,

                        itemConfig : {
                            viewModel : {
                                data : {}
                            }
                        },

                        columns : [
                            {
                                text : '',
                                width : 14,
                                minWidth : 14,
                                cls : 'workflow-cell-header',
                                cell : {
                                    cls : 'workflow-cell',
                                    width : 14,
                                    bind : {
                                        bodyCls : '{record.timeOffStatusCode}'
                                    }
                                }
                            },
                            {
                                xtype : 'datecolumn',
                                text : 'Start Date',
                                dataIndex : 'startDate',
                                width : 125
                            },
                            {
                                xtype : 'criterion_codedatacolumn',
                                text : 'TimeOff Type',
                                dataIndex : 'timeOffTypeCd',
                                codeDataId : criterion.consts.Dict.TIME_OFF_TYPE,
                                minWidth : 150
                            },
                            {
                                text : 'Total Hours',
                                dataIndex : 'totalHours',
                                width : 130
                            },
                            {
                                text : 'Notes',
                                dataIndex : 'notes',
                                flex : 1,
                                minWidth : 180
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_time_timeoff',
                height : '100%',

                listeners : {
                    close : 'onTimeOffEditFinish'
                }
            },
            {
                xtype : 'criterion_time_timeoff_detail',
                height : '100%',

                listeners : {
                    close : 'onTimeOffDetailEditFinish'
                }
            }
        ]
    };

});
