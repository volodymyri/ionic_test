Ext.define('criterion.controller.assignment.PayInformation', function() {
    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_assignment_pay_information',

        handleShow : function() {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView();

            view.setLoading(true);
            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.ASSIGNMENT_DETAIL_PAYMENT_DETAILS,
                method : 'GET',
                params : {
                    assignmentDetailId : vm.get('assignmentDetailId')
                }
            }).then(function(details) {
                view.setLoading(false);
                vm.set('details', details);
                me.makePayGroupDetail(details);
            })
        },

        makePayGroupDetail : function(details) {
            var vm = this.getViewModel(),
                payGroups = details.payGroups;

            if (payGroups.length === 1) {
                vm.set({
                    showPaygroup : false,
                    perPayPeriod : payGroups[0].perPayPeriod,
                    payFrequencyCd : payGroups[0].payFrequencyCd
                });
            } else if (payGroups.length > 1) {
                vm.getStore('payGroups').setData(payGroups);
                vm.set({
                    payGroupId : payGroups[0].payGroupId,
                    showPaygroup : true
                });
            } else {
                vm.set({
                    showPaygroup : false,
                    perPayPeriod : null,
                    payFrequencyCd : null
                });
            }
        },

        handleClose : function() {
            this.getView().destroy();
        },

        handleChangePaygroup : function(combo) {
            var vm = this.getViewModel(),
                data = combo.getSelection();

            vm.set({
                perPayPeriod : data.get('perPayPeriod'),
                payFrequencyCd : data.get('payFrequencyCd')
            });
        }
    };
});
