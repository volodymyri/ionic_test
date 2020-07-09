Ext.define('criterion.model.weekEvent', function() {

    const EVENT_TYPES = criterion.Consts.EVENT_TYPES;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.WEEK_EVENT
        },

        fields : [
            {
                name : 'parameters'
            },
            {
                name : 'eventType',
                type : 'string'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'entityId',
                type : 'integer',
            },
            {
                name : 'isWeek',
                type : 'boolean',

                persist : false
            },
            {
                name : 'title',
                type : 'string',

                persist : false,
                calculate : function(data) {
                    if (!data || !data.parameters || !data.parameters.length) {
                        return;
                    }

                    return Ext.util.Format.format('<span class="event-title {1}">{0}</span>', data.parameters[0], data.entityId ? 'clickable' : '');
                }
            },
            {
                name : 'description',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    let event = data['eventType'] && EVENT_TYPES[data['eventType']],
                        parameters = data.parameters && data.parameters.length && data.parameters.slice(1),
                        date;

                    if (Ext.Array.contains([EVENT_TYPES.EE_BIRTHDAY.code, EVENT_TYPES.EE_ANNIVERSARY.code], data['eventType'])) {
                        date = Ext.Date.format(data.date, criterion.consts.Api.WEEK_EVENT_SHORT_DATE_FORMAT);
                    } else {
                        date = Ext.Date.format(data.date, criterion.consts.Api.WEEK_EVENT_DATE_FORMAT);
                    }

                    data.title && parameters.unshift(data.title);

                    return event && Ext.util.Format.format.apply(this, Ext.Array.merge([event.message], parameters, [date]));
                }
            },
            {
                name : 'redirectTo',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    let event = data && data.eventType && EVENT_TYPES[data.eventType],
                        entityId = data && data.entityId;

                    if (!event || !event.redirectTo || !entityId) {
                        return;
                    }

                    return event.redirectTo + '/' + entityId;
                }
            }
        ]
    };
});
