Ext.define('criterion.controller.mixin.document.Base', {

    mixinId : 'document_base',

    requires : [
        'criterion.view.common.DocumentMassUpload'
    ],

    /**
     * 0 as root
     */
    findParentNodeId(selectedRec) {
        let val;

        if (!selectedRec) {
            return null;
        }

        if (selectedRec.isLeaf()) {
            val = selectedRec.parentNode.getId();
        } else {
            val = selectedRec.getId();
        }

        return val === 'root' ? null : val;
    },

    handleAddFolder() {
        let checkResult = this.checkAllowAdding();

        if (checkResult !== true) {
            criterion.Utils.toast(checkResult);
            return;
        }

        let me = this,
            formContainer = Ext.create('criterion.ux.form.Panel', {
                layout : {
                    type : 'vbox',
                    align : 'center'
                },

                title : i18n.gettext('Add Folder'),

                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],
                modal : true,
                draggable : false,

                bodyPadding : '10 0',

                buttons : [
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        cls : 'criterion-btn-light',
                        handler : () => {
                            formContainer.close();
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Create'),
                        cls : 'criterion-btn-primary',
                        handler : () => {
                            if (formContainer.isValid()) {
                                me.addNewFolder(formContainer.down('[name=description]').getValue());
                                formContainer.close();
                            }
                        }
                    }
                ],

                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Name'),
                        allowBlank : false,
                        name : 'description'
                    }
                ]
            });

        formContainer.show();
        formContainer.down('[name=description]').focus();
    },

    actRemove(record, isEmployerDoc) {
        let me = this,
            view = this.getView(),
            data = {
                documentId : record.getId()
            };

        if (isEmployerDoc) {
            data.employerId = this.getEmployerId();
        } else {
            data.employeeId = this.getCurrentEmployeeId();
            data.documentLocationCd = this.getDocumentLocation();
        }

        view.setLoading(true);

        criterion.Api.requestWithPromise({
            method : 'POST',
            url : isEmployerDoc ? criterion.consts.Api.API.EMPLOYER_DOCUMENT_DELETE_ITEM : criterion.consts.Api.API.EMPLOYEE_DOCUMENT_DELETE_ITEM,
            jsonData : data
        }).then(_ => {
            view.setLoading(false);

            me.load();
        }, _ => {
            view.setLoading(false);
        });
    },

    handleDropAction(node, data, overModel, dropPosition, eOpts) {
        let me = this,
            view = this.getView(),
            dragRecord = data['records'][0],
            documentId = dragRecord.getId(),
            destinationRecord = overModel,
            documentLocation = this.getDocumentLocation(),
            isEmployerDoc = documentLocation < 0,
            parentDocumentId = destinationRecord.get('leaf') ? destinationRecord.get('parentDocumentId') : (dropPosition === 'before' ? destinationRecord.get('parentDocumentId') : destinationRecord.getId()),
            jsonData = {
                documentId : documentId,
                parentDocumentId : parentDocumentId
            };

        if (isEmployerDoc) {
            jsonData.employerId = this.getEmployerId();
        } else {
            jsonData.employeeId = this.getCurrentEmployeeId();
            jsonData.documentLocationCd = documentLocation;
        }

        view.setLoading(true);
        criterion.Api.requestWithPromise({
            method : 'POST',
            url : isEmployerDoc ? criterion.consts.Api.API.EMPLOYER_DOCUMENT_MOVE_ITEM : criterion.consts.Api.API.EMPLOYEE_DOCUMENT_MOVE,
            jsonData : jsonData
        }).then(() => {
            view.setLoading(false);

            me.load();
        }, () => {
            view.setLoading(false);
        });
    },

    handleMassUpload() {
        const ATTACHMENTS_CONFIG = criterion.Consts.ATTACHMENTS_CONFIG;

        let me = this,
            vm = this.getViewModel(),
            mode = this.getView().mode,
            isCompanyDocument = !!vm.get('isCompanyDocument'),
            cEmployeeId = vm.get('currentEmployeeId'),
            documentLocation,
            currentEmployeeId,
            isMassEmployeeUpload,
            employerId;

        if (mode === ATTACHMENTS_CONFIG.MODE_PERSON) {
            documentLocation = this.getDocumentLocation && this.getDocumentLocation();
            currentEmployeeId = this.getEmployeeId && this.getEmployeeId();
        } else {
            documentLocation = !isCompanyDocument ? vm.get('documentLocation') : null;
            currentEmployeeId = cEmployeeId;
        }

        employerId = this.getEmployerId && this.getEmployerId();

        isMassEmployeeUpload = mode === ATTACHMENTS_CONFIG.MODE_ADMIN && !isCompanyDocument && !cEmployeeId;

        let massUploadForm = Ext.create('criterion.view.common.DocumentMassUpload', {
            viewModel : {
                data : {
                    mode,
                    isCompanyDocument,
                    documentLocation,
                    currentEmployeeId,
                    isMassEmployeeUpload,
                    employerId
                }
            }
        });

        massUploadForm.on('uploaded', () => {
            me.load();
        });
        massUploadForm.show();
    }
});
