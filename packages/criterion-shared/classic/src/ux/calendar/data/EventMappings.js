//@define criterion.ux.calendar.data.EventMappings
/**
 * @class criterion.ux.calendar.data.EventMappings
 * A simple object that provides the field definitions for Event records so that they can
 * be easily overridden.
 *
 * To ensure the proper definition of criterion.ux.calendar.data.EventModel the override should be
 * written like this:
 *
 *      Ext.define('MyApp.data.EventMappings', {
 *          override: 'criterion.ux.calendar.data.EventMappings'
 *      },
 *      function () {
 *          // Update "this" (this === criterion.ux.calendar.data.EventMappings)
 *      });
 */
Ext.ns('criterion.ux.calendar.data');

criterion.ux.calendar.data.EventMappings = {
    EventId : {
        name : 'EventId',
        mapping : 'id',
        type : 'string'
    },
    CalendarId : {
        name : 'CalendarId',
        mapping : 'cid',
        type : 'int'
    },
    Title : {
        name : 'Title',
        mapping : 'title',
        type : 'string'
    },
    StartDate : {
        name : 'StartDate',
        mapping : 'start',
        type : 'date',
        dateFormat : criterion.consts.Api.DATE_FORMAT
    },
    EndDate : {
        name : 'EndDate',
        mapping : 'end',
        type : 'date',
        dateFormat : criterion.consts.Api.DATE_FORMAT
    },
    Location : {
        name : 'Location',
        mapping : 'loc',
        type : 'string'
    },
    Notes : {
        name : 'Notes',
        mapping : 'notes',
        type : 'string'
    },
    Url : {
        name : 'Url',
        mapping : 'url',
        type : 'string'
    },
    IsAllDay : {
        name : 'IsAllDay',
        mapping : 'ad',
        type : 'boolean'
    },
    Reminder : {
        name : 'Reminder',
        mapping : 'rem',
        type : 'string'
    },
    IsNew : {
        name : 'IsNew',
        mapping : 'n',
        type : 'boolean'
    },
    Recurrence : {
        name : 'Recurrence',
        mapping : 'r',
        type : 'boolean'
    }
};
