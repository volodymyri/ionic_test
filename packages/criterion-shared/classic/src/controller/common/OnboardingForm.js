Ext.define('criterion.controller.common.OnboardingForm', function() {

    const CODE_DATA_MANAGER = criterion.CodeDataManager,
        DICT = criterion.consts.Dict,
        API = criterion.consts.Api.API,
        ONBOARDING_TASK_TYPES = criterion.Consts.ONBOARDING_TASK_TYPES,
        SYSTEM_ATTRIBUTE = '1';

    return {
        alias : 'controller.criterion_common_onboarding_form',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.RecordPicker',
            'criterion.view.employee.EmployeePicker'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleFillFormChange(toggle, isFillForm) {
            if (isFillForm) {
                this.switchToFillForm();
            }
        },

        switchToFillForm() {
            let record = this.getRecord(),
                recordId = record.getId(),
                webformId = record.get('webformId'),
                dataformId = record.get('dataformId');

            webformId && this.lookup('webform').loadForm(recordId, criterion.consts.Api.API.EMPLOYEE_ONBOARDING_WEBFORM_FIELDS);
            dataformId && this.lookup('dataform').loadForm(recordId, criterion.consts.Api.API.EMPLOYEE_ONBOARDING_DATAFORM_FIELDS);
        },

        handleRecordLoad : function(record) {
            let view = this.getView(),
                vm = this.getViewModel(),
                taskTypeCombo = view.lookup('taskTypeCombo'),
                recordTaskTypeId = record && record.get('onboardingTaskTypeCd'),
                systemTaskTypeId = CODE_DATA_MANAGER.getCodeDetailRecord('code', ONBOARDING_TASK_TYPES.SYSTEM_TASK, DICT.ONBOARDING_TASK_TYPE).getId(),
                systemTaskType = recordTaskTypeId && CODE_DATA_MANAGER.getCodeDetailRecord('id', recordTaskTypeId, DICT.ONBOARDING_TASK_TYPE),
                isSystemTask = systemTaskType && systemTaskType.get('attribute1') === SYSTEM_ATTRIBUTE;

            vm.set('isSystemTaskType', isSystemTask);
            taskTypeCombo.setValue(isSystemTask ? systemTaskTypeId : recordTaskTypeId);
        },

        handleRecordUpdate(record) {
            let fields = ['employerDocumentId', 'employerVideoId', 'assignedToEmployeeId', 'courseId', 'webformId', 'dataformId', 'workflowId'],
                keepFields = [];

            switch (record.get('onboardingTaskTypeCode')) {
                case ONBOARDING_TASK_TYPES.DOCUMENT:
                    keepFields.push('employerDocumentId');
                    break;

                case ONBOARDING_TASK_TYPES.FORM:
                    keepFields.push('webformId', 'dataformId', 'workflowId', 'assignedToEmployeeId');
                    break;

                case ONBOARDING_TASK_TYPES.VIDEO:
                    keepFields.push('employerVideoId');
                    break;

                case ONBOARDING_TASK_TYPES.USER_TASK:
                    keepFields.push('assignedToEmployeeId');
                    break;

                case ONBOARDING_TASK_TYPES.COURSE:
                    keepFields.push('courseId');
                    break;
            }

            Ext.Array.forEach(fields, function(field) {
                if (!Ext.Array.contains(keepFields, field)) {
                    record.set(field, null);
                }
            });

            this.callParent(arguments);
        },

        handleSubmitClick() {
            let me = this,
                form = me.getView().getForm(),
                record = this.getRecord(),
                webform = record.get('webformId') && this.lookup('webform');

            this.isNewRecord = record.phantom;

            if (record.get('isFillForm')) {
                // validation for web or data form

                if (webform && !webform.isValid()) {
                    webform.findNextInvalidFormField(me.getView());
                    return;
                }

                if (record.get('dataformId') && !this.lookup('dataform').isValid()) {
                    return;
                }
            }

            if (form.isValid()) {
                me.updateRecord(record, this.handleRecordUpdate);
            } else {
                me.focusInvalidField();
            }
        },

        onAfterSave(view, record) {
            let me = this,
                promises = [],
                recordId = record.getId(),
                isFillForm = record.get('isFillForm');

            if (isFillForm && record.get('webformId') && this.lookup('webform').isValid()) {
                promises.push(this.saveWebFormValues(recordId));
            }

            if (isFillForm && record.get('dataformId') && this.lookup('dataform').isValid()) {
                promises.push(this.saveDataFormValues(recordId));
            }

            Ext.promise.Promise.all(promises).then(() => {
                view.fireEvent('afterSave', view, record);
                me.close();
            });
        },

        saveWebFormValues(recordId) {
            let dfd = Ext.create('Ext.Deferred');

            criterion.Api.submitFakeForm(this.lookup('webform').getFormValues(), {
                url : Ext.String.format(API.EMPLOYEE_ONBOARDING_WEBFORM_FIELDS, recordId),
                method : 'POST',
                scope : this,
                success : function(obj, res) {
                    if (Ext.isObject(obj)) {
                        obj = Ext.Object.merge(obj, {responseStatus : res.status});
                    }

                    dfd.resolve(obj);
                },
                failure : function(response) {
                    dfd.reject(response);
                }
            });

            return dfd.promise;
        },

        saveDataFormValues(recordId) {
            return criterion.Api.requestWithPromise({
                method : 'POST',
                url : Ext.String.format(API.EMPLOYEE_ONBOARDING_DATAFORM_FIELDS, recordId),
                jsonData : {
                    values : this.lookup('dataform').getFormValues()
                }
            });
        },

        onShow() {
            let view = this.getView(),
                cancelBtn = this.lookup('cancel'),
                vm = this.getViewModel();

            view.setLoading(true);
            Ext.defer(() => {
                if (view.destroyed) {
                    return;
                }

                vm.getStore('workflows').loadWithPromise({
                    params : {
                        employerId : vm.get('employerId')
                    }
                }).always(function() {
                    if (view.destroyed) {
                        return;
                    }

                    view.setLoading(false);
                });

                cancelBtn.focus();
            }, 100);
        },

        handleTaskTypeSelect(combo, selectedRecord) {
            let view = this.getView(),
                vm = view.getViewModel(),
                systemTaskTypeId = CODE_DATA_MANAGER.getCodeDetailRecord('code', ONBOARDING_TASK_TYPES.SYSTEM_TASK, DICT.ONBOARDING_TASK_TYPE).getId(),
                selectedId = selectedRecord ? selectedRecord.getId() : null,
                isSystemTaskTypeSelected = selectedId === systemTaskTypeId,
                record = vm.get('record');

            vm.set('isSystemTaskType', isSystemTaskTypeSelected);
            record.set('onboardingTaskTypeCd', isSystemTaskTypeSelected ? null : selectedId);
        },

        onDocumentSearch() {
            let me = this,
                vm = me.getViewModel(),
                store = vm.getStore('documents'),
                picker;

            store.getProxy().setExtraParam('employerId', vm.get('employerId'));

            picker = Ext.create('criterion.view.RecordPicker', {
                title : i18n.gettext('Select Document'),
                searchFields : [
                    {
                        fieldName : 'fileName',
                        displayName : i18n.gettext('Name')
                    }
                ],
                columns : [
                    {
                        text : i18n.gettext('Name'),
                        dataIndex : 'fileName',
                        flex : 1
                    }
                ],
                store : store,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
                    }
                ],
                cls : 'criterion-modal',
                localFiltering : true
            });

            picker.on('select', function(record) {
                vm.get('record').set({
                    employerDocumentId : record.getId(),
                    employerDocumentName : record.get('fileName')
                });
            });

            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        handleDocumentDownload() {
            window.open(criterion.Api.getSecureResourceUrl(API.EMPLOYER_DOCUMENT_DOWNLOAD + this.getRecord().get('employerDocumentId')));
        },

        onVideoSearch() {
            let me = this,
                vm = me.getViewModel(),
                store = vm.getStore('videos'),
                picker;

            store.getProxy().setExtraParam('employerId', vm.get('employerId'));

            picker = Ext.create('criterion.view.RecordPicker', {
                title : i18n.gettext('Select Video'),
                searchFields : [
                    {
                        fieldName : 'url',
                        displayName : i18n.gettext('URL')
                    }
                ],
                columns : [
                    {
                        text : i18n.gettext('URL'),
                        dataIndex : 'url',
                        flex : 1
                    }
                ],
                store : store,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
                    }
                ],
                cls : 'criterion-modal',
                localFiltering : true
            });

            picker.on('select', function(record) {
                vm.get('record').set({
                    employerVideoId : record.getId(),
                    employerVideoUrl : record.get('url')
                });
            });

            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        onAssignedToEmployeeSearch() {
            let me = this,
                vm = me.getViewModel(),
                picker = Ext.create('criterion.view.employee.EmployeePicker', {
                    isActive : true,
                    employerId : vm.get('employerId')
                });

            picker.on('select', function(employee) {
                vm.get('record').set({
                    assignedToEmployeeId : employee.get('employeeId'),
                    assignedToEmployeeName : employee.get('fullName')
                });
            }, this);

            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        onClearAssignedEmployee() {
            this.getViewModel().get('record').set({
                assignedToEmployeeId : null,
                assignedToEmployeeName : null
            })
        },

        onCourseSearch() {
            let me = this,
                vm = me.getViewModel(),
                store = vm.getStore('courses'),
                picker;

            store.getProxy().setExtraParams({
                employerId : vm.get('employerId'),
                isActive : true
            });

            picker = Ext.create('criterion.view.RecordPicker', {
                title : i18n.gettext('Select Course'),
                searchFields : [
                    {
                        fieldName : 'name',
                        displayName : i18n.gettext('Name')
                    }
                ],
                columns : [
                    {
                        text : i18n.gettext('Name'),
                        dataIndex : 'name',
                        flex : 1
                    }
                ],
                store : store,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
                    }
                ],
                cls : 'criterion-modal',
                localFiltering : true
            });

            picker.on('select', function(record) {
                vm.get('record').set({
                    courseId : record.getId(),
                    courseName : record.get('name')
                });
            });

            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        handleChangeForm(cmp, value) {
            let rec = cmp.getSelection(),
                webformId = null,
                dataformId = null,
                vm = this.getViewModel();

            if (!value) {
                return;
            }

            if (rec.get('isWebForm')) {
                webformId = rec.get('formId');
            } else {
                dataformId = rec.get('formId');
            }

            vm.get('record').set({
                webformId : webformId,
                dataformId : dataformId
            });
        }
    };

});
