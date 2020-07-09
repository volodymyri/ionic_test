Ext.define('criterion.data.field.CustomFieldValue', function() {

    function customValueIsDate(dataTypeCd) {
        let dataTypeRecord = criterion.CodeDataManager.getCodeDetailRecord('id', dataTypeCd, criterion.consts.Dict.DATA_TYPE);

        return dataTypeRecord && dataTypeRecord.get('code') === criterion.Consts.DATA_TYPE.DATE;
    }

    return {

        alias : [
            'data.field.custom_field_value'
        ],

        extend : 'Ext.data.field.String',

        serialize : function(value, record) {
            return (
                value &&
                record &&
                (
                    record.data.customField && customValueIsDate(record.data.customField['dataTypeCd']) ||
                    record.data[this.name + 'Type'] === criterion.Consts.DATA_TYPE.DATE
                )
            ) ? (Ext.isDate(value) ? Ext.Date.format(value, criterion.consts.Api.DATE_FORMAT) : value) : value;
        }
    };

});
