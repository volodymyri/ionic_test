Ext.define('criterion.view.WeekView', function() {

    return {

        alias : 'widget.criterion_week_view',

        cls : 'criterion-common-week-calendar',
        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.ux.calendar.CalendarPanel',
            'criterion.ux.calendar.util.Date',
            'criterion.ux.calendar.data.MemoryCalendarStore',
            'criterion.ux.calendar.data.MemoryEventStore',
            'criterion.ux.calendar.data.Events',
            'criterion.ux.calendar.data.Calendars',
            'criterion.controller.WeekView',
            'criterion.view.WeekFormView'
        ],

        mixins : [
            'Ext.util.StoreHolder'
        ],

        config : {
            readOnlyMode : false
        },
        
        controller : {
            type : 'criterion_weekview',
            connectParentView : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_week_form_view',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],
                draggable : false
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate',
            afterrender : 'handleAfterRender'
        },

        title : i18n.gettext('Week Calendar'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        tbar : [
            {
                xtype : 'component',
                flex : 1
            },
            {
                xtype : 'button',
                text : i18n.gettext('Today'),
                cls : 'criterion-btn-feature',
                margin : '0 20 0 0',
                listeners : {
                    click : 'handleTodayClick'
                },
                bind : {
                    hidden : '{!showTodayButton}'
                }
            },
            {
                glyph : criterion.consts.Glyph['ios7-arrow-left'],
                cls : 'criterion-btn-transparent',
                scale : 'medium',
                listeners : {
                    click : 'handlePrevWeek'
                }
            },
            {
                xtype : 'component',
                reference : 'currentWeek',
                cls : 'criterion-my-calendar-current-week'
            },
            {
                glyph : criterion.consts.Glyph['ios7-arrow-right'],
                cls : 'criterion-btn-transparent',
                scale : 'medium',
                listeners : {
                    click : 'handleNextWeek'
                }
            },
            {
                xtype : 'component',
                bind : {
                    html : '{timezone}',
                    hidden : '{!timezone}'
                }
            },
            {
                xtype : 'component',
                flex : 1
            },
            {
                xtype : 'button',
                text : i18n.gettext('Add'),
                bind : {
                    hidden : '{!showAddButton}'
                },
                cls : 'criterion-btn-feature',
                margin : '0 20 0 0',
                listeners : {
                    click : 'handleAddClick'
                }
            }
        ],

        viewModel : {
            data : {
                showAddButton : true,
                showTodayButton : false
            }
        },

        /**
         * @required
         */
        store : null,
        eventStore : null,
        calendarStore : null,

        getStoreListeners : function() {
            return {
                load : this.calendarRefresh,
                remove : this.calendarRefresh
            }
        },

        calendarRefresh : function() {
            this.getController().calendarRefresh();
        },

        initComponent : function() {
            if (this.store) {
                this.bindStore(Ext.data.StoreManager.lookup(this.store));
            }

            if (!this.eventStore) {
                this.eventStore = Ext.create('criterion.ux.calendar.data.MemoryEventStore', {
                    data : {
                        data : [] // see criterion.ux.calendar.data.Events.getData()
                    }
                });
            }

            if (!this.calendarStore) {
                this.calendarStore = Ext.create('criterion.ux.calendar.data.MemoryCalendarStore', {
                    data : {
                        calendars : [
                            {
                                id : 1,
                                title : i18n.gettext('Main events')
                            },
                            {
                                id : 2,
                                title : i18n.gettext('Recurring events')
                            }
                        ] // criterion.ux.calendar.data.Calendars.getData
                    }
                });
            }

            this.items = [
                {
                    xtype : 'calendarpanel',
                    reference : 'calendarPanel',
                    eventStore : this.eventStore,
                    calendarStore : this.calendarStore,
                    flex : 1,

                    listeners : {
                        viewchange : 'onCalendarViewChange',
                        eventclick : 'onCalendarEventClick',
                        dayclick : 'onCalendarDayClick'
                    },

                    border : true,
                    showTime : true,
                    showNavBar : false,
                    hidden : true,

                    weekViewCfg : {
                        showHeader : true,
                        enableDD : false,
                        monitorResize : false,
                        trackMouseOver : false // true -> bugs
                    }
                }
            ];

            this.callParent(arguments);
        }

    }
});
