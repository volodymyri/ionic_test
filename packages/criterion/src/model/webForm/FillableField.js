Ext.define('criterion.model.webForm.FillableField', function() {

    return {
        extend : 'criterion.model.webForm.Field',

        fields : [
            {
                name : 'webformId',
                type : 'integer',
                reference : 'criterion.model.webForm.FillableForm'
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
                name : 'value',
                type : 'string'
            }
        ]
    };
});
