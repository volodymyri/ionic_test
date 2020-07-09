Ext.define('criterion.model.webForm.Field', function() {

    const DICT = criterion.consts.Dict,
        WEBFORM_DATA_TYPE = criterion.Consts.WEBFORM_DATA_TYPE,
        DATA_GRID_FIELD_TYPE = criterion.Consts.DATA_GRID_FIELD_TYPE;

    let CONVERT_TO_DATA_GRID_TYPE = {};

    CONVERT_TO_DATA_GRID_TYPE[WEBFORM_DATA_TYPE.TEXT] = DATA_GRID_FIELD_TYPE.STRING;
    CONVERT_TO_DATA_GRID_TYPE[WEBFORM_DATA_TYPE.NUMBER] = DATA_GRID_FIELD_TYPE.DOUBLE;
    CONVERT_TO_DATA_GRID_TYPE[WEBFORM_DATA_TYPE.DATE] = DATA_GRID_FIELD_TYPE.DATE;
    CONVERT_TO_DATA_GRID_TYPE[WEBFORM_DATA_TYPE.CHECKBOX] = DATA_GRID_FIELD_TYPE.BOOLEAN;
    CONVERT_TO_DATA_GRID_TYPE[WEBFORM_DATA_TYPE.DROPDOWN] = DATA_GRID_FIELD_TYPE.INTEGER;
    CONVERT_TO_DATA_GRID_TYPE[WEBFORM_DATA_TYPE.MEMO] = DATA_GRID_FIELD_TYPE.STRING;
    CONVERT_TO_DATA_GRID_TYPE[WEBFORM_DATA_TYPE.RADIO] = DATA_GRID_FIELD_TYPE.STRING; // ?
    CONVERT_TO_DATA_GRID_TYPE[WEBFORM_DATA_TYPE.EMAIL] = DATA_GRID_FIELD_TYPE.STRING;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory',
            reader : {
                transform : {
                    fn : function(data) {
                        Ext.Array.each(data, function(field) {
                            criterion.Utils.convertFieldDPI(field);
                        });
                        return data;
                    },
                    scope : this
                }
            }
        },

        fields : [
            {
                name : 'webformId',
                type : 'integer',
                reference : 'criterion.model.Form'
            },
            {
                name : 'webformDataTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WEBFORM_DATA_TYPE
            },
            {
                name : 'webformDataTypeCode',
                type : 'criterion_codedatavalue',
                referenceField : 'webformDataTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'maximumSize',
                type : 'integer'
            },
            {
                name : 'xPosition',
                type : 'integer',
                serialize : criterion.Utils.serializeDPI
            },
            {
                name : 'yPosition',
                type : 'integer',
                serialize : criterion.Utils.serializeDPI
            },
            {
                name : 'width',
                type : 'integer',
                serialize : criterion.Utils.serializeDPI
            },
            {
                name : 'height',
                type : 'integer',
                serialize : criterion.Utils.serializeDPI
            },
            {
                name : 'responseCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RESPONSE
            },
            {
                name : 'responseName',
                type : 'string',
                persist : false
            },
            {
                name : 'responseDescription',
                type : 'string',
                persist : false
            },
            {
                name : 'isRequired',
                type : 'boolean'
            },
            {
                name : 'data',
                type : 'string'
            },
            {
                name : 'imageData',
                type : 'auto',
                persist : false
            },
            {
                name : 'groupName',
                type : 'string'
            },
            {
                name : 'pageNumber',
                type : 'integer',
                defaultValue : 1
            },
            {
                name : 'zIndex',
                type : 'integer',
                defaultValue : 1
            },
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'contentToken',
                type : 'string'
            },
            {
                name : 'targetField',
                type : 'string'
            },
            {
                name : 'validation',
                type : 'string'
            },

            {
                // for compatibility with dataform
                name : 'label',
                type : 'string',
                persist : false,
                calculate : data => data.code
            },
            {
                name : 'isMeaningfulInputField',
                type : 'boolean',
                persist : false,
                calculate : data => Ext.Array.contains([
                    WEBFORM_DATA_TYPE.TEXT,
                    WEBFORM_DATA_TYPE.NUMBER,
                    WEBFORM_DATA_TYPE.DATE,
                    WEBFORM_DATA_TYPE.CHECKBOX,
                    WEBFORM_DATA_TYPE.DROPDOWN,
                    WEBFORM_DATA_TYPE.MEMO,
                    WEBFORM_DATA_TYPE.RADIO,
                    WEBFORM_DATA_TYPE.EMAIL
                ], data['webformDataTypeCode'])
            },
            {
                name : 'dataGridFieldType',
                type : 'string',
                persist : false,
                calculate : data => CONVERT_TO_DATA_GRID_TYPE[data['webformDataTypeCode']] || DATA_GRID_FIELD_TYPE.STRING
            }
        ],

        isDateField() {
            return this.get('webformDataTypeCode') === WEBFORM_DATA_TYPE.DATE
        }
    };
});
