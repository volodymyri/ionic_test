Ext.define('criterion.controller.ess.payroll.PayHistoryInfo', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_selfservice_payroll_pay_history_info',

        onDownloadReport : function() {
            var vm = this.getViewModel(),
                record = vm.get('record'),
                includeSSN = vm.get('includeSSN');

            var payDate = Ext.Date.format(record.get('payDate'), criterion.consts.Api.DATE_FORMAT);

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(criterion.consts.Api.API.EMPLOYEE_DOWNLOAD_PAY_CHECK_REPORT, payDate, includeSSN, record.getId())
            ));
        }
    };
});

