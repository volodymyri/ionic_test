Ext.define('criterion.controller.common.DocumentMassUpload', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        ATTACHMENTS_CONFIG = criterion.Consts.ATTACHMENTS_CONFIG,
        bytesInMb = ATTACHMENTS_CONFIG.BYTES_IN_MB,
        MODE_PERSON = ATTACHMENTS_CONFIG.MODE_PERSON;

    let aFiles = [],
        maxFileSize = ATTACHMENTS_CONFIG.MAX_FILE_SIZE_MB,
        progress, uploadedSize = {}, filesSize = 0;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_common_document_mass_upload',

        handleAfterRender() {
            let me = this,
                dropEl = this.lookup('dropRegion').getEl(),
                filesGridEl = this.lookup('filesGrid').getEl(),
                view = this.getView(),
                vm = this.getViewModel(),
                mode = vm.get('mode'),
                isCompanyDocument = vm.get('isCompanyDocument');

            vm.getStore('files').removeAll();
            aFiles = [];

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : mode === MODE_PERSON || !isCompanyDocument ? API.EMPLOYEE_DOCUMENT_MAX_FILE_SIZE : API.EMPLOYER_DOCUMENT_MAX_FILE_SIZE,
                method : 'GET',
                silent : true
            }).then(function(mFileSize) {
                maxFileSize = mFileSize;
            }).always(() => {
                view.setLoading(false);
            });

            Ext.Array.each([dropEl, filesGridEl], el => {
                el.on({
                    dragover : function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        el.addCls('drag-over');
                    },
                    drop : function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        let files = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files;

                        if (files) {
                            if (!vm.get('hasManifest')) {
                                me.addUsualModeFiles(files);
                            } else {
                                me.addManifestModeFiles(files);
                            }

                            if (aFiles.length) {
                                vm.set('hasFiles', true);

                                if (!vm.get('hasManifest')) {
                                    vm.set('isManifestMode', false);
                                }
                            }
                        }

                        el.removeCls('drag-over');
                    },
                    dragleave : function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        el.removeCls('drag-over');
                    }
                });
            });
        },

        handleCancel() {
            let view = this.getView();

            view.fireEvent('uploaded');
            view.destroy();
        },

        handleDownloadSample() {
            this.lookup('downloadAEl').getEl().dom.click();
        },

        handleSelectManifest(event, cmp) {
            const reader = new FileReader();

            let me = this,
                vm = this.getViewModel(),
                files = vm.getStore('files'),
                file = event.target && event.target.files && event.target.files[0];

            if (!file) {
                return;
            }

            cmp.tmpFile = null;

            reader.onload = (event) => {
                const manifest = event.target.result,
                    x2js = new X2JS();

                let res = x2js.xml_str2json(manifest);

                files.removeAll();
                aFiles = [];

                if (me.validateManifest(res)) {
                    vm.set({
                        hasManifest : true,
                        invalidManifestFormat : false,
                        manifestIssueText : ''
                    });

                    me.fillFilePlaceholdersByManifest(res);
                } else {
                    vm.set({
                        hasManifest : false,
                        invalidManifestFormat : true
                    });
                }
            };

            reader.readAsText(file);
        },

        validateManifest(manifest) {
            let vm = this.getViewModel(),
                isMassEmployeeUpload = vm.get('isMassEmployeeUpload'),
                employeeNumberGroupNameErrorFlag = false;

            if (manifest && Ext.isObject(manifest) && manifest.files && manifest.files.file) {
                if (Ext.isObject(manifest.files.file)) {
                    manifest.files.file = [manifest.files.file];
                }

                Ext.Array.each(manifest.files.file, file => {
                    let hasEmployeeNumber = file.employeeNumber !== undefined && file.employeeNumber.length,
                        hasEmployeeGroupName = file.employeeGroupName !== undefined && file.employeeGroupName.length;

                    if ((hasEmployeeNumber && hasEmployeeGroupName) || (!hasEmployeeNumber && !hasEmployeeGroupName)) {
                        employeeNumberGroupNameErrorFlag = true;
                        return false;
                    }
                });

                if (isMassEmployeeUpload && employeeNumberGroupNameErrorFlag) {
                    vm.set('manifestIssueText', i18n.gettext('Must contain only one of the fields - \'employeeNumber\' or \'employeeGroupName\' in one \'file\' tag.'));
                    return false;
                }

                return true;
            }

            return false;
        },

        fillFilePlaceholdersByManifest(manifest) {
            let vm = this.getViewModel(),
                files = vm.getStore('files');

            Ext.Array.each(manifest.files.file, file => {
                let documentTypeRecord = criterion.CodeDataManager.getCodeDetailRecord('isDefault', true, DICT.DOCUMENT_RECORD_TYPE),
                    defaultDocumentTypeCd = documentTypeRecord && documentTypeRecord.getId(),
                    dTRecord = criterion.CodeDataManager.getCodeDetailRecord('code', file.documentTypeCode, DICT.DOCUMENT_RECORD_TYPE);

                files.add({
                    fileName : file.name,
                    name : file.documentName,
                    employeeNumber : file.employeeNumber,
                    employeeGroupName : file.employeeGroupName,
                    documentTypeCd : dTRecord ? dTRecord.getId() : defaultDocumentTypeCd,
                    isShare : file.share && file.share === ATTACHMENTS_CONFIG.SHARE_FLAG_YES,
                    path : Ext.isString(file.folder) ? file.folder.split('$').join('/') : '',
                    isUploaded : false
                });
            });
        },

        handleAddFiles(cmp, e) {
            if (!e.target.files || !e.target.files.length) {
                return;
            }

            let vm = this.getViewModel();

            if (!vm.get('hasManifest')) {
                this.addUsualModeFiles(e.target.files);
            } else {
                this.addManifestModeFiles(e.target.files);
            }

            if (aFiles.length) {
                vm.set('hasFiles', true);

                if (!vm.get('hasManifest')) {
                    vm.set('isManifestMode', false);
                }
            }
        },

        addUsualModeFiles(files) {
            let vm = this.getViewModel(),
                isMassEmployeeUpload = vm.get('isMassEmployeeUpload'),
                stFiles = vm.getStore('files');

            if (!files instanceof FileList) {
                return;
            }

            Ext.Array.each(files, file => {
                let fRec,
                    docParams = criterion.Utils.parseDocumentParams(file.name, isMassEmployeeUpload);

                if (isMassEmployeeUpload && !(docParams.employeeNumber || docParams.employeeGroupName)) {
                    criterion.Utils.toast({
                        html : i18n.gettext('The file name must have an employee number or employee group name') + ' : ' + file.name,
                        autoCloseDelay : 3000
                    });

                    return;
                }

                aFiles.push(file);

                fRec = stFiles.add({
                    fileName : file.name,
                    name : docParams.name,
                    employeeNumber : docParams.employeeNumber,
                    employeeGroupName : docParams.employeeGroupName,
                    documentTypeCd : docParams.documentTypeCd,
                    isShare : docParams.isShare,
                    path : docParams.path ? docParams.path.join('/') : '',
                    isUploaded : true
                })[0];

                file.__id = fRec.getId();
            });
        },

        addManifestModeFiles(files) {
            let vm = this.getViewModel(),
                stFiles = vm.getStore('files');

            if (!files instanceof FileList) {
                return;
            }

            Ext.Array.each(files, file => {
                let records = Ext.Array.filter(stFiles.getRange(), function(rec) {
                        return rec.get('fileName') === file.name;
                    }),
                    ids = [];

                if (records.length) {
                    Ext.Array.each(records, rec => {
                        if (!rec.get('isUploaded')) {
                            rec.set('isUploaded', true);
                            ids.push(rec.getId());
                        } else {
                            criterion.Utils.toast({
                                html : i18n.gettext('The file with the same name is already selected') + ' : ' + file.name,
                                autoCloseDelay : 3000
                            });
                        }
                    });
                    file.__id = ids.join(',');
                    aFiles.push(file);
                } else {
                    criterion.Utils.toast({
                        html : i18n.gettext('File not found in manifest') + ' : ' + file.name,
                        autoCloseDelay : 3000
                    });
                }
            });
        },

        handleUpload() {
            let me = this,
                vm = this.getViewModel(),
                stFiles = vm.getStore('files'),
                isManifestMode = vm.get('isManifestMode'),
                tooBigFiles = Ext.Array.filter(aFiles, file => (file.size / bytesInMb > maxFileSize));

            if (tooBigFiles.length) {
                criterion.Msg.warning(
                    Ext.String.format(
                        i18n.gettext('Files exceed the configured size limit') + ' ({0} MB) ' + i18n.gettext('and cannot be uploaded.') + '<BR/><BR/>{1}',
                        maxFileSize,
                        Ext.Array.pluck(tooBigFiles, 'name').join('<BR/>')
                    ),
                    _ => {
                        Ext.Array.each(tooBigFiles, tooBigFile => {
                            let rec = stFiles.findRecord('fileName', tooBigFile.name, 0, false, false, true);

                            if (!rec) {
                                return;
                            }

                            if (isManifestMode) {
                                rec.set('isUploaded', false);
                            } else {
                                stFiles.remove(rec);
                            }
                        });

                        aFiles = Ext.Array.difference(aFiles, tooBigFiles);

                        if (aFiles.length) {
                            me.doUpload();
                        } else {
                            vm.set('hasFiles', false);
                        }
                    }
                );
            } else {
                me.doUpload();
            }
        },

        getUploadURL() {
            let vm = this.getViewModel();

            return vm.get('isCompanyDocument') ? API.EMPLOYER_DOCUMENT_UPLOAD : (vm.get('isMassEmployeeUpload') && vm.get('hasManifest') ? API.EMPLOYEE_DOCUMENT_MASS_UPLOAD : API.EMPLOYEE_DOCUMENT_UPLOAD);
        },

        doUpload() {
            let me = this,
                vm = this.getViewModel(),
                stFiles = vm.getStore('files'),
                seq = [], errors = [], promise,
                employeeId = vm.get('currentEmployeeId'),
                employerId = vm.get('employerId'),
                documentLocation = vm.get('documentLocation'),
                isCompanyDocument = vm.get('isCompanyDocument'),
                isMassEmployeeUpload = vm.get('isMassEmployeeUpload'),
                hasManifest = vm.get('hasManifest'),
                uploadURL = me.getUploadURL();

            vm.set('uploadInProgress', true);

            filesSize = Ext.Array.sum(Ext.Array.pluck(aFiles, 'size'));

            if (isMassEmployeeUpload && hasManifest) {
                seq = Ext.Array.clean(Ext.Array.map(aFiles, (file, idx) => {
                    let extraData = {
                            document : file
                        },
                        fRecIds = file.__id && file.__id.split(','),
                        filesInfo = [];

                    Ext.Array.each(fRecIds, fRecId => {
                        let fRec,
                            path,
                            employeeNumber,
                            employeeGroupName,
                            fileInfo = {};

                        fRec = stFiles.getById(fRecId);

                        if (!fRec) {
                            return;
                        }

                        fileInfo.description = fRec.get('name');
                        fileInfo.documentTypeCd = fRec.get('documentTypeCd');
                        fileInfo.isShare = fRec.get('isShare');

                        path = fRec.get('path');
                        employeeNumber = fRec.get('employeeNumber');
                        employeeGroupName = fRec.get('employeeGroupName');

                        if (isMassEmployeeUpload && !(employeeNumber || employeeGroupName)) {
                            console && console.error(i18n.gettext('employeeNumber or employeeGroupName are not set!'));
                            return;
                        }

                        if (path) {
                            fileInfo.path = path;
                        }

                        if (isCompanyDocument) {
                            fileInfo.employerId = employerId;
                        } else if (isMassEmployeeUpload) {
                            fileInfo.employerId = employerId;
                            fileInfo.employeeNumber = employeeNumber;
                            fileInfo.employeeGroupName = employeeGroupName;
                        } else {
                            fileInfo.employeeId = employeeId;
                        }

                        fileInfo.documentLocationCd = documentLocation;

                        filesInfo.push(fileInfo);

                        fRec.set('status', '<span class="blink-text">' + i18n.gettext('Uploading....') + '</span>');
                    });

                    extraData.filesInfo = Ext.encode(filesInfo);

                    return criterion.Api.submitFakeFormWithPromise(
                        [],
                        {
                            url : uploadURL,
                            scope : me,
                            extraData : extraData,
                            owner : 'process_' + idx,
                            initialWidth : null,
                            text : Ext.String.format(i18n.gettext('Processing {0} file(s)'), aFiles.length),
                            silent : true,
                            success : response => {
                                Ext.Array.each(fRecIds, fRecId => {
                                    let fRec = stFiles.getById(fRecId);

                                    fRec.set('status', '<span class="criterion-green">' + i18n.gettext('Uploaded') + '</span>');
                                });
                            },
                            failure : response => {
                                let data = response && (Ext.decode(response.responseText, true) || response.responseText || response.responseJson);

                                Ext.Array.each(fRecIds, fRecId => {
                                    let fRec = stFiles.getById(fRecId);

                                    fRec.set('status', '<span class="criterion-red bold" data-qtip="' + (data ? criterion.consts.Error.getErrorInfo(data)['description'] : i18n.gettext('We do not support directory uploading')) + '">' + i18n.gettext('Error') + '</span>');
                                });

                                errors.push(data ? data : {});
                            }
                        },
                        me.handleUploadProgress
                    );
                }));
            } else {
                seq = Ext.Array.clean(Ext.Array.map(aFiles, (file, idx) => {
                    let extraData = {
                            document : file,
                            documentLocationCd : documentLocation
                        },
                        fRec,
                        path,
                        employeeNumber,
                        employeeGroupName;

                    fRec = file.__id && stFiles.getById(file.__id);

                    if (!fRec) {
                        return;
                    }

                    extraData.description = fRec.get('name');
                    extraData.documentTypeCd = fRec.get('documentTypeCd');
                    extraData.isShare = fRec.get('isShare');

                    path = fRec.get('path');
                    employeeNumber = fRec.get('employeeNumber');
                    employeeGroupName = fRec.get('employeeGroupName');

                    if (isMassEmployeeUpload && !(employeeNumber || employeeGroupName)) {
                        console && console.error(i18n.gettext('employeeNumber or employeeGroupName are not set!'));
                        return;
                    }

                    if (path) {
                        extraData.path = path;
                    }

                    if (isCompanyDocument) {
                        extraData.employerId = employerId;
                    } else if (isMassEmployeeUpload) {
                        extraData.employerId = employerId;
                        extraData.employeeNumber = employeeNumber;
                        extraData.employeeGroupName = employeeGroupName;
                    } else {
                        extraData.employeeId = employeeId;
                    }

                    fRec.set('status', '<span class="blink-text">' + i18n.gettext('Uploading....') + '</span>');

                    return criterion.Api.submitFakeFormWithPromise(
                        [],
                        {
                            url : uploadURL,
                            scope : me,
                            extraData : extraData,
                            owner : 'process_' + idx,
                            initialWidth : null,
                            text : Ext.String.format(i18n.gettext('Processing {0} file(s)'), aFiles.length),
                            silent : true,
                            success : response => {
                                fRec.set('status', '<span class="criterion-green">' + i18n.gettext('Uploaded') + '</span>');
                            },
                            failure : response => {
                                let data = response && (Ext.decode(response.responseText, true) || response.responseText || response.responseJson);

                                fRec.set('status', '<span class="criterion-red bold" data-qtip="' + (data ? criterion.consts.Error.getErrorInfo(data)['description'] : i18n.gettext('We do not support directory uploading')) + '">' + i18n.gettext('Error') + '</span>');
                                errors.push(data ? data : {});
                            }
                        },
                        me.handleUploadProgress
                    );
                }));
            }

            if (seq.length) {
                promise = Ext.promise.Promise.all(seq)
                    .then(_ => {
                        me.afterUpload();
                    }, _ => {
                        me.afterUpload(errors.length);
                    })
            }
        },

        afterUpload(failed) {
            let view = this.getView();

            progress.close();

            filesSize = 0;
            uploadedSize = {};
            aFiles = [];

            Ext.defer(_ => {
                view.fireEvent('uploaded');
                progress.close();

                if (!failed) {
                    view.destroy();
                }
            }, 1000);
        },

        handleUploadProgress(e, owner, initialWidth, text) {
            progress = criterion.Msg.progress(i18n.gettext('Uploading files'), text, '');

            uploadedSize[owner] = e.loaded;

            progress.updateProgress(Ext.Array.sum(Ext.Object.getValues(uploadedSize)) / filesSize);
        }
    };
});
