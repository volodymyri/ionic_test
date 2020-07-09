Ext.define('criterion.model.webForm.Annotation', function() {

    var DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'webformId',
                type : 'integer',
                reference : 'criterion.model.Form'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'webformDataTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WEBFORM_DATA_TYPE
            },
            {
                name : 'xPosition',
                type : 'integer',
                convert : criterion.Utils.convertDPI
            },
            {
                name : 'yPosition',
                type : 'integer',
                convert : criterion.Utils.convertDPI
            },
            {
                name : 'width',
                type : 'integer',
                convert : criterion.Utils.convertDPI
            },
            {
                name : 'height',
                type : 'integer',
                convert : criterion.Utils.convertDPI
            },
            {
                name : 'imageData',
                type : 'string'
            },
            {
                name : 'data',
                type : 'string'
            }
        ]
    };
});
