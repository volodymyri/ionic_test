Ext.define('criterion.controller.settings.system.dataImport.Base', function() {
    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_data_import_base',

        mixins : [
            'criterion.controller.mixin.ControlDeferredProcess'
        ],

        beforeSubmit() {
            let view = this.getView(),
                form = view.up('form'),
                templateFileField = form.down('#templateFileField');

            form.setLoading(true);
            templateFileField.inputEl.setStyle('background-color', '#eee');
        },

        onSuccessSubmit() {
            let view = this.getView(),
                form = view.up('form'),
                templateFileField = view.up('form').down('#templateFileField');

            form.setLoading(false);
            templateFileField.inputEl.setStyle('background-color', '#fff');
        },

        onFailSubmit() {
            let view = this.getView(),
                form = view.up('form'),
                templateFileField = view.up('form').down('#templateFileField');

            form.setLoading(false);
            templateFileField.reset();
            templateFileField.inputEl.setStyle('background-color', '#fff');
        },

        isValidForm() {
            let view = this.getView(),
                form = view.up('form'),
                actionsCardPanel = view.down('#actionsCardPanel'),
                templateFileField = form.down('#templateFileField'),
                employerField = form.down('criterion_employer_combo'),
                activeForm;

            if (!employerField.isValid()) {
                return false;
            }

            if (!templateFileField.isValid()) {
                return false;
            }

            if (actionsCardPanel) {
                activeForm = actionsCardPanel.getLayout().getActiveItem();

                if (!activeForm.isValid()) {
                    return false;
                }
            }

            return true;
        },

        resetData() {
            let actionsCardPanel = this.getView().down('#actionsCardPanel'),
                activeForm;

            if (actionsCardPanel) {
                activeForm = actionsCardPanel.getLayout().getActiveItem();
            }

            if (activeForm) {
                activeForm.getForm().reset();
            }
        },

        deleteFile(url, fileId) {
            criterion.Api.request({
                url : Ext.String.format(url, fileId),
                method : 'DELETE',
                scope : this
            });
        },

        getSelectedEmployerId() {
            let view = this.getView(),
                form = view.up('form'),
                formViewModel = form.lookupViewModel(),
                selectedEmployer = formViewModel.get('employer');

            return selectedEmployer ? selectedEmployer.getId() : criterion.Api.getEmployerId();
        },

        pushForm(opts) {
            let me = this;

            criterion.Api.submitFakeForm(
                [],
                {
                    url : opts.submitAttributes.url,
                    scope : me,
                    extraData : opts.submitAttributes.data,
                    success : function(result) {
                        let fileId = result['fileId'];

                        me._opts = Ext.clone(opts);

                        me.onSuccessSubmit();
                        me.resetData();

                        if (result['hasErrors']) {
                            criterion.Msg.confirm(
                                opts.windowTitle,
                                opts.errorsFileAttributes.msg || i18n.gettext('The file has been validated and errors were found. Would you like to look through them?'),
                                function(btn) {
                                    if (btn === 'yes') {
                                        window.open(
                                            criterion.Api.getSecureResourceUrl(
                                                Ext.String.format(
                                                    opts.errorsFileAttributes.url,
                                                    fileId
                                                )
                                            ), '_blank'
                                        );
                                    } else {
                                        me.deleteFile(opts.processAttributes.url, fileId);
                                    }
                                }
                            );
                        } else {
                            criterion.Msg.confirm(
                                opts.windowTitle,
                                opts.processAttributes.msg || i18n.gettext('The file has been validated and no errors were found. Would you like to import the file?'),
                                function(btn) {
                                    if (btn === 'yes') {
                                        let url = Ext.String.format.apply(this, Ext.Array.push(
                                            [opts.processAttributes.url, fileId], opts.processAttributes.orderedParams || []
                                        ));

                                        if (opts.processAttributes.additionalParams && Ext.isObject(opts.processAttributes.additionalParams)) {
                                            url = Ext.urlAppend(url, Ext.Object.toQueryString(opts.processAttributes.additionalParams))
                                        }

                                        criterion.Api.requestWithPromise({
                                            url : url,
                                            method : 'PUT'
                                        }).then(function(res) {
                                            if (me.isDelayedResponse(res)) {
                                                me.controlDeferredProcess(
                                                    i18n.gettext('Import'),
                                                    i18n.gettext('Import in progress'),
                                                    res.processId
                                                );
                                            } else {
                                                me.processingCheckResult(res);
                                            }
                                        });
                                    } else {
                                        me.deleteFile(opts.processAttributes.url, fileId);
                                    }
                                }
                            );
                        }
                    },
                    failure : function() {
                        me.onFailSubmit();
                    },
                    owner : me
                },
                me.handleUploadProgress
            );
        },

        processingCheckResult(result) {
            let me = this,
                opts = me._opts,
                discrepanciesFileId = result && result['discrepanciesFileId'];

            if (discrepanciesFileId && opts.discrepanciesAttributes) {
                criterion.Msg.info(
                    opts.discrepanciesAttributes.msg,
                    function() {
                        window.open(
                            criterion.Api.getSecureResourceUrl(
                                Ext.String.format(
                                    opts.discrepanciesAttributes.url,
                                    discrepanciesFileId
                                )
                            )
                        );
                    }
                );
            }

            criterion.Utils.toast(i18n.gettext('Successfully imported.'));

            this.afterImport();
        },

        afterImport() {}
    }
});
