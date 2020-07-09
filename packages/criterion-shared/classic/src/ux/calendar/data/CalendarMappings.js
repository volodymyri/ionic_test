//@define criterion.ux.calendar.data.CalendarMappings

/**
 * @class criterion.ux.calendar.data.CalendarMappings
 * A simple object that provides the field definitions for Calendar records so that they can be easily overridden.
 *
 * To ensure the proper definition of criterion.ux.calendar.data.EventModel the override should be
 * written like this:
 *
 *      Ext.define('MyApp.data.CalendarMappings', {
 *          override: 'criterion.ux.calendar.data.CalendarMappings'
 *      },
 *      function () {
 *          // Update "this" (this === criterion.ux.calendar.data.CalendarMappings)
 *      });
 */
Ext.ns('criterion.ux.calendar.data');

criterion.ux.calendar.data.CalendarMappings = {
    CalendarId: {
        name:    'CalendarId',
        mapping: 'id',
        type:    'int'
    },
    Title: {
        name:    'Title',
        mapping: 'title',
        type:    'string'
    },
    Description: {
        name:    'Description', 
        mapping: 'desc',   
        type:    'string' 
    },
    ColorId: {
        name:    'ColorId',
        mapping: 'color',
        type:    'int'
    },
    IsHidden: {
        name:    'IsHidden',
        mapping: 'hidden',
        type:    'boolean'
    }
};
