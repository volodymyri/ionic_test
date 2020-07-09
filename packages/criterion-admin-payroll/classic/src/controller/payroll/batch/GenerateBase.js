Ext.define('criterion.controller.payroll.batch.GenerateBase', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_generate_base',

        countApiUrl : null, // to define in inherited classes
        generateUrl : null, //
        downloadUrl : API.EMPLOYER_PAYROLL_BATCH_DOWNLOAD_FILE,
        numberOfPaymentsName : 'numberOfPayments',
        totalAmountName : 'totalAmount',

        handleShow() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                batchId = vm.get('batchId');

            view.setLoading(true);

            vm.set({
                numberOfPayments : 0,
                totalAmount : 0
            });

            criterion.Api.requestWithPromise({
                url : me.countApiUrl,
                params : {
                    batchId : batchId
                },
                method : 'GET'
            }).then(response => {
                vm.set({
                    numberOfPayments : response[me.numberOfPaymentsName],
                    totalAmount : response[me.totalAmountName]
                });
            }).always(() => {
                view.setLoading(false);
            });
        },

        handleGenerate() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                bankAccountCombo = this.lookupReference('bankAccountCombo'),
                bankAccount = bankAccountCombo.getValue(),
                batchId = vm.get('batchId');

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : me.generateUrl,
                method : 'POST',
                jsonData : {
                    batchId : batchId,
                    employerBankAccountId : bankAccount
                }
            }).then(response => {
                view.setLoading(false);

                if (response && Ext.isObject(response)) {
                    window.location.href = criterion.Api.getSecureResourceUrl(me.downloadUrl + response.id);
                }

                view.fireEvent('batchUpdated');
                view.destroy();
            }).always(() => {
                view.setLoading(false);
            });
        },

        handleCancelClick() {
            this.getView().destroy();
        }
    };
});
