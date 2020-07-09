Ext.define('criterion.controller.settings.system.TaxEngine', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_system_tax_engine',

        load(opts = {}) {
            let mergeOptions = {
                    params : {}
                },
                showInactive = this.lookup('showInactive'),
                countryCd = this.getViewModel().get('countryCd');

            if (showInactive && !showInactive.getValue()) {
                mergeOptions.params.isActive = true;
            }

            if (countryCd) {
                mergeOptions.params.countryCd = countryCd
            } else {
                return;
            }

            this.callParent([Ext.apply({}, Ext.merge(opts, mergeOptions))]);
        },

        handleChangeFilter() {
            this.load();
        }

    };

});
