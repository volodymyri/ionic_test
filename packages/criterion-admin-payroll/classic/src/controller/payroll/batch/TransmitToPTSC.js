Ext.define('criterion.controller.payroll.batch.TransmitToPTSC', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_transmit_to_ptsc',

        handleTransmit : function() {
            var view = this.getView(),
                batchRecord = this.getViewModel().get('batchRecord');

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_GENERATE_PERIODIC_CERIDIAN_XML,
                method : 'POST',
                jsonData : {
                    batchId : batchRecord.getId()
                }
            }).then({
                    success : function() {
                        criterion.Utils.toast(i18n.gettext('Successfully.'));
                        view.setLoading(false);
                        view.fireEvent('batchUpdated');
                        view.destroy();
                    },
                    failure : function() {
                        criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                        view.setLoading(false);
                    }
                }
            );
        },

        handleCancelClick : function() {
            this.getView().destroy();
        }
    };
});
