Ext.define('criterion.controller.ess.calendar.Calendars', function() {

    return {

        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_dashboard_calendars',

        getEmployeeId : function() {
            return this.getViewModel().get('employeeId');
        },

        init : function() {
            var calendars;

            this.callParent(arguments);

            calendars = this.getViewModel().getStore('calendars');
            calendars.on('load', this.createCalendars, this);

            if (calendars.isLoaded()) {
                this.createCalendars();
            }
        },

        getRoutes : function() {
            var routes = {};

            routes[criterion.consts.Route.SELF_SERVICE.CALENDAR + '/:calendarId'] = 'handleRoute';

            return routes;
        },

        /**
         * handled by global store
         */
        handleEmployeeStorageLoaded : Ext.emptyFn,

        /**
         * handled by global store
         */
        load : Ext.emptyFn,

        /**
         * @private
         */
        deferredItemId : null,

        handleRoute : function(itemId) {
            var view = this.getView(),
                item = view.down('#' + itemId),
                calendars = this.getViewModel().getStore('calendars'),
                calendarId = parseInt(itemId.replace('calendar', ''), 10);

            if (!calendars.isLoaded() && !calendars.isLoading()) {
                this.deferredItemId = itemId;
                return;
            }

            if (item) {
                view.setActiveItem(item);
                view.setLoading(true);
                this.loadCalendarRecord(calendarId).then(function(calendarRec) {
                    if (item.destroyed) {
                        item = view.down('#' + itemId);
                        view.setActiveItem(item);
                    }

                    item.updateRecord(calendarRec);
                    view.setLoading(false);
                });
            }
        },

        loadCalendarRecord : function(id) {
            var calendarRec = new criterion.model.employee.CalendarIcs({
                    id : id
                });

            return calendarRec.loadWithPromise();
        },

        createCalendars : function() {
            var me = this,
                view = this.getView(),
                store = this.getViewModel().getStore('calendars'),
                items = [];

            store.each(function(calendar) {
                var calendarId = calendar.getId(),
                    itemId = 'calendar' + calendarId;

                items.push({
                    xtype : 'criterion_selfservice_resources_my_calendar',
                    id : 'calendar' + calendar.getId(),

                    header : {
                        title : {
                            text : calendar.get('name'),
                            minimizeWidth : true
                        },

                        items : [
                            {
                                xtype : 'tbfill'
                            },
                            {
                                xtype : 'button',
                                glyph : criterion.consts.Glyph['ios7-arrow-left'],
                                ui : 'secondary',
                                listeners : {
                                    click : 'onPrevMonth'
                                }
                            },
                            {
                                xtype : 'tbspacer'
                            },
                            {
                                xtype : 'component',
                                reference : 'currentDate',
                                cls : 'criterion-my-calendar-current-date'
                            },
                            {
                                xtype : 'tbspacer'
                            },
                            {
                                xtype : 'button',
                                glyph : criterion.consts.Glyph['ios7-arrow-right'],
                                ui : 'secondary',
                                listeners : {
                                    click : 'onNextMonth'
                                }
                            },
                            {
                                xtype : 'tbfill'
                            },
                            {
                                xtype : 'button',
                                cls : 'criterion-btn-glyph-only',
                                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                                scale : 'medium',
                                handler : 'handleRefreshClick'
                            }
                        ]
                    },

                    itemId : itemId,
                    record : calendar,
                    listeners : {
                        reloadCalendar : function(item) {
                            item.setLoading(true);
                            me.loadCalendarRecord(calendarId).then(function(calendarRec) {
                                item.updateRecord(calendarRec);
                                item.setLoading(false);
                            });
                        }
                    }
                })
            });

            view.removeAll();
            view.add(items);

            // to avoid empty calendar page
            if (!store.count() && this.checkViewIsActive()) {
                this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD);
            }

            if (this.deferredItemId) {
                this.handleRoute(this.deferredItemId);
                this.deferredItemId = null;
            }

            if (this.inLoadingMode) {
                this.inLoadingMode = false;
                view.setLoading(false);
            }
        }

    }
});
