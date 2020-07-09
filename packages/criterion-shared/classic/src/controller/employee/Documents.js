Ext.define('criterion.controller.employee.Documents', function() {

    const API = criterion.consts.Api.API;

    return {
        alias : 'controller.criterion_employee_documents',

        extend : 'criterion.controller.employee.GridView',

        requires : [
            'criterion.view.common.DocumentAttachForm',
            'criterion.view.common.Document',
            'criterion.view.common.DocumentFolder',
            'criterion.ux.form.FillableWebForm'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.document.Base'
        ],

        connectParentView : true,

        config : {
            documentLocation : null
        },

        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_common_document',
            allowDelete : true,
            bodyPadding : 10,
            plugins : {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            },
            viewModel : {
                formulas : {
                    hideSave : function(data) {
                        return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DOCUMENTS, criterion.SecurityManager.UPDATE, false, true));
                    },

                    hideDelete : function(data) {
                        return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DOCUMENTS, criterion.SecurityManager.DELETE, false, true));
                    }
                }
            }
        },

        getConnectParentView : function() {
            return this.folderEdit ? false : this.callParent(arguments);
        },

        getCurrentEmployeeId() {
            return this.getEmployeeId();
        },

        edit : function(record) {
            if (record.get('leaf')) {
                this.folderEdit = false;
                this.startEdit(record, this.getEditor());
            } else {
                this.folderEdit = true;
                this.startEdit(record, {
                    xtype : 'criterion_common_document_folder',
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

        createEditor : function(editorCfg, record) {
            var editor = this.callParent(arguments);

            editor.getViewModel().set({
                shareText : i18n.gettext('Share with Employee'),
                allowChangeLocation : true,
                currentEmployeeId : this.getCurrentEmployeeId(),
                employeeLevelDocumentLocations : Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.DOCUMENT_LOCATIONS.storeId)
            });
            return editor;
        },

        checkAllowAdding() {
            return true;
        },

        handleAddClick : function() {
            let checkResult = this.checkAllowAdding();

            if (checkResult !== true) {
                criterion.Utils.toast(checkResult);
                return;
            }

            let selected = this.getView().getSelectionModel().getSelected(),
                parentDocumentId = null;

            if (selected.getCount()) {
                parentDocumentId = this.findParentNodeId(selected.last());
            }

            Ext.create('criterion.view.common.DocumentAttachForm', {
                employeeId : this.getCurrentEmployeeId(),
                mode : criterion.Consts.ATTACHMENTS_CONFIG.MODE_PERSON,
                callback : Ext.Function.bind(this.load, this),
                uploadUrl : criterion.consts.Api.API.EMPLOYEE_DOCUMENT_UPLOAD,
                documentLocation : this.getDocumentLocation(),
                parentNodeId : parentDocumentId
            }).show();
        },

        addNewFolder : function(name) {
            let me = this,
                view = this.getView(),
                selected = view.getSelectionModel().getSelected(),
                parentDocumentId = null,
                data = {
                    description : name
                };

            if (selected.getCount()) {
                parentDocumentId = this.findParentNodeId(selected.last());
            }

            data.parentDocumentId = parentDocumentId;
            data.employeeId = this.getCurrentEmployeeId();
            data.documentLocationCd = this.getDocumentLocation();

            view.setLoading(true);
            criterion.Api.requestWithPromise({
                method : 'POST',
                url : API.EMPLOYEE_DOCUMENT_ADD_FOLDER,
                jsonData : data
            }).then(function() {
                view.setLoading(false);

                me.load();
            }, function() {
                view.setLoading(false);
            });
        },

        getAdditionalParams : function() {
            return {
                params : {
                    documentLocationCd : this.getDocumentLocation()
                }
            };
        },

        onAttachmentView : function(record) {
            var recordId = record.get('id'),
                webformId = record.get('webformId');

            if (!webformId) {
                window.location.href = criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYEE_DOCUMENT_DOWNLOAD + recordId)
            } else {
                var formContainer = Ext.create('criterion.ux.Panel', {
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
                                window.location.href = criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYEE_DOCUMENT_DOWNLOAD + recordId);
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
                    items : [{
                        xtype : 'criterion_fillable_webform'
                    }]
                });

                formContainer.down('criterion_fillable_webform').loadForm(recordId);
                formContainer.show();
            }
        },

        /**
         * Route refreshing is disabled to fix the issue https://perfecthr.atlassian.net/browse/CR-9407
         * @returns {null}
         */
        getHandleRoute : function() {
            return null;
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
                        me.actRemove(record, false);
                    }
                }
            );
        },

        handleBeforeDropAction : function(node, data, overModel, dropPosition, dropHandlers, eOpts) {
            // Defer the handling
            dropHandlers.wait = true;
            criterion.Msg.confirm(
                i18n.gettext('Move'),
                data['records'][0].get('leaf') ? i18n.gettext('Do you want to move this file?') : i18n.gettext('Do you want to move this folder, subfolders and subfiles?'),
                function(btn) {
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
