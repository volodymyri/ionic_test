/*
 * A simple reusable store that loads static calendar field definitions into memory
 * and can be bound to the CalendarCombo widget and used for calendar color selection.
 */
Ext.define('criterion.ux.calendar.data.MemoryCalendarStore', {
    extend: 'Ext.data.Store',
    model: 'criterion.ux.calendar.data.CalendarModel',
    
    requires: [
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'criterion.ux.calendar.data.CalendarModel',
        'criterion.ux.calendar.data.CalendarMappings'
    ],
    
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'calendars'
        },
        writer: {
            type: 'json'
        }
    },

    autoLoad: true
});
