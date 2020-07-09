Ext.define('criterion.controller.settings.general.DataForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_general_data_form',

        requires : [
            'criterion.view.settings.general.AssignForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleRecordLoad(record) {
            let formFields = record.formFields();

            this.callParent(arguments);

            if (formFields.getRemoteFilter()) {
                formFields.setRemoteFilter(false);
            }

            formFields.setSorters({
                property : 'sequenceNumber',
                direction : 'ASC'
            });

            formFields.setFilters([
                {
                    property : 'isHidden',
                    value : false,
                    exactMatch : true
                }
            ]);
        },

        handleAssignForm() {
            let me = this,
                vm = this.getViewModel(),
                dataformId = vm.get('record.id'),
                attachForm = Ext.create('criterion.view.settings.general.AssignForm', {
                    viewModel : {
                        data : {
                            isWebForm : false,
                            formId : dataformId,

                            searchAdditionalData : {
                                dataformId : dataformId
                            }
                        },

                        stores : {
                            employees : {
                                type : 'criterion_abstract_store',
                                model : 'criterion.model.employee.Search',
                                autoLoad : false,
                                autoSync : false,

                                pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                                remoteSort : true,
                                remoteFilter : true,

                                proxy : {
                                    type : 'criterion_rest',
                                    url : criterion.consts.Api.API.DATAFORM_EMPLOYEE_FOR_ASSIGN,
                                    extraParams : {
                                        dataformId : dataformId
                                    }
                                }
                            }
                        }
                    }
                });

            attachForm.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            attachForm.show();

            me.setCorrectMaskZIndex(true);
        },

        handleSubmitClick() {
            let form = this.getView(),
                record = this.getRecord(),
                formData = record.getData(true);

            if (form.isValid()) {
                if (Ext.isObject(formData.description)) {
                    let value = formData.description,
                        valKeys = Ext.Object.getKeys(value);

                    formData.description = valKeys.length > 1 ? Ext.encode(value) : (!Ext.isEmpty(value[criterion.Consts.LOCALIZATION_LANGUAGE_EN]) ? value[criterion.Consts.LOCALIZATION_LANGUAGE_EN] : '');
                } else if (Ext.isEmpty(formData.description)) {
                    formData.description = '';
                }

                form.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.DATAFORM + (record.phantom ? '' : '/' + record.getId()),
                    method : record.phantom ? 'POST' : 'PUT',
                    jsonData : formData
                }).then({
                    scope : this,
                    success : () => {
                        form.fireEvent('afterSave');
                        form.setLoading(false);
                        form.close();
                    }
                }).always(() => {
                    form.setLoading(false);
                });
            } else {
                this.focusInvalidField();
            }
        }
    };
});
