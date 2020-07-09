Ext.define('criterion.controller.mixin.WorkflowHighlight', function() {

    const CLS_HIGHLIGHTED = criterion.Consts.UI_CLS.WORKFLOW_HIGHLIGHTED,
        WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'Ext.Mixin',

        mixinConfig : {
            id : 'workflowHighlight'
        },

        highlightMapping : {},

        workflowLogFieldsIsReadyForHighlight : true, // for delayed

        _getFormFields() {
            return this.getView().getForm().getFields().getRange();
        },

        _getRequestData(changed) {
            return changed;
        },

        highlightFields(changed) {
            let me = this,
                vm = this.getViewModel(),
                record = vm && vm.get('record'),
                modifiedCustomValues,
                removedCustomValues,
                workflowKeys = [],
                customValues = {},
                flatRequestData,
                customFieldIds;

            if (!vm || !this.workflowLogFieldsIsReadyForHighlight) {
                return;
            }

            flatRequestData = this._getRequestData(changed);
            modifiedCustomValues = changed.customValues;
            removedCustomValues = changed.removedCustomValues;
            workflowKeys = Ext.Object.getAllKeys(flatRequestData);

            modifiedCustomValues && Ext.Array.each(modifiedCustomValues, cValue => {
                customValues[cValue['customFieldId']] = cValue['value'];
            });

            removedCustomValues && Ext.Array.each(removedCustomValues, cValue => {
                customValues[cValue['customFieldId']] = null;
            });

            customFieldIds = Ext.Object.getKeys(customValues);

            Ext.Array.each(this._getFormFields(), field => {
                let bind = field.bind || field.getBind && field.getBind(), // bind exposed differently in modern and classic
                    bindValue = bind && (bind.value || bind.rawNumber || bind.checked),
                    fieldName,
                    isCustomField = field.isXType('criterion_customdata_field') || field.customFieldId;

                if ((!bind || !bindValue) && !isCustomField) {
                    return;
                }

                fieldName = bindValue && bindValue.stub.name;

                if (me.highlightMapping[fieldName]) {
                    fieldName = me.highlightMapping[fieldName];
                }

                if (fieldName && workflowKeys && Ext.Array.contains(workflowKeys, fieldName)) {
                    let value = flatRequestData[fieldName];

                    if (field.getXType() === 'datefield') {
                        value = Ext.Date.parse(value, criterion.consts.Api.DATE_FORMAT)
                    }

                    if (field._ownerRecord && field._ownerRecord.isModel) {
                        field._ownerRecord.set(fieldName, value, {dirty : false})
                    }
                    record && record.set(fieldName, value, {dirty : false});
                    field.setValue(value);
                    field.resetOriginalValue();

                    field.addCls(CLS_HIGHLIGHTED);
                } else if (field.isXType('criterion_customdata_field')) {
                    let customFieldId = field.getCustomFieldId().toString();

                    if (Ext.Array.contains(customFieldIds, customFieldId)) {
                        field.setValue(customValues[customFieldId]);
                        field.addCls(CLS_HIGHLIGHTED);
                    } else {
                        field.removeCls(CLS_HIGHLIGHTED);
                    }
                } else if (field.customFieldId) {
                    // modern custom field
                    let customFieldId = field.customFieldId.toString();

                    if (Ext.Array.contains(customFieldIds, customFieldId)) {
                        field.setValue(customValues[customFieldId]);
                        field.addCls(CLS_HIGHLIGHTED);
                    } else {
                        field.removeCls(CLS_HIGHLIGHTED);
                    }
                } else {
                    field.removeCls(CLS_HIGHLIGHTED);
                }
            });

            this.highlightFieldsAdditional(flatRequestData);
        },

        highlightFieldsAdditional(changed) {},

        highlightWorkflowLogFields(workflowLog) {
            let isPendingWorkflow = workflowLog && workflowLog.isModel && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], workflowLog.get('stateCode'));

            if (workflowLog && workflowLog.isModel) {
                if (isPendingWorkflow) {
                    this.highlightFields(workflowLog.get('request'));
                } else {
                    this.clearHighlight();
                }
            } else {
                this.clearHighlight();
            }
        },

        clearHighlight() {
            Ext.Array.each(this._getFormFields(), field => {
                field.removeCls(CLS_HIGHLIGHTED);
            });
        }
    }

});
