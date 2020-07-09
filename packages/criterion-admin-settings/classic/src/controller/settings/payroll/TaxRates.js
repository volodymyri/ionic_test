Ext.define('criterion.controller.settings.payroll.TaxRates', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_tax_rates',

        requires : [
            'criterion.view.settings.payroll.TaxRate'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAdd : function() {
            var me = this,
                view = Ext.create('criterion.view.settings.payroll.TaxRate', {
                viewModel : {
                    data : {
                        record : this.addRecord(this.getEmptyRecord()),
                        employerId : this.getEmployerId(),
                        blockedTaxes : me.getViewModel().getStore('employerTaxes')
                    }
                },
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            });
            view.on('saved', function() {
                me.load();
            });
            view.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            view.show();

            me.setCorrectMaskZIndex(true);
        }

    };

});
