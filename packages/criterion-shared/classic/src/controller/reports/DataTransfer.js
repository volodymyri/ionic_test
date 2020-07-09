Ext.define('criterion.controller.reports.DataTransfer', function() {

    var downloadableResult = false;

    return {
        extend : 'criterion.app.ViewController',
        alias : 'controller.criterion_reports_datatransfer',

        requires : [
            'criterion.ux.form.ReportParameter'
        ],

        handleActivate : function() {
            var view = this.getView(),
                transfers = this.getViewModel().getStore('transfers');

            view.setLoading(true);
            criterion.CodeDataManager.getCodeDetailRecordStrict('code', 'DATA_TRANSFER', criterion.consts.Dict.TRANSFER_TYPE).then(function(dataTransferTypeRecord) {
                dataTransferTypeRecord && transfers.getProxy().setExtraParam('transferTypeCd', dataTransferTypeRecord.getId());
                transfers.loadWithPromise();
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleSetDownloadableResult : function(res) {
            downloadableResult = res;
        },

        handleDataTransferChange : function(cmp, value) {
            if (value) {
                this.lookup('transferOptions').loadTransferOptions(value);
            }
        },

        handleTransferExec : function(cmp) {
            var view = this.getView(),
                transferOptionsEl = this.lookup('transferOptions'),
                transferId = this.getViewModel().get('transferId');

            if (transferOptionsEl.isValidForm()) {
                var parameters = transferOptionsEl.getReportParams(),
                    extraData = {};

                cmp.setDisabled(true);
                view.setLoading(true);

                Ext.Array.each(parameters, function(parameter) {
                    extraData[parameter.get('name')] = parameter.get('value');
                });

                criterion.Api.submitFakeForm(transferOptionsEl.getFormItems(), {
                    url : Ext.util.Format.format(criterion.consts.Api.API.TRANSFER_EXECUTE, transferId),
                    extraData : extraData,
                    scope : this,
                    success : function(result) {
                        cmp.setDisabled(false);
                        view.setLoading(false);
                        if (downloadableResult) {
                            window.open(criterion.Api.getSecureResourceUrl(Ext.util.Format.format(criterion.consts.Api.API.TRANSFER_DOWNLOAD, result.fileName, result.hash)));
                        }
                        if (result.outputLog) {
                            var logPanel = Ext.create('Ext.form.Panel', {
                                title : i18n.gettext('Status'),
                                plugins : [
                                    {
                                        ptype : 'criterion_sidebar',
                                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                                        modal : true
                                    }
                                ],

                                modal : true,
                                layout : 'fit',
                                cls : ['criterion-form'],
                                items : [
                                    {
                                        xtype : 'textarea',
                                        readOnly : true,
                                        value : result.outputLog,
                                        padding : '17 15',
                                        cls : 'bordered transfer-status'
                                    }
                                ],
                                buttons : [
                                    '->',
                                    {
                                        xtype : 'button',
                                        cls : 'criterion-btn-light',
                                        text : i18n.gettext('Close'),
                                        handler : function() {
                                            logPanel.close();
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        cls : 'criterion-btn-primary',
                                        text : i18n.gettext('Export as .txt'),
                                        handler : function() {
                                            var a = document.createElement("a"),
                                                fileName = 'outputLog.txt',
                                                file = new Blob([result.outputLog], {type : 'text/plain;charset=utf-8'});

                                            if (window.navigator.msSaveOrOpenBlob) { // IE10+
                                                window.navigator.msSaveOrOpenBlob(file, fileName);
                                            } else { // Others
                                                var url = URL.createObjectURL(file);
                                                a.href = url;
                                                a.download = fileName;
                                                document.body.appendChild(a);
                                                a.click();
                                                setTimeout(function() {
                                                    document.body.removeChild(a);
                                                    window.URL.revokeObjectURL(url);
                                                }, 0);
                                            }
                                        }
                                    }
                                ]
                            });
                            logPanel.show();
                        }
                    },
                    failure : function() {
                        cmp.setDisabled(false);
                        view.setLoading(false);
                    }
                });
            }
        }
    }
});
