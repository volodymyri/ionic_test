Ext.define('ess.controller.payroll.PayHistory', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_payroll_pay_history',

        onSelectedYearChange : function(cmp) {
            let vm = this.getViewModel(),
                payrolls = vm.getStore('payrolls'),
                employeeId = vm.get('employeeId'),
                selection = cmp.getSelection();

            selection && payrolls.load({
                params : {
                    employeeId : employeeId,
                    payDateYear : selection.get('value')
                }
            });
        },

        handlePainted : function() {
            let me = this,
                vm = this.getViewModel(),
                payDateYears = vm.get('payDateYears');

            payDateYears.removeAll();

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.PAYROLL_PAY_DATE_YEARS,
                method : 'GET'
            }).then(function(response) {
                if (response && Ext.isArray(response) && response.length > 0) {
                    payDateYears.add(Ext.Array.map(Ext.Array.sort(response, (a, b) => {
                        return a > b ? -1 : 1
                    }), payDateYear => {
                        return {
                            text : (new Date).getFullYear() === payDateYear ? 'Current Year' : payDateYear,
                            value : payDateYear
                        }
                    }));

                    me.lookup('payDateYearsCombo').setSelection(payDateYears.getAt(0));
                }
            });

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.PAYROLL_NEXT_PAY_DATE,
                method : 'GET'
            }).then(function(response) {
                if (response && response['nextPayDate']) {
                    vm.set('nextPayDate', response['nextPayDate'])
                } else {
                    vm.set('nextPayDate', null);
                }
            });
        },

        handleTapFullScreenButton : function(cmp) {
            let vm = this.getViewModel();

            vm.set('payHistoryExpanded', !vm.get('payHistoryExpanded'));
        }
    }
});