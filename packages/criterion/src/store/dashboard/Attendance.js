Ext.define('criterion.store.dashboard.Attendance', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_attendance',

        model: 'criterion.model.dashboard.Attendance',
        autoLoad : false,
        autoSync : false
    };

});