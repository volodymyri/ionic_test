Ext.define('criterion.controller.ess.calendar.Events', function() {

    return {

        extend : 'criterion.controller.ess.calendar.event.List',

        alias : 'controller.criterion_selfservice_calendar_events',

        suppressIdentity : ['employeeContext'],

        handleSetCompEvents : function(data) {
            this.getViewModel().set(data);
        }
    };
});
