Ext.define('criterion.controller.settings.payroll.CertifiedRates', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_payroll_settings_certified_rates',

        load : function() {
            var employerId = this.getEmployerId();

            if (employerId) {
                this.getView().getStore().load({
                    params : {
                        employerId : employerId,
                        showInactive : this.lookup('showInactive').getValue()
                    }
                });
            }
        },

        handleChangeShowInactive : function() {
            this.load();
        }

    };

});
