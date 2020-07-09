Ext.define('criterion.view.common.DocumentTree', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        ATTACHMENTS_CONFIG = criterion.Consts.ATTACHMENTS_CONFIG,
        bytesInMb = ATTACHMENTS_CONFIG.BYTES_IN_MB,
        SHOW_NAMES_LIMIT = 5;

    let maxFileSize = ATTACHMENTS_CONFIG.MAX_FILE_SIZE_MB,
        elementFromPoint,
        files = [],
        progress, uploadedSize = {}, filesSize = 0,
        isEmployeeRequired = false;

    return {

        alias : 'widget.criterion_common_document_tree',

        extend : 'Ext.tree.Panel',

        requires : [
            'criterion.store.employer.document.Tree',
            'criterion.store.employee.document.Tree'
        ],

        title : i18n.gettext('Documents'),

        viewModel : {
            data : {
                gridColumns : [
                    {
                        xtype : 'treecolumn',
                        text : 'Name',
                        dataIndex : 'description',
                        flex : 3,
                        sortable : true
                    },
                    {
                        xtype : 'criterion_codedatacolumn',
                        text : i18n.gettext('Type'),
                        dataIndex : 'documentTypeCd',
                        codeDataId : DICT.DOCUMENT_RECORD_TYPE,
                        flex : 2,
                        renderer : (value, metaData, record) => record.get('isFolder') ? '' : record.get('documentTypeDesc')
                    },
                    {
                        xtype : 'datecolumn',
                        dataIndex : 'dueDate',
                        text : i18n.gettext('Due Date'),
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'completedBy',
                        text : i18n.gettext('Completed by'),
                        flex : 2
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('File Name'),
                        dataIndex : 'fileName',
                        flex : 2
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Size'),
                        dataIndex : 'size',
                        align : 'right',
                        formatter : 'criterionFileSize',
                        flex : 1
                    },
                    {
                        xtype : 'datecolumn',
                        dataIndex : 'uploadDate',
                        text : i18n.gettext('Upload Date'),
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'booleancolumn',
                        header : i18n.gettext('Share'),
                        align : 'center',
                        dataIndex : 'isShare',
                        trueText : '✓',
                        falseText : '',
                        width : criterion.Consts.UI_DEFAULTS.COL_SMALL_WIDTH
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 2.5,
                        items : [
                            {
                                glyph : criterion.consts.Glyph['android-create'],
                                tooltip : i18n.gettext('Edit'),
                                action : 'editaction',
                                getClass : function(value, metaData) {
                                    return 'edit-btn';
                                }
                            },
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeaction'
                            },
                            {
                                glyph : criterion.consts.Glyph['ios7-download-outline'],
                                tooltip : i18n.gettext('Download'),
                                action : 'viewaction',
                                permissionAction : function(v, cellValues, record) {
                                    return record.get('leaf');
                                }
                            }
                        ]
                    }
                ]
            },

            stores : {
                employerDocumentTree : {
                    type : 'criterion_employer_document_tree',
                    listeners : {
                        load : function(store) {
                            store.getRoot().expand();
                        }
                    }
                },
                employeeDocumentTree : {
                    type : 'criterion_employee_document_tree',
                    listeners : {
                        load : function(store) {
                            store.getRoot().expand();
                        }
                    }
                }
            }
        },

        reserveScrollbar : true,
        useArrows : true,
        rootVisible : false,

        bind : {
            store : '{employerDocumentTree}',
            columns : '{gridColumns}'
        },

        selModel : {
            selType : 'rowmodel',
            mode : 'SINGLE',
            allowDeselect : true
        },

        uploadUrl : null,
        mode : null, // see ATTACHMENTS_CONFIG.MODE_*

        listeners : {
            activate : 'handleActivate',
            viewaction : 'onAttachmentView',
            editaction : 'handleEditAction',
            removeaction : 'handleRemoveAction',
            beforedrop : 'handleBeforeDropAction',
            drop : 'handleDropAction',
            render() {
                let me = this,
                    el = me.getEl && me.getEl(),
                    isCompanyForm = false;

                this.getViewModel().bind('{isCompanyForm}', value => isCompanyForm = value);

                if (this.mode === ATTACHMENTS_CONFIG.MODE_ADMIN) {
                    this.getViewModel().bind('{!isCompanyForm && !isCompanyDocument}', value => isEmployeeRequired = value);
                }

                if (el) {
                    el.on({
                        dragover : function(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            if (isCompanyForm || !me.mode) {
                                return;
                            }

                            el.addCls('drag-over');

                            if (elementFromPoint !== document.elementFromPoint(e.clientX, e.clientY)) {
                                elementFromPoint && elementFromPoint.removeCls('x-grid-item-over drag-over');

                                elementFromPoint = Ext.fly(document.elementFromPoint(e.clientX, e.clientY)).up('.x-grid-item');

                                if (elementFromPoint && elementFromPoint.down('[aria-expanded]')) {
                                    elementFromPoint.addCls('x-grid-item-over drag-over');
                                }
                            }
                        },
                        drop : function(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            if (isCompanyForm || !me.mode) {
                                return;
                            }

                            if (e.event.dataTransfer && e.event.dataTransfer.files) {
                                files = Ext.Array.clone(e.event.dataTransfer.files);
                            }

                            if (files.length) {
                                me.uploadFiles();
                            }

                            el.removeCls('drag-over');
                        },
                        dragleave : function(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            if (isCompanyForm || !me.mode) {
                                return;
                            }

                            el.removeCls('drag-over');
                        }
                    });
                }

                criterion.Api.requestWithPromise({
                    url : this.mode === ATTACHMENTS_CONFIG.MODE_PERSON ? API.EMPLOYEE_DOCUMENT_MAX_FILE_SIZE : API.EMPLOYER_DOCUMENT_MAX_FILE_SIZE,
                    method : 'GET',
                    silent : true
                }).then(function(mFileSize) {
                    maxFileSize = mFileSize;
                });
            }
        },

        uploadFiles() {
            let me = this,
                controller = this.getController && this.getController(),
                documentTypeRecord = criterion.CodeDataManager.getCodeDetailRecord('isDefault', true, DICT.DOCUMENT_RECORD_TYPE),
                documentTypeCd = documentTypeRecord && documentTypeRecord.getId(),
                tooBigFiles = Ext.Array.filter(files, file => {
                    return file.size / bytesInMb > maxFileSize;
                }),
                activeComponent = Ext.ComponentManager.fromElement(elementFromPoint),
                record = activeComponent && activeComponent.getRecord(elementFromPoint),
                parentNodeId = record && record.get('isFolder') && record.getId();

            if (!documentTypeCd) {
                criterion.Msg.warning(i18n.gettext('To drag-and-drop files, one of the default values in the Document Type code table should be turned ON.'));

                files = [];
                elementFromPoint && elementFromPoint.removeCls('x-grid-item-over drag-over');

                return;
            }

            if (tooBigFiles.length) {
                criterion.Msg.warning(
                    Ext.String.format(
                        i18n.gettext('Files exceed the configured size limit') + ' ({0} MB) ' + i18n.gettext('and cannot be uploaded.') + '<BR/><BR/>{1}',
                        maxFileSize, Ext.Array.pluck(tooBigFiles, 'name').join('<BR/>')
                    ),
                    _ => {
                        me.doUpload(parentNodeId, documentTypeCd, controller);
                    }
                );

                files = Ext.Array.difference(files, tooBigFiles);
            } else {
                this.doUpload(parentNodeId, documentTypeCd, controller)
            }
        },

        doUpload(parentNodeId, documentTypeCd, controller) {
            let vm = this.getViewModel(),
                documentLocation, employeeId, employerId,
                _callback = this.callback,
                afterFn = function(failed = false) {
                    Ext.defer(_ => {
                        !failed && progress.close();
                        _callback();
                    }, 1000);

                    filesSize = 0;
                    uploadedSize = {};
                    files = [];
                },
                promises = [], errors = [], promise;

            filesSize = Ext.Array.sum(Ext.Array.pluck(files, 'size'));

            if (controller) {
                if (this.mode === ATTACHMENTS_CONFIG.MODE_PERSON) {
                    documentLocation = controller.getDocumentLocation && controller.getDocumentLocation();
                    employeeId = controller.getEmployeeId && controller.getEmployeeId();
                } else {
                    documentLocation = !vm.get('isCompanyDocument') ? vm.get('documentLocation') : null;
                    employeeId = vm.get('currentEmployeeId');
                }

                employerId = controller.getEmployerId && controller.getEmployerId();
                if (controller.load) {
                    _callback = Ext.Function.bind(controller.load, this);
                }
            }

            if (isEmployeeRequired && !employeeId) {
                criterion.Msg.warning(i18n.gettext('Please select an Employee.'));

                files = [];
                elementFromPoint && elementFromPoint.removeCls('x-grid-item-over drag-over');

                return;
            }

            if (!employeeId && !employerId) {
                Ext.Logger.warn('EmployeeId or employerId are required to upload files');

                files = [];
                elementFromPoint && elementFromPoint.removeCls('x-grid-item-over drag-over');

                return;
            }

            promises = Ext.Array.clean(Ext.Array.map(files, (file, idx) => {
                let extraData = {
                        parentDocumentId : parentNodeId || null,
                        documentLocationCd : documentLocation,
                        documentTypeCd : documentTypeCd,
                        document : file,
                        isShare : false,
                        description : file.name
                    },
                    uploadURL = this.uploadUrl;

                let docParams = criterion.Utils.parseDocumentParams(file.name);

                extraData.description = docParams.name;
                extraData.documentTypeCd = docParams.documentTypeCd;
                extraData.isShare = docParams.isShare;

                if (docParams.path) {
                    delete extraData.parentDocumentId;
                    extraData.path = docParams.path.join('/');
                }

                if (this.mode === ATTACHMENTS_CONFIG.MODE_PERSON) {
                    extraData.employeeId = employeeId;
                } else {
                    if (employeeId) {
                        extraData.employeeId = employeeId;
                        uploadURL = criterion.consts.Api.API.EMPLOYEE_DOCUMENT_UPLOAD;
                    } else {
                        extraData.employerId = employerId;
                    }
                }

                return criterion.Api.submitFakeFormWithPromise(
                    [],
                    {
                        url : uploadURL,
                        scope : this,
                        extraData : extraData,
                        owner : 'process_' + idx,
                        initialWidth : null,
                        text : files.length > SHOW_NAMES_LIMIT ?
                            Ext.String.format(i18n.gettext('Processing {0} file(s)'), files.length) :
                            Ext.Array.map(files, file => file.name).join('<BR/>'),
                        silent : true,
                        failure : response => {
                            let data = response && (Ext.decode(response.responseText, true) || response.responseText || response.responseJson);

                            data && errors.push(data);
                        }
                    },
                    this.handleUploadProgress
                );
            }));

            if (promises.length) {
                promise = Ext.promise.Promise.all(promises)
                    .then(_ => {
                        afterFn();
                    })
                    .always(_ => {
                        if (promise.owner && !promise.owner.completed) {
                            Ext.TaskManager.start({
                                run : _ => {
                                    if (!Ext.Array.contains(Ext.Array.pluck(Ext.Array.pluck(promises, 'owner'), 'completed'), false)) {
                                        if (errors.length) {
                                            Ext.Array.map(errors, error => {
                                                criterion.consts.Error.showMessage(error);
                                            });
                                        }

                                        afterFn(true);

                                        return false;
                                    }
                                },
                                interval : 100
                            });
                        } else {
                            if (errors.length) {
                                Ext.Array.map(errors, error => {
                                    criterion.consts.Error.showMessage(error);
                                });
                            }
                            afterFn(true)
                        }
                    });
            }

            elementFromPoint && elementFromPoint.removeCls('x-grid-item-over drag-over');
        },

        handleUploadProgress(e, owner, initialWidth, text) {
            progress = criterion.Msg.progress(i18n.gettext('Uploading files'), text, '');

            uploadedSize[owner] = e.loaded;

            progress.updateProgress(Ext.Array.sum(Ext.Object.getValues(uploadedSize)) / filesSize);
        },

        columns : []
    };

});
