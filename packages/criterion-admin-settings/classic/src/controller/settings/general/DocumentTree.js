Ext.define('criterion.controller.settings.general.DocumentTree', function() {

    const API = criterion.consts.Api.API,
        DOCUMENT_LOCATION_TYPE = criterion.Consts.DOCUMENT_LOCATION_TYPE;

    return {
        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_document_tree',

        requires : [
            'criterion.view.common.DocumentAttachForm',
            'criterion.view.common.Document',
            'criterion.view.common.DocumentFolder',
            'criterion.view.common.EmployerDocumentFolder',
            'criterion.view.employee.EmployeePicker',
            'criterion.ux.form.FillableWebForm',
            'criterion.model.employer.Form',
            'criterion.view.settings.general.EmployerDataForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.document.Base'
        ],

        showTitleInConnectedViewMode : true,
        editor : {
            xtype : 'criterion_common_document',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar',
                    height : 'auto',
                    width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                }
            ],
            draggable : false
        },
        editorCompanyForm : {
            xtype : 'criterion_settings_general_employer_dataform',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar',
                    height : 'auto',
                    width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                }
            ],
            draggable : false
        },

        handleEditAction(record) {
            this.edit(record);

            this.toggleAutoSync(false);
        },

        getConnectParentView() {
            return this.folderEdit ? false : this.callParent(arguments);
        },

        getDocumentLocation() {
            return this.getViewModel().get('documentLocation');
        },

        getCurrentEmployeeId() {
            return this.getViewModel().get('currentEmployeeId');
        },

        edit(record) {
            let documentLocation = this.getDocumentLocation();

            if (record.get('leaf')) {
                this.folderEdit = false;
                if (documentLocation === DOCUMENT_LOCATION_TYPE.COMPANY_FORM) {
                    this.startEdit(record, this.editorCompanyForm);
                } else {
                    this.startEdit(record, this.getEditor());
                }
            } else {
                this.folderEdit = true;
                this.startEdit(record, {
                    xtype : documentLocation === DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT ? 'criterion_common_employer_document_folder' : 'criterion_common_document_folder',
                    allowDelete : false,
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            modal : true,
                            height : 'auto',
                            width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                        }
                    ],
                    modal : true,
                    draggable : false
                });
            }
        },

        createEditor(editorCfg, record) {
            let editor = this.callParent(arguments),
                documentLocation = this.getDocumentLocation();

            if (documentLocation === DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT) {
                editor.getViewModel().set({
                    shareText : i18n.gettext('Public'),
                    hideEmployeeGroups : false
                });
            } else if (documentLocation !== DOCUMENT_LOCATION_TYPE.COMPANY_FORM) {
                editor.getViewModel().set({
                    allowChangeLocation : true,
                    currentEmployeeId : this.getCurrentEmployeeId()
                });
            }

            return editor;
        },

        checkAllowAdding() {
            return this.getViewModel().get('allowAdding') ? true : i18n.gettext('Please select an Employee');
        },

        handleAddClick() {
            let checkResult = this.checkAllowAdding(),
                documentLocation = this.getDocumentLocation();

            if (checkResult !== true) {
                criterion.Utils.toast(checkResult);
                return;
            }

            let me = this,
                selected = this.getView().getSelectionModel().getSelected(),
                documentAttachWindow,
                isEmployerDoc = documentLocation === DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT,
                mode = isEmployerDoc ? criterion.Consts.ATTACHMENTS_CONFIG.MODE_ADMIN : criterion.Consts.ATTACHMENTS_CONFIG.MODE_PERSON,
                parentDocumentId = null;

            if (selected.getCount()) {
                parentDocumentId = this.findParentNodeId(selected.last());
            }

            if (documentLocation === DOCUMENT_LOCATION_TYPE.COMPANY_FORM) {
                this.folderEdit = false;
                this.startEdit(Ext.create('criterion.model.employer.Form', {
                    employerId : this.getEmployerId(),
                    parentDocumentId : parentDocumentId
                }), this.editorCompanyForm);
            } else {
                documentAttachWindow = Ext.create('criterion.view.common.DocumentAttachForm', {
                    employerId : this.getEmployerId(),
                    employeeId : this.getCurrentEmployeeId(),
                    documentLocation : !isEmployerDoc ? this.getDocumentLocation() : null,
                    mode : mode,
                    callback : Ext.Function.bind(this.load, this),
                    uploadUrl : isEmployerDoc ? API.EMPLOYER_DOCUMENT_UPLOAD : API.EMPLOYEE_DOCUMENT_UPLOAD,
                    parentNodeId : parentDocumentId
                }).show();

                documentAttachWindow.on('close', function() {
                    me.setCorrectMaskZIndex(false);
                });

                documentAttachWindow.show();

                me.setCorrectMaskZIndex(true);
            }
        },

        addNewFolder(name) {
            let me = this,
                view = this.getView(),
                selected = view.getSelectionModel().getSelected(),
                parentDocumentId = null,
                isEmployerDoc = this.getDocumentLocation() < 0,
                data = {
                    description : name
                };

            if (selected.getCount()) {
                parentDocumentId = this.findParentNodeId(selected.last());
            }

            data.parentDocumentId = parentDocumentId;

            if (isEmployerDoc) {
                data.employerId = this.getEmployerId();
            } else {
                data.employeeId = this.getCurrentEmployeeId();
                data.documentLocationCd = this.getDocumentLocation();
            }

            view.setLoading(true);
            criterion.Api.requestWithPromise({
                method : 'POST',
                url : isEmployerDoc ? API.EMPLOYER_DOCUMENT_ADD_FOLDER : API.EMPLOYEE_DOCUMENT_ADD_FOLDER,
                jsonData : data
            }).then(() => {
                view.setLoading(false);

                me.load();
            }, () => {
                view.setLoading(false);
            });
        },

        handleChangeDocumentLocation(cmp, value, old) {
            if (!old) {
                return;
            }

            let view = this.getView(),
                vm = this.getViewModel();

            vm.set('isCommonDocument', value !== DOCUMENT_LOCATION_TYPE.COMPANY_FORM);

            if (value === DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT) {
                view.setStore(vm.getStore('employerDocumentTree'));
                this.load();
            } else if (value === DOCUMENT_LOCATION_TYPE.COMPANY_FORM) {
                view.setStore(vm.getStore('employerFormTree'));
                this.load();
            } else {
                view.setStore(vm.getStore('employeeDocumentTree'));

                if (this.getCurrentEmployeeId()) {
                    this.load();
                }
            }
        },

        onAttachmentView(record) {
            if (this.getDocumentLocation() === DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT) {
                window.location.href = criterion.Api.getSecureResourceUrl(API.EMPLOYER_DOCUMENT_DOWNLOAD + record.get('id'));
            } else {
                let recordId = record.get('id');

                if (!record.get('webformId')) {
                    window.location.href = criterion.Api.getSecureResourceUrl(API.EMPLOYEE_DOCUMENT_DOWNLOAD + recordId)
                } else {
                    let formContainer = Ext.create('criterion.ux.Panel', {
                        layout : {
                            type : 'vbox',
                            align : 'center'
                        },
                        scrollable : true,
                        title : record.get('description'),
                        plugins : [
                            {
                                ptype : 'criterion_sidebar',
                                width : criterion.Consts.UI_DEFAULTS.MODAL_SCREEN_WIDTH,
                                height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                                modal : true
                            }
                        ],
                        bbar : [
                            {
                                xtype : 'button',
                                text : i18n.gettext('Save as PDF'),
                                handler : function() {
                                    window.location.href = criterion.Api.getSecureResourceUrl(API.EMPLOYEE_DOCUMENT_DOWNLOAD + recordId);
                                }
                            },
                            '->',
                            {
                                xtype : 'button',
                                text : i18n.gettext('Close'),
                                handler : function() {
                                    formContainer.close();
                                }
                            }
                        ],
                        items : [
                            {
                                xtype : 'criterion_fillable_webform'
                            }
                        ]
                    });

                    formContainer.down('criterion_fillable_webform').loadForm(recordId);
                    formContainer.show();
                }
            }
        },

        onEmployerChange() {
            let vm = this.getViewModel();

            vm.getStore('employeeDocumentTree').removeAll();

            vm.set({
                documentLocation : DOCUMENT_LOCATION_TYPE.COMPANY_DOCUMENT,
                currentEmployeeId : null,
                currentEmployeeName : i18n.gettext('- select employee -')
            });

            this.load();
        },

        load(opts) {
            let currentEmployeeId = this.getCurrentEmployeeId(),
                documentLocation = this.getDocumentLocation(),
                dfd = Ext.create('Ext.Deferred');

            if (documentLocation > 0 && !currentEmployeeId) {
                dfd.resolve();

                return dfd.promise;
            }

            return this.callParent(arguments);
        },

        getAdditionalParams() {
            let currentEmployeeId = this.getCurrentEmployeeId(),
                documentLocation = this.getDocumentLocation();

            return {
                params : Ext.Object.merge(
                    documentLocation > 0 ? {
                        documentLocationCd : documentLocation,
                    } : {},
                    currentEmployeeId ? {
                        employeeId : currentEmployeeId
                    } : {}
                )
            };
        },

        handleEmployeeSearch() {
            let me = this,
                vm = me.getViewModel(),
                picker = Ext.create('criterion.view.employee.EmployeePicker', {
                    isActive : true,
                    employerId : this.getEmployerId()
                });

            picker.on('select', function(employee) {
                vm.set({
                    currentEmployeeId : employee.get('employeeId'),
                    currentEmployeeName : employee.get('fullName')
                });

                me.load();
            });

            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        handleRemoveAction(record) {
            let me = this;

            criterion.Msg.confirmDelete(
                {
                    title : i18n.gettext('Delete'),
                    message : record.get('leaf') ? i18n.gettext('Do you want to delete this file?') : i18n.gettext('Do you want to delete this folder, subfolders and subfiles?')
                },
                btn => {
                    if (btn === 'yes') {
                        me.actRemove(record, this.getDocumentLocation() < 0);
                    }
                }
            );
        },

        handleBeforeDropAction : function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
            dropHandlers.wait = true;

            criterion.Msg.confirm(
                i18n.gettext('Move'),
                data['records'][0].get('leaf') ? i18n.gettext('Do you want to move this file?') : i18n.gettext('Do you want to move this folder, subfolders and subfiles?'),
                btn => {
                    if (btn === 'yes') {
                        dropHandlers.processDrop();
                    } else {
                        dropHandlers.cancelDrop();
                    }
                }
            );
        }
    };

});
