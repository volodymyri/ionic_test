Ext.define('criterion.controller.common.Document', function() {

    const API = criterion.consts.Api.API;

    return {
        alias : 'controller.criterion_common_document',

        extend : 'criterion.controller.FormView',

        getRecord() {
            return this.getViewModel().get('record');
        },

        updateRecord(record, handler) {
            Ext.isFunction(handler) ? handler.call(this, record) : null;
        },

        handleFillFormChange(toggle, isFillForm) {
            if (isFillForm) {
                this.switchToFillForm();
            }
        },

        switchToFillForm() {
            let record = this.getRecord(),
                webformId = record.get('webformId'),
                dataformId = record.get('dataformId');

            webformId && this.lookup('webform').loadForm(record.getId());
            dataformId && this.lookup('dataform').loadForm(record.getId());
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
                    webform.findNextInvalidFormField(webform);
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
                vm = this.getViewModel(),
                hideEmployeeGroups = vm.get('hideEmployeeGroups'),
                isFillForm = record.get('isFillForm'),
                promises = [];

            if (isFillForm && record.get('webformId') && this.lookup('webform').isValid()) {
                promises.push(this.saveWebFormValues(record.getId()));
            }

            if (isFillForm && record.get('dataformId') && this.lookup('dataform').isValid()) {
                promises.push(this.saveDataFormValues(record.getId()));
            }

            if (vm.get('oldDocumentLocationCd') !== vm.get('documentLocationCd') || vm.get('oldParentDocumentId') !== vm.get('parentDocumentId')) {
                promises.push(this.actReplaceDocument());
            }

            !hideEmployeeGroups && promises.push(me.lookup('employeeGroupCombo').saveValuesForRecord(vm.get('record')));

            Ext.promise.Promise.all(promises).then(() => {
                view.fireEvent('afterSave', view, record);
                me.close();
            });
        },

        actReplaceDocument() {
            let dfd = Ext.create('Ext.Deferred'),
                vm = this.getViewModel(),
                parentDocumentId = vm.get('parentDocumentId');

            criterion.Api.requestWithPromise({
                method : 'POST',
                url : API.EMPLOYEE_DOCUMENT_MOVE,
                jsonData : {
                    documentId : vm.get('record.id'),
                    employeeId : vm.get('currentEmployeeId'),
                    documentLocationCd : vm.get('documentLocationCd'),
                    parentDocumentId : parentDocumentId === 0 ? null : parentDocumentId
                }
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Document successfully moved.'));
                dfd.resolve();
            }, function(response) {
                dfd.reject(response);
            });

            return dfd.promise;
        },

        saveWebFormValues(employeeDocumentId) {
            let dfd = Ext.create('Ext.Deferred');

            criterion.Api.submitFakeForm(this.lookup('webform').getFormValues(), {
                url : Ext.String.format(API.EMPLOYEE_DOCUMENT_WEBFORM_FIELDS, employeeDocumentId),
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

        saveDataFormValues(employeeDocumentId) {
            return criterion.Api.requestWithPromise({
                method : 'POST',
                url : Ext.String.format(API.EMPLOYEE_DOCUMENT_DATAFORM_FIELDS, employeeDocumentId),
                jsonData : {
                    values : this.lookup('dataform').getFormValues()
                }
            });
        },

        handleChangeDocumentLocation(cmp, val, oldVal) {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                employeeDocuments = vm.getStore('employeeDocuments');

            view.setLoading(true);

            if (employeeDocuments && !employeeDocuments.getRoot()) {
                employeeDocuments.setRoot({
                    expanded : false
                });
            }

            if (oldVal) {
                vm.set('parentDocumentId', 0);
            }

            employeeDocuments.load({
                params : {
                    documentLocationCd : val,
                    employeeId : vm.get('currentEmployeeId')
                },
                callback : function() {
                    me.prepareFolders(employeeDocuments);
                    view.setLoading(false);
                }
            })
        },

        prepareFolders(documents) {
            let vm = this.getViewModel(),
                folders = vm.getStore('folders'),
                foldersData = [
                    {
                        id : 0,
                        text : i18n.gettext('Root'),
                        description : i18n.gettext('..')
                    }
                ];

            folders.removeAll();

            documents.getRootNode().cascadeBy(function(node) {
                if (node.get('isFolder')) {
                    foldersData.push({
                        id : node.getId(),
                        text : node.get('description'),
                        description : Ext.String.repeat('&nbsp;&nbsp;', node.get('depth') - 1) + (node.get('depth') > 1 ? '&#9492;&nbsp;' : '') + node.get('description')
                    });
                }
            });

            folders.loadData(foldersData);
        }
    };

});
