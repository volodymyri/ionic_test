Ext.define('criterion.controller.settings.employeeEngagement.Communities', function() {

    return {
        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_communities',

        load : function(opts) {
            return this.callParent([
                {
                    params : Ext.apply({
                        withEmployeeCount : true
                    }, opts || {})
                }
            ]);
        }
    };

});
