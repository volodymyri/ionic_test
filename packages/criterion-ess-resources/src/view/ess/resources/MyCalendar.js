Ext.define('criterion.view.ess.resources.MyCalendar', function() {

    return {

        alias : 'widget.criterion_selfservice_resources_my_calendar',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.resources.MyCalendar',
            'criterion.ux.calendar.CalendarPanel',
            'criterion.ux.calendar.util.Date',
            'criterion.ux.calendar.CalendarPanel',
            'criterion.ux.calendar.data.MemoryCalendarStore',
            'criterion.ux.calendar.data.MemoryEventStore',
            'criterion.ux.calendar.data.Events',
            'criterion.ux.calendar.data.Calendars',
            'criterion.ux.calendar.form.EventWindow'
        ],

        mixins : [
            'criterion.ux.mixin.TitleReplaceable'
        ],

        config : {
            record : null
        },

        controller : 'criterion_selfservice_resources_my_calendar',

        layout : 'fit',

        frame : true,

        ui : 'no-footer',

        initComponent : function() {
            this.items = [
                {
                    xtype : 'calendarpanel',
                    reference : 'calendarPanel',

                    eventStore : Ext.create('criterion.ux.calendar.data.MemoryEventStore', {
                        data : {
                            data : []
                        }
                    }),
                    calendarStore : Ext.create('criterion.ux.calendar.data.MemoryCalendarStore', {
                        data : criterion.ux.calendar.data.Calendars.getData()
                    }),

                    showDayView : false,
                    showWeekView : false,
                    showTime : false,
                    showNavBar : false,
                    highlightEventDay : true,

                    monthViewCfg : {
                        showHeader : true,
                        showWeekLinks : false,
                        showWeekNumbers : false,
                        enableDD : false,
                        trackMouseOver : false
                    }
                }
            ];

            this.callParent(arguments);
        },

        updateRecord : function(record) {
            this.record = record;
            this.getController().loadData();
        }

    }
});
