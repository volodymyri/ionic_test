Ext.define('criterion.view.ess.Calendar', function() {

    return {
        alias : 'widget.criterion_selfservice_calendar',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.Calendar',
            'criterion.view.ess.calendar.Calendars',
            'criterion.view.ess.calendar.Events'
        ],

        controller : {
            type : 'criterion_selfservice_calendar'
        },

        viewModel : {},

        showHeaders : true,

        layout : {
            type : 'card',
            deferredRender : true
        },

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',

                items : [
                    {
                        xtype : 'criterion_selfservice_dashboard_calendars',
                        itemId : 'calendar',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.CALENDAR_MENU),
                        isSubMenu : true,
                        collapsible : false
                    },
                    {
                        xtype : 'criterion_selfservice_calendar_events',
                        itemId : 'events',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.EVENTS)
                    }
                ]
            }
        ]
    }
});
