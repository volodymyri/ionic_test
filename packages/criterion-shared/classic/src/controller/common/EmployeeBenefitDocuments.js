Ext.define('criterion.controller.common.EmployeeBenefitDocuments', function() {

    const API = criterion.consts.Api.API,
          bytesInMb = criterion.Consts.ATTACHMENTS_CONFIG.BYTES_IN_MB,
          maxFileSize = criterion.Consts.ATTACHMENTS_CONFIG.MAX_FILE_SIZE_MB;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_common_employee_benefit_documents',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init() {
            let view = this.getView();

            this.callParent(arguments);

            delete view.uploadStorage;
            view.uploadStorage = {};
        },

        load(employeeBenefitId) {
            let view = this.getView(),
                dfd = Ext.create('Ext.Deferred');

            this.getView().getStore().loadWithPromise({
                params : {
                    employeeBenefitId : employeeBenefitId
                }
            }).then(() => {
                delete view.uploadStorage;
                view.uploadStorage = {};

                dfd.resolve();
            });

            return dfd.promise;
        },

        handleRemove(rec) {
            let view = this.getView(),
                store = view.getStore();

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete document'),
                    message : i18n.gettext('Do you want to delete the document?')
                }, btn => {
                    if (btn === 'yes') {
                        delete view.uploadStorage[rec.getId()];
                        store.remove(rec);
                    }
                }
            );
        },

        handleDownload(rec) {
            let view = this.getView();

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(view.getDownloadURL(), rec.getId())
            ));
        },

        createUploadForm() {
            let file,
                uploadForm;

            return uploadForm = Ext.create('criterion.ux.form.Panel', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        height : 'auto',
                        modal : true
                    }
                ],

                title : i18n.gettext('Add File'),

                viewModel : {
                    data : {
                        name : ''
                    }
                },

                listeners : {
                    afterrender : 'handleAfterRender',
                    scope : 'this'
                },

                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Name'),
                        name : 'documentName',
                        allowBlank : false,
                        bind : '{name}'
                    },
                    {
                        xtype : 'filefield',
                        fieldLabel : i18n.gettext('File'),
                        name : 'attachment',
                        reference : 'fileField',
                        flex : 1,
                        buttonText : i18n.gettext('Browse'),
                        emptyText : i18n.gettext('Drop File here or browse'),
                        buttonOnly : false,
                        allowBlank : false,
                        listeners : {
                            change : function(cmp, value) {
                                cmp.setRawValue(value.replace(/C:\\fakepath\\/g, ''));
                            },
                            afterrender : function(cmp) {
                                cmp.fileInputEl.on('change', function(event) {
                                    cmp.fireEvent('onselectfile', event, cmp);
                                });
                            },
                            onselectfile : function(event, cmp) {
                                let maxSize = maxFileSize,
                                    form = cmp.up('criterion_form');

                                cmp && cmp.setValidation(true);
                                file = event.target && event.target.files && event.target.files[0];
                                cmp.tmpFile = null;

                                if (maxSize) {
                                    maxSize = maxSize * bytesInMb;
                                }

                                form.getViewModel().set('name', file.name.split('.')[0]);

                                if (file.size > maxSize) {
                                    cmp && cmp.setValidation(Ext.util.Format.format('Max File size is {0} MB', Math.round(maxSize / bytesInMb)));
                                } else {
                                    Ext.defer(() => {
                                        let documentNameField = form.down('[name=documentName]');

                                        documentNameField.clearInvalid();
                                        documentNameField.focus();
                                    }, 100);
                                }
                            }
                        }
                    }
                ],

                buttons : [
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-light',
                        scale : 'small',
                        text : i18n.gettext('Cancel'),
                        handler : function() {
                            uploadForm.fireEvent('cancel');
                        }
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        cls : 'criterion-btn-primary',
                        text : i18n.gettext('Add'),
                        handler : function() {
                            uploadForm.fireEvent('addFile', uploadForm.getViewModel().get('name'), file);
                        }
                    }
                ],

                handleAfterRender() {
                    let viewEl = uploadForm.getEl(),
                        fileField = this.down('[reference=fileField]');

                    viewEl.on({
                        dragover : function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            viewEl.addCls('drag-over');
                        },
                        drop : function(e) {
                            let maxSize = maxFileSize;

                            e.preventDefault();
                            e.stopPropagation();
                            file = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];
                            if (file) {
                                fileField.inputEl.dom.value = file.name;
                                fileField.fileInputEl.el.dom.value = '';
                                fileField.tmpFile = file;
                            }

                            if (maxSize) {
                                maxSize = maxSize * bytesInMb;
                            }

                            uploadForm.getViewModel().set('name', file.name.split('.')[0]);

                            if (file.size > maxSize) {
                                fileField && fileField.setValidation(Ext.util.Format.format('Max File size is {0} MB', Math.round(maxSize / bytesInMb)));
                            }
                            viewEl.removeCls('drag-over');
                        },
                        dragleave : function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            viewEl.removeCls('drag-over');
                        }
                    });
                }
            });
        },

        handleAddDocument() {
            let me = this,
                view = this.getView(),
                store = view.getStore(),
                uploadForm;

            uploadForm = this.createUploadForm();

            uploadForm.show();
            uploadForm.focusFirstField();
            me.setCorrectMaskZIndex(true);

            uploadForm.on('cancel', () => {
                uploadForm.destroy();
                me.setCorrectMaskZIndex(false);
            });

            uploadForm.on('addFile', (documentName, file) => {
                if (uploadForm.isValid()) {
                    let newRec = store.add({
                        documentName : documentName
                    })[0];

                    view.uploadStorage[newRec.getId()] = [
                        {
                            name : 'documentName',
                            value : documentName
                        },
                        {
                            name : 'attachment',
                            value : file
                        }
                    ];

                    me.setCorrectMaskZIndex(false);
                    uploadForm.destroy();
                }
            })
        },

        syncDocuments(employeeBenefitId) {
            let view = this.getView(),
                store = view.getStore(),
                seq = [];

            Ext.Array.each(store.getRemovedRecords(), removed => {
                seq.push(removed.eraseWithPromise())
            });

            Ext.Object.each(view.uploadStorage, (key, fields) => {
                seq.push(criterion.Api.submitFormWithPromise({
                    url : API.EMPLOYEE_BENEFIT_DOCUMENT_UPLOAD,
                    fields : fields,
                    extraData : {
                        employeeBenefitId : employeeBenefitId
                    }
                }));
            });


            return Ext.promise.Promise.all(seq);
        }

    };
});
