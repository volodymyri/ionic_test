Ext.define('criterion.view.settings.hr.workPeriod.DaysContainer', function() {

    const WIDTHS = {
        ENABLED : 80,
        PERIOD : 350,
        TIMESHEET_HOURS : 200
    };

    return {

        alias : 'widget.criterion_settings_work_period_days_container',

        extend : 'Ext.form.Panel',

        requires : [
            'criterion.view.settings.hr.workPeriod.DayDetailsContainer'
        ],

        mixins : [
            'Ext.util.StoreHolder'
        ],

        padding : '10 20',

        dockedItems : [
            {
                xtype : 'container',
                dock : 'top',

                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },

                defaultType : 'component',

                border : 1,
                style : {
                    borderColor : criterion.consts.Colors.LIGHT_GRAY,
                    borderStyle : 'solid',
                    backgroundColor : criterion.consts.Colors.B_GRAY
                },

                defaults : {
                    margin : '0 5',
                    padding : '5 10 5 10',
                    border : '0 1 0 0',
                    style : {
                        borderColor : criterion.consts.Colors.LIGHT_GRAY,
                        borderStyle : 'solid'
                    },
                    cls : 'bold'
                },

                items : [
                    {
                        html : i18n._('Enabled'),
                        width : WIDTHS.ENABLED
                    },

                    {
                        html : i18n._('Day of Week'),
                        flex : 1
                    },

                    {
                        html : i18n._('Scheduled Start') + ' &mdash; ' + i18n._('Scheduled End'),
                        width : WIDTHS.PERIOD
                    },

                    {
                        html : i18n._('Default Timesheet Hours'),
                        border : 0,
                        width : WIDTHS.TIMESHEET_HOURS
                    }
                ]
            }
        ],

        items : [],

        defaultListenerScope : true,

        listeners : {
            ready : 'reconstruct'
        },

        createItems() {
            let items = [],
                store = this.getStore(),
                i = 0,
                count = store.count();

            store.each(rec => {
                let id = rec.getId();

                i++;

                items.push({
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },

                    viewModel : {
                        data : {
                            day : rec
                        },

                        formulas : {
                            dayCls : data => !data('day.isActive') ? 'nonActiveDay' : ''
                        }
                    },

                    bind : {
                        userCls : '{dayCls}'
                    },

                    border : i === count ? 1 : '1 1 0 1',
                    style : {
                        borderColor : criterion.consts.Colors.LIGHT_GRAY,
                        borderStyle : 'solid'
                    },

                    defaults : {
                        margin : '0 5',
                        padding : '5 10 5 10',
                        border : '0 1 0 0',
                        style : {
                            borderColor : criterion.consts.Colors.LIGHT_GRAY,
                            borderStyle : 'solid'
                        }
                    },

                    defaultType : 'container',

                    items : [
                        {
                            width : WIDTHS.ENABLED,
                            layout : 'hbox',
                            items : [
                                {
                                    xtype : 'toggleslidefield',
                                    margin : '0 0 0 5',
                                    bind : {
                                        value : '{day.isActive}'
                                    }
                                }
                            ]
                        },

                        {
                            xtype : 'component',
                            flex : 1,
                            border : 0,
                            padding : '10 10 5 10',
                            html : criterion.Consts.DAYS_OF_WEEK_ARRAY[rec.get('dayOfWeek') - 1]
                        },

                        {
                            xtype : 'criterion_settings_work_period_day_details_container',
                            reference : `day_container_${id}`,
                            width : WIDTHS.PERIOD,
                            border : 0,
                            hidden : true,
                            bind : {
                                store : '{day.details}',
                                hidden : '{!day.isActive}'
                            }
                        },

                        {
                            width : WIDTHS.TIMESHEET_HOURS,
                            layout : 'hbox',
                            border : 0,
                            hidden : true,
                            items : [
                                {
                                    xtype : 'component',
                                    flex : 1
                                },
                                {
                                    xtype : 'numberfield',
                                    width : 100,
                                    bind : {
                                        value : '{day.defaultTimesheetHours}',
                                        disabled : '{!day.isActive}',
                                        hidden : '{!day.isActive}'
                                    }
                                }
                            ],
                            bind : {
                                hidden : '{!day.isActive}'
                            }
                        }
                    ]
                })
            });

            return items;
        },

        reconstruct() {
            let items;

            Ext.suspendLayouts();
            this.removeAll();

            items = this.createItems();
            this.add(items);

            Ext.resumeLayouts(true);
        },

        validate() {
            let me = this,
                res = true;

            this.getStore().each(rec => {
                if (!me.down(`[reference=day_container_${rec.getId()}]`).validateIntervals()) {
                    res = false;
                }
            });

            return res;
        }
    }
});
