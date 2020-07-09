Ext.define('criterion.store.dashboard.UpcomingEvents', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_upcoming_events',

        model: 'criterion.model.dashboard.UpcomingEvent',
        autoLoad : false,
        autoSync : false
    };

});