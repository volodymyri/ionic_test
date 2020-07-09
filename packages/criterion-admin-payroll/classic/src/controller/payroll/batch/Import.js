Ext.define('criterion.controller.payroll.batch.Import', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_import',

        requires : [
            'criterion.view.common.FileAttachForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.ControlDeferredProcess'
        ],

        onShow() {
            this.load();
        },

        load() {
            let view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            vm.getStore('imports').loadWithPromise({
                params : {
                    payrollBatchId : vm.get('batchId')
                }
            }).always(function() {
                view.setLoading(false);
            })
        },

        handleCancel() {
            this.getView().destroy();
        },

        handleSubmit() {
            let me = this,
                view = this.getView(),
                selection = this.lookupReference('importGrid').getSelection(),
                record = selection.length && selection[0];

            if (record && !record.get('isAdded')) {
                view.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_SAVE_TO_BATCH + '/' + record.getId(),
                    method : 'POST'
                }).then({
                    success : function(res) {
                        if (me.isDelayedResponse(res)) {
                            me.controlDeferredProcess(
                                i18n.gettext('Save To Batch'),
                                i18n.gettext('Saving in progress'),
                                res.processId
                            );
                        } else {
                            me.processingCheckResult(res);
                        }
                    },
                }).always(function() {
                    view.setLoading(false);
                });
            }
        },

        processingCheckResult(res) {
            let view = this.getView();

            if (res.errors && res.errors.length) {
                let errors;

                errors = Ext.Array.map(res.errors, function(error) {
                    let errorInfo = criterion.consts.Error.getErrorInfo(error);

                    return error.employeeName + ': ' + errorInfo.description;
                });

                criterion.Msg.error({
                    title : i18n.gettext('Errors in saving imported data'),
                    message : errors.join('<br>')
                });
            } else {
                view.fireEvent('save');
                view.destroy();
            }
        },

        onGetErrors(record) {
            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.PAYROLL_IMPORT_GET_ERRORS_CSV + '/' + record.getId()));
        },

        onRemove(record) {
            let vm = this.getViewModel();

            vm.getStore('imports').remove(record);
            vm.getStore('imports').sync();
        },

        handleImportIncome() {
            let me = this,
                importDialog;

            importDialog = Ext.create('criterion.view.common.FileAttachForm', {
                title : i18n.gettext('Import File'),
                attachButtonText : i18n.gettext('Import'),
                modal : true,
                uploadUrl : API.PAYROLL_IMPORT_UPLOAD,
                maxFileSizeUrl : API.PAYROLL_IMPORT_MAX_FILE_SIZE,
                fileFieldName : 'file',
                extraFields : [
                    {
                        xtype : 'hiddenfield',
                        name : 'payrollBatchId',
                        value : me.getViewModel().get('batchId')
                    }
                ],
                callback : {
                    scope : me,
                    fn : me.load
                }
            });

            importDialog.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            importDialog.show();

            me.setCorrectMaskZIndex(true);
        },

        handleImportDeductions() {
            let me = this,
                importDialog,
                payrollBatchId = me.getViewModel().get('batchId'),
                extraFields = [
                    {
                        xtype : 'hiddenfield',
                        name : 'payrollBatchId',
                        value : payrollBatchId
                    },
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                        cls : 'criterion-btn-primary',
                        width : 60,
                        margin : '0 0 0 10',
                        listeners : {
                            click : () => {
                                window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(
                                    API.EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS_DOWNLOAD_TEMPLATE,
                                    payrollBatchId
                                )));
                            }
                        }
                    }
                ];

            importDialog = Ext.create('criterion.view.common.FileAttachForm', {
                title : i18n.gettext('Import Deductions'),
                attachButtonText : i18n.gettext('Import'),
                modal : true,
                uploadUrl : API.EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS_UPLOAD,
                maxFileSizeUrl : API.EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS_MAXFILESIZE,
                fileFieldName : 'file',
                extraFields : extraFields,
                layout : 'hbox',
                success : {
                    scope : me,
                    fn : me.importDeductions
                }
            });

            importDialog.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            importDialog.show();

            me.setCorrectMaskZIndex(true);
        },

        importDeductions(result) {
            if (result.hasErrors) {
                criterion.Msg.confirm(
                    i18n.gettext('Import Deductions'),
                    i18n.gettext('The file has been validated and errors were found. Would you like to look through them?'),
                    function(btn) {
                        if (btn === 'yes') {
                            window.open(
                                criterion.Api.getSecureResourceUrl(
                                    Ext.String.format(
                                        API.EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS_ERRORS,
                                        result.fileId
                                    )
                                ), '_blank'
                            );
                        } else {
                            criterion.Api.request({
                                url : Ext.String.format(API.EMPLOYER_PAYROLL_BATCH_IMPORT_DEDUCTIONS, result.fileId),
                                method : 'DELETE',
                                scope : this
                            });
                        }
                    }
                );
            } else {
                criterion.Utils.toast(i18n.gettext('Successfully imported.'));
                this.handleCancel();
            }
        },

        handleImportTimesheet() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);
            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.PAYROLL_IMPORT_TIMESHEET,
                method : 'POST',
                jsonData : {
                    payrollBatchId : vm.get('batchId')
                }
            })
                .then({
                    success : function() {
                        me.load();
                        view.setLoading(false);
                    },
                    failure : function() {
                        view.setLoading(false);
                    }
                })
        },

        onSelectionChange(grid, selection) {
            this.getViewModel().set('canBeSaved', selection.length && !selection[0].get('isAdded') || false);
        }

    };
});
