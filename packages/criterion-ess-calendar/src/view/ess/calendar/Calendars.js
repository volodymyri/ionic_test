Ext.define('criterion.view.ess.calendar.Calendars', function() {

    return {

        alias : 'widget.criterion_selfservice_dashboard_calendars',

        extend : 'Ext.container.Container',

        requires : [
            'criterion.controller.ess.calendar.Calendars',
            'criterion.ux.calendar.CalendarPanel',
            'criterion.ux.calendar.util.Date',
            'criterion.ux.calendar.data.MemoryCalendarStore',
            'criterion.ux.calendar.data.MemoryEventStore',
            'criterion.ux.calendar.data.Events',
            'criterion.ux.calendar.data.Calendars',
            'criterion.ux.calendar.form.EventWindow',
            'criterion.store.employee.IcsCalendars',
            'criterion.view.ess.resources.MyCalendar',
            'criterion.model.employee.CalendarIcs'
        ],

        viewModel : {},

        controller : 'criterion_selfservice_dashboard_calendars',

        layout : 'card',

        initComponent : function() {
            this.getViewModel().setStores({
                calendars : Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.ESS_EMPLOYEE_CALENDARS.storeId)
            });

            this.callParent(arguments);
        }

    }
});
