Ext.define('criterion.controller.employee.payroll.form.DeductionForm', function() {

    const DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employee_payroll_form_deduction',

        load : function(record) {
            let vm = this.getViewModel(),
                view = this.getView(),
                employerDeductions = vm.getStore('employerDeductions'),
                deductionFrequencies = vm.getStore('deductionFrequencies'),
                employerBankAccounts = vm.getStore('employerBankAccounts'),
                employerId = vm.get('employer.id');

            view.setLoading(true);

            Ext.promise.Promise.all([
                employerDeductions.loadWithPromise({
                    params : {
                        employerId : employerId,
                        isActive : true
                    }
                }),
                deductionFrequencies.loadWithPromise(),
                employerBankAccounts.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                })
            ])
                .then({
                    scope : this,
                    success : function() {
                        vm.set({
                            record : record
                        });
                    }
                }).always(function() {
                view.setLoading(false);
            })
        },

        handleRecordLoad : function(record) {
            let deduction = record.get('deduction'),
                employeeGarnishment = record.getEmployeeGarnishment();

            deduction && record.set('contributionTypeCd', deduction.contributionTypeCd);

            if (record.phantom || !employeeGarnishment) {
                employeeGarnishment = Ext.create('criterion.model.employee.deduction.EmployeeGarnishment', {employeeDeductionId : record.getId()});
            }

            this.getViewModel().set('employeeGarnishment', employeeGarnishment);
        },

        handleChangeDeduction : function(cmp, value) {
            let vm = this.getViewModel(),
                deductionRec = cmp.getSelection(),
                record = this.getRecord(),
                pooledParent;

            if (!deductionRec) {
                return;
            }

            pooledParent = deductionRec.getPooledParent();

            vm.set({
                isInPool : deductionRec.get('isPool'),
                pooledParent : pooledParent
            });

            if (record.phantom) {
                // While creating employee_deduction, initialize the values from deduction, employee_amount and employer_amount
                record.set({
                    employeeAmount : deductionRec.get('employeeAmount'),
                    employerAmount : deductionRec.get('employerAmount'),
                    deductionCalcMethodCd : deductionRec.get('deductionCalcMethodCd'),
                    contributionTypeCd : deductionRec.get('contributionTypeCd'),
                    deductionLimitCd : deductionRec.get('deductionLimitCd'),
                    employerMatch : deductionRec.get('employerMatch')
                });

                if (pooledParent) {
                    record.set({
                        employeeLimit : pooledParent.get('employeeLimit'),
                        employerLimit : pooledParent.get('employerLimit')
                    });
                } else {
                    record.set({
                        employeeLimit : deductionRec.get('employeeLimit'),
                        employerLimit : deductionRec.get('employerLimit')
                    });
                }
            }
        },

        handleDeductionCalcMethodChange : function(cmp, val) {
            let code = val ? cmp.getSelection().get('code') : null,
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
        },

        updateRecord : function(record, handler) {
            // skipping record update - here form working on vm record
            Ext.isFunction(handler) ? handler.call(this, record) : null;
        },

        handleRecordUpdate : function() {
            let view = this.getView(),
                record = this.getRecord(),
                superFn = this.superclass.handleRecordUpdate,
                me = this,
                employeeGarnishment = this.getViewModel().get('employeeGarnishment');

            record.setEmployeeGarnishment(employeeGarnishment);

            if (employeeGarnishment.dirty) {
                record.dirty = true;
            }

            view.setLoading('Validating..');

            Ext.promise.Promise.all([
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_DEDUCTION_CHECK_WARNINGS,
                    method : 'GET',
                    params : {
                        employeeId : record.get('employeeId'),
                        deductionId : record.get('deductionId'),
                        effectiveDate : Ext.Date.format(record.get('effectiveDate'), criterion.consts.Api.DATE_FORMAT)
                    }
                })
            ]).then(function(result) {
                let checkWarningsResult = result[0];

                if (checkWarningsResult.length) {
                    let info = criterion.consts.Error.getErrorInfo(checkWarningsResult[0]),
                        msg = 'Do you want to proceed with following warnings? <br>' + info.description;

                    criterion.Msg.confirm(i18n.gettext('Save Deduction'), msg, function(btn) {
                        if (btn === 'yes') {
                            superFn.call(me, record);
                        }
                    }, this);
                } else {
                    superFn.call(me, record);
                }
            }, null, null, this)
                .always(function() {
                    view.setLoading(false);
                })
        },

        handleEmployeeAmountChange : function(cmp, value) {
            let record = this.getRecord();

            if (record.get('deductionCalcMethodCode') !== DEDUCTION_CALC_METHOD_CODES.GARNISHMENT) {
                record.set('employeeAmount', Ext.isNumeric(value) ? value : null, {silent : true});
            }
        },

        handleEmployerAmountChange : function(cmp, value) {
            let record = this.getRecord();

            if (cmp.disabled) {
                return;
            }

            if (!Ext.Array.contains([DEDUCTION_CALC_METHOD_CODES.GARNISHMENT, DEDUCTION_CALC_METHOD_CODES.FORMULA], record.get('deductionCalcMethodCode'))) {
                record.set('employerAmount', Ext.isNumeric(value) ? value : null, {silent : true});
            }
        }

    };
});
