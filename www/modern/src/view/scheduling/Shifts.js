Ext.define('ess.view.scheduling.Shifts', function() {

    let {start, end} = criterion.Utils.getCurrentWeek();

    return {
        alias : 'widget.ess_modern_scheduling_shifts',

        extend : 'Ext.Panel',

        requires : [
            'criterion.view.scheduling.ShiftForm',
            'ess.controller.scheduling.Shifts',
            'criterion.store.employer.shift.occurrence.Schedules'
        ],

        viewModel : {
            data : {
                activeViewIdx : 0,
                viewStart : start,
                viewEnd : end
            },

            stores : {
                occurrenceSchedules : {
                    type : 'criterion_employer_shift_occurrence_schedules',
                    sorters : [
                        {
                            property : 'startTimestamp',
                            direction : 'ASC'
                        }
                    ],
                    filters : [
                        {
                            property : 'startTimestamp',
                            operator : '>=',
                            value : '{viewStart}'
                        },
                        {
                            property : 'endTimestamp',
                            operator : '<=',
                            value : '{viewEnd}'
                        }
                    ],

                    listeners : {
                        refresh : function(store) {
                            let dates = [];

                            Ext.defer(_ => {
                                store.each(rec => {
                                    let date = rec.get('startDate');

                                    if (!Ext.Array.contains(dates, date)) {
                                        dates.push(date);
                                        rec.set('_showDayTitle', true);
                                    } else {
                                        rec.set('_showDayTitle', false);
                                    }
                                });
                            }, 100);
                        }
                    }
                }
            },

            formulas : {
                weekTitle : data => Ext.Date.format(data('viewStart'), criterion.consts.Api.SHOW_DATE_FORMAT) + ' &mdash; ' + Ext.Date.format(data('viewEnd'), criterion.consts.Api.SHOW_DATE_FORMAT),

                hideWeekSelector : data => data('activeViewIdx') === 1
            }
        },

        layout : 'card',

        _getController() {
            return this.down('criterion_gridview').getController();
        },

        getViewXtype() {
            return this.xtype;
        },

        getFormXtype() {
            return 'ess_modern_scheduling_shift_form';
        },

        constructor(config) {
            let me = this;

            config.items = [
                {
                    xtype : 'container',
                    layout : 'hbox',

                    margin : '20 20 10 20',
                    docked : 'top',
                    hidden : true,
                    bind : {
                        hidden : '{hideWeekSelector}'
                    },
                    items : [
                        {
                            xtype : 'component',
                            flex : 1
                        },
                        {
                            xtype : 'button',
                            text : '<',
                            ui : 'act-btn-light',
                            width : 50,
                            margin : '0 5 0 0',
                            handler : _ => {
                                me._getController().handleGoPrevWeek()
                            }
                        },
                        {
                            xtype : 'component',
                            bind : {
                                html : '{weekTitle}'
                            },
                            width : 200,
                            margin : '15 5 0 5',
                            cls : 'criterion-dark-gray'
                        },
                        {
                            xtype : 'button',
                            text : '>',
                            ui : 'act-btn-light',
                            width : 50,
                            margin : '0 5 0 0',
                            handler : _ => {
                                me._getController().handleGoNextWeek()
                            }
                        },
                        {
                            xtype : 'component',
                            flex : 1
                        }
                    ]
                },

                {
                    xtype : 'container',
                    isWrapper : 1,
                    height : '100%',
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    items : [
                        {
                            xtype : 'criterion_gridview',
                            cls : 'ess-grid-with-workflow',
                            hidden : true,
                            bind : {
                                store : '{occurrenceSchedules}',
                                hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.MY_SHIFT_ASSIGNMENTS, true)
                            },

                            controller : {
                                type : 'ess_modern_scheduling_shifts'
                            },

                            mainXtype : me.getViewXtype(),
                            formXtype : me.getFormXtype(),

                            listeners : {
                                doEdit : function(record) {
                                    me._getController().onEdit(record)
                                }
                            },

                            height : '100%',
                            flex : 1,

                            columns : [
                                {
                                    text : 'Day',
                                    dataIndex : 'startTimestamp',
                                    minWidth : 100,
                                    sortable : false,
                                    menuDisabled : true,
                                    width : 120,
                                    renderer : (value, record) => {
                                        return record.get('_showDayTitle') ? Ext.Date.format(record.get('startTimestamp'), criterion.consts.Api.SHORT_DATE_FORMAT + ' [D]') : '\u00A0 \u21B3';
                                    }
                                },
                                {
                                    text : 'Shift Time',
                                    dataIndex : 'startTimestamp',
                                    minWidth : 100,
                                    sortable : false,
                                    menuDisabled : true,
                                    width : 180,
                                    renderer : (value, record) => Ext.Date.format(record.get('startTimestamp'), criterion.consts.Api.SHOW_TIME_FORMAT) + ' - ' + Ext.Date.format(record.get('endTimestamp'), criterion.consts.Api.SHOW_TIME_FORMAT)
                                },
                                {
                                    text : 'Name',
                                    dataIndex : 'name',
                                    minWidth : 100,
                                    sortable : false,
                                    menuDisabled : true,
                                    flex : 1
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'ess_modern_scheduling_shift_form',
                    height : '100%',

                    listeners : {
                        close : function() {
                            me._getController().onEditFinish()
                        }
                    }
                }
            ];

            me.callParent(arguments);
        }
    };

});
