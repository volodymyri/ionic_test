Ext.define('criterion.ux.form.field.DataFormField', function() {

    const DATA_TYPE = criterion.Consts.DATA_TYPE;

    return {

        alias : 'widget.criterion_data_form_field',

        extend : 'criterion.view.customData.Field',

        config : {
            fieldId : undefined
        },

        updateRecord : function(record) {
            let field = this.getField(),
                value = record.get('value'),
                isRequired = record.get('isRequired');

            if (field) {
                this.remove(field);
            }

            this.setFieldId(record.getId());

            field = this.createField(record);

            if (field) {
                field['fieldId'] = record.getId();

                if (isRequired) {
                    field['allowBlank'] = false;
                }

                field = this.add(field);

                if (field['isMemo']) {
                    this['isMemo'] = true;
                }

                field.initValue();

                if (value) {
                    this.setValue(value);
                }

                record._customField = field;
            }
        },

        getValue() {
            let field = this.getField(),
                value;

            if (field) {
                value = field.getValue();

                if (Ext.isDate(value) && this.getDataType() === DATA_TYPE.DATE) {
                    value = Ext.Date.format(value, criterion.consts.Api.DATE_FORMAT);
                }
            }

            return value;
        },

        isValid() {
            return this.getField().isValid();
        }
    };

});
