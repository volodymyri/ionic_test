Ext.define('criterion.model.dataForm.Field', function() {

    const DICT = criterion.consts.Dict,
          VALIDATOR = criterion.Consts.getValidator(),
          DATA_TYPE = criterion.Consts.DATA_TYPE,
          DATA_GRID_FIELD_TYPE = criterion.Consts.DATA_GRID_FIELD_TYPE;

    let CONVERT_TO_DATA_GRID_TYPE = {};

    CONVERT_TO_DATA_GRID_TYPE[DATA_TYPE.TEXT] = DATA_GRID_FIELD_TYPE.STRING;
    CONVERT_TO_DATA_GRID_TYPE[DATA_TYPE.STRING] = DATA_GRID_FIELD_TYPE.STRING;
    CONVERT_TO_DATA_GRID_TYPE[DATA_TYPE.NUMBER] = DATA_GRID_FIELD_TYPE.DOUBLE;
    CONVERT_TO_DATA_GRID_TYPE[DATA_TYPE.DATE] = DATA_GRID_FIELD_TYPE.DATE;
    CONVERT_TO_DATA_GRID_TYPE[DATA_TYPE.CHECKBOX] = DATA_GRID_FIELD_TYPE.BOOLEAN;
    CONVERT_TO_DATA_GRID_TYPE[DATA_TYPE.DROPDOWN] = DATA_GRID_FIELD_TYPE.INTEGER;
    CONVERT_TO_DATA_GRID_TYPE[DATA_TYPE.MEMO] = DATA_GRID_FIELD_TYPE.STRING;
    CONVERT_TO_DATA_GRID_TYPE[DATA_TYPE.CURRENCY] = DATA_GRID_FIELD_TYPE.DOUBLE;
    CONVERT_TO_DATA_GRID_TYPE[DATA_TYPE.INTEGER] = DATA_GRID_FIELD_TYPE.INTEGER;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'dataTypeCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.DATA_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'dataformDataTypeCode',
                type : 'criterion_codedatavalue',
                referenceField : 'dataTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'codeTableId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'dataformId',
                type : 'integer'
            },
            {
                name : 'sequenceNumber',
                type : 'integer',
                defaultValue : 0
            },
            {
                name : 'label',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'maximumSize',
                type : 'integer',
                defaultValue : 0
            },
            {
                name : 'fieldFormatTypeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'isHidden',
                type : 'boolean'
            },
            {
                name : 'showInEss',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'isRequired',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'value',
                type : 'string'
            },
            {
                // for compatibility with webform
                name : 'isMeaningfulInputField',
                type : 'boolean',
                persist : false,
                defaultValue : true
            },
            {
                name : 'dataGridFieldType',
                type : 'string',
                persist : false,
                calculate : data => CONVERT_TO_DATA_GRID_TYPE[data['dataformDataTypeCode']] || DATA_GRID_FIELD_TYPE.STRING
            }
        ]
    };
});
