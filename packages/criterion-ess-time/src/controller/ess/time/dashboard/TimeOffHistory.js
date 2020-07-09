Ext.define('criterion.controller.ess.time.dashboard.TimeOffHistory', function() {

    return {
        extend : 'criterion.app.ViewController',
        
        alias : 'controller.criterion_selfservice_time_dashboard_time_off_history',

        load : function() {
            this.lookupReference('list').getController().load();
        }
       
    };
});
