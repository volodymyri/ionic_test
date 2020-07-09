Ext.define('criterion.controller.payroll.batch.Approval', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_approval',

        mixins : [
            'criterion.controller.mixin.ControlDeferredProcess'
        ],

        handleActivate : function() {
            var batchRecord = this.getViewModel().get('batchRecord'),
                approvalData = this.lookupReference('approvalData'),
                vm = this.getViewModel(),
                incomes = vm.getStore('incomes'),
                employeeTaxes = vm.getStore('employeeTaxes'),
                employeeDeductions = vm.getStore('employeeDeductions'),
                employerTaxes = vm.getStore('employerTaxes'),
                employerDeductions = vm.getStore('employerDeductions');

            approvalData.setLoading('Loading...', null);

            criterion.Api.request({
                url : criterion.consts.Api.API.REPORT_CHECK_ACCESS,
                method : 'GET',
                silent : true,
                params : {
                    name : 'payroll_summary_by_employee'
                },
                scope : this,
                success : function() {
                    vm.set('isHasAccessDownloadSummary', true);
                }
            });

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_SUMMARY,
                method : 'GET',
                params : {
                    batchId : batchRecord.getId()
                }
            })
                .then(
                    function(data) {
                        vm.set('batchSummary', data);

                        incomes.removeAll();
                        data.incomes && incomes.add(data.incomes);

                        employeeTaxes.removeAll();
                        data.employeeTaxes && employeeTaxes.add(data.employeeTaxes);

                        employeeDeductions.removeAll();
                        data.employeeDeductIns && employeeDeductions.add(data.employeeDeductIns);

                        employerTaxes.removeAll();
                        data.employerTaxes && employerTaxes.add(data.employerTaxes);

                        employerDeductions.removeAll();
                        data.employerDeductIns && employerDeductions.add(data.employerDeductIns);

                        // Payroll Total = Gross Income + Employer Taxes + Employer Deductions.
                        vm.set('totalCost', data.totalIncome + data.totalEmployerTax + data.totalEmployerDeductions);

                        approvalData.setLoading(false, null);
                    }
                )
        },

        reloadBatch : function() {
            var me = this,
                batchRecord = this.getViewModel().get('batchRecord'),
                view = this.getView();

            view.setLoading(true);
            batchRecord.loadWithPromise().then(function() {
                view.setLoading(false);
                me.handleActivate();
            })
        },

        onApproveClick : function() {
            var me = this,
                batchRecord = this.getViewModel().get('batchRecord'),
                view = this.getView();

            if (!batchRecord.get('canApprove')) {
                return;
            }

            view.setLoading(true);
            criterion.Api.requestWithPromise({
                url : Ext.String.format(criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_APPROVE, batchRecord.getId()),
                method : 'PUT'
            })
                .then({
                    success : function() {
                        view.setLoading(false);
                        me.reloadBatch();
                    }
                });
        },

        onDownloadSummary : function() {
            var me = this,
                batchRecord = this.getViewModel().get('batchRecord'),
                options = Ext.JSON.encode({
                    isDeferredRequest : true,
                    filters : [],
                    hiddenColumns : [],
                    orderBy : [
                        {
                            key : 'order_1',
                            fieldName : 'employee_name',
                            displayName : 'Employee Name'
                        },
                        {
                            key : 'order_2',
                            fieldName : 'title',
                            displayName : 'Title'
                        }
                    ],
                    groupBy : [],
                    parameters : [
                        {
                            name : 'employerId',
                            mandatory : true,
                            valueType : 'integer',
                            value : batchRecord.get('employerId')
                        },
                        {
                            name : 'batchId',
                            mandatory : false,
                            valueType : 'integer',
                            value : batchRecord.getId()
                        }
                    ]
                });

            criterion.Api.requestWithPromise({
                url : criterion.Api.getSecureResourceUrl(Ext.util.Format.format(criterion.consts.Api.API.PAYROLL_GENERATE_SUMMARY_REPORT, 'payroll_summary_by_employee', options))
            })
                .then(function(res) {
                    if (me.isDelayedResponse(res)) {
                        me.controlDeferredProcess(
                            i18n.gettext('Download'),
                            i18n.gettext('Preparing for download'),
                            res.processId
                        );
                    } else {
                        me.processingCheckResult(res);
                    }
                });
        },

        handlePrevClick : function() {
            this.getView().fireEvent('batchSaved', this.getViewModel().get('batchRecord'));
        },

        processingCheckResult : function(res) {
            let batchId;
            
            if (Ext.isObject(res.result)) {
                batchId = this.getViewModel().get('batchRecord').getId();
                
                window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(criterion.consts.Api.API.PAYROLL_DOWNLOAD_GENERATED_SUMMARY_REPORT, batchId, res.result.fileId)));
            }
        }
    };
});
