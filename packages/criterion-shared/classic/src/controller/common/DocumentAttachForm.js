Ext.define('criterion.controller.common.DocumentAttachForm', function() {

    const API = criterion.consts.Api.API,
        bytesInMb = criterion.Consts.ATTACHMENTS_CONFIG.BYTES_IN_MB,
        MODE_PERSON = criterion.Consts.ATTACHMENTS_CONFIG.MODE_PERSON;

    let maxFileSize = criterion.Consts.ATTACHMENTS_CONFIG.MAX_FILE_SIZE_MB,
        file;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_common_document_attach_form',

        requires : [
            'criterion.view.employee.EmployeePicker'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleShow : function() {
            Ext.Function.defer(function() {
                this.getView().getPlugins()[0].reCenter();
                this.lookup('closeBtn').focus();
            }, 200, this);
        },

        handleSelectFile : function(event, cmp) {
            cmp && cmp.setValidation(true);

            file = event.target && event.target.files && event.target.files.length && event.target.files[0];

            if (file && file.size > maxFileSize * bytesInMb) {
                cmp && cmp.setValidation(Ext.util.Format.format('Max File size is {0} MB', maxFileSize));
            }
        },

        handleChangeFormName : function(cmp, value, oldValue) {
            let form = cmp.getSelection();

            if (value === oldValue) {
                return;
            }

            this.lookup('description').setValue(form.get('name'));
            this.lookup('workflow').setValue(form.get('workflowId'));
            this.lookup('isShare').setValue(form.get('shareWithEmployee'));
        },

        handleAfterRender : function() {
            var view = this.getView(),
                viewEl = view.getEl(),
                vm = this.getViewModel(),
                mode = view.getMode(),
                document = this.lookup('document'),
                seq = [];

            view.setLoading(true);

            if (mode === MODE_PERSON) {
                seq.push(
                    vm.getStore('workflows').loadWithPromise(),
                    vm.getStore('forms').loadWithPromise({
                        params : {
                            documentLocationCd : view.getDocumentLocation()
                        }
                    })
                );
            }

            Ext.promise.Promise.all(seq).always(function() {
                view.setLoading(false);
            });

            criterion.Api.requestWithPromise({
                url : mode === MODE_PERSON ? API.EMPLOYEE_DOCUMENT_MAX_FILE_SIZE : API.EMPLOYER_DOCUMENT_MAX_FILE_SIZE,
                method : 'GET',
                silent : true
            }).then(function(mFileSize) {
                maxFileSize = mFileSize;
            });

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
                        document.inputEl.dom.value = file.name;

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

        handleAttach : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                document = this.lookup('document'),
                documentTypeCd = this.lookup('documentTypeCd'),
                formField = this.lookup('formName'),
                dueDate = this.lookup('dueDate'),
                workflow = this.lookup('workflow'),
                description = this.lookup('description'),
                isShare = this.lookup('isShare'),
                mode = view.getMode(),
                assignedEmployeeId = vm.get('assignedEmployeeId'),
                extraData,
                isWebForm;

            if (me.getView().getForm().isValid()) {
                view.setLoading(true);

                document.inputEl.setStyle('background-color', '#eee');

                if (vm.get('isCompanyForm')) {
                    isWebForm = formField.getSelection().get('isWebForm');

                    criterion.Api.request({
                        url : isWebForm ? criterion.consts.Api.API.DOCUMENT_WEBFORM_ASSIGN : criterion.consts.Api.API.DOCUMENT_DATAFORM_ASSIGN,
                        method : 'POST',
                        jsonData : Ext.Object.merge({
                            employeeId : view.getEmployeeId(),
                            parentDocumentId : view.getParentNodeId(),
                            documentLocationCd : view.getDocumentLocation(),
                            comment : description.getValue(),
                            dueDate : Ext.Date.format(dueDate.getValue(), criterion.consts.Api.DATE_FORMAT),
                            isShare : isShare.getValue(),
                            workflowId : workflow.getValue(),
                            assignedEmployeeId : assignedEmployeeId
                        }, (isWebForm ? {webformId : formField.getValue()} : {formId : formField.getValue()})),
                        success : function() {
                            Ext.callback(view.callback, me);
                            view.setLoading(false);
                            me.handleCancel();
                        },
                        failure : function() {
                            view.setLoading(false);
                        }
                    });
                } else {
                    extraData = {
                        parentDocumentId : view.getParentNodeId(),
                        documentLocationCd : view.getDocumentLocation(),
                        document : file
                    };

                    if (mode === MODE_PERSON) {
                        extraData.employeeId = view.getEmployeeId();
                    } else {
                        extraData.employerId = view.getEmployerId();
                    }

                    criterion.Api.submitFakeForm([documentTypeCd, description, isShare], {
                        url : view.getUploadUrl(),
                        scope : this,
                        extraData : extraData,
                        success : function() {
                            Ext.callback(view.callback, me);
                            view.setLoading(false);
                            me.handleCancel();
                        },
                        failure : function() {
                            view.setLoading(false);
                        },
                        owner : me,
                        initialWidth : document.inputEl.getWidth()
                    }, me.handleUploadProgress);
                }

                document.inputEl.setStyle('width', '1px');
            }
        },

        handleUploadProgress : function(event, owner, initialWidth) {
            var document = owner && owner.lookup('document');

            if (event.lengthComputable && document && document.inputEl) {
                document.inputEl.setWidth(parseInt(event.loaded / event.total * initialWidth, 10), true);
            }
        },

        handleCancel : function() {
            this.getView().destroy();
        },

        handleEmployeeSearch() {
            let me = this,
                vm = me.getViewModel(),
                picker = Ext.create('criterion.view.employee.EmployeePicker', {
                    isActive : true,
                    employerId : vm.get('workflow.selection.employerId')
                });

            picker.on('select', function(employee) {
                vm.set({
                    assignedEmployeeId : employee.get('employeeId'),
                    assignedEmployeeName : employee.get('fullName')
                });

            });

            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        handleClearAssignedEmployee() {
            this.getViewModel().set({
                assignedEmployeeName : null,
                assignedEmployeeId : null
            });
        }
    };
});
