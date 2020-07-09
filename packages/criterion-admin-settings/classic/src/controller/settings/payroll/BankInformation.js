Ext.define('criterion.controller.settings.payroll.BankInformation', function() {

    var API = criterion.consts.Api.API,
        maxFileSize = criterion.Consts.ATTACHMENTS_CONFIG.MAX_FILE_SIZE_MB,
        bytesInMb = criterion.Consts.ATTACHMENTS_CONFIG.BYTES_IN_MB,
        file;

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_payroll_bank_information',

        requires : [
            'criterion.ux.form.Panel'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleSelectFile : function(event, cmp) {
            cmp && cmp.setValidation(true);

            file = event.target && event.target.files && event.target.files.length && event.target.files[0];

            if (file && file.size > maxFileSize * bytesInMb) {
                cmp && cmp.setValidation(Ext.util.Format.format('Max File size is {0} MB', maxFileSize));
            }
        },

        handleRecordLoad : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                transfers = vm.getStore('transfers'),
                checkLayouts = vm.getStore('checkLayouts');

            view.setLoading(true);

            Ext.promise.Promise.all([
                criterion.CodeDataManager.getCodeDetailRecordStrict('code', criterion.Consts.TRANSFER_TYPE.ACH, criterion.consts.Dict.TRANSFER_TYPE),
                criterion.CodeDataManager.getCodeDetailRecordStrict('code', criterion.Consts.REPORT_TYPE.CHECK_LAYOUT, criterion.consts.Dict.REPORT_TYPE)
            ]).then(function(response) {
                if (!response || response.length < 2) {
                    return
                }

                criterion.Api.requestWithPromise({
                    url : API.EMPLOYER_BANK_ACCOUNT_MAX_FILE_SIZE,
                    method : 'GET',
                    silent : true
                }).then(function(mFileSize) {
                    maxFileSize = mFileSize;
                });

                var achTransferTypeRecord = response[0],
                    checkStyleReportRecord = response[1];

                Ext.promise.Promise.all([
                    transfers.loadWithPromise({
                        params : {
                            transferTypeCds : achTransferTypeRecord.getId()
                        }
                    }),
                    checkLayouts.loadWithPromise({
                        params : {
                            reportTypeCd : checkStyleReportRecord.getId()
                        }
                    })
                ]).always(function() {
                    view.setLoading(false);
                });
            }).otherwise(function() {
                view.setLoading(false);
            });
        },

        onAfterSaveBankAccount : function(view, record) {
            // upload signature file
            if (file) {
                criterion.Api.submitFakeForm([], {
                    url : API.EMPLOYER_BANK_ACCOUNT_UPLOAD,
                    scope : this,
                    extraData : {
                        signature : file,
                        id : record.getId()
                    }
                });
            }

            this.resetSignatureField();
        },

        onAfterRender : function() {
            var view = this.getView(),
                viewEl = view.getEl(),
                signatureFile = this.lookup('signatureFile');

            viewEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    viewEl.addCls('drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    file = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];

                    if (file) {
                        signatureFile.inputEl.dom.value = file.name;
                    }

                    viewEl.removeCls('drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    viewEl.removeCls('drag-over');
                }
            });
        },

        handleAfterRecordLoad : function(record) {
            var signatureFileName = record.get('signatureFileName');

            if (signatureFileName) {
                this.lookup('signatureFile').setRawValue(signatureFileName);
            }
        },

        resetSignatureField : function() {
            var signatureFileField = this.lookup('signatureFile');

            file = null;
            signatureFileField && signatureFileField.reset();
        },

        handleGeneratePreNote : function() {
            let me = this,
                record  = this.getRecord(),
                employerBankAccountId = record.getId(),
                selectPopup;

            selectPopup = Ext.create('criterion.ux.form.Panel', {
                title : i18n.gettext('Select Date Period'),
                modal : true,
                draggable : true,
                cls : 'criterion-modal',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        height : 'auto',
                        modal : true
                    }
                ],

                layout : 'vbox',
                bodyPadding : 20,

                items : [
                    {
                        xtype : 'datefield',
                        fieldLabel : i18n.gettext('Start Date'),
                        name : 'startDate',
                        submitFormat : criterion.consts.Api.DATE_FORMAT,
                        allowBlank : false
                    },
                    {
                        xtype : 'datefield',
                        fieldLabel : i18n.gettext('End Date'),
                        name : 'endDate',
                        submitFormat : criterion.consts.Api.DATE_FORMAT,
                        allowBlank : false
                    }
                ],

                buttons : [
                    '->',
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-light',
                        handler : function() {
                            this.up('criterion_form').fireEvent('cancel');
                        },
                        text : i18n.gettext('Cancel')
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        handler : function() {
                            let form = this.up('criterion_form');

                            if (form.isValid()) {
                                form.fireEvent('change', form.getValues());
                            }
                        },
                        text : i18n.gettext('Select')
                    }
                ]
            });

            selectPopup.on('cancel', function() {
                selectPopup.destroy();
            });
            selectPopup.on('change', function(data) {
                me.generatePreNote(data, employerBankAccountId);

                selectPopup.destroy();
            });
            selectPopup.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            selectPopup.show();

            me.setCorrectMaskZIndex(true);
        },

        generatePreNote : function(data, employerBankAccountId) {
            let view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_BANK_ACCOUNT_GENERATE_PRE_NOTE,
                method : 'POST',
                jsonData : Ext.apply({
                    employerBankAccountId : employerBankAccountId
                }, data)
            }).then(response => {
                view.setLoading(false);

                if (response && Ext.isObject(response)) {
                    window.location.href = criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_DOWNLOAD_FILE + response.id);
                }
            }).always(() => {
                view.setLoading(false);
            });
        }
    };
});
