Ext.define('criterion.controller.settings.payroll.GLTaxAddForm', function() {

    return {

        extend : 'criterion.controller.common.SelectTax',

        alias : 'controller.criterion_settings_payroll_gl_tax_add_form',

        afterPreloadDatas : function(datas) {
            var locationRecord = datas[0],
                me = this,
                vm = this.getViewModel();

            vm.getStore('gLAccounts').load({
                params : {
                    employerId : vm.get('employerId')
                },
                callback : function() {
                    if (locationRecord) {
                        me.lookupReference('location').setValue(locationRecord.get('geocode'));
                    }
                }
            });
        },

        handleAdd : function() {
            var record = this.getViewModel().get('record'),
                view = this.getView(),
                glAccount = this.lookupReference('glAccount'),
                selectionRecord = this.getGrid().getSelection()[0];

            if (!glAccount.getValue()) {
                glAccount.markInvalid('This field is required');
                return;
            }

            record.set('taxId', selectionRecord.get('id'));
            record.set('glAccountId', glAccount.getValue());

            record.save({
                success : function() {
                    view.fireEvent('saved');
                    view.destroy();
                }
            });
        }
    };

});
