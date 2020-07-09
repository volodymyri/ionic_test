Ext.define('ess.controller.personalInformation.DependentAndContact', function() {

    const DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE;

    let yearFrom = (new Date().getFullYear() - 1),
        yearTo = (new Date().getFullYear() + 1);

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.ess_modern_personal_information_dependent_and_contact',

        mixins : [
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.WorkflowHighlight'
        ],

        handlePainted : function() {
            let employeeId = this.getViewModel().get('employeeId');

            this.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS);

            this.callParent(arguments);
        },

        handleChangeEmergency : function(cmp, value) {
            let vm = this.getViewModel(),
                record = vm.get('record'),
                presentIsEmergency = record.store.checkPresentIsEmergency();

            if (!vm.get('readOnly') && value && presentIsEmergency !== false && presentIsEmergency !== record.getId()) {
                criterion.Msg.confirm(
                    i18n.gettext('Warning'),
                    i18n.gettext('There is already an emergency contact. Set the new contact as the emergency contact?'),
                    function(btn) {
                        if (btn !== 'yes') {
                            cmp.setValue(!value);
                        }
                    },
                    this
                );
            }
        },

        handleChangeRelationshipType : function(cmp) {
            let vm = this.getViewModel(),
                emergency = this.lookup('isEmergencyField'),
                rec = cmp.getSelection();

            if (vm.get('readOnly')) {
                return;
            }

            if (rec && rec.get('code') === criterion.Consts.PERSON_CONTACT_TYPE_EMERGENCY_CONTACT_CODE) {
                emergency.setValue(true);
                emergency.setReadOnly(true);
            } else {
                emergency.setReadOnly(false);
            }
        },

        handleChangeCountryChangeStates : function(cmp, val) {
            let countryRecord = cmp.getSelection(),
                countryCode = countryRecord && countryRecord.get('code'),
                stateCombo = this.lookup('statesField'),
                stateComboStore = stateCombo && stateCombo.getStore();

            if (countryCode && stateComboStore) {
                stateComboStore.clearFilter();
                stateComboStore.filter('attribute1', countryCode);

                stateCombo.setPlaceholder(stateComboStore.count() ? '' : i18n.gettext('None Specified'));
            }
        },

        updateCustomFieldValues : function() {
            let vm = this.getViewModel(),
                entityId = vm.get('record.id'),
                customFields = vm.get('customFields'),
                customFieldValues = vm.get('customFieldValues'),
                customFieldsContainer = this.lookup('customFieldsContainer'),
                fields = customFieldsContainer.getFields();

            Ext.Object.each(fields, function(key, field) {
                let newFieldValue = field.getValue(),
                    customFieldId = field.customFieldId,
                    customField = customFields.getById(customFieldId),
                    valRecord = customFieldValues.findRecord('customFieldId', customFieldId, 0, false, false, true);

                if (field._hasValue && valRecord && !newFieldValue) {
                    // if value was clear -> remove the custom field record
                    customFieldValues.remove(valRecord);
                } else if (field._hasValue && valRecord) {
                    if (Ext.isDate(newFieldValue)) {
                        // convert date value to DATE_FORMAT
                        newFieldValue = Ext.Date.format(newFieldValue, criterion.consts.Api.DATE_FORMAT);
                    }

                    valRecord.set('value', newFieldValue);
                } else {
                    customFieldValues.add({
                        entityId : entityId,
                        customFieldId : customFieldId,
                        customField : customField.getData(),
                        value : newFieldValue
                    });
                }
            });

            return {
                modifiedCustomValues : customFieldValues.getModifiedRecords(),
                removedCustomValues : customFieldValues.getRemovedRecords()
            }
        },

        deleteRecord : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                record = this.getRecord(),
                employeeId = vm.get('employeeId');

            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS).then(function(signature) {
                if (signature) {
                    record.set('signature', signature);
                }

                record.eraseWithPromise({
                    isWorkflow : true, // don't remove this
                    employeeId : employeeId
                }).then({
                    success : function() {
                        view.fireEvent('afterDelete');
                        me.close();
                    },
                    failure : function() {
                        record.reject();
                    }
                });
            });
        },

        isEmergencyPhoneRequired : function() {
            let record = this.getRecord();

            return record && record.get('isEmergency') && !(record.get('workPhone') || record.get('homePhone') || record.get('mobilePhone'));
        },

        checkDependentAndEmergency : function() {
            let record = this.getRecord();

            return record && (record.get('isEmergency') || record.get('isDependent'));
        },

        handleSubmit : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                employeeId = vm.get('employeeId'),
                customFieldChanges = this.updateCustomFieldValues();

            record.setCustomValues(customFieldChanges);

            if (view.isValid()) {

                if (!me.checkDependentAndEmergency()) {
                    criterion.Msg.error(i18n.gettext('Contact should be Dependent, Emergency or both of them'));

                    return;
                }

                if (me.isEmergencyPhoneRequired()) {
                    criterion.Msg.error(i18n.gettext('Emergency contact should has at least one phone number'));

                    return;
                }

                if (record.dirty) {

                    me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.DEPENDENTS_CONTACTS).then(function(signature) {
                        view.setLoading(true);

                        if (signature) {
                            record.set('signature', signature);
                        }

                        record.saveWithPromise({
                            employeeId : employeeId,
                            isWorkflow : true
                        }).then(function() {
                            criterion.Utils.toast(i18n.gettext('Successfully saved.'));
                            view.fireEvent('afterSave');
                            me.close();
                        }).always(function() {
                            view.setLoading(false);
                        });
                    });

                } else {
                    me.close();
                }
            }
        },

        setCustomFields : function(customFields, customFieldValues) {
            let me = this,
                vm = this.getViewModel(),
                customFieldsContainer = this.lookup('customFieldsContainer');

            customFieldsContainer.removeAll();
            customFields.each(function(customField) {

                let customFieldId = customField.getId(),
                    label = customField.get('label'),
                    dataType = criterion.CodeDataManager.getCodeDetailRecord('id', customField.get('dataTypeCd'), DICT.DATA_TYPE).get('code'),
                    codeTableId = customField.get('codeTableId'),
                    codeTableCode,
                    valRecord = customFieldValues.findRecord('customFieldId', customFieldId, 0, false, false, true),
                    value = valRecord ? valRecord.get('value') : undefined,
                    field = {
                        label : label + ':&nbsp;',
                        customFieldId : customFieldId,
                        _hasValue : !!valRecord,
                        name : 'customField_' + customFieldId,
                        bind : {
                            readOnly : '{readOnly}'
                        }
                    };

                switch (dataType) {

                    default:
                    case DATA_TYPE.TEXT:
                        field = Ext.apply(field, {
                            xtype : 'textfield',
                            value : value
                        });

                        break;

                    case DATA_TYPE.NUMBER:
                        field = Ext.apply(field, {
                            xtype : 'numberfield',
                            value : value
                        });

                        break;

                    case DATA_TYPE.CURRENCY:
                        field = Ext.apply(field, {
                            xtype : 'criterion_field_currency_field',
                            value : value
                        });

                        break;

                    case DATA_TYPE.DATE:
                        field = Ext.apply(field, {
                            xtype : 'datepickerfield',
                            edgePicker : {
                                yearFrom : yearFrom,
                                yearTo : yearTo
                            },
                            value : value ? new Date(value) : null
                        });

                        break;

                    case DATA_TYPE.CHECKBOX:
                        field = Ext.apply(field, {
                            xtype : 'selectfield',
                            store : Ext.create('Ext.data.Store', {
                                fields : ['text', 'value'],
                                data : [
                                    {
                                        text : i18n.gettext('Yes'), value : 'true'
                                    },
                                    {
                                        text : i18n.gettext('No'), value : 'false'
                                    }
                                ]
                            }),
                            displayField : 'text',
                            valueField : 'value',
                            autoSelect : false,
                            value : value ? (value === 'true') : null
                        });

                        break;

                    case DATA_TYPE.DROPDOWN:
                        codeTableCode = criterion.CodeDataManager.getCodeTableNameById(codeTableId);

                        field = Ext.apply(field, {
                            xtype : 'criterion_code_detail_select',
                            codeDataId : codeTableCode,
                            value : value ? parseInt(value, 10) : null
                        });

                        break;
                }

                customFieldsContainer.add(field);
            });

            Ext.defer(function() {
                let record = vm.get('record'),
                    workflowLog = record.getWorkflowLog();

                me.highlightWorkflowLogFields(workflowLog);
            }, 200);
        },

        _getFormFields() {
            return Ext.Object.getValues(this.getView().getFields());
        }

    }
});
