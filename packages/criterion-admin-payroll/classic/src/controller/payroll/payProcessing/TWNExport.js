Ext.define('criterion.controller.payroll.payProcessing.TWNExport', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_pay_processing_twn_export',

        handleExport : function() {
            var vm = this.getViewModel(),
                view = this.getView();

            if (!view.isValid()) {
                return;
            }

            vm.set('allowExport', false);

            criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_EXPORT_TWN,
                jsonData : {
                        batchId : vm.get('batchId')
                    },
                    method : 'POST'
                }
            ).then(function() {
                vm.set('allowExport', true);
                criterion.Msg.success(i18n.gettext('The Work Number export successful.'));
            }, function() {
                vm.set('allowExport', true);
            });
        }
    };
});
