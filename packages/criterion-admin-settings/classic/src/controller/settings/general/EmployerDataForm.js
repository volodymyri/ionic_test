Ext.define('criterion.controller.settings.general.EmployerDataForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_general_employer_data_form',

        requires : [
            'criterion.model.employer.DataForm'
        ],

        handleChangeForm(cmp, val, old) {
            let vm = this.getViewModel(),
                rec = cmp.getSelection(),
                view = this.getView();

            if (!vm.get('isPhantom')) {
                return;
            }

            view.setLoading(true);
            this.lookup('dataform').createByDataFormId(rec.get('formId'))
                .then(dataForm => {
                    let employerForm = Ext.create('criterion.model.employer.DataForm', {
                        name : dataForm.name,
                        dataformId : dataForm.id
                    });

                    employerForm.formFields().loadData(dataForm.formFields);
                    vm.set('employerForm', employerForm);
                })
                .always(() => {
                    view.setLoading(false);
                });
        },

        handleRecordLoad(record) {
            let documentId = record.getId(),
                vm = this.getViewModel();

            this.callParent(arguments);

            if (!record.phantom && documentId) {
                this.lookup('dataform').loadForm(documentId).then(formData => {
                    let employerForm = Ext.create('criterion.model.employer.DataForm', formData);

                    employerForm.formFields().loadData(formData.formFields);

                    vm.set('employerForm', employerForm);
                    record.set('dataformId', employerForm.get('dataformId'));
                });
            }
        },

        deleteRecord() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView();

            view.setLoading(true);
            criterion.Api.requestWithPromise({
                url : Ext.String.format(criterion.consts.Api.API.EMPLOYER_DATAFORM_ID, vm.get('record.id')),
                method : 'DELETE'
            }).then(function() {
                view.fireEvent('afterDelete', me);
                me.close();
            }, function() {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            }).always(function() {
                view.setLoading(false);
            });
        },

        updateRecord(record, handler) {
            Ext.isFunction(handler) ? handler.call(this, record) : null;
        },

        handleRecordUpdate(record) {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                values = this.lookup('dataform').getFormValues(),
                employerForm = vm.get('employerForm'),
                employerFormFields = employerForm.formFields(),
                dirtyAssoc = false;

            Ext.each(values, (val) => {
                employerFormFields.getById(val.name).set('value', val.value);
            });

            employerForm.set({
                employerId : vm.get('record.employerId'),
                parentDocumentId : vm.get('record.parentDocumentId')
            });

            Ext.iterate(employerForm.associations, function(name) {
                if (Ext.isFunction(employerForm[name]) && employerForm[name]().needsSync) {
                    dirtyAssoc = true;

                    return true;
                }
            });

            if (employerForm.dirty || employerForm.phantom || dirtyAssoc) {
                employerForm.saveWithPromise({
                    params : me.getRecordSaveParams()
                }).then((rec) => {
                    me.onAfterSave.call(me, view, rec);
                }, (rec, operation) => {
                    me.onFailureSave(rec, operation);
                });
            } else {
                me.onAfterSave.call(me, view, employerForm);
            }

        }
    };
});
