Ext.define('criterion.controller.settings.benefits.Deduction', function() {

    const CONST = criterion.Consts,
        DEDUCTION_CALC_METHOD_CODES = CONST.DEDUCTION_CALC_METHOD_CODES,
        PAY_TYPE_CODES = CONST.PAY_TYPE_CODES;

    return {
        alias : 'controller.criterion_settings_deduction',

        extend : 'criterion.controller.FormView',

        handleRecordLoad : function(record) {
            let vm = this.getViewModel(),
                view = this.getView(),
                employerDeductions = vm.getStore('employerDeductions'),
                employerDeductionsPoolWithoutParent = vm.getStore('employerDeductionsPoolWithoutParent'),
                employerId = criterion.Api.getEmployerId(),
                pooledParent = record.getPooledParent();

            vm.set('pooledParent', pooledParent);

            if (pooledParent) {
                record.set({
                    employeeLimit : pooledParent.get('employeeLimit'),
                    employerLimit : pooledParent.get('employerLimit')
                });
            }

            view.setLoading(true);

            Ext.promise.Promise.all([
                employerDeductions.loadWithPromise({
                    params : {
                        employerId : employerId,
                        isActive : true
                    }
                }),
                employerDeductionsPoolWithoutParent.loadWithPromise({
                    params : {
                        employerId : employerId,
                        isActive : true,
                        isPool : true,
                        isWithoutParent : true
                    }
                })
            ]).always(() => {
                view.setLoading(false);
            });
        },

        handleDeductionCalcMethodChange : function(combo, val) {
            let code = val ? combo.getStore().getById(val).get('code') : null,
                payTypeCombo = this.lookup('payTypeCombo'),
                record = this.getViewModel().get('record');

            switch (code) {
                case DEDUCTION_CALC_METHOD_CODES.AMOUNT:
                case DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS:
                case DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_AMOUNT:
                    record.set('employerMatch', null);
                    break;

                case DEDUCTION_CALC_METHOD_CODES.AMOUNT_MATCH:
                case DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH:
                    record.set('employerAmount', null);
                    break;
            }

            if (code && Ext.Array.contains([DEDUCTION_CALC_METHOD_CODES.AMOUNT, DEDUCTION_CALC_METHOD_CODES.AMOUNT_MATCH, DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_AMOUNT], code)) {
                payTypeCombo.store.clearFilter();

                payTypeCombo.store.filterBy(function(record) {
                    let attributeValue = record.get('attribute2'),
                        codeValue = record.get('code');

                    return (
                        (!attributeValue || attributeValue === '1') && codeValue !== PAY_TYPE_CODES.CUSTOM &&
                        (
                            ((code === DEDUCTION_CALC_METHOD_CODES.AMOUNT || code === DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_AMOUNT) && codeValue !== PAY_TYPE_CODES.REGULAR_AND_SUPPLEMENTAL) ||
                            code === DEDUCTION_CALC_METHOD_CODES.AMOUNT_MATCH
                        )
                    );
                });
            } else {
                payTypeCombo.setFilterValues({
                    attribute : 'attribute2',
                    value : '1'
                });
            }
        },

        handleAfterRecordLoad : function(record) {
            this.callParent(arguments);
            this.lookupReference('employerDeductionLabelsCombo').loadValuesForRecord(record);
        },

        onAfterSave : function(view, record) {
            let me = this,
                employerDeductionLabelsCombo = this.lookup('employerDeductionLabelsCombo');

            if (!employerDeductionLabelsCombo) {
                return;
            }

            employerDeductionLabelsCombo.saveValuesForRecord(record).then(function() {
                view.fireEvent('afterSave', view, record);
                me.close();
            });
        },

        handleEmployeeContributionPercentChange(cmp, value) {
            if (!this.getViewModel().get('employeeAmountIsPercentEnabled')) {
                return;
            }

            this.employeeContributionChange(value);
        },

        handleEmployeeContributionAmountChange(cmp, value) {
            if (!this.getViewModel().get('employeeAmountIsNotPercentEnabled')) {
                return;
            }

            this.employeeContributionChange(value);
        },

        employeeContributionChange(value) {
            let record = this.getRecord();

            if (record.get('deductionCalcMethodCode') !== DEDUCTION_CALC_METHOD_CODES.GARNISHMENT) {
                record.set('employeeAmount', Ext.isNumeric(value) ? value : null, {silent : true});
            }
        },

        handleEmployerContributionPercentChange(cmp, value) {
            if (!this.getViewModel().get('employerAmountIsPercentEnabled')) {
                return;
            }

            this.employerContributionChange(value);
        },

        handleEmployerContributionAmountChange(cmp, value) {
            if (!this.getViewModel().get('employerAmountIsCurrencyEnabled')) {
                return;
            }

            this.employerContributionChange(value);
        },

        employerContributionChange(value) {
            let record = this.getRecord();

            if (!Ext.Array.contains([DEDUCTION_CALC_METHOD_CODES.GARNISHMENT, DEDUCTION_CALC_METHOD_CODES.FORMULA], record.get('deductionCalcMethodCode'))) {
                record.set('employerAmount', Ext.isNumeric(value) ? value : null, {silent : true});
            }
        }
    }
});
