Ext.define('criterion.controller.settings.system.dataImport.PayrollData', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_payroll_data',

        loadStores : function() {
            let view = this.getView(),
                vm = view.getViewModel(),
                periodsStore = vm.getStore('periods'),
                employerPayrollPeriodSchedulesStore = vm.getStore('employerPayrollPeriodSchedules'),
                employerPayrollBatches = vm.getStore('employerPayrollBatches');

            view.setLoading(true);
            Ext.promise.Promise.all([
                periodsStore.loadWithPromise(),
                employerPayrollPeriodSchedulesStore.loadWithPromise(),
                employerPayrollBatches.loadWithPromise()
            ]).then(function() {
                view.setLoading(false);
            });
        },

        handleActivate : function() {
            this.loadStores();
        },

        onPayrollScheduleChange : function(combo, value) {
            let vm = this.getViewModel(),
                periodsStore = vm.getStore('periods');

            periodsStore.clearFilter();
            periodsStore.addFilter({
                property : 'payrollScheduleId',
                value : value
            });
        },

        submitHandler : function() {
            let me = this,
                view = this.getView(),
                actionsCardPanel = this.getView().down('#actionsCardPanel'),
                activeForm = actionsCardPanel.getLayout().getActiveItem(),
                data = activeForm.getForm().getValues();

            data.isImport = activeForm.isImport;
            data.payrollTemplate = this.templateFile;
            data.employerId = this.getSelectedEmployerId();

            criterion.Api.submitFakeForm([],
                {
                    url : view.importURL,
                    scope : this,
                    extraData : data,

                    success : function(o, xhr) {
                        let result = Ext.decode(xhr.responseText, true).result;

                        this.lookupReference('payrollBatches').getStore().load();

                        me.onSuccessSubmit();
                        me.resetData();

                        if (result['hasErrors']) {
                            criterion.Msg.confirm(
                                i18n.gettext('Pay Data Import'),
                                i18n.gettext('The file has been validated and errors were found. Would you like to look through them?'),
                                function(btn) {
                                    if (btn === 'yes') {
                                        window.open(
                                            criterion.Api.getSecureResourceUrl(
                                                Ext.String.format(view.errorsURL, result['fileId'])
                                            ), '_blank'
                                        );
                                    } else {
                                        me.deleteFile(view.dataURL, result['fileId']);
                                    }
                                }
                            );
                        } else {
                            if (data.isImport) {
                                criterion.Msg.confirm(
                                    i18n.gettext('Pay Data Import'),
                                    i18n.gettext('The file has been validated and no errors were found. Would you like to import the file?'),
                                    function(btn) {
                                        if (btn === 'yes') {
                                            criterion.Api.request({
                                                url : Ext.String.format(view.dataURL, result['fileId']) + '?' +
                                                Ext.Object.toQueryString(Ext.Object.merge({
                                                    payrollScheduleId : data.payrollScheduleId,
                                                    isImport : data.isImport,
                                                    employerId : data.employerId,
                                                    batchName : data.batchName,
                                                    multiplePeriodImport : data.multiplePeriodImport
                                                }, (data.multiplePeriodImport ? {} : {
                                                    payDate : data.payDate,
                                                    payrollPeriodId : data.payrollPeriodId
                                                }))),
                                                method : 'PUT',
                                                success : function(result) {
                                                    let discrepanciesFileId = result && result['discrepanciesFileId'];

                                                    if (discrepanciesFileId) {
                                                        criterion.Msg.info(
                                                            i18n.gettext('Payroll data has been validated. Please review the discrepancy report. <br />If the discrepancies are not acceptable, please delete the batch, <br />make required corrections and process the payroll validation again.'),
                                                            function() {
                                                                window.open(
                                                                    criterion.Api.getSecureResourceUrl(
                                                                        Ext.String.format(view.discrepanciesURL, discrepanciesFileId)
                                                                    )
                                                                );
                                                            }
                                                        );
                                                    }
                                                },
                                                callback : function(options, success, response) {
                                                    criterion.Utils.toast(i18n.gettext('Successfully imported.'));
                                                }
                                            });
                                        } else {
                                            me.deleteFile(view.dataURL, result['fileId']);
                                        }
                                    }
                                );
                            } else {
                                criterion.Msg.info(
                                    i18n.gettext('Payroll data validation'),
                                    function() {
                                        window.open(
                                            criterion.Api.getSecureResourceUrl(
                                                Ext.String.format(view.discrepanciesURL, result['fileId'])
                                            )
                                        );
                                    }
                                );
                            }
                        }
                    },
                    failure : function() {
                        me.onFailSubmit();
                    },
                    owner : me
                },
                me.handleUploadProgress
            );
        }
    }
});
