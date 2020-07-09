Ext.define('criterion.controller.settings.payroll.CertifiedRateDetail', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_payroll_settings_certified_rate_detail',

        handlePositionChange : function(cmp) {
            var position = cmp.getSelection();

            position && this.getViewModel().get('record').set({
                positionCode : position.get('code'),
                positionTitle : position.get('title')
            });
        },

        handleIncomeChange : function(cmp) {
            var rec = cmp.getSelection();

            rec && this.getViewModel().get('record').set({
                incomeListName : rec.get('description'),

                deductionId : null,
                deductionName : null,
                employeeAmount : null,
                employerAmount : null
            });
        },

        handleDeductionChange : function(cmp) {
            var deduction = cmp.getSelection(),
                newCalcMethodCode = deduction && deduction.get('deductionCalcMethodCode'),
                record = this.getViewModel().get('record');

            if (deduction) {
                if (record.get('deductionCalcMethodCode') !== newCalcMethodCode) {
                    record.set({
                        employeeAmount : null,
                        employerAmount : null
                    });
                }

                record.set({
                    deductionName : deduction.get('description'),
                    deductionCalcMethodCode : newCalcMethodCode,
                    incomeListId : null,
                    incomeListName : null,
                    rate : null
                });
            }
        },

        handleRateTypeChange : function(cmp, value) {
            let record = this.getViewModel().get('record');

            switch (value) {
                case criterion.Consts.CERTIFIED_RATE_DETAIL_TYPE.BASE.value:
                    record.set({
                        incomeListId : null,
                        incomeListName : null,
                        deductionId : null,
                        deductionName : null,
                        employeeAmount : null,
                        employerAmount : null
                    });
                    break;
                case criterion.Consts.CERTIFIED_RATE_DETAIL_TYPE.INCOME.value:
                    record.set({
                        deductionId : null,
                        deductionName : null,
                        employeeAmount : null,
                        employerAmount : null
                    });
                    break;
                case criterion.Consts.CERTIFIED_RATE_DETAIL_TYPE.DEDUCTION.value:
                    record.set({
                        incomeListId : null,
                        incomeListName : null,
                        rate : null
                    });
                    break;
                }
        }
    };
});
