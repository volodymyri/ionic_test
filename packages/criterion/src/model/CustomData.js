Ext.define('criterion.model.CustomData', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CUSTOM_FIELD
        },

        fields : [
            {
                name : 'entityTypeCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.ENTITY_TYPE,
                validators : [
                    VALIDATOR.PRESENCE
                ]
            },
            {
                name : 'dataTypeCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : DICT.DATA_TYPE,
                validators : [
                    VALIDATOR.PRESENCE
                ]
            },
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'codeTableId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'customFormId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employerId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'sequenceNumber',
                type : 'int',
                defaultValue : 0
            },
            {
                name : 'label',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'maximumSize',
                type : 'int',
                defaultValue : 0
            },
            {
                name : 'fieldFormatTypeId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'isHidden',
                type : 'boolean'
            },
            {
                name : 'listTypeId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'items',
                allowNull : true
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
                name : 'entityTypeCode',
                type : 'criterion_codedatavalue',
                referenceField : 'entityTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'value',
                type : 'auto',
                persist : false,
                caching : true
            }
        ],

        getCodeDataIds : function() {
            var codeDataIds = this.callParent(arguments),
                listTypeId = this.get('listTypeId');

            if (listTypeId) {
                codeDataIds.push(listTypeId);
            }

            return codeDataIds;
        }
    };

});
