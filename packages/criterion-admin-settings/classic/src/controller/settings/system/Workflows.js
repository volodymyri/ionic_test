Ext.define('criterion.controller.settings.system.Workflows', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_workflows',

        load : function() {
            var employerId = this.getEmployerId();

            if (employerId) {
                this.getView().getStore().load({
                    scope : this,
                    params : {
                        employerId : employerId
                    }
                });
            }
        }

    };

});